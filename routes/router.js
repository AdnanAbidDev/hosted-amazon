const express = require("express");
const router = new express.Router();
const Products = require("../models/productsSchema");
const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const authenicate = require("../middleware/authenticate");
router.get("/getproducts", async (req, res) => {
  try {
    const productsdata = await Products.find();
    // console.log(productsdata);
    res.status(201).json(productsdata); // identical to res.send except that it is used explicitly for json
  } catch (error) {
    console.log("error" + error.message);
  }
});

// individual data
router.get("/getproductsone/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id);
    const individual = await Products.findOne({ id: id });
    console.log(individual + "individual data found");
    res.status(201).json(individual);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post("/register", async (req, res) => {
  console.log("data" + req.body);
  const { fname, email, mobile, password, cpassword } = req.body;

  if (!fname || !email || !mobile || !password || !cpassword) {
    res.status(422).json({ error: "fill the all details" });
    console.log("all details not available");
  }

  try {
    const preuser = await User.findOne({ email: email });

    if (preuser) {
      res.status(422).json({ error: "This email is already exist" });
    } else if (password !== cpassword) {
      res.status(422).json({ error: "password are not matching" });
    } else {
      const finaluser = new User({
        fname,
        email,
        mobile,
        password,
        cpassword,
      });

      // password hashing

      const storedata = await finaluser.save();
      // console.log(storedata + "user successfully added");
      res.status(201).json(storedata);
    }
  } catch (error) {
    console.log(
      "error the bhai catch ma for registratoin time" + error.message
    );
    res.status(422).send(error);
  }
});

// login data
router.post("/login", async (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "fill the details" });
  }

  try {
    const userlogin = await User.findOne({ email: email });
    console.log(userlogin);
    if (userlogin) {
      const isMatch = await bcrypt.compare(password, userlogin.password);
      // console.log(isMatch);
      // token generate

      if (!isMatch) {
        res.status(400).json({ error: "invalid crediential pass" });
      } else {
        const token = await userlogin.generateAuthtoken();
        console.log(token);
        //cookie generate
        res.cookie("Amazonweb", token, {
          expires: new Date(Date.now() + 900000),
          httpOnly: true,
        });
        res.status(201).json(userlogin);
      }
    } else {
      res.status(400).json({ error: "user not exist" });
    }
  } catch (error) {
    res.status(400).json({ error: "invalid crediential pass" });
    console.log("catch error in login" + error.message);
  }
});

// adding the data into cart
router.post("/addcart/:id", authenicate, async (req, res) => {
  try {
    // console.log("perfect 6");
    const { id } = req.params;
    const cart = await Products.findOne({ id: id }); //find products details
    console.log(cart + "cart value");

    const Usercontact = await User.findOne({ _id: req.userID }); //find user details
    console.log(Usercontact + "user milta hain");

    if (Usercontact) {
      //if userdetail found
      const cartData = await Usercontact.addcartdata(cart); //send product detail and add them to cart in user details
      await Usercontact.save();
      console.log(cartData + " saving cartdata");
      console.log(Usercontact + "userjode save");
      res.status(201).json(Usercontact);
    } else {
      res.status(401).json({ error: "invalid user" });
    }
  } catch (error) {
    res.status(401).json({ error: "invalid user" });
  }
});

// get data into the cart
router.get("/cartdetails", authenicate, async (req, res) => {
  try {
    const buyuser = await User.findOne({ _id: req.userID });
    console.log(buyuser + "user found");
    res.status(201).json(buyuser);
  } catch (error) {
    console.log(error + "error for buy now");
  }
});

// validate user
router.get("/validuser", authenicate, async (req, res) => {
  try {
    const validuserone = await User.findOne({ _id: req.userID });
    res.status(201).json(validuserone);
  } catch (error) {
    console.log(error + "error validating user");
  }
});

// remove item from cart
router.delete("/remove/:id", authenicate, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    req.rootUser.carts = req.rootUser.carts.filter((curel) => {
      return curel.id != id;
    });

    req.rootUser.save();
    res.status(201).json(req.rootUser);
    console.log("item remove");
  } catch (error) {
    console.log(error + "remove error");
    res.status(400).json(error);
  }
});

// for userlogout

router.get("/logout", authenicate, async (req, res) => {
  try {
    req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
      return curelem.token !== req.token;
    });

    res.clearCookie("eccomerce", { path: "/" });
    req.rootUser.save();
    res.status(201).json(req.rootUser.tokens);
    console.log("user logout");
  } catch (error) {
    console.log(error + "jwt provide then logout");
  }
});

module.exports = router;
