'use client';

import { PauseIcon, PlayIcon, RefreshCw } from 'lucide-react';
import { useRef, useState } from 'react';
import useInterval from '../../../hooks/useInterval';
import { useOnResize } from '../../../hooks/useOnResize';
import { DEMO_MESSAGE } from '../constant';

// This constant is just for demo. In production, you would retrieve the message from a server.
const characters = 150;
const delay = 500;
let position = 0;
export function getNextChars(n: number) {
  const result = DEMO_MESSAGE.slice(position, position + n);
  position += n;
  return result;
}

const AutoscrollList = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');

  const scrollableRef = useRef<HTMLDivElement>(null);

  const [shouldAutoscroll, setShouldAutoscroll] = useState(true);

  // This hook simulates the streaming effect from a server
  useInterval(
    () => {
      const newText = getNextChars(characters);
      setText(text => text + newText);
    },
    isPlaying ? delay : null
  );

  // We don't need to extract the args from the callback because we don't need them in this case
  useOnResize(scrollableRef, () => {
    const scrollableEl = scrollableRef.current;
    if (!scrollableEl) return;

    // scrollableEl.scrollHeight increases when we add new text
    // scrollHeight returns the height of the scrollable element, including the hidden content
    // clientHeight returns the height of the scrollable element
    const maxScrollHeight =
      scrollableEl.scrollHeight - scrollableEl.clientHeight;

    if (shouldAutoscroll) {
      // scrollTop changes the position of the scroll inside the scrollable element
      scrollableEl.scrollTop = maxScrollHeight;
    }
  });

  return (
    <div className="w-96">
      <div className="relative">
        <div
          ref={scrollableRef}
          // This onWheel event takes care of scroll up and scroll down behavior
          onWheel={e => {
            const scrollableEl = scrollableRef.current;
            if (!scrollableEl) return;
            const maxScrollHeight =
              scrollableEl.scrollHeight - scrollableEl.clientHeight;
            // If user scroll up, we pause the auto-scroll behavior and vice versa
            if (e.deltaY < 0 && text) {
              setShouldAutoscroll(false);
            } else if (scrollableEl.scrollTop === maxScrollHeight) {
              setShouldAutoscroll(true);
            }
          }}
          className="mt-2 p-4 h-80 overflow-auto rounded-lg bg-white shadow"
        >
          <p className="whitespace-pre-wrap text-gray-700">{text}</p>
        </div>

        {!shouldAutoscroll && (
          <div className="absolute inset-x-0 bottom-2 flex justify-center">
            <button
              onClick={() => setShouldAutoscroll(true)}
              className="size-8 rounded bg-white/80 shadow backdrop-blur-xl"
            >
              👇
            </button>
          </div>
        )}
      </div>

      <p className="mt-2 text-center text-xs font-medium text-gray-500">
        <span className="tabular-nums">{text.length.toLocaleString()}</span>
      </p>

      <div className="mt-10 flex items-center justify-center gap-4">
        <button
          className="inline-flex w-32 items-center justify-center gap-1 rounded-lg bg-accent p-2 font-semibold text-white hover:bg-accent-light"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? (
            <>
              <PauseIcon className="size-4" /> Pause
            </>
          ) : (
            <>
              <PlayIcon className="size-4" /> Start
            </>
          )}
        </button>
        <button
          className="inline-flex w-32 items-center justify-center gap-1 rounded-lg border-accent bg-gray-300 p-2 font-medium text-gray-500 hover:bg-gray-400/40"
          onClick={() => {
            setText('');
            setIsPlaying(false);
            position = 0;
          }}
        >
          <RefreshCw className="size-4" /> Reset
        </button>
      </div>
    </div>
  );
};

export default AutoscrollList;
