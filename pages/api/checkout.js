import { mongooseConnect } from "../../lib/mongoose";
import { Order } from "../../models/Order";
import { MontonioClient } from "@almightytech/montonio-client";
import { Product } from "../../models/Product";
import { Alkohol } from "../../models/Alkohol";
import CryptoJS from "crypto-js";
import https from "https";
import {
  applyDiscount,
  validateDiscountedPrice,
  calculateDiscountedTotal,
} from "../../utils/priceUtils";

// Инициализация клиента Montonio
const client = new MontonioClient({
  accessKey: process.env.MONTONIO_ACCESS_KEY,
  secretKey: process.env.MONTONIO_SECRET_KEY,
  sandbox: false,
});

// Функция для создания HMAC
const createHmac = (data) => {
  return CryptoJS.HmacSHA256(
    JSON.stringify(data),
    process.env.MONTONIO_SECRET_KEY,
  ).toString();
};

// Функция для хеширования данных
const hashData = (data) => {
  return CryptoJS.SHA256(data).toString();
};

// Функция для прямого HTTP запроса к Montonio API
async function directMontonioRequest(signedData) {
  const postData = JSON.stringify(signedData);

  const options = {
    hostname: "api.montonio.com",
    port: 443,
    path: "/orders",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData),
      "User-Agent": "Node.js/Direct-Request",
      Accept: "application/json",
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve(responseData);
        } else {
          reject(new Error(`Montonio API Error: ${res.statusCode}`));
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error("Direct request timeout"));
    });

    req.write(postData);
    req.end();
  });
}

// Функция для проверки цен с учетом скидки
async function validatePrices(line_items) {
  for (const item of line_items) {
    if (!item.productId) {
      throw new Error(`Товар ${item.title || item.name} не содержит ID`);
    }

    let product = await Product.findById(item.productId).lean();
    if (!product) {
      product = await Alkohol.findById(item.productId).lean();
    }

    if (!product) {
      throw new Error(
        `Товар с ID ${item.productId} не найден ни в одной из коллекций`,
      );
    }

    const expectedPrice = applyDiscount(product.price);

    // Проверяем цену с учетом скидки
    if (!validateDiscountedPrice(item.price, product.price)) {
      throw new Error(
        `Цена товара ${item.title || item.name} не совпадает с актуальной ценой со скидкой. Ожидалось: ${expectedPrice}, Получено: ${item.price}. Пожалуйста, обновите корзину.`,
      );
    }
  }
}

// Функция для расчета итоговой суммы с учетом скидки
async function calculateGrandTotal(line_items, deliveryFee) {
  let grandTotal = 0;

  for (const item of line_items) {
    let product = await Product.findById(item.productId).lean();
    if (!product) {
      product = await Alkohol.findById(item.productId).lean();
    }

    if (!product) {
      throw new Error(
        `Товар с ID ${item.productId} не найден ни в одной из коллекций`,
      );
    }

    // Применяем скидку к цене из БД
    const discountedPrice = applyDiscount(product.price);
    grandTotal += discountedPrice * item.quantity;
  }

  grandTotal += deliveryFee;
  return Math.round(grandTotal * 100) / 100; // Округляем до 2 знаков после запятой
}

// Функция для расчета стоимости доставки
function calculateDeliveryFee(deliveryType) {
  return deliveryType === "delivery" ? 5 : 0;
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { _csrf, ...orderData } = req.body;
      const csrfTokenFromCookie = req.cookies._csrf;

      // Проверка CSRF-токена
      if (!_csrf || !csrfTokenFromCookie || _csrf !== csrfTokenFromCookie) {
        return res.status(403).json({ error: "Неверный CSRF-токен" });
      }

      const {
        name,
        surName,
        phone,
        email,
        address,
        deliveryType,
        deliveryTimeOption,
        deliveryDate,
        deliveryTime,
        notes,
        promoCode,
        agreed,
        line_items,
        deliveryFee: clientDeliveryFee,
        totalAmount: clientTotalAmount,
      } = orderData;

      // Проверка обязательных полей
      if (!name || !surName || !phone || !email || !deliveryType) {
        return res
          .status(400)
          .json({ error: "Недостаточно данных для создания заказа" });
      }

      // Пересчитываем deliveryFee на сервере
      const serverDeliveryFee = calculateDeliveryFee(deliveryType);

      // Проверяем, что deliveryFee от клиента соответствует deliveryType
      if (deliveryType === "delivery" && clientDeliveryFee !== 5) {
        return res
          .status(400)
          .json({ error: "Стоимость доставки не соответствует типу доставки" });
      }

      if (deliveryType === "pickup" && clientDeliveryFee !== 0) {
        return res
          .status(400)
          .json({ error: "Стоимость доставки не соответствует типу доставки" });
      }

      // Пересчитываем итоговую сумму на сервере
      const serverGrandTotal = await calculateGrandTotal(
        line_items,
        serverDeliveryFee,
      );

      // Сравниваем итоговую сумму от клиента с пересчитанной суммой
      if (serverGrandTotal !== clientTotalAmount) {
        throw new Error("Итоговая сумма не совпадает");
      }

      // Проверка цен товаров
      await validatePrices(line_items);

      // Преобразование данных
      const isAgreed = agreed === "on";
      const productTotal = line_items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      // Преобразуем title в строку
      const transformedLineItems = line_items.map((item) => {
        let title = "Unknown";

        if (typeof item.title === "string" && item.title.trim()) {
          title = item.title.trim();
        } else if (typeof item.name === "string" && item.name.trim()) {
          title = item.name.trim();
        } else if (item.title && typeof item.title === "object") {
          // Если title - объект с переводами
          title = item.title.en || item.title.et || item.title.ru || "Unknown";
        }

        return {
          ...item,
          title: title,
        };
      });

      // Соединение с MongoDB
      await mongooseConnect();

      // Хешируем данные клиента
      const clientHash = hashData(
        `${name}-${surName}-${phone}-${email}-${deliveryType}`,
      );

      // Проверяем существующий заказ
      const existingOrder = await Order.findOne({
        clientHash,
        paymentStatus: "pending",
      });

      if (existingOrder) {
        // Обновляем существующий заказ
        existingOrder.line_items = transformedLineItems;
        existingOrder.deliveryFee = serverDeliveryFee;
        existingOrder.totalAmount = serverGrandTotal;
        existingOrder.productTotal = productTotal;
        existingOrder.locale = orderData.locale || "et";
        await existingOrder.save();

        // Подготовка данных для отправки в Montonio
        const montonioOrderData = {
          accessKey: process.env.MONTONIO_ACCESS_KEY,
          merchantReference: existingOrder.merchantReference,
          returnUrl: `https://www.maitsevgruusia.ee/${orderData.locale}/thanks`,
          notificationUrl:
            "https://www.maitsevgruusia.ee/api/payment-notification",
          grandTotal: serverGrandTotal,
          currency: "EUR",
          locale: orderData.locale,
          payment: {
            method: "paymentInitiation",
            amount: serverGrandTotal,
            currency: "EUR",
          },
          billingAddress: {
            firstName: name,
            lastName: surName,
            email: email,
            phoneNumber: phone,
          },
          lineItems: [
            ...transformedLineItems.map((item) => {
              const lineItem = {
                name: String(item.title || "Unknown"),
                quantity: parseInt(item.quantity) || 1,
                finalPrice: parseFloat((item.price * item.quantity).toFixed(2)),
              };
              return lineItem;
            }),
            ...(deliveryType === "delivery"
              ? [
                  {
                    name: "Delivery Fee",
                    quantity: 1,
                    finalPrice: serverDeliveryFee,
                  },
                ]
              : []),
          ],
          expiresIn: 15, // Время жизни ссылки на оплату (15 минут)
        };

        // Создаем подпись данных
        const hmac = createHmac(montonioOrderData);
        const signedData = { ...montonioOrderData, hmac };

        // Пробуем прямой запрос для диагностики
        try {
          const directResponse = await directMontonioRequest(signedData);
          const orderResponse = directResponse;
        } catch (directError) {
          // Fallback to library
          const orderResponse = await client.createOrder(signedData);
        }

        // Проверяем, что orderResponse — это строка (URL)
        if (typeof orderResponse !== "string") {
          throw new Error("Неверный формат ответа от Montonio");
        }

        // Обновляем заказ в базе данных с новой ссылкой на оплату
        existingOrder.paymentUrl = orderResponse;
        await existingOrder.save();

        // Возвращаем ссылку на оплату клиенту
        return res.status(200).json({
          paymentUrl: orderResponse,
        });
      }

      // Шифруем конфиденциальные данные
      const encryptedName = CryptoJS.AES.encrypt(
        name,
        process.env.CRYPTO_SECRET_KEY,
      ).toString();
      const encryptedSurName = CryptoJS.AES.encrypt(
        surName,
        process.env.CRYPTO_SECRET_KEY,
      ).toString();
      const encryptedPhone = CryptoJS.AES.encrypt(
        phone,
        process.env.CRYPTO_SECRET_KEY,
      ).toString();
      const encryptedEmail = CryptoJS.AES.encrypt(
        email,
        process.env.CRYPTO_SECRET_KEY,
      ).toString();
      const encryptedAddress = CryptoJS.AES.encrypt(
        address,
        process.env.CRYPTO_SECRET_KEY,
      ).toString();
      const encryptedNotes = CryptoJS.AES.encrypt(
        notes,
        process.env.CRYPTO_SECRET_KEY,
      ).toString();
      const encryptedPromocode = CryptoJS.AES.encrypt(
        promoCode,
        process.env.CRYPTO_SECRET_KEY,
      ).toString();

      // Создаем ID заказа
      const storeName = "MaitsevGruusia";
      const orderCount = await Order.countDocuments();
      const orderNumber = orderCount + 1;
      const merchantReference = `${storeName}-${String(orderNumber).padStart(4, "0")}`;

      // Создаем новый заказ
      const temporaryOrder = await Order.create({
        clientHash,
        merchantReference,
        name: encryptedName,
        surName: encryptedSurName,
        phone: encryptedPhone,
        email: encryptedEmail,
        address: encryptedAddress,
        deliveryType,
        deliveryTimeOption,
        deliveryDate,
        deliveryTime,
        notes: encryptedNotes,
        promoCode: encryptedPromocode,
        agreed: isAgreed,
        line_items: transformedLineItems,
        deliveryFee: serverDeliveryFee,
        totalAmount: serverGrandTotal,
        productTotal,
        paid: false,
        paymentStatus: "pending",
        orderStatus: "non-completed",
        locale: orderData.locale || "et",
      });

      const { locale } = req.body;

      // Подготовка данных для отправки в Montonio
      const montonioOrderData = {
        accessKey: process.env.MONTONIO_ACCESS_KEY,
        merchantReference: merchantReference,
        returnUrl: `https://www.maitsevgruusia.ee/${orderData.locale}/thanks`,
        notificationUrl:
          "https://www.maitsevgruusia.ee/api/payment-notification",
        grandTotal: serverGrandTotal,
        currency: "EUR",
        locale: locale,
        payment: {
          method: "paymentInitiation",
          amount: serverGrandTotal,
          currency: "EUR",
        },
        billingAddress: {
          firstName: name,
          lastName: surName,
          email: email,
          phoneNumber: phone,
        },
        lineItems: [
          ...transformedLineItems.map((item) => {
            const lineItem = {
              name: String(item.title || "Unknown"),
              quantity: parseInt(item.quantity) || 1,
              finalPrice: parseFloat((item.price * item.quantity).toFixed(2)),
            };
            return lineItem;
          }),
          ...(deliveryType === "delivery"
            ? [
                {
                  name: "Delivery Fee",
                  quantity: 1,
                  finalPrice: serverDeliveryFee,
                },
              ]
            : []),
        ],
        expiresIn: 15, // Время жизни ссылки на оплату (15 минут)
      };

      // Создаем подпись данных
      const hmac = createHmac(montonioOrderData);
      const signedData = { ...montonioOrderData, hmac };

      // Пробуем прямой запрос для диагностики
      let orderResponse;
      try {
        orderResponse = await directMontonioRequest(signedData);
      } catch (directError) {
        // Fallback to library
        orderResponse = await client.createOrder(signedData);
      }

      // Проверяем, что orderResponse — это строка (URL)
      if (typeof orderResponse !== "string") {
        throw new Error("Неверный формат ответа от Montonio");
      }

      // Обновляем заказ в базе данных с ссылкой на оплату
      const updatedOrder = await Order.findByIdAndUpdate(
        temporaryOrder._id,
        { paymentUrl: orderResponse },
        { new: true },
      );

      // Возвращаем ссылку на оплату клиенту
      res.status(200).json({
        paymentUrl: orderResponse,
      });
    } catch (error) {
      console.error("Checkout error:", error);
      res.status(500).json({
        error: "Ошибка при обработке заказа",
        details: error.message,
      });
    }
  } else {
    res.status(405).json({ error: "Метод не разрешен" });
  }
}
