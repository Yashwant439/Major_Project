const crypto = require("crypto");

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const isValidDate = (value) => value instanceof Date && !Number.isNaN(value.getTime());

const normalizeDate = (value) => {
  const date = new Date(value);
  if (!isValidDate(date)) return null;
  return date;
};

const isFutureOrTodayDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const comparable = new Date(date);
  comparable.setHours(0, 0, 0, 0);
  return comparable >= today;
};

const calculateBookingPrice = ({ nightlyPrice, checkIn, checkOut, taxRate = 0.18 }) => {
  const start = normalizeDate(checkIn);
  const end = normalizeDate(checkOut);
  if (!start || !end) {
    return { ok: false, reason: "Invalid check-in or check-out date" };
  }
  if (end <= start) {
    return { ok: false, reason: "Check-out date must be after check-in date" };
  }

  const nights = Math.ceil((end - start) / MS_PER_DAY);
  const basePrice = Number(nightlyPrice) * nights;
  if (!Number.isFinite(basePrice) || basePrice <= 0) {
    return { ok: false, reason: "Invalid listing price" };
  }

  const tax = Math.round(basePrice * taxRate);
  const totalPrice = basePrice + tax;

  return {
    ok: true,
    value: {
      checkIn: start,
      checkOut: end,
      nights,
      basePrice,
      tax,
      totalPrice,
      isCheckInTodayOrFuture: isFutureOrTodayDate(start),
    },
  };
};

const verifyRazorpaySignature = ({ orderId, paymentId, signature, secret }) => {
  if (!orderId || !paymentId || !signature || !secret) {
    return false;
  }

  const payload = `${orderId}|${paymentId}`;
  const expectedHex = crypto.createHmac("sha256", secret).update(payload).digest("hex");

  try {
    const expected = Buffer.from(expectedHex, "hex");
    const received = Buffer.from(signature, "hex");
    if (expected.length === 0 || received.length === 0 || expected.length !== received.length) {
      return false;
    }
    return crypto.timingSafeEqual(expected, received);
  } catch (err) {
    return false;
  }
};

module.exports = {
  calculateBookingPrice,
  verifyRazorpaySignature,
  normalizeDate,
  isFutureOrTodayDate,
};
