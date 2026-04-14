const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("crypto");

const {
  calculateBookingPrice,
  verifyRazorpaySignature,
} = require("../public/utils/payment.js");

test("calculateBookingPrice returns expected totals for valid dates", () => {
  const result = calculateBookingPrice({
    nightlyPrice: 2500,
    checkIn: "2030-01-10",
    checkOut: "2030-01-13",
  });

  assert.equal(result.ok, true);
  assert.equal(result.value.nights, 3);
  assert.equal(result.value.basePrice, 7500);
  assert.equal(result.value.tax, 1350);
  assert.equal(result.value.totalPrice, 8850);
});

test("calculateBookingPrice rejects an invalid date range", () => {
  const result = calculateBookingPrice({
    nightlyPrice: 2500,
    checkIn: "2030-01-10",
    checkOut: "2030-01-09",
  });

  assert.equal(result.ok, false);
  assert.match(result.reason, /Check-out date must be after check-in date/);
});

test("verifyRazorpaySignature returns true for a valid signature", () => {
  const secret = "test_secret";
  const orderId = "order_123";
  const paymentId = "pay_123";
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const isValid = verifyRazorpaySignature({
    orderId,
    paymentId,
    signature,
    secret,
  });

  assert.equal(isValid, true);
});

test("verifyRazorpaySignature returns false for an invalid signature", () => {
  const isValid = verifyRazorpaySignature({
    orderId: "order_123",
    paymentId: "pay_123",
    signature: "deadbeef",
    secret: "test_secret",
  });

  assert.equal(isValid, false);
});
