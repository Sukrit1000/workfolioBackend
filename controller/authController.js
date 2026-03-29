import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  console.log("Register endpoint hit with data:", req.body); // Debug log
  try {
    const { firstName, lastName, email,username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
    });
     
  

    const userSaved = await user.save();

    if(userSaved){
      const token = jwt.sign({ id: userSaved._id }, process.env.JWT_SECRET);
      res.status(200).json({status:true,code:0, token, user: userSaved });
    } else {
      res.status(500).json({status:false,code:1, message: "Error saving user" });
    }
  } catch (err) {
    res.status(500).json({status:false,code:1, message: err.message });
    console.log("my error>> ", err); // Debug log
  }
};

export const login = async (req, res) => {
  console.log("Login endpoint hit with data:", req.body); // Debug log
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({status:false,code:1, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({status:false,code:1, message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.status(200).json({ status: true, code: 0, token, user });
  } catch (err) {
    res.status(500).json({ status: false, code: 1, message: err.message });
  }
};