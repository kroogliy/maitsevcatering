import { NextResponse } from "next/server";
import { mongooseConnect } from "../../../../../../lib/mongoose";
import { Category } from "../../../../../../models/Category";
import { Subcategory } from "../../../../../../models/Subcategory";
import { Product } from "../../../../../../models/Product";
import { Alkohol } from "../../../../../../models/Alkohol";

export async function GET(request, { params }) {
  try {
    await mongooseConnect();
    const { productSlug } = params;

    // 1. Находим продукт (в обычных или алкогольных)
    const product =
      (await Product.findOne({ slug: productSlug }).lean()) ||
      (await Alkohol.findOne({ slug: productSlug }).lean());

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // 2. Получаем связанные категории (используем правильные поля)
    const [category, subcategory] = await Promise.all([
      Category.findById(product.category).lean(),
      Subcategory.findById(product.subcategory).lean(),
    ]);

    // 3. Проверяем что все данные существуют
    if (!category || !subcategory) {
      return NextResponse.json(
        { error: "Category/Subcategory not found" },
        { status: 500 },
      );
    }

    // 4. Формируем ответ
    return NextResponse.json({
      product: {
        ...product,
        isDrink: product.isAlcoholic || false,
      },
      category,
      subcategory,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export const revalidate = 3600;
