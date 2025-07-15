import ReactDOM from 'react-dom/client';

import { useState, type JSX } from 'react';
import {
  MessageTreeNode,
  TreeChatbot,
} from '../src/bots/tree-chatbot/tree-chatbot';
import getOpenAIApi from '../src/api/openai/openai-client';
import type {
  ChatCompletionSystemMessageParam,
  ChatCompletionUserMessageParam,
} from 'openai/resources/index';
import cloneDeep from 'lodash-es/cloneDeep';

const root = ReactDOM.createRoot(document.body);

function App(): JSX.Element {
  const [tree, setTree] = useState<MessageTreeNode | undefined>({
    message: {
      query: 'What is React?',
      answer:
        'React is an open-source JavaScript library for building user interfaces or UI components. It was developed by Facebook and is maintained by Facebook and a community of individual developers and companies. It allows developers to create large web applications that can change data, without reloading the page. It is mainly used to build single-page applications.',
    },
    /*
      children: [
        {
          message: {
            query: 'What distinguishes React from Vue?',
            answer: 'Foo.'
          },
        },
        {
          message: {
            query: 'What distinguishes React from Angular?',
          answer: 'Bar.',
          },
        }
      ],
      */
  });

  return (
    <TreeChatbot
      root={tree}
      sendMessage={async (nodes, userInput, nodeId) => {
        const openaiAPI = getOpenAIApi();

        const messages = nodes
          .filter((node) => Boolean(node.message))
          .flatMap((node) => {
            return [
              {
                role: 'user',
                content: node.message!.query,
              } as ChatCompletionUserMessageParam,
              {
                role: 'system',
                content: node.message!.answer,
              } as ChatCompletionSystemMessageParam,
            ];
          })
          .concat({
            role: 'user',
            content: userInput,
          });

        const response = await openaiAPI.chat.completions.stream({
          messages,
          model: 'gpt-4',
        });

        let finalMessage = '';

        for await (const event of response) {
          finalMessage += event.choices.at(0)!.delta.content ?? '';

          let searchNodes = [tree!],
            foundNode = tree!;

          nodeId.forEach(({ position }) => {
            foundNode = searchNodes[position]!;

            searchNodes = foundNode.children!;
          });

          const newNode: MessageTreeNode = {
            message: {
              query: userInput,
              answer: finalMessage,
            },
          };

          foundNode.children![foundNode.children!.length - 1] = newNode;

          setTree(cloneDeep(tree));
        }
      }}
    />
  );
}

root.render(<App />);
