import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-4">
      <Link href="/components/recursive-component">Recursive Component</Link>
    </div>
  );
}
