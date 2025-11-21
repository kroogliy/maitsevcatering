import { mongooseConnect } from '../../lib/mongoose';
import { Product } from '../../models/Product';
import { Alkohol } from '../../models/Alkohol';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

   await mongooseConnect();

   const { subcategoryId, query = '', page = 1, limit = 2200, locale = 'ru' } = req.query;

   try {
     // 1. Поиск в Products
     const productsQuery = {
       subcategory: subcategoryId,
       [`title.${locale}`]: { $regex: query, $options: 'i' }
     };
 
     // 2. Поиск в Alkohols
     const alkoholsQuery = {
       subcategory: subcategoryId,
       name: { $regex: query, $options: 'i' }
     };
 
     // 3. Параллельный поиск
     const [products, alkohols, totalProducts, totalAlkohols] = await Promise.all([
       Product.find(productsQuery)
         .skip((page - 1) * limit)
         .limit(limit),
       Alkohol.find(alkoholsQuery)
         .skip((page - 1) * limit)
         .limit(limit),
       Product.countDocuments(productsQuery),
       Alkohol.countDocuments(alkoholsQuery)
     ]);
 
     // 4. Объединение результатов
     const combinedResults = [
       ...products.map(p => ({ ...p._doc, isDrink: false })),
       ...alkohols.map(a => ({ ...a._doc, isDrink: true }))
     ];
 
     res.status(200).json({
       products: combinedResults,
       pagination: {
         page: +page,
         totalItems: totalProducts + totalAlkohols,
         totalPages: Math.ceil((totalProducts + totalAlkohols) / limit)
       }
     });
 
   } catch (error) {
     console.error('Search error:', error);
     res.status(500).json({ error: 'Internal server error' });
   }
 }