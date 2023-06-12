import express from "express";
import {
  createCategoryController,
  updateCategoryController,
  allCategoriesController,
  singleCategoryController,
  deleteCategoryController
} from "../controllers/categoryController.js";
import { isAdmin, protectRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

//  create category
router.post(
  "/create-category",
  protectRoute,
  isAdmin,
  createCategoryController
);

// update category
router.put(
  "/update-category/:id",
  protectRoute,
  isAdmin,
  updateCategoryController
);

// get all categories
router.get("/all-categories", allCategoriesController);

// get single category
router.get("/single-category/:slug", singleCategoryController);

// delete category
router.delete("/delete-category/:id",protectRoute,isAdmin,  deleteCategoryController);


export default router;
