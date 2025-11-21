import mongoose, { model, Schema, models } from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: {
      en: { type: String, required: true },
      et: { type: String, required: true },
      ru: { type: String, required: true }
    },
    description: {
      en: { type: String },
      et: { type: String },
      ru: { type: String }
    },
    price: { type: Number, required: true },
    images: [{ type: String }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' },
    allergens: [{ type: String }],
    // isAlcoholic: { type: Boolean, required: true },
    // degree: { type: Number, min: 0, max: 150, default: null },
    slug: { type: String, unique: true },
  },
  // { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export { Product };
