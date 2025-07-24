import styles from './journal-chatbot.module.css';

import clsx from 'clsx';
import {
  Fragment,
  KeyboardEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
  type JSX,
} from 'react';
import { MdArrowUpward, MdOutlineArrowLeft } from 'react-icons/md';

export interface JournalEntryMessage {
  speaker: 'user' | 'ai';
  content: string;
}

export interface JournalEntry {
  messages: Array<JournalEntryMessage>;

  date?: Date;
}

// All entries should be accessible on the right-hand, like chapters

export interface Props {
  bindListenersToRoot: boolean;
  entries: Array<JournalEntry>;
  enableClickEvents: boolean;

  sendMessage?: (
    entry: JournalEntry,
    input: string,
    entryIndex: number,
  ) => Promise<void>;
}

export function JournalChatbot({
  bindListenersToRoot,
  enableClickEvents,
  entries,
  sendMessage,
}: Props): JSX.Element {
  const addBlankPage = useMemo(() => {
    return (entries: Array<JournalEntry>) => {
      const lastEntry = entries.at(-1);

      if (!lastEntry || lastEntry.messages.length > 0) {
        return entries.concat({
          messages: [],
          date: new Date(),
        });
      } else {
        return entries;
      }
    };
  }, []);

  const [calculatedEntries, setCalculatedEntries] = useState<
    Array<JournalEntry>
  >(addBlankPage(entries));

  const [currentEntryIndex, setCurrentEntryIndex] = useState(
    calculatedEntries.length - 1,
  );

  const currentEntry = calculatedEntries[currentEntryIndex]!;

  const goToPreviousPage = useMemo(() => {
    return () => {
      if (currentEntryIndex === 0) {
        setCurrentEntryIndex(calculatedEntries.length - 1);
      } else {
        setCurrentEntryIndex(currentEntryIndex - 1);
      }
    };
  }, [calculatedEntries, currentEntryIndex, setCurrentEntryIndex]);

  const goToNextPage = useMemo(() => {
    return () => {
      if (currentEntryIndex === calculatedEntries.length - 1) {
        setCurrentEntryIndex(0);
      } else {
        setCurrentEntryIndex(currentEntryIndex + 1);
      }
    };
  }, [calculatedEntries, currentEntryIndex, setCurrentEntryIndex]);

  const keyboardListener: (event: KeyboardEvent) => void = useMemo(() => {
    return (event) => {
      switch (event.key) {
        case 'ArrowRight':
          goToNextPage();
          break;
        case 'ArrowLeft':
          goToPreviousPage();
          break;
      }
    };
  }, [goToPreviousPage, goToNextPage]);

  useEffect(() => {
    if (bindListenersToRoot) {
      document.body.addEventListener('keydown', keyboardListener);

      return () =>
        document.body.removeEventListener('keydown', keyboardListener);
    }
  }, [bindListenersToRoot, keyboardListener]);

  useEffect(() => {
    setCalculatedEntries(addBlankPage(entries));
  }, [entries, setCalculatedEntries, addBlankPage]);

  const formatDate = useMemo(() => {
    return (date: Date) => {
      return `${date.getMonth().toString().padStart(2, '0')}/${date.getDay().toString().padStart(2, '0')}/${date.getFullYear()}`;
    };
  }, []);

  const [sidePaneOpened, setSidePaneOpened] = useState(false);

  return (
    <div
      className={styles.journalPage}
      tabIndex={0}
      onKeyDown={
        !bindListenersToRoot
          ? (keyboardListener as unknown as KeyboardEventHandler)
          : undefined
      }
      onClick={(event) => {
        if (!enableClickEvents) {
          return;
        }

        const eventTarget = event.target as HTMLElement;

        const { x, width } = eventTarget.getBoundingClientRect();
        const midpoint = x + width / 2;
        if (event.clientX >= midpoint) {
          goToNextPage();
        } else {
          goToPreviousPage();
        }
      }}
    >
      {currentEntry.date && (
        <p className={styles.dateString}>{formatDate(currentEntry.date)}</p>
      )}
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
      {currentEntryIndex > calculatedEntries.length - 3 && (
        <ChatForm
          sendMessage={async (input) => {
            await sendMessage?.(currentEntry, input, currentEntryIndex);
          }}
        />
      )}
      <div
        className={clsx(styles.sidePane, {
          [styles.sidePaneOpened]: sidePaneOpened,
        })}
        onClick={(event) => {
          event.stopPropagation();
          setSidePaneOpened((state) => !state);
        }}
      >
        {calculatedEntries.map((entry, i) => {
          return (
            <button
              key={i}
              onClick={(event) => {
                event.stopPropagation();
                setCurrentEntryIndex(i);
                setSidePaneOpened(false);
              }}
            >
              {entry.date ? formatDate(entry.date) : '-'}
            </button>
          );
        })}
        <button className={styles.openPane}>
          <MdOutlineArrowLeft />
        </button>
      </div>
    </div>
  );
}

interface ChatFormProps {
  sendMessage: (input: string) => Promise<void>;
}

function ChatForm({ sendMessage }: ChatFormProps): JSX.Element {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      className={styles.chatForm}
      onSubmit={async (event) => {
        event.preventDefault();

        if (inputRef.current) {
          const input = new FormData(event.target as HTMLFormElement).get(
            'input',
          ) as string;

          try {
            setSubmitting(true);

            inputRef.current.value = '';

            await sendMessage?.(input);
          } finally {
            setSubmitting(false);
          }
        }
      }}
    >
      <textarea
        className={styles.userInput}
        name="input"
        rows={5}
        ref={inputRef}
        onClick={(event) => event.stopPropagation()}
      />
      <button
        className={styles.submitChatForm}
        type="submit"
        disabled={submitting}
        onClick={(event) => event.stopPropagation()}
      >
        <MdArrowUpward />
      </button>
    </form>
  );
}
