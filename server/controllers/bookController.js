const cors = require("cors");
const multer = require("multer");
const jwt = require("jsonwebtoken");

const Users = require("../models/Users");
const Books = require("../models/Books");
const Bookings = require("../models/Bookings");

const secretKey = process.env.secretKey;

const getBookInfo = async (req, res) => {
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
    cb(null, "../client/public/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage }).single("img");

const booktheBook = async (req, res) => {
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
};

const getBookInfoForUpdate = async (req, res) => {
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
};

const updateBookInfo = [
  cors(corsOptions),

  async (req, res) => {
    try {
      const { token } = req.cookies;
      jwt.verify(token, secretKey, {}, async (err, info) => {
        if (err) throw err;
        let id = req.params.id;

        upload(req, res, async function (err) {
          if (err) {
            return res.status(500).json({ error: "Error uploading file" });
          }

          const { booktitle, edition, author, genre, condition, mrp } =
            req.body;
          if (
            !booktitle ||
            !edition ||
            !author ||
            !genre ||
            !condition ||
            !mrp
          ) {
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
  },
];

module.exports = {
  getBookInfo,
  booktheBook,
  getBookInfoForUpdate,
  updateBookInfo,
};
