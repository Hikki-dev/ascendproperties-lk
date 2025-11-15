import Link from 'next/link';

export default function RentPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-text-primary mb-8">
        Properties for Rent
      </h1>
      <p className="text-text-secondary">
        This page is under construction. Please check back soon!
      </p>
      <Link href="/" className="text-primary hover:underline mt-4 inline-block">
        Go back home
      </Link>
    </div>
  );
}