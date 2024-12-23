const express = require("express");
const router = express.Router();

const {
  userSignup,
  userLogin,
  userForgotPassword,
  userMyBooks,
  userAddBook,
  userBookingReceipt,
  userBookings,
  userInfo,
  UpdateUserInfo,
  userLendedBooks,
  userLendedBookReceipt,
} = require("../controllers/userController");

router.post("/signup", userSignup);
router.post("/login", userLogin);
router.post("/forgotpassword", userForgotPassword);
router.get("/:id/mybooks", userMyBooks);
router.post("/addbook", userAddBook);
router.get("/:id/bookings/:id1", userBookingReceipt);
router.get("/:id/bookings", userBookings);
router.get("/:id", userInfo);
router.post("/:id", UpdateUserInfo);
router.get("/:id/lendedbooks", userLendedBooks);
router.get("/:id/lendedbookreceipt/:id1", userLendedBookReceipt);

module.exports = router;
