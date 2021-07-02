const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  richDescription: { type: String, default: "" },
  iamge: {
    type: String,
    default: "",
  },
  iamges: [
    {
      type: String,
      default: "",
    },
  ],
  brand: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    default: 0.0,
  },
  // link between category and product is id
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  countInStock: {
    type: Number,
    required: true,
    min: 0.0,
    max: 1500,
  },
  rating: {
    type: Number,
    default: 0.0,
  },
  numReviews: {
    type: Number,
    default: 0.0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  dataCreated: {
    type: Date,
    default: Date.now,
  },
});

exports.Product = mongoose.model("Product", productSchema);
