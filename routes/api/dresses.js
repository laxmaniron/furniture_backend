const express = require("express");
const router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");

// const upload = multer({ dest: "dressuploads/" }).single("dresspicparse");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./dressuploads/");
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  //accept on certain types of files

  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/gif"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 100 },
  fileFilter: fileFilter
}).single("dresspicparse");

//Load Dress Model
const { Dress, ValidateDress } = require("../../models/Dress");
//Load Color Model
const { ColorModel, ValidateColorModel } = require("../../models/ColorModel");

const {
  DressMainInfo,
  ValidateDressMainInfo
} = require("../../models/DressMainInfo");

// @route   GET api/dresses/test
// @descrip Tests dresses route
// @access  Public
router.get("/test", async (req, res) => {
  let dressid = req.query.dressid;

  dressid = mongoose.Types.ObjectId(dressid);

  let dress = await Dress.collection.findOne({ _id: dressid });

  console.log(dress.next_page_link);

  let color, colorsall;

  color = await ColorModel.collection.findOne({
    dressId: dressid,
    page_color_link: dress.next_page_link
  });

  colorsall = await ColorModel.collection.find({ dressId: dressid }).toArray();

  let allcolorinfo = [];
  let singlecolor;

  for (let i = 0; i < colorsall.length; i++) {
    singlecolor = await DressMainInfo.collection.findOne({
      colorId: colorsall[i]._id
    });

    allcolorinfo.push(singlecolor);
    console.log("all correct");
  }

  console.log(color);

  singlecolor = await DressMainInfo.collection.findOne({
    colorId: color._id
  });

  res.send({
    dress: dress,
    colorModel: colorsall,
    color: singlecolor,
    allcolorinfo: allcolorinfo
  });
});

// @route   GET api/dresses/get
// @descrip fetches all the dresses
// @access  Public
router.get("/get", async (req, res) => {
  let page = parseInt(req.query.page, 10);

  let limit = parseInt(req.query.limit, 10);

  let gender = req.query.gender;
  let brand = req.query.brand;

  console.log(brand);

  brand = brand.split(",");

  console.log(brand);

  let dynamicquery = {
    gender: gender
  };

  if (brand.length !== 0) {
    if (brand.length >= 1 && brand[0] != "") {
      dynamicquery.brand = { $in: brand };
    }
  }

  // console.log(brady);

  console.log(dynamicquery);

  var countQuery = await Dress.find(dynamicquery).countDocuments();

  dresses = await Dress.find(dynamicquery)
    .skip((page - 1) * limit)
    .limit(limit)
    .catch(err => res.send({ errormessage: err }));

  brands = await Dress.find({ gender: gender })
    .distinct("brand")
    .catch(err => res.send({ errormessage: err }));

  res.send({ dresses: dresses, total: countQuery, brands: brands });
});

router.post("/getdress", async (req, res) => {
  // console.log(req.body);
  let page = parseInt(req.body.page, 10);

  let limit = parseInt(req.body.limit, 10);

  let gender = req.body.gender;
  let brand = req.body.brand;
  let category = req.body.category;
  let color = req.body.color;
  // let maindisc = parseInt(req.body.maindisc, 10);
  let search = req.body.search;

  console.log(search);

  let dynamicquery = {
    gender: gender
  };

  if (brand.length !== 0) {
    if (brand.length >= 1 && brand[0] != "") {
      dynamicquery.brand = { $in: brand };
    }
  }

  if (category.length !== 0) {
    if (category.length >= 1 && category[0] != "") {
      dynamicquery.type = { $in: category };
    }
  }

  var regex = color.join("|");

  if (color.length !== 0) {
    if (color.length >= 1 && color[0] != "") {
      dynamicquery.cover_color = { $regex: regex, $options: "i" };
    }
  }

  console.log(dynamicquery);

  let normalquery = { gender: gender };

  if (search !== "search") {
    normalquery = {
      $or: [
        {
          gender: gender,
          brand: { $regex: search, $options: "i" }
        },
        {
          gender: gender,
          type: { $regex: search, $options: "i" }
        },
        {
          gender: gender,
          cover_color: { $regex: search, $options: "i" }
        }
      ]
    };

    var kdf = await Dress.find(normalquery).countDocuments();

    console.log(kdf);

    dynamicquery = {
      $and: [dynamicquery, normalquery]
    };
  }

  var countQuery = await Dress.find(dynamicquery).countDocuments();

  dresses = await Dress.find(dynamicquery)
    .skip((page - 1) * limit)
    .limit(limit)
    .catch(err => res.send({ errormessage: err }));

  let brands = await Dress.find(normalquery)
    .distinct("brand")
    .catch(err => res.send({ errormessage: err }));

  let categories = await Dress.find(normalquery)
    .distinct("type")
    .catch(err => res.send({ errormessage: err }));

  let colors = await Dress.find(normalquery)
    .distinct("cover_color")
    .catch(err => res.send({ errormessage: err }));

  res.send({
    dresses: dresses,
    total: countQuery,
    brands: brands,
    categories: categories,
    colors: colors
  });
});

// @route   POST api/dresses/post
// @descrip end point for posting dresses
// @access  Public
router.post("/post", upload, async (req, res) => {
  console.log(req.file);
  const { error } = ValidateDress(req.body);

  if (error) {
    // console.log(error.details[0].message);
    return res.status(400).send(error.details[0].message);
  }

  let dress = new Dress({
    name: req.body.name,
    price: req.body.price,
    cover_photo: req.file.path,
    type: req.body.type,
    cover_color: req.body.cover_color,
    brand: req.body.brand,
    discount: req.body.discount,
    tag: req.body.tag,
    gender: req.body.gender
  });

  dress
    .save()
    .then(dress => {
      res.send(dress);
    })
    .catch(error => res.send(error));
});

module.exports = router;
