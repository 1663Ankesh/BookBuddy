const express = require("express");
const router = express.Router();

const {
  getBookInfo,
  booktheBook,
  getBookInfoForUpdate,
  updateBookInfo,
} = require("../controllers/bookController");

router.get("/:id", getBookInfo);
router.post("/:id", booktheBook);

router.get("/:id/update", getBookInfoForUpdate);
router.post("/:id/update", updateBookInfo);

module.exports = router;
