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
    children: [
      {
        message: {
          query: 'Why is it so popular?',
          answer: `React has gained popularity for a number of reasons:

1. Components: React code is made of entities called components. Components simplify the development and maintenance of complex UI features. They are reusable and can manage their own state.

2. Virtual DOM: React uses a virtual DOM that helps to organize your components in a way that follows logic and reason. The virtual DOM also makes React very fast, optimizing rendering and improving app performance.

3. Flexibility: React offers more flexibility and efficiency through its unidirectional data flow, allowing you to structure your app in the way that makes the most sense for you.

4. Community and Ecosystem: React has a large community and ecosystem, leading to better resources for learning and troubleshooting. It's also backed by Facebook, which provides a level of trust in its longevity and continued support.

5. React Native: With React Native, you can develop mobile apps that are indistinguishable from an app built using Objective-C or Java. React Native uses the same fundamental UI building blocks as regular iOS or Android apps.

6. Advanced JavaScript: React pushes you to learn JavaScript in depth and use its modern features, which can make you a better JavaScript developer.

7. Use of JSX: JSX is an HTML-like syntax that compiles down to JavaScript. It makes writing React components, handling of JavaScript's "this" keyword, and managing component state easier.`,
        },
      },
      {
        message: {
          query: `How does it work?`,
          answer: `React works by building interfaces using small parts or components. Each component manages its own state (data that influences how a component renders). The components are reusable, allowing developers to easily manage and manipulate their web applications as isolated, independent pieces.

React uses a virtual DOM (Document Object Model) to improve performance. The DOM is a representation of the webpage that JavaScript can use to change the content of a web page. However, updating the DOM directly can be slow, especially when there are heavy updates. 

Here's where Virtual DOM comes in. Whenever a change is made, React builds a new Virtual DOM and compares it with the old one. It identifies the changes (or 'differences') and then updates ONLY those changes on the actual DOM. This process, known as 'diffing', greatly enhances the performance and speed of updates, contributing to a more seamless user interface.

React also utilizes one-way data binding and an application architecture called Flux controls to update the view and control application workflow. This approach allows for improved control over the application.

In summary, React’s workflow enables developers to efficiently manage and organize their project, contributing to improved maintainability, simplicity and a smoother, faster web performance.`,
        },
      },
    ],
  });

  const [activatedNode, setActivatedNode] = useState<
    MessageTreeNode | undefined
  >();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <TreeChatbot
        appearance="query-only"
        root={tree}
        expandMessageNode={setActivatedNode}
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

            setActivatedNode(newNode);
            setTree(cloneDeep(tree));
          }
        }}
      />
      <div
        style={{
          flex: '1',
          minWidth: 0,
          padding: '1em',
          textIndent: '2em',
          whiteSpace: 'pre-wrap',
        }}
      >
        {activatedNode && (
          <>
            <p>{activatedNode.message!.answer}</p>
          </>
        )}
      </div>
    </div>
  );
}

root.render(<App />);
