'use client';

import { ChevronRight, File, Folder } from 'lucide-react';
import { useState } from 'react';
import { FileNode } from './types';
const FileSystemItem = ({ node }: { node: FileNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <li>
      {/* if nodes.length > 0 */}
      {/* Display arrow down icon */}
      {/* Display folder icon */}

      <span className="flex items-center gap-1.5 py-1">
        {node.nodes && node.nodes.length > 0 && (
          <button onClick={() => setIsOpen(!isOpen)} className="p-1 -m-1">
            <ChevronRight
              className={`size-4 text-gray-500 ${isOpen ? 'rotate-90' : ''}`}
            />
          </button>
        )}

        {node.nodes ? (
          <Folder
            className={`size-6 text-sky-500 ${
              node.nodes.length === 0 ? 'ml-[22px]' : ''
            }`}
          />
        ) : (
          <File className="ml-[22px] size-6 text-gray-900" />
        )}
        {node.name}
      </span>

      {/* Display items when folder is open */}
      {isOpen && (
        <ul className="pl-6">
          {node.nodes?.map(node => (
            <FileSystemItem node={node} key={node.name} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default FileSystemItem;
