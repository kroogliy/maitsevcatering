import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import { CartProvider } from "../../contexts/CartContext";
import { ProductsProvider } from "../../contexts/ProductsContext";
import ModalInit from "../../components/modal-init/ModalInit";
import LenisProvider from "../../components/lenis/LenisProvider";
import GSAPProvider from "../../components/gsap/GSAPProvider";
import ScrollController from "../../components/scroll/ScrollController";
import GlobalCartModals from "../../components/cart/GlobalCartModals";

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ProductsProvider>
        <GSAPProvider>
          <LenisProvider>
            <CartProvider>
              <ScrollController />
              <ModalInit />
              <Header locale={locale} />
              {children}
              <Footer locale={locale} />
              <GlobalCartModals />
            </CartProvider>
          </LenisProvider>
        </GSAPProvider>
      </ProductsProvider>
    </NextIntlClientProvider>
  );
}
