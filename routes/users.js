const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");



router.get(`/`, async (req, res) => {
  const userList = await User.find();

  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});
// all users showing name and email without id 
router.get("/list", async (req, res) => {
  const singleUser = await User.find({}).select("name phone email -_id");
  if (!singleUser) {
    return res.status(404).send("the user is not here ");
  }

  res.status(200).send(singleUser);
});

router.post("/register", async (req, res) => {
  console.log(req.body);
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });
  await user.save();
  if (!user) {
    res.status(400).send("cant register user ");
  }
  res.send({ user });
});
// get single user by id
router.get("/:id", async (req, res) => {
  const userid = req.params.id;
  const singleUser = await User.findById(userid);
  if (!singleUser) {
    return res.status(404).send("the user is not here ");
  }
  res.status(200).send(singleUser);
});
// single user without showing password
router.get("/secure/:id", async (req, res) => {
  const userid = req.params.id;
  console.log(userid);
  const singleUser = await User.find({ _id: userid }).select("-passwordHash");
  if (!singleUser) {
    return res.status(404).send("the user is not here ");
  }
  res.status(200).send(singleUser);
});
router.put("/edit/:id", async (req, res) => {
  let id = req.params.id;
  // console.log(req.body);
  let newpassword;
  if (!req.body.passwordHash) {
    const user = await User.findById(req.params.id);
    // console.log(req.params.id);
    newpassword = user.passwordHash;
    // console.log(newpassword);
  } else {
    newpassword = req.body.passwordHash;
  }
  console.log(newpassword);
  const user = await User.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(newpassword, 10),
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    },
    { new: true }
  );
  user.save();
  if (!user) {
    res.status(400).send("cant register user ");
  }

  res.send({ user });
});

module.exports = router;
