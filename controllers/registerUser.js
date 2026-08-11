const userModel = require("../Models/Users");
const bcrypt = require("bcryptjs")
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
   const hash = await bcrypt.hash(password,15)
    const user = new userModel({
      name,
      email,
      password:hash,
      role,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error registering user",
      error: error.message,
    });
  }
};

module.exports = registerUser;