import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center">
      <h2 className="text-2xl font-bold text-gray-900">Page not found</h2>
      <p className="mt-2 text-gray-600">The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="mt-4 rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
      >
        Go home
      </Link>
    </div>
  );
}
