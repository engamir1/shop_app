const { Product } = require("../models/product");
const express = require("express");
const { Category } = require("../models/category");
const router = express.Router();
const mongoose = require("mongoose");

// get all products
router.get(`/`, async (req, res) => {
  const productList = await Product.find();

  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
});

// get single product by id
router.get(`/details/:id`, async (req, res) => {
  //   console.log(req.params);
  //   if u want to show all details about connected category not only id  we use
  // populate("category");  "category" -- > it should be an id
  //   in model it should be ObjectId
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Category",
  const singleProduct = await Product.findById(req.params.id).populate(
    "category"
  );

  if (!singleProduct) {
    res.status(500).json({ success: false });
  }
  res.send(singleProduct);
});
// get all product by id and show only name and images
router.get("/list", async (req, res) => {
  //   console.log(req.params);
  //   -_id  if u want to remove _id from showing
  const productList = await Product.find({}).select("name image  -_id ");

  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
});

// add new product
router.post(`/`, async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(400).send("sorry wrong category ");
  }
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    iamge: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });

  product
    .save()
    .then((createdProduct) => {
      res.status(201).json(createdProduct);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        success: false,
      });
    });
});

// edit product
// ------------- edit in category
router.put("/:id/edit", async (req, res) => {
  // make check for id
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.send("the Product is Invalid ID ");
  }
  const product_id = req.params.id;
  const singleProduct = await Product.findByIdAndUpdate(
    product_id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      iamge: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  );
  if (!singleProduct) {
    return res.status(404).send("the Product is not here ");
  }

  res.status(200).send(singleProduct);
});

// get product count so i can use in ststics  الاحصاء
router.get("/get/count", async (req, res) => {
  const countProducts = await Product.countDocuments((count) => {
    count;
  });
  if (!countProducts) {
    return res.status(400).send("sorry wrong category ");
  }
  res.status(201).json({ countedProducts: countProducts });
});
// get featured products
router.get("/featured/:num", async (req, res) => {
  // make limit for returned featured product
  const num = req.params.num ? req.params.num : 0;
  //   if (num >= 0) {
  //     return num;
  //   } else {
  //     return (num = 0);
  //   }
  const productList = await Product.find({ isFeatured: true }).limit(
    parseInt(num)
  );

  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(`${productList}`);
});
// get products by categories
router.get("/get", async (req, res) => {
  //   console.log(req.query.category);

  console.log(req.query.category);

  const productList = await Product.find({
    category: req.query.category,
  }).populate("category");

  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
});

module.exports = router;
