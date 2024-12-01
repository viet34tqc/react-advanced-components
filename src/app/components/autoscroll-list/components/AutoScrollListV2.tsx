'use client';

import { PauseIcon, PlayIcon, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import useInterval from '../../../hooks/useInterval';
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

function autoScrollListRef(list: HTMLDivElement) {
  let shouldAutoScroll = true;
  let touchStartY = 0;
  let lastScrollTop = 0;

  const checkScrollPosition = () => {
    const { scrollHeight, clientHeight, scrollTop } = list;
    const maxScrollHeight = scrollHeight - clientHeight;
    const scrollThreshold = maxScrollHeight / 2;

    if (scrollTop < lastScrollTop) {
      shouldAutoScroll = false;
    } else if (maxScrollHeight - scrollTop <= scrollThreshold) {
      shouldAutoScroll = true;
    }

    lastScrollTop = scrollTop;
  };

  const handleWheel = (e: WheelEvent) => {
    if (e.deltaY < 0) {
      shouldAutoScroll = false;
    } else {
      checkScrollPosition();
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    touchStartY = e.touches[0].clientY;
  };

  const handleTouchMove = (e: TouchEvent) => {
    const touchEndY = e.touches[0].clientY;
    const deltaY = touchStartY - touchEndY;

    if (deltaY < 0) {
      shouldAutoScroll = false;
    } else {
      checkScrollPosition();
    }

    touchStartY = touchEndY;
  };

  list.addEventListener('wheel', handleWheel);
  list.addEventListener('touchstart', handleTouchStart);
  list.addEventListener('touchmove', handleTouchMove);

  const observer = new MutationObserver(() => {
    if (shouldAutoScroll) {
      list.scrollTo({ top: list.scrollHeight });
    }
  });

  observer.observe(list, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  return () => {
    observer.disconnect();
    list.removeEventListener('wheel', handleWheel);
    list.removeEventListener('touchstart', handleTouchStart);
    list.removeEventListener('touchmove', handleTouchMove);
  };
}

const AutoscrollListV2 = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');

  // This hook simulates the streaming effect from a server
  useInterval(
    () => {
      const newText = getNextChars(characters);
      setText(text => text + newText);
    },
    isPlaying ? delay : null
  );

  return (
    <div className="w-96">
      <div className="relative">
        <div
          ref={autoScrollListRef}
          className="mt-2 p-4 h-80 overflow-auto rounded-lg bg-white shadow"
        >
          <p className="whitespace-pre-wrap text-gray-700">{text}</p>
        </div>
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

export default AutoscrollListV2;
