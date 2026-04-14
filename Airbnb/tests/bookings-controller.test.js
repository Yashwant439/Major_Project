const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");

const bookingController = require("../controllers/bookings.js");
const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");

const createReqRes = () => {
  const flashMessages = [];
  const req = {
    params: { id: "listing_1" },
    body: {},
    user: { _id: new mongoose.Types.ObjectId() },
    flash: (type, msg) => flashMessages.push({ type, msg }),
  };

  const res = {
    redirectPath: null,
    statusCode: 200,
    jsonPayload: null,
    redirect(path) {
      this.redirectPath = path;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.jsonPayload = payload;
      return this;
    },
    render() {
      throw new Error("render should not be called for this test");
    },
  };

  return { req, res, flashMessages };
};

test("create booking rejects invalid date range", async () => {
  process.env.TEST_API_KEY = "test_key";
  process.env.TEST_API_KEY_SECRET = "test_secret";

  const { req, res, flashMessages } = createReqRes();
  req.body = {
    checkIn: "2030-04-10",
    checkOut: "2030-04-09",
    guests: "2",
    name: "Demo User",
    email: "demo@example.com",
    phone: "9999999999",
  };

  const originalFindById = Listing.findById;
  Listing.findById = async () => ({ _id: req.params.id, price: 2000 });

  try {
    await bookingController.create(req, res);
  } finally {
    Listing.findById = originalFindById;
  }

  assert.equal(res.redirectPath, `/listings/${req.params.id}/book`);
  assert.equal(flashMessages[0].type, "error");
});

test("verifyPayment marks booking as failed on order mismatch", async () => {
  process.env.TEST_API_KEY_SECRET = "test_secret";

  const { req, res } = createReqRes();
  req.body = {
    bookingId: "booking_1",
    razorpay_order_id: "order_wrong",
    razorpay_payment_id: "pay_1",
    razorpay_signature: "deadbeef",
  };

  const bookingDoc = {
    paymentStatus: "pending",
    razorpayOrderId: "order_expected",
    user: { _id: req.user._id },
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
  assert.equal(res.jsonPayload.success, false);
  assert.equal(bookingDoc.paymentStatus, "failed");
});
