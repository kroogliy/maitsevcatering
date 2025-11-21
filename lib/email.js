const nodemailer = require("nodemailer");
const CryptoJS = require("crypto-js");

// Функция для расчета налога (24% НДС)
const calculateTaxDetails = (totalWithTax) => {
  const taxRate = 0.24;
  const totalWithoutTax = totalWithTax / (1 + taxRate);
  const taxAmount = totalWithTax - totalWithoutTax;

  return {
    totalWithoutTax: Math.round(totalWithoutTax * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    totalWithTax: totalWithTax,
  };
};

// Создаем транспортер для Zoho Mail
const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.zoho.eu",
    port: 587,
    secure: false,
    auth: {
      user: process.env.ZOHO_EMAIL,
      pass: process.env.ZOHO_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

// Функция для расшифровки данных
function decryptData(encryptedData) {
  if (!encryptedData) return "";
  try {
    const bytes = CryptoJS.AES.decrypt(
      encryptedData,
      process.env.CRYPTO_SECRET_KEY,
    );
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    return "";
  }
}

// HTML шаблон для клиента
const createClientEmailTemplate = (order, locale = "et") => {
  const decryptedName = decryptData(order.name);
  const decryptedSurName = decryptData(order.surName);
  const decryptedPhone = decryptData(order.phone);
  const decryptedAddress = decryptData(order.address);
  const decryptedNotes = decryptData(order.notes);

  const translations = {
    et: {
      subject: "Teie tellimus on vastu võetud - Maitsev Gruusia",
      title: "Aitäh tellimuse eest!",
      orderConfirmed: "Teie tellimus on edukalt vastu võetud ja makstud.",
      orderNumber: "Tellimuse number",
      customerInfo: "Kliendi andmed",
      name: "Nimi",
      phone: "Telefon",
      delivery: "Tarne",
      pickup: "Kättesaamine",
      address: "Aadress",
      asap: "Nii kiiresti kui võimalik",
      scheduled: "Planeeritud ajaks",
      notes: "Märkused",
      items: "Tellitud tooted",
      quantity: "Kogus",
      price: "Hind",
      total: "Kokku",
      noItems: "Tooteid ei leitud",
      deliveryFee: "Tarnetasu",
      grandTotal: "Lõppsumma",
      totalWithoutTax: "Summa ilma käibemaksuta",
      vat: "Käibemaks (24%)",
      totalWithTax: "Kaupade summa (käibemaksuga)",
      pickupAddress: "Maitsev Gruusia - Kättesaamine",
      timeLabel: "Aeg",
      footer: "Küsimuste korral võtke meiega ühendust telefonil või e-postiga.",
      thankYou: "Täname teid Maitsev Gruusia valikute eest!",
    },
    en: {
      subject: "Your order has been received - Maitsev Gruusia",
      title: "Thank you for your order!",
      orderConfirmed: "Your order has been successfully received and paid.",
      orderNumber: "Order number",
      customerInfo: "Customer information",
      name: "Name",
      phone: "Phone",
      delivery: "Delivery",
      pickup: "Pickup",
      address: "Address",
      asap: "As soon as possible",
      scheduled: "Scheduled for",
      notes: "Notes",
      items: "Ordered items",
      quantity: "Quantity",
      price: "Price",
      total: "Total",
      noItems: "No items found",
      deliveryFee: "Delivery fee",
      grandTotal: "Grand total",
      totalWithoutTax: "Amount excluding tax",
      vat: "VAT (24%)",
      totalWithTax: "Total amount (including VAT)",
      pickupAddress: "Maitsev Gruusia - Pickup",
      timeLabel: "Time",
      footer: "If you have any questions, please contact us by phone or email.",
      thankYou: "Thank you for choosing Maitsev Gruusia!",
    },
    ru: {
      subject: "Ваш заказ принят - Maitsev Gruusia",
      title: "Спасибо за ваш заказ!",
      orderConfirmed: "Ваш заказ успешно принят и оплачен.",
      orderNumber: "Номер заказа",
      customerInfo: "Информация о клиенте",
      name: "Имя",
      phone: "Телефон",
      delivery: "Доставка",
      pickup: "Самовывоз",
      address: "Адрес",
      asap: "Как можно скорее",
      scheduled: "Запланировано на",
      notes: "Заметки",
      items: "Заказанные товары",
      quantity: "Количество",
      price: "Цена",
      total: "Итого",
      noItems: "Товары не найдены",
      deliveryFee: "Стоимость доставки",
      grandTotal: "Общая сумма",
      totalWithoutTax: "Сумма без налога",
      vat: "НДС (24%)",
      totalWithTax: "Сумма товаров (включая НДС)",
      pickupAddress: "Maitsev Gruusia - Самовывоз",
      timeLabel: "Время",
      footer:
        "Если у вас есть вопросы, свяжитесь с нами по телефону или электронной почте.",
      thankYou: "Спасибо, что выбрали Maitsev Gruusia!",
    },
  };

  const t = translations[locale] || translations.et;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${t.subject}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
        }

        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .header {
          background: white;
          color: black;
          padding: 30px 20px;
          text-align: center;
          position: relative;
          border-bottom: 2px solid #e0e0e0;
        }

        .logo {
          background: transparent;
          max-width: 160px;
          height: auto;
          margin: 0 auto 15px auto;
          display: block;
        }

        .header h1 {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 8px;
          text-shadow: none;
        }

        .header h2 {
          font-size: 18px;
          font-weight: normal;
          opacity: 0.95;
        }

        .content {
          padding: 30px 20px;
          background-color: #ffffff;
        }

        .success-message {
          background: white;
          color: black;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin-bottom: 25px;
          font-size: 16px;
          font-weight: 500;
        }

        .order-info {
          background-color: #f9f9f9;
          padding: 20px;
          margin: 20px 0;
          border-radius: 8px;
          border-left: 4px solid #d32f2f;
        }

        .order-info h3 {
          color: #d32f2f;
          margin-bottom: 15px;
          font-size: 18px;
        }

        .order-info h4 {
          color: #555;
          margin: 15px 0 10px 0;
          font-size: 16px;
        }

        .order-info p {
          margin: 8px 0;
          color: #666;
        }

        .order-info strong {
          color: #333;
        }

        .items-section {
          margin: 25px 0;
        }

        .items-section h4 {
          color: #d32f2f;
          margin-bottom: 15px;
          font-size: 18px;
        }

        /* Десктопная таблица - показываем по умолчанию */
        .items-table-container {
          overflow-x: auto;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          display: block;
        }

        .items-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 500px;
        }

        .items-table th, .items-table td {
          padding: 12px 8px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }

        .items-table th {
          background-color: #f8f8f8;
          font-weight: 600;
          color: #555;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .items-table td {
          color: #666;
        }

        .items-table tr:last-child td {
          border-bottom: none;
        }

        .total-row {
          font-weight: bold;
          background-color: #f0f0f0;
          color: #333;
        }

        .grand-total-row {
          background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%);
          color: white !important;
        }

        .grand-total-row td {
          color: white !important;
          font-size: 16px;
          font-weight: bold;
        }

        /* Мобильные карточки - скрываем по умолчанию */
        .mobile-items {
          display: none;
        }

        .mobile-item {
          background: white;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          border-left: 4px solid #d32f2f;
        }

        .mobile-item-name {
          font-weight: bold;
          color: #333;
          margin-bottom: 8px;
          font-size: 16px;
        }

        .mobile-item-details {
          display: flex;
          justify-content: space-between;
          color: #666;
          font-size: 14px;
        }

        .mobile-item-total {
          font-weight: bold;
          color: #d32f2f;
        }

        .mobile-summary {
          background: #f8f8f8;
          border-radius: 8px;
          padding: 15px;
          margin-top: 15px;
        }

        .mobile-summary-row {
          display: flex;
          justify-content: space-between;
          margin: 8px 0;
        }

        .mobile-summary-row.total {
          font-weight: bold;
          font-size: 18px;
          color: #d32f2f;
          border-top: 2px solid #d32f2f;
          padding-top: 12px;
          margin-top: 12px;
        }

        .footer {
          background-color: #2c2c2c;
          color: #ffffff;
          padding: 30px 20px;
          text-align: center;
          font-size: 14px;
        }

        .footer p {
          margin: 8px 0;
          line-height: 1.5;
        }

        .contact-info {
          margin: 15px 0;
          font-size: 16px;
          font-weight: 500;
        }

        .contact-info a {
          color: #ffffff;
          text-decoration: none;
        }

        /* Мобильные стили */
        @media only screen and (max-width: 600px) {
          .email-container {
            margin: 0;
            box-shadow: none;
          }

          .header {
            padding: 20px 15px;
          }

          .header h1 {
            font-size: 24px;
          }

          .header h2 {
            font-size: 16px;
          }

          .content {
            padding: 20px 15px;
          }

          .order-info {
            padding: 15px;
          }

          /* Скрываем десктопную таблицу на мобильных */
          .items-table-container {
            display: none !important;
          }

          /* Показываем мобильные карточки */
          .mobile-items {
            display: block !important;
          }

          .footer {
            padding: 20px 15px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Maitsev Gruusia</h1>
          <h2>${t.title}</h2>
        </div>

        <div class="content">
          <div class="success-message">
             ${t.orderConfirmed}
          </div>

          <div class="order-info">
            <h3> ${t.orderNumber}: ${order.merchantReference}</h3>

            <h4> ${t.customerInfo}:</h4>
            <p><strong>${t.name}:</strong> ${decryptedName} ${decryptedSurName}</p>
            <p><strong>${t.phone}:</strong> ${decryptedPhone}</p>

            <h4> ${order.deliveryType === "delivery" ? t.delivery : t.pickup}:</h4>
            <p><strong>${t.address}:</strong>
              ${order.deliveryType === "delivery" ? decryptedAddress : t.pickupAddress}
            </p>
            <p><strong>${t.timeLabel}:</strong>
              ${
                order.deliveryTimeOption === "scheduled"
                  ? `${t.scheduled} ${order.deliveryDate ? order.deliveryDate.slice(8, 10) + "." + order.deliveryDate.slice(5, 7) + "." + order.deliveryDate.slice(0, 4) : ""} - ${order.deliveryTime || ""}`
                  : t.asap
              }
            </p>
            ${decryptedNotes ? `<p><strong>${t.notes}:</strong> ${decryptedNotes}</p>` : ""}
          </div>

          <div class="items-section">
            <h4>${t.items}:</h4>

            <!-- Десктопная таблица -->
            <div class="items-table-container">
              <table class="items-table">
                <thead>
                  <tr>
                    <th>${t.items}</th>
                    <th>${t.quantity}</th>
                    <th>${t.price}</th>
                    <th>${t.total}</th>
                  </tr>
                </thead>
                <tbody>
                  ${
                    order.line_items && order.line_items.length > 0
                      ? order.line_items
                          .map(
                            (item) => `
                        <tr>
                          <td>${item.title}</td>
                          <td>${item.quantity}</td>
                          <td>€${item.price}</td>
                          <td>€${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      `,
                          )
                          .join("")
                      : `<tr><td colspan="4">${t.noItems}</td></tr>`
                  }
                  ${(() => {
                    const taxDetails = calculateTaxDetails(order.productTotal);
                    return `
                      <tr class="total-row">
                        <td colspan="3"><strong>${t.totalWithoutTax}</strong></td>
                        <td><strong>€${taxDetails.totalWithoutTax}</strong></td>
                      </tr>
                      <tr class="total-row">
                        <td colspan="3"><strong>${t.vat}</strong></td>
                        <td><strong>€${taxDetails.taxAmount}</strong></td>
                      </tr>
                      <tr class="total-row">
                        <td colspan="3"><strong>${t.totalWithTax}</strong></td>
                        <td><strong>€${order.productTotal}</strong></td>
                      </tr>
                    `;
                  })()}
                  ${
                    order.deliveryFee > 0
                      ? `
                    <tr class="total-row">
                      <td colspan="3"><strong>${t.deliveryFee}</strong></td>
                      <td><strong>€${order.deliveryFee}</strong></td>
                    </tr>
                  `
                      : ""
                  }
                  <tr class="grand-total-row">
                    <td colspan="3"><strong> ${t.grandTotal}</strong></td>
                    <td><strong>€${(order.productTotal + order.deliveryFee).toFixed(2)}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Мобильные карточки -->
            <div class="mobile-items">
              ${
                order.line_items && order.line_items.length > 0
                  ? order.line_items
                      .map(
                        (item) => `
                    <div class="mobile-item">
                      <div class="mobile-item-name">${item.title}</div>
                      <div class="mobile-item-details">
                        <span>${item.quantity} x €${item.price}</span>
                        <span class="mobile-item-total">€${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  `,
                      )
                      .join("")
                  : `<div class="mobile-item">${t.noItems}</div>`
              }

              <div class="mobile-summary">
                ${(() => {
                  const taxDetails = calculateTaxDetails(order.productTotal);
                  return `
                    <div class="mobile-summary-row">
                      <span>${t.totalWithoutTax}:</span>
                      <span>€${taxDetails.totalWithoutTax}</span>
                    </div>
                    <div class="mobile-summary-row">
                      <span>${t.vat}:</span>
                      <span>€${taxDetails.taxAmount}</span>
                    </div>
                    <div class="mobile-summary-row">
                      <span>${t.totalWithTax}:</span>
                      <span>€${order.productTotal}</span>
                    </div>
                  `;
                })()}
                ${
                  order.deliveryFee > 0
                    ? `
                  <div class="mobile-summary-row">
                    <span>${t.deliveryFee}:</span>
                    <span>€${order.deliveryFee}</span>
                  </div>
                `
                    : ""
                }
                <div class="mobile-summary-row total">
                  <span>${t.grandTotal}:</span>
                  <span>€${(order.productTotal + order.deliveryFee).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="footer">
          <p>${t.footer}</p>
          <div class="contact-info">
             +372 502 3599 | <a href="mailto:info@maitsevgruusia.ee">info@maitsevgruusia.ee</a>
          </div>
          <p style="margin-top: 15px; font-weight: bold;">${t.thankYou}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// HTML шаблон для администратора
const createAdminEmailTemplate = (order, locale = "ru") => {
  const decryptedName = decryptData(order.name);
  const decryptedSurName = decryptData(order.surName);
  const decryptedPhone = decryptData(order.phone);
  const decryptedEmail = decryptData(order.email);
  const decryptedAddress = decryptData(order.address);
  const decryptedNotes = decryptData(order.notes);
  const decryptedPromocode = decryptData(order.promoCode);

  const adminTranslations = {
    et: {
      subject: "Uus tellimus - Maitsev Gruusia",
      title: "Uus tellimus saabunud!",
      orderDetails: "Tellimuse üksikasjad",
      orderNumber: "Tellimuse number",
      customerInfo: "Kliendi andmed",
      name: "Nimi",
      phone: "Telefon",
      email: "Email",
      delivery: "Tarne",
      pickup: "Kättesaamine",
      address: "Aadress",
      deliveryTime: "Tarneaeg",
      asap: "Nii kiiresti kui võimalik",
      scheduled: "Planeeritud ajaks",
      notes: "Märkused",
      items: "Tellitud tooted",
      product: "Toode",
      quantity: "Kogus",
      noItems: "Tooteid ei leitud",
      pricePerUnit: "Hind tk",
      amount: "Summa",
      totalWithoutTax: "Summa ilma käibemaksuta",
      vat: "Käibemaks (24%)",
      totalWithTax: "Kaupade summa (käibemaksuga)",
      deliveryFee: "Tarnetasu",
      grandTotal: "KOKKU MAKSTA",
      paymentStatus: "Makse staatus",
      paid: "MAKSTUD",
      unpaid: "MAKSMATA",
      warning:
        "Tähelepanu! See tellimus vajab töötlemist. Kontrollige kaupade olemasolu ja valmistage tellimus vastavalt märgitud tarneajale.",
      montonioLink: "Avada Montonio Partner Portaalis",
      orderInfo: "Tellimuse informatsioon",
      orderID: "Tellimuse ID",
      creationDate: "Loomise kuupäev",
      deliveryInfo: "Tarneinfo",
      deliveryType: "Tüüp",
      deliveryAddress: "Aadress",
      time: "Aeg",
      promoCode: "Promokood",
    },
    en: {
      subject: "New order - Maitsev Gruusia",
      title: "New order received!",
      orderDetails: "Order details",
      orderNumber: "Order number",
      customerInfo: "Customer information",
      name: "Name",
      phone: "Phone",
      email: "Email",
      delivery: "Delivery",
      pickup: "Pickup",
      address: "Address",
      deliveryTime: "Delivery time",
      asap: "As soon as possible",
      scheduled: "Scheduled for",
      notes: "Notes",
      items: "Ordered items",
      product: "Product",
      quantity: "Quantity",
      noItems: "No items found",
      pricePerUnit: "Price per unit",
      amount: "Amount",
      totalWithoutTax: "Amount excluding tax",
      vat: "VAT (24%)",
      totalWithTax: "Total amount (including VAT)",
      deliveryFee: "Delivery fee",
      grandTotal: "TOTAL TO PAY",
      paymentStatus: "Payment status",
      paid: "PAID",
      unpaid: "UNPAID",
      warning:
        "Attention! This order requires processing. Check product availability and prepare the order according to the specified delivery time.",
      montonioLink: "Open in Montonio Partner Portal",
      orderInfo: "Order Information",
      orderID: "Order ID",
      creationDate: "Creation Date",
      deliveryInfo: "Delivery Information",
      deliveryType: "Type",
      deliveryAddress: "Address",
      time: "Time",
      promoCode: "Promo Code",
    },
    ru: {
      subject: "Новый заказ - Maitsev Gruusia",
      title: "Получен новый заказ!",
      orderDetails: "Детали заказа",
      orderNumber: "Номер заказа",
      customerInfo: "Информация о клиенте",
      name: "Имя",
      phone: "Телефон",
      email: "Email",
      delivery: "Доставка",
      pickup: "Самовывоз",
      address: "Адрес",
      deliveryTime: "Время доставки",
      asap: "Как можно скорее",
      scheduled: "Запланировано на",
      notes: "Заметки",
      items: "Заказанные товары",
      product: "Товар",
      quantity: "Количество",
      noItems: "Товары не найдены",
      pricePerUnit: "Цена за ед.",
      amount: "Сумма",
      totalWithoutTax: "Сумма без налога",
      vat: "НДС (24%)",
      totalWithTax: "Сумма товаров (включая НДС)",
      deliveryFee: "Доставка",
      grandTotal: "ИТОГО К ОПЛАТЕ",
      paymentStatus: "Статус оплаты",
      paid: "ОПЛАЧЕН",
      unpaid: "НЕ ОПЛАЧЕН",
      warning:
        "Внимание! Этот заказ требует обработки. Проверьте наличие товаров и подготовьте заказ согласно указанному времени доставки.",
      montonioLink: "Открыть в Montonio Partner Portal",
      orderInfo: "Информация о заказе",
      orderID: "ID заказа",
      creationDate: "Дата создания",
      deliveryInfo: "Информация о доставке",
      deliveryType: "Тип",
      deliveryAddress: "Адрес",
      time: "Время",
      promoCode: "Промокод",
    },
  };

  const t = adminTranslations[locale] || adminTranslations.ru;

  return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${t.subject}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }

          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .header {
            background: white;
            color: black;
            padding: 30px 20px;
            text-align: center;
            position: relative;
            border-bottom: 2px solid #e0e0e0;
          }

          .logo {
            background: transparent;
            max-width: 160px;
            height: auto;
            margin: 0 auto 15px auto;
            display: block;
          }

          .header h1 {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 8px;
            text-shadow: none;
          }

          .header h2 {
            font-size: 18px;
            font-weight: normal;
            opacity: 0.95;
          }

          .content {
            padding: 30px 20px;
            background-color: #ffffff;
          }

          .montonio-link {
            background: white;
            color: black;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 25px;
            font-size: 16px;
            font-weight: 500;
          }

          .montonio-link a {
            color: black;
            text-decoration: none;
            font-weight: bold;
            font-size: 16px;
          }

          .order-info {
            background-color: #f9f9f9;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
            border-left: 4px solid #d32f2f;
          }

          .order-info h3 {
            color: #d32f2f;
            margin-bottom: 15px;
            font-size: 18px;
          }

          .order-info h4 {
            color: #555;
            margin: 15px 0 10px 0;
            font-size: 16px;
          }

          .order-info p {
            margin: 8px 0;
            color: #666;
          }

          .order-info strong {
            color: #333;
          }

          .status-paid {
            color: #4caf50;
            font-weight: bold;
          }

          .status-unpaid {
            color: #f44336;
            font-weight: bold;
          }

          .items-section {
            margin: 25px 0;
          }

          .items-section h3 {
            color: #d32f2f;
            margin-bottom: 15px;
            font-size: 18px;
          }

        .items-table-container {
          overflow-x: auto;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .items-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 500px;
        }

        .items-table th, .items-table td {
          padding: 12px 8px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }

        .items-table th {
          background-color: #f8f8f8;
          font-weight: 600;
          color: #555;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .items-table td {
          color: #666;
        }

        .items-table tr:last-child td {
          border-bottom: none;
        }

        .total-row {
          font-weight: bold;
          background-color: #f0f0f0;
          color: #333;
        }

        .grand-total-row {
          background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%);
          color: white !important;
        }

        .grand-total-row td {
          color: white !important;
          font-size: 16px;
          font-weight: bold;
        }

        .alert {
          background-color: #fff3cd;
          border: 1px solid #ffeaa7;
          padding: 15px;
          border-radius: 8px;
          margin: 15px 0;
          border-left: 5px solid #ffc107;
        }

        .alert strong {
          color: #856404;
        }

        @media only screen and (max-width: 600px) {
          .email-container {
            margin: 0;
            box-shadow: none;
          }

          .header {
            padding: 20px 15px;
          }

          .content {
            padding: 20px 15px;
          }

          .order-info {
            padding: 15px;
          }

          .items-table th, .items-table td {
            padding: 8px 6px;
            font-size: 14px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1> ${t.title.toUpperCase()}</h1>
          <h2>Maitsev Gruusia</h2>
        </div>

        <div class="content">
          ${
            order.uuid
              ? `
            <div class="montonio-link">
              <a href="https://partnerv2.montonio.com/orders/${order.uuid}" target="_blank">
                🔗 ${t.montonioLink}
              </a>
            </div>
          `
              : ""
          }

          <div class="order-info">
            <h3>${t.orderInfo}</h3>
            <p><strong>${t.orderID}:</strong> ${order.merchantReference || order._id}</p>
            ${order.uuid ? `<p><strong>UUID:</strong> ${order.uuid}</p>` : ""}
            <p><strong>${t.paymentStatus}:</strong>
              <span class="${order.paymentStatus === "completed" ? "status-paid" : "status-unpaid"}">
                ${order.paymentStatus === "completed" ? `✅ ${t.paid}` : `❌ ${t.unpaid}`}
              </span>
            </p>
            <p><strong>${t.creationDate}:</strong> ${new Date(order.createdAt || Date.now()).toLocaleString(locale === "et" ? "et-EE" : locale === "en" ? "en-US" : "ru-RU")}</p>
          </div>

          <div class="order-info">
            <h3>${t.customerInfo}</h3>
            <p><strong>${t.name}:</strong> ${decryptedName} ${decryptedSurName}</p>
            <p><strong>${t.phone}:</strong> <a href="tel:${decryptedPhone}">${decryptedPhone}</a></p>
            <p><strong>${t.email}:</strong> <a href="mailto:${decryptedEmail}">${decryptedEmail}</a></p>
          </div>

          <div class="order-info">
            <h3>${t.deliveryInfo}</h3>
            <p><strong>${t.deliveryType}:</strong> ${order.deliveryType === "delivery" ? t.delivery : t.pickup}</p>
            ${order.deliveryType === "delivery" ? `<p><strong>${t.address}:</strong> ${decryptedAddress}</p>` : ""}
            <p><strong>${t.time}:</strong>
              ${
                order.deliveryTimeOption === "scheduled"
                  ? `${t.scheduled} ${order.deliveryDate ? order.deliveryDate.slice(8, 10) + "." + order.deliveryDate.slice(5, 7) + "." + order.deliveryDate.slice(0, 4) : ""} - ${order.deliveryTime || ""}`
                  : t.asap
              }
            </p>
            ${decryptedNotes ? `<p><strong>${t.notes}:</strong> ${decryptedNotes}</p>` : ""}
            ${decryptedPromocode ? `<p><strong>${t.promoCode}:</strong> ${decryptedPromocode}</p>` : ""}
          </div>

          <div class="order-info">
            <div class="items-section">
              <h3>🛒 ${t.items}</h3>
              <div class="items-table-container">
                <table class="items-table">
                  <thead>
                    <tr>
                      <th>${t.product}</th>
                      <th>${t.quantity}</th>
                      <th>${t.pricePerUnit}</th>
                      <th>${t.amount}</th>
                    </tr>
                  </thead>
                <tbody>
                  ${
                    order.line_items && order.line_items.length > 0
                      ? order.line_items
                          .map(
                            (item) => `
                        <tr>
                          <td>${item.title}</td>
                          <td>${item.quantity}</td>
                          <td>€${item.price}</td>
                          <td>€${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      `,
                          )
                          .join("")
                      : `<tr><td colspan="4">${t.noItems}</td></tr>`
                  }
                  ${(() => {
                    const taxDetails = calculateTaxDetails(order.productTotal);
                    return `
                      <tr class="total-row">
                        <td colspan="3"><strong>${t.totalWithoutTax}</strong></td>
                        <td><strong>€${taxDetails.totalWithoutTax}</strong></td>
                      </tr>
                      <tr class="total-row">
                        <td colspan="3"><strong>${t.vat}</strong></td>
                        <td><strong>€${taxDetails.taxAmount}</strong></td>
                      </tr>
                      <tr class="total-row">
                        <td colspan="3"><strong>${t.totalWithTax}</strong></td>
                        <td><strong>€${order.productTotal}</strong></td>
                      </tr>
                    `;
                  })()}
                  ${
                    order.deliveryFee > 0
                      ? `
                    <tr class="total-row">
                      <td colspan="3"><strong>${t.deliveryFee}</strong></td>
                      <td><strong>€${order.deliveryFee}</strong></td>
                    </tr>
                  `
                      : ""
                  }
                  <tr class="grand-total-row">
                    <td colspan="3"><strong>${t.grandTotal}</strong></td>
                    <td><strong>€${(order.productTotal + order.deliveryFee).toFixed(2)}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="alert">
            <strong>⚠️ ${t.warning.split("!")[0]}!</strong> ${t.warning.split("! ")[1] || t.warning.substring(t.warning.indexOf("!") + 1).trim()}
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Функция отправки email клиенту
const sendClientEmail = async (order, locale = "et") => {
  try {
    console.log("📧 CLIENT EMAIL DEBUG:");
    console.log("- Order ID:", order._id || order.orderId);
    console.log("- Line items exists:", !!order.line_items);
    console.log(
      "- Line items length:",
      order.line_items ? order.line_items.length : "undefined",
    );

    const transporter = createTransporter();
    const decryptedEmail = decryptData(order.email);

    const translations = {
      et: { subject: "Teie tellimus on vastu võetud - Maitsev Gruusia" },
      en: { subject: "Your order has been received - Maitsev Gruusia" },
      ru: { subject: "Ваш заказ принят - Maitsev Gruusia" },
    };

    const t = translations[locale] || translations.et;

    const mailOptions = {
      from: {
        name: "Maitsev Gruusia",
        address: process.env.ZOHO_EMAIL,
      },
      to: decryptedEmail,
      subject: t.subject,
      html: createClientEmailTemplate(order, locale),
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Client email sent successfully");
    return result;
  } catch (error) {
    console.error("❌ Error sending client email:", error);
    throw error;
  }
};

// Функция отправки email администратору
const sendAdminEmail = async (order, locale = "ru") => {
  try {
    console.log("📧 ADMIN EMAIL DEBUG:");
    console.log("- Order ID:", order._id || order.orderId);
    console.log("- Line items exists:", !!order.line_items);
    console.log(
      "- Line items length:",
      order.line_items ? order.line_items.length : "undefined",
    );

    const transporter = createTransporter();

    const adminTranslations = {
      et: { subject: "Uus tellimus" },
      en: { subject: "New order" },
      ru: { subject: "Новый заказ" },
    };

    const t = adminTranslations[locale] || adminTranslations.ru;

    const mailOptions = {
      from: {
        name: "Maitsev Gruusia System",
        address: process.env.ZOHO_EMAIL,
      },
      to: "bahus@bahus.ee",
      subject: `${t.subject} #${order.merchantReference || order._id} - Maitsev Gruusia`,
      html: createAdminEmailTemplate(order, locale),
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Admin email sent successfully");
    return result;
  } catch (error) {
    console.error("❌ Error sending admin email:", error);
    throw error;
  }
};

// Функция отправки обоих email
const sendOrderEmails = async (order, locale = "et") => {
  const results = {};

  try {
    results.client = await sendClientEmail(order, locale);
  } catch (error) {
    console.error("Client email error:", error);
    results.clientError = error.message;
  }

  try {
    results.admin = await sendAdminEmail(order, locale);
  } catch (error) {
    console.error("Admin email error:", error);
    results.adminError = error.message;
  }

  return results;
};

module.exports = {
  sendClientEmail,
  sendAdminEmail,
  sendOrderEmails,
};
