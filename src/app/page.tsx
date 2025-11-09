import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col gap-2">
      <Link href="/components/recursive-component">Recursive Component</Link>
      <Link href="/components/headless-dropdown">Headless Dropdown</Link>
      <Link href="/components/autoscroll-list">Autoscroll List</Link>
      <Link href="/components/url-search-params">URL Search Params</Link>
      <Link href="/components/drag-to-select">Drag to select</Link>
      <Link href="/components/treeview">Treeview</Link>
      <Link href="/components/button-group-with-tabindex">
        Button Group with TabIndex
      </Link>
    </div>
  );
}
