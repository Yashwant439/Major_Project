const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");

const middleware = require("../middleware.js");
const Listing = require("../models/listing.js");

const createReqRes = () => {
  const flashMessages = [];
  const req = {
    user: null,
    isAuthenticated: () => false,
    flash: (type, msg) => {
      flashMessages.push({ type, msg });
      return [];
    },
    session: {},
    params: {},
  };
  const res = {
    locals: {},
    redirectPath: null,
    redirect(path) {
      this.redirectPath = path;
    },
  };
  return { req, res, flashMessages };
};

test("setCommonLocals exposes auth flags for templates", () => {
  const { req, res } = createReqRes();
  req.user = { _id: new mongoose.Types.ObjectId(), username: "demo" };
  req.isAuthenticated = () => true;

  middleware.setCommonLocals(req, res, () => {});

  assert.equal(res.locals.isAuthenticated, true);
  assert.equal(res.locals.currentUser.username, "demo");
});

test("isOwner blocks non-owner access", async () => {
  const { req, res, flashMessages } = createReqRes();
  const listingOwnerId = new mongoose.Types.ObjectId();
  const currentUserId = new mongoose.Types.ObjectId();

  req.params.id = "listing_1";
  res.locals.currentUser = { _id: currentUserId };

  const originalFindById = Listing.findById;
  Listing.findById = async () => ({
    owner: listingOwnerId,
  });

  try {
    await middleware.isOwner(req, res, () => {
      throw new Error("next should not run for non-owner");
    });
  } finally {
    Listing.findById = originalFindById;
  }

  assert.equal(res.redirectPath, "/listings/listing_1");
  assert.equal(flashMessages[0].type, "error");
});
