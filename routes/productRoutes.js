import express from "express";
import {
  singleProductController,
  createProductController,
  allProductsController,
  productPhotoController,
  deleteProductController,
  updateProductController,
  productFilterController,
  productsCountController,
  productsPageController,
  productSearchController,
  similarProductsController,
  CateoryWiseProductsController
} from "../controllers/createProductController.js";
import { isAdmin, protectRoute } from "../middlewares/authMiddleware.js";

import formidable from "express-formidable";

const router = express.Router();

// create new product
router.post(
  "/create-product",
  protectRoute,
  isAdmin,
  formidable(),
  createProductController
);

// get all products
router.get("/all-products", allProductsController);

// get single product
router.get("/single-product/:slug", singleProductController);

// get product photo
router.get("/product-photo/:pid", productPhotoController);

// delete product
router.delete(
  "/delete-product/:pid",
  protectRoute,
  isAdmin,
  deleteProductController
);

//update product
router.put(
  "/update-product/:pid",
  protectRoute,
  isAdmin,
  formidable(),
  updateProductController
);

// filter products
router.post("/product-filter", productFilterController);

// count total products
router.get("/products-count", productsCountController);

// get product by page number
router.get("/products-page/:page", productsPageController);

// search for products
router.get("/search/:keyword", productSearchController);

// get similar products
router.get("/similar-products/:pid/:cid", similarProductsController);

// get products by category
router.get("/get-categorywise-products/:slug", CateoryWiseProductsController);

export default router;
