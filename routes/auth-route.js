const bcrypt = require("bcrypt");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { application } = require("express");
const registration = require("../models/user");
const products = require("../models/products");

router.post("/register", (req, res) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.json({ status: false, message: "Hashing issue" });
    } else {
      const user = new registration({
        name: req.body.name,
        email: req.body.email,
        password: hash
      });
    console.log(user)
      user
        .save()
        .then((_) => {
          res.json({ success: true, message: "Account  created" });
        })
        .catch((err) => {
          if (err.code === 11000) {
            return res.json({ success: false, message: "Email already Exist" });
          }
          res.json({ success: false, message: "Problem creating Account" });
        });
    }
  });
});

router.post("/data",(req,res)=>{
  console.log("jjj")
  products.insertMany(req.body)
  .then(()=>{
  res.json({ success: true, message: "Account  created" });}
  ).catch((e)=>{
    res.send(e)
      console.log("a");
  })
})
//for login routing
router.post("/login", (req, res) => {
  registration
    .find({ email: req.body.email })
    .exec()
    .then((result) => {
      if (result < 1) {
        return res.json({ success: false, message: "user not found" });
      }
      const user = result[0];
      bcrypt.compare(req.body.password, user.password, (err, rest) => {
        const payload = {
          userId: user._id,
        };
        const token = jwt.sign(payload, "webBatch");
        if (rest) {
          return res.json({
            success: true,
            token: token,
            message: "Login Successful",
          });
        } else {
          return res.json({
            success: false,
            message: "Password do not Matched",
          });
        }
      });
    })
    .catch((err) => {
      res.json({ success: false, message: "Auth Failed" });
    });
});
///verifying the token

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "webBatch");
    req.userData = decoded;
    next();
  } catch (ex) {
    console.log("Failed to verify in VerifyToken");
    res.json({ sucess: false, data: "Authentication Failed to verifytoken" });
  }
};

//main content routing
router.get("/:name", (req, res) => {
  const productName = req.params.name;
  console.log(productName);
  products
    .find({"cat":productName})
    .exec()
    .then((result) => {
      res.send( result);
    })
    .catch((err) => {
      res.json({ sucess: false, data: "Server Error" });
    });
});

module.exports = router;
