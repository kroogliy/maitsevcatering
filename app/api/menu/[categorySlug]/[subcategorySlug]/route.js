// app/api/menu/[categorySlug]/[subcategorySlug]/route.js

import { NextResponse } from "next/server";
import { mongooseConnect } from "../../../../../lib/mongoose";
import { Category } from "../../../../../models/Category";
import { Subcategory } from "../../../../../models/Subcategory";

export async function GET(request, { params }) {
  try {
    await mongooseConnect();

    const { categorySlug, subcategorySlug } = await params;

    // Находим категорию
    const category = await Category.findOne({ slug: categorySlug }).exec();
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    // Находим подкатегорию
    const subcategory = await Subcategory.findOne({
      slug: subcategorySlug,
      categoryId: category._id,
    }).exec();

    if (!subcategory) {
      return NextResponse.json(
        { error: "Subcategory not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ category, subcategory });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export const revalidate = 3600; // Кешируем на 1 час
