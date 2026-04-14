const assert = require("node:assert/strict");
const crypto = require("crypto");
const mongoose = require("mongoose");

process.env.TEST_API_KEY = process.env.TEST_API_KEY || "test_key";
process.env.TEST_API_KEY_SECRET = process.env.TEST_API_KEY_SECRET || "test_secret";

const middleware = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const bookingController = require("../controllers/bookings.js");
const wishlistController = require("../controllers/wishlist.js");
const Listing = require("../models/listing.js");
const User = require("../models/auth.js");
const Booking = require("../models/booking.js");
const { listingSchema } = require("../schema.js");
const {
  calculateBookingPrice,
  verifyRazorpaySignature,
} = require("../public/utils/payment.js");

const tests = [];

const addTest = (name, fn) => tests.push({ name, fn });

addTest("payment utility calculates totals", () => {
  const result = calculateBookingPrice({
    nightlyPrice: 2500,
    checkIn: "2030-01-10",
    checkOut: "2030-01-13",
  });
  assert.equal(result.ok, true);
  assert.equal(result.value.nights, 3);
  assert.equal(result.value.totalPrice, 8850);
});

addTest("payment utility validates signatures", () => {
  const secret = "test_secret";
  const orderId = "order_123";
  const paymentId = "pay_123";
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  assert.equal(
    verifyRazorpaySignature({ orderId, paymentId, signature, secret }),
    true
  );
  assert.equal(
    verifyRazorpaySignature({
      orderId,
      paymentId,
      signature: "deadbeef",
      secret,
    }),
    false
  );
});

addTest("setCommonLocals exposes auth state", () => {
  const req = {
    user: { _id: new mongoose.Types.ObjectId(), username: "demo" },
    isAuthenticated: () => true,
    flash: () => [],
  };
  const res = { locals: {} };

  middleware.setCommonLocals(req, res, () => {});
  assert.equal(res.locals.isAuthenticated, true);
  assert.equal(res.locals.currentUser.username, "demo");
});

addTest("isOwner blocks access for non-owner", async () => {
  const req = {
    params: { id: "listing_1" },
    flash: () => [],
  };
  const res = {
    locals: { currentUser: { _id: new mongoose.Types.ObjectId() } },
    redirectPath: null,
    redirect(path) {
      this.redirectPath = path;
    },
  };

  const originalFindById = Listing.findById;
  Listing.findById = async () => ({ owner: new mongoose.Types.ObjectId() });

  try {
    await middleware.isOwner(req, res, () => {
      throw new Error("should not call next for non-owner");
    });
  } finally {
    Listing.findById = originalFindById;
  }

  assert.equal(res.redirectPath, "/listings/listing_1");
});

addTest("listing create handles missing image gracefully", async () => {
  const flashes = [];
  const req = {
    body: { listing: { title: "Demo listing" } },
    file: null,
    user: { _id: "user_1" },
    flash: (type, msg) => flashes.push({ type, msg }),
  };
  const res = {
    redirectPath: null,
    redirect(path) {
      this.redirectPath = path;
    },
  };

  await listingController.create(req, res);
  assert.equal(res.redirectPath, "/listings/new");
  assert.equal(flashes[0].type, "error");
});

addTest("listing schema accepts lat/lng from new listing form", () => {
  const payload = {
    listing: {
      title: "Sunset villa",
      description: "A beautiful place to stay near the beach with all amenities.",
      price: 3000,
      location: "Goa",
      country: "India",
      category: "Beach",
      lat: "15.2993",
      lng: "74.1240",
    },
  };

  const { error } = listingSchema.validate(payload);
  assert.equal(error, undefined);
});

addTest("booking create rejects invalid dates", async () => {
  process.env.TEST_API_KEY = "test_key";
  process.env.TEST_API_KEY_SECRET = "test_secret";

  const req = {
    params: { id: "listing_1" },
    body: {
      checkIn: "2030-04-10",
      checkOut: "2030-04-09",
      guests: "2",
      name: "Demo User",
      email: "demo@example.com",
      phone: "9999999999",
    },
    user: { _id: new mongoose.Types.ObjectId() },
    flash: () => [],
  };
  const res = {
    redirectPath: null,
    redirect(path) {
      this.redirectPath = path;
    },
  };

  const originalFindById = Listing.findById;
  Listing.findById = async () => ({ _id: req.params.id, price: 2000 });

  try {
    await bookingController.create(req, res);
  } finally {
    Listing.findById = originalFindById;
  }

  assert.equal(res.redirectPath, "/listings/listing_1/book");
});

addTest("verifyPayment fails on order mismatch", async () => {
  process.env.TEST_API_KEY_SECRET = "test_secret";

  const userId = new mongoose.Types.ObjectId();
  const req = {
    body: {
      bookingId: "booking_1",
      razorpay_order_id: "order_wrong",
      razorpay_payment_id: "pay_1",
      razorpay_signature: "deadbeef",
    },
    user: { _id: userId },
    flash: () => [],
  };

  const res = {
    statusCode: 200,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    },
  };

  const bookingDoc = {
    paymentStatus: "pending",
    razorpayOrderId: "order_expected",
    user: { _id: userId },
    listing: { _id: new mongoose.Types.ObjectId() },
    async save() {
      return this;
    },
  };

  const originalFindById = Booking.findById;
  Booking.findById = () => ({
    populate: async () => bookingDoc,
  });

  try {
    await bookingController.verifyPayment(req, res);
  } finally {
    Booking.findById = originalFindById;
  }

  assert.equal(res.statusCode, 400);
  assert.equal(bookingDoc.paymentStatus, "failed");
  assert.equal(res.payload.success, false);
});

addTest("wishlist toggle removes existing item correctly", async () => {
  const userId = new mongoose.Types.ObjectId();
  const listingId = new mongoose.Types.ObjectId();
  const req = {
    params: { listingId: listingId.toString() },
    user: { _id: userId },
  };
  const res = {
    statusCode: 200,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    },
  };

  const originalListingFindById = Listing.findById;
  const originalUserFindById = User.findById;
  const originalUserFindByIdAndUpdate = User.findByIdAndUpdate;

  Listing.findById = () => ({
    select: async () => ({ _id: listingId }),
  });
  User.findById = () => ({
    select: async () => ({ wishlist: [listingId] }),
  });

  let pullCalled = false;
  User.findByIdAndUpdate = async (_id, update) => {
    if (update.$pull && update.$pull.wishlist && update.$pull.wishlist.equals(listingId)) {
      pullCalled = true;
    }
    return {};
  };

  try {
    await wishlistController.toggleWishlist(req, res);
  } finally {
    Listing.findById = originalListingFindById;
    User.findById = originalUserFindById;
    User.findByIdAndUpdate = originalUserFindByIdAndUpdate;
  }

  assert.equal(res.statusCode, 200);
  assert.equal(res.payload.status, "removed");
  assert.equal(pullCalled, true);
});

const run = async () => {
  let passed = 0;
  let failed = 0;

  for (const t of tests) {
    try {
      await t.fn();
      passed += 1;
      console.log(`PASS - ${t.name}`);
    } catch (err) {
      failed += 1;
      console.error(`FAIL - ${t.name}`);
      console.error(err.stack || err.message);
    }
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) {
    process.exitCode = 1;
  }
};

run();
