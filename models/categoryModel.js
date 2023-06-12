import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    require: true,
  },
  slug: {
    type: String,
    lowercase: true,
  },
});

const categoryModel = mongoose.model("category", categorySchema);
export default categoryModel;
