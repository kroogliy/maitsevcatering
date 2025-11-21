import { model, models, Schema } from "mongoose";

// Схема для товаров в заказе (не изменяется)
const LineItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  isDelivery: { type: Boolean, default: false }, // Флаг для доставки
});

// Схема для неоплаченного заказа
const UnpaidOrderSchema = new Schema(
  {
    merchantReference: { type: String, unique: true },
    line_items: {
      type: [LineItemSchema], // Массив объектов товаров
      required: true,
      validate: [arrayLimit, "UnpaidOrder must have at least one item."],
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
    totalAmount: { type: Number, required: true },
    orderId: { type: String },
    paid: { type: Boolean, default: false }, // Всегда false для неоплаченных заказов
    productTotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    uuid: { type: String },
    paymentStatus: { type: String, default: "unpaid" }, // Статус по умолчанию
    //   status: { type: String, required: true, default: 'abandoned',
  },
  {
    timestamps: true,
  },
);

// Функция для проверки минимального количества элементов
function arrayLimit(val) {
  return val.length > 0;
}

// Экспортируем модель UnpaidOrder
export const UnpaidOrder =
  models?.UnpaidOrder || model("UnpaidOrder", UnpaidOrderSchema);
