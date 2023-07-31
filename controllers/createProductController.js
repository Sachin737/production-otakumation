import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from "fs";
import categoryModel from "../models/categoryModel.js";

const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields; // why? before this there is a middleware formidable which make it like this
    const { photo } = req.files;

    //Validating user input
    switch (true) {
      case !name:
        return res.status(500).send({
          success: false,
          message: "Product name is required!",
        });
      case !description:
        return res.status(500).send({
          success: false,
          message: "Description is required!",
        });
      case !price:
        return res.status(500).send({
          success: false,
          message: "Price is required!",
        });
      case !quantity:
        return res.status(500).send({
          success: false,
          message: "Quantity is required!",
        });
      case !category:
        return res.status(500).send({
          success: false,
          message: "Category is required!",
        });
      case !photo || photo.size > 1000000: // in bytes
        return res.status(500).send({
          success: false,
          message: "Photo required and size must be less than 1mb!",
        });
    }

    const product = new productModel({ ...req.fields, slug: slugify(name) });

    if (photo) {
      product.photo.contentType = photo.type;
      product.photo.data = fs.readFileSync(photo.path);
    }
    await product.save();

    res.status(201).send({
      success: true,
      message: "Successfully created product!",
      product,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Error while creating product!",
      err,
    });
  }
};

// get all products
const allProductsController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .select("-photo")
      .populate("category")
      .limit(30)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "All prroducts fetched successfully!",
      total: products.length,
      products,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Error while getting products!",
      err,
    });
  }
};

// get single product
const singleProductController = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await productModel
      .findOne({ slug: slug })
      .select("-photo")
      .populate("category");

    res.status(200).send({
      success: true,
      message: "Product fetched scuccessfully!",
      product,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error while fetching your product!",
      err,
    });
  }
};

// get product photo
const productPhotoController = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productModel.findById(pid).populate("category");

    if (product.photo.data) {
      res.set("contentType", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }

    res.status(500).send({
      success: false,
      message: "Error while fetching photo!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error while fetching photo!",
      err,
    });
  }
};

// delete product
const deleteProductController = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productModel.findById(pid).select("-photo");
    await productModel.findByIdAndDelete(pid).select("-photo");

    // console.log(pid);

    res.status(200).send({
      success: true,
      message: "Product deleted successfully!",
      product,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error while deleting product!",
      err,
    });
  }
};

// update product
const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields; // why? before this there is a middleware formidable which make it like this
    const { photo } = req.files;

    const { pid } = req.params;

    //Validating user input
    switch (true) {
      case !name:
        return res.status(500).send({
          success: false,
          message: "Product name is required!",
        });
      case !description:
        return res.status(500).send({
          success: false,
          message: "Description is required!",
        });
      case !price:
        return res.status(500).send({
          success: false,
          message: "Price is required!",
        });
      case !quantity:
        return res.status(500).send({
          success: false,
          message: "Quantity is required!",
        });
      case !category:
        return res.status(500).send({
          success: false,
          message: "Category is required!",
        });
      case photo && photo.size > 1000000: // in bytes
        return res.status(500).send({
          success: false,
          message: "Photo required and size must be less than 1mb!",
        });
    }

    const product = await productModel.findByIdAndUpdate(
      pid,
      {
        ...req.fields,
        slug: slugify(name),
      },
      { new: true }
    );
    if (photo) {
      product.photo.contentType = photo.type;
      product.photo.data = fs.readFileSync(photo.path);
    }
    await product.save();

    res.status(201).send({
      success: true,
      message: "Successfully updated product!",
      product,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Error while updating product!",
      err,
    });
  }
};

// product filters
const productFilterController = async (req, res) => {
  const { checked, price } = req.body;
  try {
    let Queries = {};

    if (checked.length) {
      Queries.category = checked;
    }
    if (price.length) {
      Queries.price = { $gte: price[0], $lte: price[1] };
    }
    const prods = await productModel.find(Queries).select("-photo");

    res.status(200).send({
      success: true,
      prods,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      success: false,
      message: "Error in filtering!",
      err,
    });
  }
};

// count of total products
const productsCountController = async (req, res) => {
  try {
    const totalCount = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      succes: true,
      totalCount,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      success: false,
      message: "Error in getting count of products!",
      err,
    });
  }
};

// get products based on page number
const productsPageController = async (req, res) => {
  try {
    const perPage = 8;
    const page = req.params.page ? req.params.page : 1;

    const products = await productModel
      .find({})
      .select("-photo")
      .skip(perPage * (page - 1))
      .limit(perPage);

    res.status(200).send({
      success: true,
      products,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      success: false,
      message: "Error in getting current page's products!",
      err,
    });
  }
};

// search products

const productSearchController = async (req, res) => {
  try {
    const { keyword } = req.params;

    const products = await productModel
      .find({
        $or: [
          {
            name: { $regex: keyword, $options: "i" },
          },
          {
            description: { $regex: keyword, $options: "i" },
          },
        ],
      })
      .select("-photo");

    res.status(200).send({
      success: true,
      products,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      success: false,
      message: "Error in searching products!",
      err,
    });
  }
};

// similar produccts
const similarProductsController = async (req, res) => {
  try {
    const { pid, cid } = req.params;

    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(4)
      .populate("category");

    res.status(200).send({
      success: true,
      products,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      success: false,
      message: "error in getting similar products",
      err,
    });
  }
};

// get products by category
const CateoryWiseProductsController = async (req, res) => {
  try {
    const category = await categoryModel.find({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category").select("-photo");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      success: false,
      message: "error in getting category wise products",
      err,
    });
  }
};

export {
  createProductController,
  allProductsController,
  singleProductController,
  productPhotoController,
  deleteProductController,
  updateProductController,
  productFilterController,
  productsCountController,
  productsPageController,
  productSearchController,
  similarProductsController,
  CateoryWiseProductsController,
};
