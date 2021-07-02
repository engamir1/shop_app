const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ------------------------------------------------------------------
// get all user
router.get(`/`, async (req, res) => {
  const userList = await User.find();

  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});
// ------------------------------------------------------------------
// all users showing name and email without id
router.get("/list", async (req, res) => {
  const singleUser = await User.find({}).select("name phone email -_id");
  if (!singleUser) {
    return res.status(404).send("the user is not here ");
  }
  res.status(200).send(singleUser);
});
// ------------------------------------------------------------------
// register new users
router.post("/register", async (req, res) => {
  console.log(req.body);
  const user = User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.passwordHash, 10),
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
// ------------------------------------------------------------------
// get single user by id
router.get("/:id", async (req, res) => {
  const userid = req.params.id;
  const singleUser = await User.findById(userid);
  if (!singleUser) {
    return res.status(404).send("the user is not here ");
  }
  res.status(200).send(singleUser);
});
// ------------------------------------------------------------------
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
  let newpassword;
  let getuser = await User.findById(req.params.id);
  if (req.body.passwordHash) {
    // console.log(req.params.id);
    console.log(req.body.passwordHash);
    newpassword = bcrypt.hashSync(req.body.passwordHash, 10);
    console.log(newpassword);
  } else {
    newpassword = getuser.passwordHash;
    console.log(newpassword);
  }
  const user = await User.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      email: req.body.email,
      passwordHash: newpassword,
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

  res.send({
    old_password: user.passwordHash,
    updated_password: getuser.passwordHash,
  });
});
// ------------------------------------------------------------------
// login user by email and password 
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  console.log(user);
  console.log(req.body.email);
  const secret = process.env.SECRET_KEY;
  if (!user) {
    res.status(400).send("not found that user");
  }
  if (user && bcrypt.compareSync(req.body.passwordHash, user.passwordHash)) {
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      secret,
      { expiresIn: "1d" }
    );
    res.status(200).send({ user: user._id, token: token });
  } else {
    res.status(400).send(" not **** authenticated user .... ");
  }
});
// ------------------------------------------------------------------
// get product count so i can use in ststics  الاحصاء
router.get("/get/count", async (req, res) => {
  const countUsers = await User.countDocuments((count) => {
    count;
  });
  if (!countUsers) {
    return res.status(400).send("sorry wrong category ");
  }
  res.status(201).json({ countedUsers: countUsers });
});
// ------------------------------------------------------------------
// delete user by id 
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const user = await User.findByIdAndRemove(id);
  console.log(user);
 //   ------------------ first way using async await ------
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
  user = await User.findByIdAndRemove(id)
    .then(() => {
      if (user) {
        return res
          .status(200)
          .json({ success: true, message: "success delete user " });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "sorry didnt find the user" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, err: err });
    });
  //   res.send("{sucess : scucess} - u deleteed category ");
});

module.exports = router;
