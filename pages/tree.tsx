import ReactDOM from 'react-dom/client';

import { Tree, TreeNode } from '../src/shared/Tree';

interface CustomTreeNode extends TreeNode<CustomTreeNode> {
  // text: string;
}

const treeNode: CustomTreeNode = {
  children: [
    {
      label: 'a',
      children: [
        {
          label: 'c',
        },
      ],
    },
    {
      label: 'b',
      children: [
        { label: 'd', children: [{ label: 'i' }] },
        { label: 'e', children: [{ label: 'g' }, { label: 'h' }] },
        { label: 'f' },
      ],
    },
  ],
};

const root = ReactDOM.createRoot(document.body);
root.render(<Tree root={treeNode} />);
