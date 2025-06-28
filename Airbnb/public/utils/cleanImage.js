module.exports = (req, res, next) => {
  if (req.body.listing && req.body.listing.image.trim() === "") {
    delete req.body.listing.image;
  }
  next();
};