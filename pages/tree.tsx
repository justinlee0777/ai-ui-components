import ReactDOM from 'react-dom/client';

import { Tree, type TreeNode } from '../src/shared/Tree';
import clsx from 'clsx';
import { type JSX } from 'react';

interface CustomTreeNode extends TreeNode<CustomTreeNode> {
  label: string;

  text?: string;
  imageUrl?: string;
}

const treeNode: CustomTreeNode = {
  label: 'Who am I?',
  text: 'I am Justin Lee. I am very surprised by things.',
  imageUrl: '/portrait.jpg',
  children: [
    {
      label: 'What my career\nlooks like',
      children: [
        {
          label: 'College',
          text: 'From 2012 to 2016 I attended Rensselaer Polytechnic Institute.\nI received a Dual Bachelors Degree in Psychology and Computer Science.',
          children: [
            {
              label: 'Unbound and SAP',
              text: '',
              children: [
                {
                  label: 'My gap',
                  text: '',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      label: 'What my life\nlooks like',
      children: [
        {
          label: 'Art',
          text: '',
        },
        {
          label: 'Writing',
          text: '',
        },
      ],
    },
    {
      label: 'Who I think\nI really am',
      children: [
        {
          label: 'Curiosity',
          text: '',
        },
      ],
    },
    {
      label: 'Where I want\nto go',
      children: [],
    },
  ],
};

const root = ReactDOM.createRoot(document.body);

function App(): JSX.Element {
  return (
    <Tree
      root={treeNode}
      classes={{
        node: (nodeId, node) =>
          clsx('customTreeNode', {
            customRootNode: nodeId.length === 1,
            customTitleNode: !Boolean(node.text),
          }),
      }}
      renderNode={(_, node, { activated: { exact } }) => {
        if (exact) {
          return (
            <>
              <p>{node.text}</p>
              {node.imageUrl && <img src={node.imageUrl} />}
            </>
          );
        } else {
          return <label className="nodeLabel">{node.label}</label>;
        }
      }}
    />
  );
}

root.render(<App />);
