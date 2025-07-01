import clsx from 'clsx';
import styles from './Tree.module.css';

import { useMemo, type JSX } from 'react';

export interface TreeNode {
  label?: string;
  children?: Array<TreeNode>;
}

interface NodeId {
  depth: number;
  position: number;
}

interface AddNode {
  (nodeId: NodeId): void;
}

interface RenderNode {
  (nodeId: NodeId, node: TreeNode): JSX.Element;
}

interface Props {
  root: TreeNode;

  renderNode?: RenderNode;

  /** TODO: Remember to focus on new node. */
  addNode?: AddNode;
}

export function Tree({ root, addNode, renderNode }: Props): JSX.Element {
  const addFn: AddNode = useMemo(() => {
    return addNode ?? (() => {});
  }, [addNode]);

  const renderFn: RenderNode = useMemo(() => {
    return renderNode ?? ((_, node) => <label>{node.label}</label>);
  }, [renderNode]);

  return (
    <div className={styles.tree}>
      <TreeNode
        node={root}
        nodeId={{ depth: 0, position: 0 }}
        onAdd={addFn}
        render={renderFn}
      />
    </div>
  );
}

interface TreeNodeProps {
  node: TreeNode;

  nodeId: NodeId;

  render: (nodeId: NodeId, node: TreeNode) => JSX.Element;
  onAdd: (nodeId: NodeId) => void;
}

function TreeNode({ node, nodeId, onAdd, render }: TreeNodeProps): JSX.Element {
  return (
    <div className={styles.nodeContainer}>
      <div className={styles.node}>{render(nodeId, node)}</div>
      {node.children && (
        <div className={styles.children}>
          {node.children.map((child, i) => (
            <TreeNode
              node={child}
              nodeId={{ depth: nodeId.depth + 1, position: i }}
              render={render}
              onAdd={onAdd}
            />
          ))}
          {/*<button className={clsx(styles.node, styles.addNode)} onClick={() => onAdd(1, Number(node.children?.length))}>+</button>*/}
        </div>
      )}
    </div>
  );
}
