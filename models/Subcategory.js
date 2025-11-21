import mongoose from 'mongoose';

// models/Subcategory.js
const SubcategorySchema = new mongoose.Schema({
  name: {
    en: { type: String, required: true },
    et: { type: String, required: true },
    ru: { type: String, required: true }
  },
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  slug: { type: String, required: true, unique: true },
});

const Subcategory = mongoose.models.Subcategory || mongoose.model('Subcategory', SubcategorySchema);
export { Subcategory };
