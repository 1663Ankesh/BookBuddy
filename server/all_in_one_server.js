const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const fs = require("fs");
require("dotenv").config();
const path = require("path");
const Users = require("./models/Users");
const Books = require("./models/Books");
const Bookings = require("./models/Bookings");
const secretKey = process.env.secretKey;
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

mongoose
  .connect("mongodb://127.0.0.1:27017/givingbooks")
  .then(() => {
    console.log("Connected to Mongodb");
  })
  .catch(() => {
    console.log("MongoDB connection error");
  });

async function generatehashedpwd(pwd) {
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(pwd, salt);
  return hash;
}

app.get("/api/", async (req, res) => {
  try {
    let result = await Books.find({ isbooked: false });
    result = result.reverse();

    // console.log(result);

    res.status(200).json(result);
  } catch (e) {
    console.log(e);

    res.status(500).json({ error: "Server error" });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const { username, email, pwd, phn, place, state, pincode } = req.body;

    if (!username || !email || !pwd || !phn || !place || !state || !pincode) {
      res.json({ error: "Fill Up the Form" });
    } else {
      let result = await Users.findOne({ email });

      if (result) {
        res.json({ error: "User Exists" });
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
          secretKey,
          { expiresIn: "1h" }
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
  } catch (e) {
    res.status(501).json({ error: "Server Error" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, pwd } = req.body;
    if (!email || !pwd) {
      return res.status(400).json({ error: "Fill Up the form" });
    }

    const user = await Users.findOne({ email });
    if (user) {
      const result = await bcrypt.compare(pwd, user.pwd);

      if (result) {
        const token = jwt.sign(
          { userId: user._id, username: user.username, email: user.email },
          secretKey,
          { expiresIn: "1h" }
        );

        console.log(token);

        res
          .cookie("token", token, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
          })
          .json({ username: user.username, email: user.email });
      } else {
        return res.status(401).json({ error: "Incorrect password" });
      }
    } else {
      return res.status(401).json({ error: "User not found" });
    }
  } catch (e) {
    res.status(501).json({ error: "Server Error" });
  }
});

app.post("/logout", async (req, res) => {
  try {
    res
      .cookie("token", " ", {
        sameSite: "None",
        secure: true,
        expire: new Date(0),
      })
      .json("ok");
  } catch (e) {
    res.status(501).json({ error: "Server Error" });
  }
});

app.post("/profile", (req, res) => {
  try {
    const { token } = req.cookies;

    jwt.verify(token, secretKey, {}, (err, info) => {
      if (err) {
        console.log(err);
        throw err;
      } else {
        console.log("Info is ", info);
        res.json(info);
      }
    });
  } catch (e) {
    console.log(e);
    res.status(501).json({ error: "Server Error" });
  }
});

app.post("/forgotpassword", async (req, res) => {
  try {
    const { email, pwd } = req.body;

    if (!email || !pwd) {
      return res.status(401).json({ error: "Fill Up the form" });
    } else {
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
    res.status(501).json({ error: "Server Error" });
  }
});

app.get("/book/:id", async (req, res) => {
  try {
    let id = req.params.id;

    let result = await Books.findOne({ _id: id });
    let owner = await Users.findOne({ _id: result.ownerId });

    owner = {
      owner_id: owner._id,
      owner_name: owner.username,
      owner_phn: owner.phn,
      owner_place: owner.place,
      owner_state: owner.state,
      owner_pincode: owner.pincode,
    };

    res.status(200).json({ result, owner });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server Error" });
  }
});

app.get("/:id/mybooks", async (req, res) => {
  try {
    const { token } = req.cookies;

    jwt.verify(token, secretKey, {}, async (err, info) => {
      if (err) throw err;

      let books = await Books.find({ ownerId: req.params.id, isbooked: false });
      books = books.reverse();

      // console.log("My Books : ", books);
      res.status(200).json(books);
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server Error" });
  }
});

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage }).single("img");

app.post("/addbook", cors(corsOptions), async (req, res) => {
  try {
    const { token } = req.cookies;

    console.log(token);

    jwt.verify(token, secretKey, {}, (err, info) => {
      if (err) throw err;
      console.log("Token verified at /addbook");

      upload(req, res, async function (err) {
        if (err) {
          return res.status(500).json({ error: "Error uploading file" });
        }

        // console.log(req.body);
        // console.log(req.file);

        let {
          booktitle,
          author,
          edition,
          genre,
          condition,
          mrp,
          curruseremail,
        } = req.body;

        // console.log(booktitle, author, edition, genre, condition, mrp);
        if (!booktitle || !author || !edition || !genre || !condition || !mrp) {
          res.status(501).json({ error: "Fill Up the Form" });
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
              path.join("../client/public/images", filename),
              path.join("../client/public/images", newFilename),
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

          // console.log("Final added, ", result);
          res.status(200).json(result);
        }
      });
    });
  } catch (e) {
    console.log(e);
    res.status(501).json({ error: "Internal Server Error" });
  }
});

function gettime() {
  const now = new Date();
  let time = new Date(now.getTime());
  const options = {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  time = time.toLocaleTimeString("en-US", options);
  return time;
}

app.post("/book/:id", async (req, res) => {
  console.log("Got request to book");
  try {
    const { token } = req.cookies;

    jwt.verify(token, secretKey, {}, async (err, info) => {
      if (err) throw err;

      const bookid = req.params.id;
      const ownerid = req.body.owner_id;
      const buyerid = req.body.id;

      const dateofbooking = new Date();
      const timeofbooking = gettime();

      const newbooking = new Bookings({
        bookid,
        ownerid,
        buyerid,
        dateofbooking,
        timeofbooking,
      });

      await newbooking.save();

      await Books.findOneAndUpdate(
        { _id: bookid },
        { isbooked: true },
        { new: true }
      );

      res.status(200).json({ message: "Booked" });
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server Error" });
  }
});

function gettimeahead() {
  const now = new Date();
  let time = new Date(now.getTime() + 1 * 60 * 60 * 1000);
  const options = {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  time = time.toLocaleTimeString("en-US", options);
  return time;
}

app.get("/:id/bookings/:id1", async (req, res) => {
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
});

app.get("/:id/bookings", async (req, res) => {
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
});

app.get("/:id", async (req, res) => {
  try {
    const { token } = req.cookies;
    console.log(token);
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
});

app.post("/:id", async (req, res) => {
  try {
    const { token } = req.cookies;
    jwt.verify(token, secretKey, {}, async (err, info) => {
      if (err) throw err;

      const userid = req.params.id;

      if (req.body.newpwd) {
        let newpwd = await generatehashedpwd(req.body.newpwd);

        let result = await Users.findOneAndUpdate(
          { _id: userid },
          {
            $set: {
              username: req.body.newname,
              phn: req.body.newphn,
              pwd: newpwd,
              place: req.body.newplace,
              state: req.body.newstate,
              pincode: req.body.newpincode,
            },
          }
        );
      } else {
        let result = await Users.findOneAndUpdate(
          { _id: userid },
          {
            $set: {
              username: req.body.newname,
              phn: req.body.newphn,
              place: req.body.newplace,
              state: req.body.newstate,
              pincode: req.body.newpincode,
            },
          }
        );
      }

      const newtoken = jwt.sign(
        {
          userId: userid,
          username: req.body.newname,
          email: req.body.curruseremail,
        },
        secretKey,
        { expiresIn: "1h" }
      );

      res
        .cookie("token", newtoken, {
          httpOnly: true,
          sameSite: "None",
          secure: true,
        })
        .json({ username: req.body.newname, email: req.body.curruseremail });
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server Error" });
  }
});

app.get("/:id/lendedbooks", async (req, res) => {
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
});

app.get(`/:id/lendedbookreceipt/:id1`, async (req, res) => {
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
});

app.get("/book/:id/update", async (req, res) => {
  try {
    const { token } = req.cookies;

    jwt.verify(token, secretKey, {}, async (err, info) => {
      if (err) throw err;
      let id = req.params.id;

      let result = await Books.findOne({ _id: id });

      res.status(200).json(result);
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server Error" });
  }
});

app.post("/book/:id/update", cors(corsOptions), async (req, res) => {
  try {
    const { token } = req.cookies;
    jwt.verify(token, secretKey, {}, async (err, info) => {
      if (err) throw err;
      let id = req.params.id;

      upload(req, res, async function (err) {
        if (err) {
          return res.status(500).json({ error: "Error uploading file" });
        }

        const { booktitle, edition, author, genre, condition, mrp } = req.body;
        if (!booktitle || !edition || !author || !genre || !condition || !mrp) {
          res.json({ error: "Fill Up the Form" });
        } else {
          let result = await Books.findOneAndUpdate(
            { _id: id },
            {
              $set: {
                booktitle: req.body.booktitle,
                edition: req.body.edition,
                author: req.body.author,
                genre: req.body.genre,
                condition: req.body.condition,
                mrp: req.body.mrp,
              },
            }
          );

          if (req.file) {
            const updateImageFilenames = async (fieldName) => {
              const filename = req.file.originalname;
              const newFilename = `${id}_img.jpg`;
              console.log("Old filename ", filename);
              fs.rename(
                path.join("../client/public/images", filename),
                path.join("../client/public/images", newFilename),
                (err) => {
                  if (err) throw err;
                  console.log(`${filename} renamed to ${newFilename}`);
                }
              );
              return newFilename;
            };

            const imageFilename = await updateImageFilenames("img");

            await Books.findByIdAndUpdate(id, {
              img: imageFilename,
            });
          }
          res.status(200).json(result);
        }
      });
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
