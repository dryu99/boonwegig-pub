import { MusicGenre } from "@/lib/genre";
import { useTranslations } from "next-intl";

//  TODO support translations here?

export const FreeTag = ({ text }: { text: string }) => {
  return <span className="text-yellow-400">{text}</span>;
};

export const NewTag = ({ text }: { text: string }) => {
  return <span className="text-green-500">{text}</span>;
};

export const GenreTag = ({ genre }: { genre: string }) => {
  return <span className="text-blue-500">{genre}</span>;
};
