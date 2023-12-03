import { AppLocale, LocaleConfig } from "@/lib/locale";
import { unstable_getHeaderTranslations } from "@/lib/translation";
import { Footer } from "@/ui/components/footer";
import { Header } from "@/ui/components/header";
import { courier } from "@/ui/fonts";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Script from "next/script";
import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
  params: { locale: AppLocale };
};

// TODO move this (or add another one) to city/ so we can get access to city params
export const generateMetadata = async ({
  params: { locale },
}: Omit<LayoutProps, "children">): Promise<Metadata> => {
  const t = await getTranslations({
    locale,
    namespace: "html-metadata",
  });

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
  };
};

// enable static rendering
export const generateStaticParams = () => {
  return LocaleConfig.locales.map((locale) => ({ locale }));
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: LayoutProps) {
  // validate that the incoming `locale` parameter is valid
  if (!LocaleConfig.locales.includes(locale)) notFound();

  // enable static rendering: https://next-intl-docs.vercel.app/docs/getting-started/app-router#static-rendering
  unstable_setRequestLocale(locale);

  // TODO should prob be calling this in header
  const t = await getTranslations("header");
  const headerTranslations = unstable_getHeaderTranslations(t);

  // TODO look into optimizing scripts: afterInteractive, beforeInteractive, etc
  return (
    <html lang={locale}>
      <head>
        <Script
          async
          data-domains="www.boonwegig.com"
          src="https://umami-ten-indol.vercel.app/script.js"
          data-website-id="89ba67d0-9f46-4234-b81b-989a67eba5cc"
        />
      </head>
      <body className={`${courier.className} antialiased`}>
        <Header locale={locale} translations={headerTranslations} />
        {/* not using min-h-screen here to account for header + footer height */}
        <main className="flex flex-col items-center mx-auto p-4 min-h-[67vh]">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
