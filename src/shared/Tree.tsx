import clsx from 'clsx';
import styles from './Tree.module.css';

import { useMemo, useState, type JSX } from 'react';

type NodeId = Array<{
  position: number;
}>;

export interface TreeNode {
  label?: string;
  children?: Array<TreeNode>;
}

interface AddNode {
  (nodeId: NodeId): void;
}

interface ActivateNode {
  (nodes: NodeId): void;
}

interface RenderNode {
  (nodeId: NodeId, node: TreeNode): JSX.Element;
}

interface Props {
  root: TreeNode;

  renderNode?: RenderNode;

  /** TODO: Remember to focus on new node. */
  addNode?: AddNode;

  activateNode?: ActivateNode;
}

function isPartOfNode(node: NodeId, path: NodeId): boolean {
  return node.every(({ position }, i) => {
    const node = path.at(i);

    return node ? node.position === position : false;
  });
}

export function Tree({ root, addNode, renderNode }: Props): JSX.Element {
  const addFn: AddNode = useMemo(() => {
    return addNode ?? (() => {});
  }, [addNode]);

  const renderFn: RenderNode = useMemo(() => {
    return renderNode ?? ((_, node) => <label>{node.label}</label>);
  }, [renderNode]);

  const [activatedNode, setActivatedNode] = useState<NodeId | null>(null);

  const activateFn: ActivateNode = useMemo(() => {
    return (nodeIds) => {
      setActivatedNode(nodeIds);
    };
  }, [setActivatedNode]);

  return (
    <div className={styles.tree}>
      <TreeNode
        node={root}
        nodeId={[{ position: 0 }]}
        activatedNode={activatedNode}
        onAdd={addFn}
        onActivate={activateFn}
        render={renderFn}
      />
    </div>
  );
}

interface TreeNodeProps {
  node: TreeNode;

  nodeId: NodeId;

  activatedNode: NodeId | null;

  render: RenderNode;
  onAdd: AddNode;
  onActivate: ActivateNode;
}

function TreeNode({
  node,
  nodeId,
  ...passedDownProps
}: TreeNodeProps): JSX.Element {
  const activated =
    passedDownProps.activatedNode &&
    isPartOfNode(nodeId, passedDownProps.activatedNode);

  return (
    <div className={styles.nodeContainer}>
      <button
        className={clsx(styles.node, {
          [styles.nodeActivated]: activated,
        })}
        onClick={() => passedDownProps.onActivate(nodeId)}
      >
        {/*render(nodeId, node)*/}
      </button>
      {node.children && (
        <div className={styles.children}>
          {node.children.map((child, i) => (
            <TreeNode
              key={i}
              node={child}
              nodeId={nodeId.concat({ position: i })}
              {...passedDownProps}
            />
          ))}
          {/*<button className={clsx(styles.node, styles.addNode)} onClick={() => onAdd(1, Number(node.children?.length))}>+</button>*/}
        </div>
      )}
    </div>
  );
}
