import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import Link from "next/link";
import NotFoundBackButton from "../components/not-found/backbutton";
import "./not-found.css";

export default async function NotFound() {
  const t = await getTranslations("404");
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const locale = pathname.split("/")[1] || "et";

  return (
    <div className="not-found-container">
      {/* Decorative background elements */}
      <div className="not-found-decoration"></div>

      {/* Main content */}
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <p className="not-found-message">{t("notFoundMessage")}</p>
        {t("subtitle") && <p className="not-found-subtitle">{t("subtitle")}</p>}
        {t("subtitle2") && (
          <p className="not-found-subtitle">{t("subtitle2")}</p>
        )}

        <div className="buttons-container">
          <NotFoundBackButton label={t("backButton")} />
          <Link href={`/${locale}/menu/menu/sushi`}>
            <button
              className="button"
            >
              {t("menuButton")}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
