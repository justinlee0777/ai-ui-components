import styles from './journal-chatbot.module.css';

import clsx from 'clsx';
import {
  Fragment,
  KeyboardEventHandler,
  useEffect,
  useMemo,
  useState,
  type JSX,
} from 'react';

export interface JournalEntryMessage {
  speaker: 'user' | 'ai';
  content: string;
}

export interface JournalEntry {
  messages: Array<JournalEntryMessage>;

  date?: Date;
}

export interface Props {
  bindListenersToRoot: boolean;
  entries: Array<JournalEntry>;
}

function ChatForm(): JSX.Element {
  return <form></form>;
}

export function JournalChatbot({
  bindListenersToRoot,
  entries,
}: Props): JSX.Element {
  const [currentEntryIndex, setCurrentEntryIndex] = useState(0);

  const currentEntry = entries[currentEntryIndex];

  const keyboardListener: (event: KeyboardEvent) => void = useMemo(() => {
    return (event) => {
      switch (event.key) {
        case 'ArrowRight':
          setCurrentEntryIndex((currentIndex) => {
            if (currentIndex === entries.length - 1) {
              return 0;
            } else {
              return currentIndex + 1;
            }
          });
          break;
        case 'ArrowLeft':
          setCurrentEntryIndex((currentIndex) => {
            if (currentIndex === 0) {
              return entries.length - 1;
            } else {
              return currentIndex - 1;
            }
          });
          break;
      }
    };
  }, [entries, setCurrentEntryIndex]);

  useEffect(() => {
    if (bindListenersToRoot) {
      document.body.addEventListener('keydown', keyboardListener);

      return () =>
        document.body.removeEventListener('keydown', keyboardListener);
    }
  }, [bindListenersToRoot]);

  if (!currentEntry) {
    return <></>;
  } else {
    return (
      <div
        className={styles.journalPage}
        tabIndex={0}
        onKeyDown={
          !bindListenersToRoot
            ? (keyboardListener as unknown as KeyboardEventHandler)
            : undefined
        }
      >
        {currentEntry.messages.flatMap(({ speaker, content }, i) => {
          return (
            <Fragment key={i}>
              {i > 0 && <div className={styles.border}></div>}
              <div
                className={clsx({
                  [styles.aiMessage]: speaker === 'ai',
                  [styles.userMessage]: speaker === 'user',
                })}
              >
                {content.split('\n').map((paragraph, j) => (
                  <p key={`${i}-${j}`}>{paragraph}</p>
                ))}
              </div>
            </Fragment>
          );
        })}
      </div>
    );
  }
}
