import express from "express";
import {
  forgotPasswordController,
  loginController,
  registerController,
  testJWT,
  updateUserProfileController,
  getUserCartController,
  updateUserCartController,
  removeProductCartController,
  userOrdersController,
  adminOrdersController,
  OrderStatusController
} from "../controllers/authController.js";

import { isAdmin, protectRoute } from "../middlewares/authMiddleware.js";

// router obj
const router = express.Router();

// ROUTES

// Register
router.post("/register", registerController);

// Login
router.post("/login", loginController);

// Test Route
router.get("/test", protectRoute, isAdmin, testJWT);

// Forgot Password
router.post("/forgot-password", forgotPasswordController);

// Protection route for user DASHBOARD
router.get("/user-auth", protectRoute, (req, res) => {
  res.status(200).send({
    ok: true,
  });
});

// Protection route for admin DASHBOARD
router.get("/admin-auth", protectRoute, isAdmin, (req, res) => {
  res.status(200).send({
    ok: true,
  });
});

// upadte user profile
router.put("/profile", protectRoute, updateUserProfileController);

// get user cart
router.get("/user-cart", protectRoute, getUserCartController);

// update User cart
router.put("/update-cart", protectRoute, updateUserCartController);

// remove product from User cart
router.put("/remove-product/:id", protectRoute, removeProductCartController);

// get all user orders
router.get("/orders", protectRoute, userOrdersController);

// get all admin recieved orders
router.get("/admin-orders", protectRoute, isAdmin, adminOrdersController);

// order status update in admin panel
router.put("/order-status/:id", protectRoute, isAdmin, OrderStatusController);


export default router;
