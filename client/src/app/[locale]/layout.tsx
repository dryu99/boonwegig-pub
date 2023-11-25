import { AppLocale, LocaleConfig } from "@/lib/locale";
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
        <main className="mx-auto flex flex-col items-center min-h-screen p-4 bg-primary w-full md:w-5/6 overflow-x-hidden xl:w-[900px]">
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
          <Analytics />
        </main>
      </body>
    </html>
  );
}
