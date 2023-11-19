"use client";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">Something went wrong ㅠ _ ㅠ</h2>
    </main>
  );
}
