const { Category } = require("../models/category");
const express = require("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
  const categoryList = await Category.find();

  if (!categoryList) {
    res.status(500).json({ success: false });
  }
  res.send(categoryList);
});
// ---------------------------------------------------
router.post("/", async (req, res) => {
  const categoryList = await Category.find();
  const { name, icon, color } = req.body;
  let category = new Category({
    // name : req.body.name
    name: name,
    icon: icon,
    color: color,
  });
  category = await category.save();
  if (!category) {
    return res.status(404).send("the category is not here ");
  }
  res.send(`${categoryList}`);
});
// ----------------------------------------------------------------
router.get("/:id", async (req, res) => {
  const category = req.params.id;
  const singleCategory = await Category.findById(category);
  if (!singleCategory) {
    return res.status(404).send("the category is not here ");
  }

  res.status(200).send(singleCategory);
});
// ------------- edit in category
router.put("/:id", async (req, res) => {
  const category_id = req.params.id;
  const singleCategory = await Category.findByIdAndUpdate(category_id, {
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  },{new : true});
  if (!singleCategory) {
    return res.status(404).send("the category is not here ");
  }

  res.status(200).send(singleCategory);
});
// ----------------------------------------------------------------
// delete category
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  // Category.findByIdAndRemove(id) == Category.findByIdAndDelete(id)
  //   const category = await Category.findByIdAndRemove(id);
  //   if (category) {
  //     return res
  //       .status(200)
  //       .json({ success: true, message: "success delete category " });
  //   } else {
  //     return res
  //       .status(404)
  //       .json({ success: false, message: "sorry didnt find the category" });
  //   }
  // }
  //   ------------------ another way using promises ------
  const category = await Category.findByIdAndRemove(req.params.id)
    .then(() => {
      if (category) {
        return res
          .status(200)
          .json({ success: true, message: "success delete category " });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "sorry didnt find the category" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, err: err });
    });

  //   res.send("{sucess : scucess} - u deleteed category ");
});
module.exports = router;
