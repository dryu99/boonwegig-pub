import { createSharedPathnamesNavigation } from "next-intl/navigation";
import { LocaleConfig } from "./locale";

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales: LocaleConfig.locales });
