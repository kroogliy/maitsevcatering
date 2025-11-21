import { Category } from "../models/Category";
import { mongooseConnect } from "./mongoose";

export async function getCategories() {
  try {
    await mongooseConnect();
    const categories = await Category.find().exec();

    return categories;
  } catch (error) {
    return [];
  }
}
