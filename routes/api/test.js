"use strict";
const excelToJson = require("convert-excel-to-json");
const { Dress, ValidateDress } = require("../../models/Dress");
const { ColorModel, ValidateColorModel } = require("../../models/ColorModel");
const {
  DressMainInfo,
  ValidateDressMainInfo,
} = require("../../models/DressMainInfo");
var assert = require("assert");
const mongoose = require("mongoose");

mongoose.set("useFindAndModify", false);

// let MongoClient = require("mongodb").MongoClient;
// let url = "mongodb://localhost:27017/";

mongoose
  .connect("mongodb://localhost:27017/furniture", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }) // only in development environment
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB....", err));

/////////////////////////////////////////////////////////////////////////////////////////

// const excelData = excelToJson({
//   sourceFile: "apparels.xlsx",

//   header: {
//     rows: 1,
//   },

//   // Mapping columns to keys
//   columnToKey: {
//     A: "name",
//     B: "price",
//     C: "cover_photo",
//     D: "type",
//     E: "cover_color",
//     F: "brand",
//     G: "discount",
//     H: "tag",
//     I: "gender",
//     J: "next_page_link",
//   },
// });

// // console.log(excelData.Sheet);

// Dress.collection.insertMany(excelData.Sheet, function (err, docs) {
//   if (err) {
//     console.log("...................................");
//     return console.error(err);
//   } else {
//     console.log("Multiple documents inserted to Collection");
//   }
// });

///////////////////////////////////////////////////////////////////////////////////////////

const colorData = excelToJson({
  sourceFile: "./colormodel.xlsx",

  header: {
    rows: 1,
  },

  // Mapping columns to keys
  columnToKey: {
    A: "main_page_link",
    B: "page_color_link",
    C: "page_color_image_link",
  },
});

// console.log(colorData.Sheet);

// let k;

const finder = async (color) => {
  let k = await Dress.find();

  // if (!k) {
  //   console.log(color.main_page_link);
  // }

  // toArray;

  let ll = Object.keys(k);

  // for (let p = 0; p < ll.length; p++) {
  //   console.log(ll[p]);
  // }

  // console.log(k["0"].length);

  let count, i;
  for (i = 0, count = 0; i < ll.length; i++) {
    let buffer = [];
    for (let j = 0; j < colorData.Sheet.length; j++) {
      if (k[ll[i]]["next_page_link"] === colorData.Sheet[j].main_page_link) {
        if (!buffer.includes(colorData.Sheet[j].page_color_link)) {
          ColorModel.collection.insertOne({
            dressId: k[ll[i]]["_id"],
            color_dresspic: colorData.Sheet[j].page_color_image_link,
            page_color_link: colorData.Sheet[j].page_color_link,
          });
          count += 1;
          buffer.push(colorData.Sheet[j].page_color_link);
        }
      }
    }
  }

  console.log(`count ${count}`);
};

finder();

///////////////////////////////////////////////////////////////////////////////

// DressMainInfo.collection.insertOne({
//   colorId: mongoose.Types.ObjectId("5dcac0c2afc76c4db4fe7503"),
//   smallimageset: [
//     "https://img01.ztat.net/article/1F/I8/10/00/2C/11/1FI810002-C11@4.jpg?imwidth=78&filter=packshot",
//     "https://img02.ztat.net/article/1F/I8/10/00/2C/11/1FI810002-C11@3.jpg?imwidth=78"
//   ],
//   hdimageset: [
//     "https://img01.ztat.net/article/1F/I8/10/00/2C/11/1FI810002-C11@4.jpg?imwidth=765&filter=packshot",
//     "https://img02.ztat.net/article/1F/I8/10/00/2C/11/1FI810002-C11@3.jpg?imwidth=765"
//   ],
//   price: "£12.99",
//   discount: 0,
//   tag: "notag",
//   color_text: "grey",
//   description: {
//     "Outer fabric material": "70% cotton, 29% polyester, 1% elastane",
//     Fabric: "Rib",
//     "Care instructions": "Do not tumble dry, machine wash at 30°C",
//     Pattern: "Marl",
//     "Article number": "1FI810002-C11"
//   },
//   size_n_fit: { Length: "Normal" }
// });

// console.log(k);
