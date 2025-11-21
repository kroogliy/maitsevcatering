import { Alkohol } from "../../models/Alkohol";
import { mongooseConnect } from "../../lib/mongoose";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await mongooseConnect();

    // Подсчитываем все напитки
    const totalCount = await Alkohol.countDocuments();

    // Подсчитываем напитки с подкатегориями
    const withSubcategoryCount = await Alkohol.countDocuments({
      subcategory: { $exists: true, $ne: null }
    });

    // Подсчитываем напитки БЕЗ подкатегорий
    const withoutSubcategoryCount = await Alkohol.countDocuments({
      $or: [
        { subcategory: null },
        { subcategory: { $exists: false } }
      ]
    });

    // Подсчитываем напитки с slug
    const withSlugCount = await Alkohol.countDocuments({
      slug: { $exists: true, $ne: null, $ne: '' }
    });

    // Подсчитываем напитки БЕЗ slug
    const withoutSlugCount = await Alkohol.countDocuments({
      $or: [
        { slug: null },
        { slug: { $exists: false } },
        { slug: '' }
      ]
    });

    // Подсчитываем напитки готовые для sitemap (с обеими полями)
    const sitemapReadyCount = await Alkohol.countDocuments({
      subcategory: { $exists: true, $ne: null },
      slug: { $exists: true, $ne: null, $ne: '' }
    });

    // Получаем уникальные подкатегории
    const uniqueSubcategories = await Alkohol.distinct("subcategory");
    const validSubcategories = uniqueSubcategories.filter(id => id !== null);

    // Разбивка по подкатегориям (первые 10)
    const subcategoryBreakdown = [];
    for (let i = 0; i < Math.min(10, validSubcategories.length); i++) {
      const subId = validSubcategories[i];
      const count = await Alkohol.countDocuments({ subcategory: subId });

      // Получаем название подкатегории
      const sample = await Alkohol.findOne({ subcategory: subId })
        .populate('subcategory', 'name')
        .lean();

      const subcatName = sample?.subcategory?.name?.en ||
                        sample?.subcategory?.name ||
                        'Unknown';

      subcategoryBreakdown.push({
        id: subId,
        name: subcatName,
        count
      });
    }

    return res.status(200).json({
      summary: {
        total: totalCount,
        withSubcategory: withSubcategoryCount,
        withoutSubcategory: withoutSubcategoryCount,
        withSlug: withSlugCount,
        withoutSlug: withoutSlugCount,
        sitemapReady: sitemapReadyCount
      },
      subcategories: {
        total: validSubcategories.length,
        breakdown: subcategoryBreakdown,
        note: validSubcategories.length > 10 ?
              `Показаны первые 10 из ${validSubcategories.length}` :
              'Показаны все подкатегории'
      },
      issues: {
        missingSubcategory: withoutSubcategoryCount,
        missingSlug: withoutSlugCount,
        notSitemapReady: totalCount - sitemapReadyCount
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Debug count error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
