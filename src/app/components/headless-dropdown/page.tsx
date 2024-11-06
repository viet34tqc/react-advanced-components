'use client';

import { ComponentProps } from 'react';
import HeadlessDropdown from './components/HeadlessDropdown';

const items = [
  {
    icon: 'https://i.pravatar.cc/128?u=John',
    label: 'John Doe',
    description: 'Software Engineer',
  },
  {
    icon: 'https://i.pravatar.cc/128?u=Jane',
    label: 'Jane Smith',
    description: 'Graphic Designer',
  },
  {
    icon: 'https://i.pravatar.cc/128?u=Mike',
    label: 'Mike Johnson',
    description: 'Product Manager',
  },
  {
    icon: 'https://i.pravatar.cc/128?u=Emily',
    label: 'Emily Davis',
    description: 'UX Designer',
  },
  {
    icon: 'https://i.pravatar.cc/128?u=Robert',
    label: 'Robert Brown',
    description: 'Data Analyst',
  },
];

const CustomTrigger = (props: ComponentProps<'button'>) => {
  return (
    <button
      className="btn p-2 border rounded min-w-[240px]"
      tabIndex={0}
      {...props}
    />
  );
};

const CustomList = (props: ComponentProps<'div'>) => (
  <div className=" shadow-sm rounded mt-2 absolute min-w-[240px]" {...props} />
);

const CustomListItem = (props: ComponentProps<'div'>) => (
  <div
    className="p-2 border-b border-gray-600 flex items-center aria-selected:bg-gray-800 hover:bg-gray-600"
    {...props}
  />
);

const Page = () => {
  return (
    <HeadlessDropdown items={items}>
      <HeadlessDropdown.Trigger as={CustomTrigger}>
        Select an option
      </HeadlessDropdown.Trigger>
      <HeadlessDropdown.List as={CustomList}>
        {items.map((item, index) => (
          <HeadlessDropdown.Option
            index={index}
            key={index}
            item={item}
            as={CustomListItem}
          />
        ))}
      </HeadlessDropdown.List>
    </HeadlessDropdown>
  );
};

export default Page;
