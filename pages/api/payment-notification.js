import { mongooseConnect } from "../../lib/mongoose";
import jwt from "jsonwebtoken";
import { Order } from "../../models/Order";
import { UnpaidOrder } from "../../models/UnpaidOrder";
import axios from "axios";
import CryptoJS from "crypto-js";
import { formatPrice } from "../../utils/priceUtils";
const { sendOrderEmails } = require("../../lib/email");

const secretKey = process.env.MONTONIO_SECRET_KEY;
const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
const telegramChatId = process.env.TELEGRAM_CHAT_ID;

if (!secretKey) {
  throw new Error(
    "MONTONIO_SECRET_KEY is not defined in environment variables",
  );
}

if (!telegramBotToken || !telegramChatId) {
  throw new Error(
    "Telegram bot token or chat ID is not defined in environment variables",
  );
}

// Функция для расшифровки данных
function decryptData(encryptedData) {
  const bytes = CryptoJS.AES.decrypt(
    encryptedData,
    process.env.CRYPTO_SECRET_KEY,
  );
  return bytes.toString(CryptoJS.enc.Utf8);
}

// Функция для отправки уведомления в Telegram
async function sendTelegramNotification(message) {
  const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
  const payload = {
    chat_id: telegramChatId,
    text: message,
  };

  try {
    const response = await axios.post(url, payload);
    return response.data;
  } catch (error) {
    // Silent Telegram error - logged server-side only
    throw error;
  }
}

// Функция для создания сообщения о заказе
function createOrderMessage(order) {
  const decryptedName = decryptData(order.name);
  const decryptedSurName = decryptData(order.surName);
  const decryptedPhone = decryptData(order.phone);
  const decryptedEmail = decryptData(order.email);
  const decryptedAddress = decryptData(order.address);
  const decryptedNotes = decryptData(order.notes);
  const decryptedPromocode = decryptData(order.promoCode);

  const {
    uuid,
    merchantReference,
    deliveryType,
    deliveryTimeOption,
    deliveryDate,
    deliveryTime,
    line_items,
    productTotal,
    deliveryFee,
    paymentStatus,
  } = order;

  let message = `Новый заказ 🔴MAITSEV GRUUSIA🔴\n`;
  message += `_________________________________\n\n`;
  message += `Номер заказа: ${merchantReference}\n`;
  message += `Заказчик: ${decryptedName} ${decryptedSurName}\n`;
  message += `Телефон: ${decryptedPhone}\n`;
  message += `Почта: ${decryptedEmail}\n`;
  message += `Доставка: ${deliveryType === "pickup" ? "Самовывоз" : `${decryptedAddress}`}\n`;
  message += `Время выполнения: ${deliveryTimeOption === "scheduled" ? `${deliveryDate.slice(8, 10)}.${deliveryDate.slice(5, 7)}.${deliveryDate.slice(0, 4)} - ${deliveryTime}` : "Как можно скорее"}\n`;
  message += `Заметки: ${decryptedNotes || "Нет"}\n`;
  message += `Промокод: ${decryptedPromocode || "Не использован"}\n\n`;
  message += `🛒 Товары:\n`;
  line_items.forEach((item) => {
    message += `🔹 ${item.title} (x${item.quantity}) - €${formatPrice(item.price * item.quantity)}\n`;
  });
  message += `📦 Сумма товаров: ${formatPrice(productTotal)}€\n`;
  if (deliveryType === "delivery") {
    message += `🚚 Доставка: ${formatPrice(deliveryFee)}€\n`;
  }
  message += `💰 Итого: ${formatPrice(productTotal + deliveryFee)}€\n`;
  message += `💳 Статус заказа: ${paymentStatus === "completed" ? "Оплачен" : "Не оплачен"}\n\n`;

  return message;
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await mongooseConnect();

      const paymentData = req.body;

      if (
        !paymentData ||
        typeof paymentData !== "object" ||
        Object.keys(paymentData).length === 0
      ) {
        return res
          .status(400)
          .json({ error: "Invalid or missing payment data" });
      }

      const { orderToken } = paymentData;

      if (!orderToken) {
        return res
          .status(400)
          .json({ error: "Order token is missing in the payment data" });
      }

      let decodedToken;
      try {
        decodedToken = jwt.verify(orderToken, secretKey);
      } catch (error) {
        return res
          .status(401)
          .json({ error: `Invalid order token: ${error.message || error}` });
      }

      // const orderId = decodedToken?.merchantReference;
      const merchantReference = decodedToken?.merchantReference;
      const paymentStatus = decodedToken?.paymentStatus;
      const uuid = decodedToken?.uuid;

      if (!paymentStatus) {
        return res
          .status(400)
          .json({ error: "Payment status is missing in the decoded token" });
      }

      let updatedOrder;
      switch (paymentStatus) {
        case "PAID":
          const existingOrder = await Order.findOne({ merchantReference });
          if (existingOrder && existingOrder.paymentStatus === "completed") {
            return res.status(200).json({
              message: "Order already processed",
              merchantReference,
              uuid,
            });
          }

          updatedOrder = await Order.findOneAndUpdate(
            { merchantReference },
            {
              paid: true,
              paymentStatus: "completed",
              uuid,
              merchantReference,
            },
            { new: true },
          );

          if (updatedOrder) {
            // Отправляем сообщение в Telegram
            const message = createOrderMessage(updatedOrder);
            await sendTelegramNotification(message);

            // Отправляем email-уведомления
            try {
              const locale = updatedOrder.locale || "et";
              const emailResults = await sendOrderEmails(updatedOrder, locale);
            } catch (error) {
              // Silent email error - logged server-side only
            }
          }
          break;

        case "VOIDED":
          updatedOrder = await Order.findOneAndUpdate(
            { merchantReference },
            { paymentStatus: "voided" },
            { new: true },
          );
          break;

        case "PARTIALLY_REFUNDED":
          updatedOrder = await Order.findOneAndUpdate(
            { merchantReference },
            { paymentStatus: "partially_refunded" },
            { new: true },
          );
          break;

        case "REFUNDED":
          updatedOrder = await Order.findOneAndUpdate(
            { merchantReference },
            { paymentStatus: "refunded" },
            { new: true },
          );
          break;

        case "ABANDONED":
          const abandonedOrder = await Order.findOneAndDelete({
            merchantReference,
          });
          if (abandonedOrder) {
            await UnpaidOrder.create({
              ...abandonedOrder.toObject(),
              paymentStatus: "abandoned",
            });
            return res.status(200).json({
              message: `Order ${merchantReference} abandoned and moved to 'unpaid' collection`,
            });
          } else {
            return res.status(404).json({ error: "Order not found" });
          }

        case "AUTHORIZED":
          updatedOrder = await Order.findOneAndUpdate(
            { merchantReference },
            { paymentStatus: "authorized" },
            { new: true },
          );
          break;

        default:
          return res
            .status(400)
            .json({ error: `Unknown payment status: ${paymentStatus}` });
      }

      if (!updatedOrder) {
        return res
          .status(404)
          .json({ error: "Order not found or update failed" });
      }

      return res.status(200).json({
        message: "Payment status processed and order updated",
        merchantReference,
        paymentStatus,
        uuid,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: `Internal server error: ${error.message || error}` });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
