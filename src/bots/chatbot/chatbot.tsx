import clsx from 'clsx';
import styles from './chatbot.module.css';

import { JSX, useRef, useState } from 'react';
import { MdArrowUpward, MdList } from 'react-icons/md';

export interface ChatbotMessage {
  speaker: 'ai' | 'human';
  content: string;
}

interface Props {
  messages: Array<ChatbotMessage>;

  className?: string;
  sendMessage?: (input: string) => Promise<void>;
}

export function Chatbot({
  className,
  messages,
  sendMessage,
}: Props): JSX.Element {
  const messageRefs = useRef<Array<HTMLDivElement>>([]);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className={clsx(styles.chatbot, className)}>
      <button className={styles.chatList}>
        <MdList />
      </button>
      {messages.map(({ speaker, content }, i) => {
        let messageContent: JSX.Element;
        switch (speaker) {
          case 'ai':
            messageContent = <p>{content}</p>;
            break;
          case 'human':
            messageContent = <p className={styles.userMessage}>{content}</p>;
            break;
        }

        return (
          <div
            key={i}
            className={styles.message}
            ref={(el) => {
              if (el) {
                messageRefs.current[i] = el;
              } else {
                delete messageRefs.current[i];
              }
            }}
          >
            {messageContent}
          </div>
        );
      })}
      <form
        className={styles.userInputContainer}
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
        <textarea ref={inputRef} name="input" rows={3} />
        <button
          className={styles.submitChat}
          type="submit"
          disabled={submitting}
          onClick={(event) => event.stopPropagation()}
        >
          <MdArrowUpward />
        </button>
        <div className={styles.queryList}>
          {messages.map((message, i) => {
            if (message.speaker === 'human') {
              return (
                <button
                  key={i}
                  type="button"
                  title={message.content}
                  onClick={(event) => {
                    event.preventDefault();

                    messageRefs.current[i].scrollIntoView({
                      behavior: 'smooth',
                    });
                  }}
                >
                  {message.content}
                </button>
              );
            }
          })}
        </div>
      </form>
    </div>
  );
}
