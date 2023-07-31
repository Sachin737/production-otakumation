import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";

const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(401).send({
        success: false,
        message: "category name is required!",
      });
    }

    const categoryExist = await categoryModel.findOne({ name: name });

    if (categoryExist) {
      return res.status(200).send({
        success: false,
        message: "Category already exist!",
      });
    }

    const category = await new categoryModel({
      name: name,
      slug: slugify(name),
    }).save();

    res.status(201).send({
      success: true,
      message: "New category created!",
      category,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "error in category!",
      err,
    });
  }
};

// update category
const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    if (!name) {
      return res.status(401).send({
        success: false,
        message: "category name is required!",
      });
    }

    const category = await categoryModel.findByIdAndUpdate(
      id,
      {
        name: name,
        slug: slugify(name),
      },
      { new: true } // to update db
    );

    res.status(201).send({
      success: true,
      message: "Category updated successfully!",
      category,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "error in updating category!",
      err,
    });
  }
};

// get all categories
const allCategoriesController = async (req, res) => {
  try {
    const category = await categoryModel.find({});

    res.status(201).send({
      success: true,
      message: "All categories",
      category
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "error in fetching all categories!",
      err,
    });
  }
};

// get single category
const singleCategoryController = async (req, res) => {
  try {
    const { slug } = req.params;

    const data = await categoryModel.findOne({ slug: slug });
    
    if(data){
      res.status(201).send({
        success: true,
        message: "category found successfully!",
        data,
      });
    }else{
      res.status(400).send({
        success: false,
        message: "No such category exist!",
      });  
    }
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "error in fetching your category!",
      err,
    });
  }
};

// delete category

const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;

    await categoryModel.findByIdAndDelete(id);
    res.status(201).send({
      success: true,
      message: "category deleted successfully!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "error in deleting category!",
      err,
    });
  }
};

export {
  createCategoryController,
  updateCategoryController,
  allCategoriesController,
  singleCategoryController,
  deleteCategoryController,
};
