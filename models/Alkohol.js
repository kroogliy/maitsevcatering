import mongoose, { Schema, models } from "mongoose";

const AlkoholSchema = new Schema(
  {
    eanCode: { type: String, unique: true, required: true },
    name: { type: String, required: true }, // Оригинальное название товара

    // Регион с переводами
    region: {
      et: { type: String },
      en: { type: String },
      ru: { type: String },
    },

    volume: { type: String },

    // Цвет с переводами
    color: {
      et: { type: String },
      en: { type: String },
      ru: { type: String },
    },

    degree: { type: String, required: true },
    isAlcoholic: { type: Boolean, required: true},
    price: { type: String },
    category: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Category', 
      required: true 
    },

    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' },  // Связь с подкатегорией
    images: { type: String, required: true },
    slug: { type: String, unique: true },
  },
);

export const Alkohol = models.Alkohol || mongoose.model("Alkohol", AlkoholSchema);
