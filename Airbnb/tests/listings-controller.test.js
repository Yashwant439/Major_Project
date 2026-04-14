const test = require("node:test");
const assert = require("node:assert/strict");

const listingController = require("../controllers/listings.js");

test("create listing gracefully handles missing image upload", async () => {
  const flashMessages = [];
  const req = {
    body: { listing: { title: "Demo listing" } },
    file: null,
    flash: (type, msg) => flashMessages.push({ type, msg }),
    user: { _id: "user_1" },
  };
  const res = {
    redirectPath: null,
    redirect(path) {
      this.redirectPath = path;
    },
  };

  await listingController.create(req, res);

  assert.equal(res.redirectPath, "/listings/new");
  assert.equal(flashMessages[0].type, "error");
});
