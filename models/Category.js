// qq

import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: {
    en: { type: String, required: true },
    et: { type: String, required: true },
    ru: { type: String, required: true },
  },
  slug: { type: String, required: true, unique: true },
});

const Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);
export { Category };
