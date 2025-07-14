import ReactDOM from 'react-dom/client';

import { type NodeId, Tree, type TreeNode } from '../src/shared/Tree';
import clsx from 'clsx';
import { act, useMemo, useState, type JSX } from 'react';
import { Tooltip } from 'react-tooltip';
import {
  MessageTreeNode,
  TreeChatbot,
} from '../src/bots/tree-chatbot/tree-chatbot';
import getOpenAIApi from '../src/api/openai/openai-client';

const treeNode: MessageTreeNode = {};

const root = ReactDOM.createRoot(document.body);

function App(): JSX.Element {
  const [tree, setTree] = useState<MessageTreeNode | undefined>();

  return (
    <TreeChatbot
      root={tree}
      sendMessage={async (nodes, userInput) => {
        console.log('sendMessage', nodes);

        const openaiAPI = getOpenAIApi();
        console.log(
          'messages',
          nodes
            .filter((node) => Boolean(node.message))
            .map((node) => {
              return node.message;
            }),
        );

        const response = await openaiAPI.chat.completions.create({
          messages: nodes
            .filter((node) => Boolean(node.message))
            .map((node) => {
              return node.message!;
            })
            .concat({
              role: 'user',
              content: userInput,
            }),
          model: 'gpt-4',
        });

        console.log('response', response);
        /*
          for await (const event of response) {
            console.log('streaming chunk', event);
          }
            */
      }}
    />
  );
}

root.render(<App />);
