import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col gap-2">
      <Link href="/components/recursive-component">Recursive Component</Link>
      <Link href="/components/headless-dropdown">Headless Dropdown</Link>
    </div>
  );
}
