const userModel = require("../Models/Users");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const user = new userModel({
      name,
      email,
      password,
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