import { CITIES } from "@/lib/city";

export const generateStaticParams = () => {
  return CITIES.map((city) => ({ city }));
};

export default function CityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
