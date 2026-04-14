const Razorpay = require("razorpay");

const keyId = process.env.RAZORPAY_KEY_ID || process.env.TEST_API_KEY || "";
const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.TEST_API_KEY_SECRET || "";
const hasKeys = Boolean(keyId && keySecret);

const instance = hasKeys
  ? new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })
  : {
      orders: {
        create: async () => {
          throw new Error("Razorpay is not configured");
        },
      },
    };

instance.isConfigured = hasKeys;
instance.keyId = keyId;
instance.keySecret = keySecret;

module.exports = instance;
