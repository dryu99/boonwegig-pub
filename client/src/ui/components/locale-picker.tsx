"use client";

import { usePathname, useRouter } from "@/lib/navigation";

export const LocalePicker = () => {
  const pathname = usePathname();
  const router = useRouter();

  // router.replace(pathname, { locale: "de" });

  return (
    <div>
      <span
        className="hover:underline cursor-pointer"
        data-umami-event="en-locale-link"
        onClick={() => router.replace(pathname, { locale: "en" })}
      >
        ENG
      </span>
      <span className="mx-1 cursor-default">|</span>
      <span
        className="text-sm hover:underline cursor-pointer"
        data-umami-event="ko-locale-link"
        onClick={() => router.replace(pathname, { locale: "ko" })}
      >
        한국어
      </span>
    </div>
  );
};
