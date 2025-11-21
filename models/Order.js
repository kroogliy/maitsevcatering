import { model, models, Schema } from "mongoose";

// LineItemSchema не изменяется
const LineItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  isDelivery: { type: Boolean, default: false }, // Флаг для доставки
});

const OrderSchema = new Schema({
  merchantReference: { type: String, unique: true },
  line_items: {
    type: [LineItemSchema], // Используем массив объектов
    required: true,
    validate: [arrayLimit, "Order must have at least one item."],
  },
  name: { type: String, required: true, trim: true },
  surName: { type: String, required: false },
  phone: { type: String, required: false },
  email: { type: String, required: false },
  deliveryType: { type: String, required: true },
  address: { type: String, required: false },
  deliveryDate: { type: String, required: false },
  deliveryTime: { type: String, required: false },
  deliveryTimeOption: { type: String, required: true },
  promoCode: { type: String, required: false },
  notes: { type: String, required: false },
  agreed: { type: Boolean, required: true },
  totalAmount: { type: Number, required: true }, // Сумма заказа
  orderId: { type: String },
  paid: { type: Boolean, required: true, default: false }, // Статус оплаты
  productTotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  uuid: { type: String },
  paymentStatus: {
    type: String,
    required: true,
    enum: ["pending", "paid", "abandoned", "returned", "partially_returned"],
    default: "pending",
  },
  orderStatus: {
    type: String,
    enum: ["non-completed", "completed"],
    default: "non-completed", // По умолчанию заказ не завершён
  },
  paymentUrl: { type: String },
  clientHash: { type: String },
  locale: { type: String, default: "et" }, // Язык интерфейса для email-уведомлений
  createdAt: { type: Date, default: Date.now }, // Можно добавить дату создания заказа
  updatedAt: { type: Date, default: Date.now }, // Дата последнего обновления заказа
});

// Функция для проверки минимального количества элементов
function arrayLimit(val) {
  return val.length > 0;
}

export const Order = models?.Order || model("Order", OrderSchema);
