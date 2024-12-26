const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const generatehashedpwd = require("../utils/generatehashedpwd");
const { errorForSignUp, errorForEmail } = require("../utils/validationerrors");

const Users = require("../models/Users");
const Books = require("../models/Books");
const Bookings = require("../models/Bookings");

const secretKey = process.env.secretKey;

const userSignup = async (req, res) => {
  try {
    const { username, email, pwd, phn, place, state, pincode } = req.body;

    if (!username || !email || !pwd || !phn || !place || !state || !pincode) {
      res.status(400).json({ error: "Fill Up the Form", donavigate: false });
    } else {
      const validationErrors = errorForSignUp(req.body);

      if (Object.keys(validationErrors).length > 0) {
        let err;
        if (validationErrors.email) err += validationErrors.email;
        if (validationErrors.phn) err += validationErrors.phn + "\n";
        if (validationErrors.pincode) err += validationErrors.pincode + "\n";

        res.status(400).json({ error: err, donavigate: false });
      } else {
        let result = await Users.findOne({ email });

        if (result) {
          res.status(401).json({ error: "User Exists" });
        } else {
          let user = {
            username: username,
            email: email,
            phn: phn,
            pwd: await generatehashedpwd(pwd),
            place: place,
            state: state,
            pincode: pincode,
          };

          user = new Users(user);
          await user.save();

          const token = jwt.sign(
            {
              userId: user._id,
              username: user.username,
              email: user.email,
            },
            secretKey
          );

          return res
            .status(200)
            .cookie("token", token, {
              httpOnly: true,
              sameSite: "None",
              secure: true,
            })
            .json({ username: user.username, email: user.email });
        }
      }
    }
  } catch (e) {
    res.status(501).json({ error: "Server Error" });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, pwd } = req.body;

    if (!email || !pwd) {
      return res.status(400).json({ error: "Fill Up the form" });
    }

    const validationErrors = errorForEmail(email);

    if (validationErrors?.email) {
      return res
        .status(400)
        .json({ error: validationErrors.email, donavigate: false });
    }

    const user = await Users.findOne({ email });
    if (user) {
      const result = await bcrypt.compare(pwd, user.pwd);

      if (result) {
        const token = jwt.sign(
          { userId: user._id, username: user.username, email: user.email },
          secretKey
        );

        res
          .cookie("token", token, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
          })
          .status(200)
          .json({ username: user.username, email: user.email });
      } else {
        return res.status(401).json({ error: "Incorrect password" });
      }
    } else {
      return res.status(401).json({ error: "User not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(501).json({ error: "Server Error" });
  }
};

const userForgotPassword = async (req, res) => {
  try {
    const { email, pwd } = req.body;

    if (!email || !pwd) {
      return res.status(401).json({ error: "Fill Up the form" });
    } else {
      const validationErrors = errorForEmail(email);

      if (validationErrors?.email) {
        return res
          .status(400)
          .json({ error: validationErrors.email, donavigate: false });
      }

      let user = await Users.findOne({ email });

      if (user) {
        let result = await Users.findOneAndUpdate(
          { email: email },
          {
            $set: {
              pwd: await generatehashedpwd(pwd),
            },
          }
        );
        res.status(200).json({ email: req.body.newemail });
      } else {
        res.status(404).json({ error: "User Not Found" });
      }
    }
  } catch (e) {
    console.log(e);
    res.status(501).json({ error: "Server Error" });
  }
};

const userMyBooks = async (req, res) => {
  try {
    const { token } = req.cookies;

    jwt.verify(token, secretKey, {}, async (err, info) => {
      if (err) throw err;

      let books = await Books.find({ ownerId: req.params.id, isbooked: false });
      books = books.reverse();

      res.status(200).json(books);
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server Error" });
  }
};

const allowedOrigins = [
  "http://localhost:3000",
  `${process.env.REACT_APP_Front_End}`,
  `${process.env.REACT_APP_Host_Api}`,
];
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads");
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage }).single("img");

const userAddBook = [
  cors(corsOptions),

  async (req, res) => {
    try {
      const { token } = req.cookies;

      jwt.verify(token, secretKey, {}, (err, info) => {
        if (err) throw err;

        upload(req, res, async function (err) {
          if (err) {
            return res.status(500).json({ error: "Error uploading file" });
          }

          let {
            booktitle,
            author,
            edition,
            genre,
            condition,
            mrp,
            curruseremail,
          } = req.body;

          if (
            !booktitle ||
            !author ||
            !edition ||
            !genre ||
            !condition ||
            !mrp
          ) {
            res.status(401).json({ error: "Fill Up the Form" });
          } else {
            let owner = await Users.findOne({ email: curruseremail });

            let result = new Books({
              booktitle,
              author,
              edition,
              genre,
              condition,
              mrp,
              img: "img",
              ownerId: owner._id,
            });
            result = await result.save();

            const bookid = result._id;

            const updateImageFilenames = async (fieldName) => {
              const filename = req.file.originalname;
              const newFilename = `${bookid}_img.jpg`;
              console.log("Old filename ", filename);
              fs.rename(
                path.join(__dirname, "../uploads", filename),
                path.join(__dirname, "../uploads", newFilename),
                (err) => {
                  if (err) throw err;
                  console.log(`${filename} renamed to ${newFilename}`);
                }
              );
              return newFilename;
            };

            const imageFilename = await updateImageFilenames("img");

            await Books.findByIdAndUpdate(bookid, {
              img: imageFilename,
            });

            res.status(200).json(result);
          }
        });
      });
    } catch (e) {
      console.log(e);
      res.status(501).json({ error: "Internal Server Error" });
    }
  },
];

const userBookingReceipt = async (req, res) => {
  try {
    const { token } = req.cookies;
    jwt.verify(token, secretKey, {}, async (err, info) => {
      if (err) throw err;

      let bookingid = req.params.id1;

      let booking = await Bookings.findOne({ _id: bookingid });

      let book = await Books.findOne({ _id: booking.bookid });

      let owner = await Users.findOne({ _id: booking.ownerid });

      owner = {
        owner_id: owner._id,
        owner_name: owner.username,
        owner_phn: owner.phn,
        owner_place: owner.place,
        owner_state: owner.state,
        owner_pincode: owner.pincode,
      };

      let buyer = await Users.findOne({ _id: booking.buyerid });
      buyer = {
        buyer_id: buyer._id,
        buyer_name: buyer.username,
        buyer_phn: buyer.phn,
        buyer_place: buyer.place,
        buyer_state: buyer.state,
        buyer_pincode: buyer.pincode,
      };

      res.status(200).json({ booking, book, owner, buyer });
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server Error" });
  }
};

const userBookings = async (req, res) => {
  try {
    const { token } = req.cookies;

    jwt.verify(token, secretKey, {}, async (err, info) => {
      if (err) throw err;

      const buyerid = req.params.id;
      let result = await Bookings.find({ buyerid });
      result = result.reverse();

      res.status(200).json(result);
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server Error" });
  }
};

const userInfo = async (req, res) => {
  try {
    const { token } = req.cookies;

    jwt.verify(token, secretKey, {}, async (err, info) => {
      if (err) throw err;

      const userid = req.params.id;
      let user = await Users.findOne({ _id: userid });
      if (user) {
        user = { ...user._doc };
        delete user.pwd;

        // console.log(user);
        res.status(200).json(user);
      } else {
        res.status(500).json({ error: "User Not Exists" });
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server Error" });
  }
};

const UpdateUserInfo = async (req, res) => {
  try {
    const { token } = req.cookies;
    jwt.verify(token, secretKey, {}, async (err, info) => {
      if (err) throw err;

      // console.log(req.body);
      const userid = req.params.id;

      const { newname, curruseremail, newphn, newplace, newstate, newpincode } =
        req.body;

      if (
        !newname ||
        !curruseremail ||
        !newphn ||
        !newplace ||
        !newstate ||
        !newpincode
      ) {
        res.status(400).json({ error: "Fill Up the Form", donavigate: false });
      } else {
        const validationErrors = errorForSignUp({
          email: curruseremail,
          phn: newphn,
          pincode: newpincode,
        });

        if (Object.keys(validationErrors).length > 0) {
          let err;
          if (validationErrors.email) err += validationErrors.email;
          if (validationErrors.phn) err += validationErrors.phn + "\n";
          if (validationErrors.pincode) err += validationErrors.pincode + "\n";

          res.status(400).json({ error: err, donavigate: false });
        } else {
          if (req.body.newpwd) {
            let newpwd = await generatehashedpwd(req.body.newpwd);

            let result = await Users.findOneAndUpdate(
              { _id: userid },
              {
                $set: {
                  username: newname,
                  phn: newphn,
                  pwd: newpwd,
                  place: newplace,
                  state: newstate,
                  pincode: newpincode,
                },
              }
            );
          } else {
            let result = await Users.findOneAndUpdate(
              { _id: userid },
              {
                $set: {
                  username: newname,
                  phn: newphn,
                  place: newplace,
                  state: newstate,
                  pincode: newpincode,
                },
              }
            );
          }

          const newtoken = jwt.sign(
            {
              userId: userid,
              username: newname,
              email: req.body.curruseremail,
            },
            secretKey
          );

          res
            .cookie("token", newtoken, {
              httpOnly: true,
              sameSite: "None",
              secure: true,
            })
            .status(200)
            .json({ username: newname, email: req.body.curruseremail });
        }
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server Error" });
  }
};

const userLendedBooks = async (req, res) => {
  try {
    const { token } = req.cookies;
    jwt.verify(token, secretKey, {}, async (err, info) => {
      if (err) throw err;

      let userid = req.params.id;

      let lendedbooks = await Bookings.find({ ownerid: userid });
      lendedbooks = lendedbooks.reverse();

      res.status(200).json(lendedbooks);
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server Error" });
  }
};

const userLendedBookReceipt = async (req, res) => {
  try {
    const { token } = req.cookies;

    jwt.verify(token, secretKey, {}, async (err, info) => {
      if (err) throw err;

      let bookingid = req.params.id1;

      let booking = await Bookings.findOne({ _id: bookingid });

      let book = await Books.findOne({ _id: booking.bookid });

      let owner = await Users.findOne({ _id: booking.ownerid });

      owner = {
        owner_id: owner._id,
        owner_name: owner.username,
        owner_phn: owner.phn,
        owner_place: owner.place,
        owner_state: owner.state,
        owner_pincode: owner.pincode,
      };

      let buyer = await Users.findOne({ _id: booking.buyerid });
      buyer = {
        buyer_id: buyer._id,
        buyer_name: buyer.username,
        buyer_phn: buyer.phn,
        buyer_place: buyer.place,
        buyer_state: buyer.state,
        buyer_pincode: buyer.pincode,
      };

      res.status(200).json({ booking, book, owner, buyer });
    });
  } catch (e) {
    console.log(e);

    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
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
};
