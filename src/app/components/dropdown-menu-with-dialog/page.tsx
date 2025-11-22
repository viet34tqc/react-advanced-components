'use client';

import { Button } from '@/components/ui/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
} from '@/components/ui/context-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ContextMenuTrigger } from '@radix-ui/react-context-menu';

import { useRef, useState } from 'react';

const DropdownMenuWithDialog = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState<DOMRect | null>(null);
  return (
    <>
      <Popover modal={true}>
        {/* Set the position of popover content relative to context menu */}
        {position && (
          <PopoverAnchor
            virtualRef={{
              current: {
                getBoundingClientRect: () => position,
              },
            }}
          />
        )}
        <ContextMenu>
          <ContextMenuTrigger
            onContextMenu={e =>
              setPosition(new DOMRect(e.clientX, e.clientY, 0, 0))
            }
          >
            <DropdownMenu modal={false}>
              <div className="w-52 h-52 flex justify-end items-start border border-white">
                <PopoverAnchor>
                  <DropdownMenuTrigger asChild>
                    <Button ref={buttonRef} variant="outline">
                      Open
                    </Button>
                  </DropdownMenuTrigger>
                </PopoverAnchor>
              </div>
              <DropdownMenuContent sideOffset={5} align="start">
                <PopoverTrigger asChild>
                  <DropdownMenuItem
                    onSelect={e => {
                      e.preventDefault();
                    }}
                  >
                    Profile
                  </DropdownMenuItem>
                </PopoverTrigger>

                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-28 bg-white border-2 border-black">
            <PopoverTrigger asChild>
              <ContextMenuItem onSelect={e => e.preventDefault()}>
                Profile
              </ContextMenuItem>
            </PopoverTrigger>

            <ContextMenuItem>Billing</ContextMenuItem>
            <ContextMenuItem>Settings</ContextMenuItem>
          </ContextMenuContent>
          <PopoverContent
            sideOffset={0}
            align={'start'}
            asChild
            onCloseAutoFocus={e => {
              e.preventDefault();
              buttonRef.current?.focus();
            }}
          >
            <div className="flex flex-col gap-2.5">
              <p className=" text-[15px] leading-[19px] font-medium mb-2.5">
                Custom
              </p>
              <fieldset className="flex gap-2 items-center">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Name" />
              </fieldset>
              <fieldset className="flex gap-2 items-center">
                <Label htmlFor="width">Width</Label>
                <Input id="width" defaultValue="3in" />
              </fieldset>
              <fieldset className="flex gap-2 items-center">
                <Label htmlFor="height">Height</Label>
                <Input id="height" defaultValue="7in" />
              </fieldset>
              <fieldset className="flex gap-2 items-center">
                <Label htmlFor="color">Color</Label>
                <Input id="color" defaultValue="Purple" />
              </fieldset>
            </div>
          </PopoverContent>
        </ContextMenu>
      </Popover>
    </>
  );
};

export default DropdownMenuWithDialog;
