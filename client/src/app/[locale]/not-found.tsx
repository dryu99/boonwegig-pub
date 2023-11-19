import { Link } from "@/lib/navigation";

export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2>404 Not Found</h2>
      <p>Could not find requested resource</p>
      <Link className="underline" href="/">
        Return Home
      </Link>
    </main>
  );
}
