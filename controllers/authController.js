import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import { comparePassword, hashMyPassword } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";

const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer, cart } = req.body;

    //validating user
    if (!name) {
      return res.send({
        success: false,
        message: "Name is required!",
      });
    }
    if (!email) {
      return res.send({
        success: false,
        message: "email is required!",
      });
    }
    if (!password) {
      return res.send({
        success: false,
        message: "Password is required!",
      });
    }
    if (!phone) {
      return res.send({
        success: false,
        message: "Phone no. is required!",
      });
    }
    if (!address) {
      return res.send({
        success: false,
        message: "Address is required!",
      });
    }
    if (!answer) {
      return res.send({
        success: false,
        message: "Answer is required!",
      });
    }

    // check for exisiting user with same credentials
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "User is already registered!",
      });
    }

    // Creating new User using userModel
    const hashedPass = await hashMyPassword(password);

    const newUser = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPass,
      question: answer,
      cart,
    }).save();

    res.status(201).send({
      success: true,
      message: "User registered successfully",
      newUser,
    });
  } catch (err) {
    // //console.log(err);
    res.status(500).send({
      success: false,
      message: "Registration error!",
      err,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    //validating user
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password!",
      });
    }

    // Check if user exist
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered!",
      });
    }

    // Match password with hashedPass in database
    const hashedPass = user.password;
    const match = await comparePassword(password, hashedPass);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password!",
      });
    }

    // create token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Login successfully!",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        cart: user.cart,
      },
      token,
    });
  } catch (err) {
    // //console.log(err);
    res.status(500).send({
      success: false,
      message: "Login error!",
      err,
    });
  }
};

// forgot pass controller
const forgotPasswordController = async (req, res) => {
  try {
    const { email, newpassword, answer } = req.body;
    if (!email) {
      res.status(400).send({
        success: false,
        message: "Email is required!",
      });
    }
    if (!answer) {
      res.status(400).send({
        success: false,
        message: "answer is required!",
      });
    }
    if (!newpassword) {
      res.status(400).send({
        success: false,
        message: "new Password is required!",
      });
    }

    // check email and question's answer
    const user = await userModel.findOne({ email, question: answer });

    if (!user) {
      res.status(401).send({
        success: false,
        message: "entered email or answer is wrong!",
      });
    }

    // create hash for new password
    const passwordHash = await hashMyPassword(newpassword);

    // changing pass in db
    await userModel.findByIdAndUpdate(user?._id, { password: passwordHash });

    res.status(200).send({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    // //console.log(err);
    res.status(500).send({
      success: false,
      message: "Something went wrong!",
      err,
    });
  }
};

// test controller
const testJWT = async (req, res) => {
  res.send({
    message: "token verified!",
  });
};

// Update User Profile
const updateUserProfileController = async (req, res) => {
  try {
    const { name, email, address, phone, password } = req?.body;
    const user = await userModel.findById(req?.user?._id);

    // //console.log(user);

    // Match password with hashedPass in database
    const hashedPass = user.password;
    const match = await comparePassword(password, hashedPass);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password!",
      });
    }

    // update details
    const updatedUser = await userModel.findByIdAndUpdate(
      req?.user._id,
      {
        name: name || user.name,
        email: email || user.email,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (err) {
    // //console.log(err);
    res.status(500).send({
      success: false,
      message: "Error in profile update!",
      err,
    });
  }
};

// update user's cart
const updateUserCartController = async (req, res) => {
  try {
    const { el } = req?.body;
    const user = await userModel.findById(req?.user?._id);

    const { updatedCart } = await userModel.findByIdAndUpdate(
      user?._id,
      {
        $push: { cart: el },
      },
      {
        new: true,
      }
    );
    res.status(200).send({
      success: true,
      updatedCart,
    });
  } catch (err) {
    // //console.log(err);
    res.status(500).send({
      success: false,
      message: "Error in cart update!",
      err,
    });
  }
};

// get users' cart
const getUserCartController = async (req, res) => {
  try {
    const user = await userModel.findById(req?.user?._id);

    const { cart } = user;

    res.status(200).send({
      success: true,
      cart,
    });
  } catch (err) {
    // //console.log(err);
    res.status(500).send({
      success: false,
      message: "Error in fetching user cart!",
      err,
    });
  }
};

// remove prod from cart
const removeProductCartController = async (req, res) => {
  try {
    const user = await userModel.findById(req?.user?._id);
    const { id } = req.params;
    // //console.log(id);

    const { updatedCart } = await userModel.findByIdAndUpdate(
      user?._id,
      { $pull: { cart: { _id: id } } },
      { new: true }
    );
    // //console.log(updatedCart);

    res.status(200).send({
      success: true,
      updatedCart,
    });
  } catch (err) {
    // //console.log(err);
    res.status(500).send({
      success: false,
      message: "Error in removing product fro cart!",
      err,
    });
  }
};

// Get all user orders
const userOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (err) {
    // //console.log(err);
    res.status(500).send({
      success: false,
      message: "Error in getting user orders",
      err,
    });
  }
};

// get orders on ADMIN PANEL
const adminOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (err) {
    // //console.log(err);
    res.status(500).send({
      success: false,
      message: "Error in getting user orders",
      err,
    });
  }
};

// change ORDER STATUS on admin panel
const OrderStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // //console.log(id, status);
    const orders = await orderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (err) {
    // //console.log(err);
    res.status(500).send({
      success: false,
      message: "Error in updating order status",
      err,
    });
  }
};

export {
  registerController,
  loginController,
  testJWT,
  forgotPasswordController,
  updateUserProfileController,
  getUserCartController,
  updateUserCartController,
  removeProductCartController,
  userOrdersController,
  adminOrdersController,
  OrderStatusController,
};
