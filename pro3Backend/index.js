const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://coupen:coupen@pro3-vijay-coupen.zeaxi.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});
const User = mongoose.model("User", userSchema);

const couponSchema = new mongoose.Schema({
  code: String,
  discount: Number,
  expiryDate: Date,
});
const Coupon = mongoose.model("Coupon", couponSchema);

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "Signup Successful" });
  } catch (err) {
    res.status(500).json({ message: "Error signing up" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid password" });
  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" });
  res.status(200).json({ token });
});

app.post("/add-coupon", async (req, res) => {
  const { code, discount, expiryDate } = req.body;
  try {
    const newCoupon = new Coupon({ code, discount, expiryDate });
    await newCoupon.save();
    res.status(201).json({ message: "Coupon added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error adding coupon" });
  }
});

app.get("/coupons", async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json(coupons);
  } catch (err) {
    res.status(500).json({ message: "Error fetching coupons" });
  }
});

app.delete("/delete-coupon/:id", async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Coupon deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting coupon" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
