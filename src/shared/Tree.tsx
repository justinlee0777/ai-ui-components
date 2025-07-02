import clsx from 'clsx';
import styles from './Tree.module.css';

import { useMemo, useState, type JSX } from 'react';

type NodeId = Array<{
  position: number;
}>;

export interface TreeNode<NodeType extends TreeNode<NodeType>> {
  label?: string;
  children?: Array<NodeType>;
}

interface AddNode {
  (nodeId: NodeId): void;
}

interface ActivateNode {
  (nodes: NodeId): void;
}

interface RenderNode<NodeType extends TreeNode<NodeType>> {
  (nodeId: NodeId, node: NodeType): JSX.Element;
}

interface Props<NodeType extends TreeNode<NodeType>> {
  root: NodeType;

  canAdd?: boolean;

  renderNode?: RenderNode<NodeType>;

  renderActivatedNode?: RenderNode<NodeType>;

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

export function Tree<NodeType extends TreeNode<NodeType>>({
  root,
  canAdd,
  addNode,
  renderNode,
  renderActivatedNode,
}: Props<NodeType>): JSX.Element {
  const addFn: AddNode = useMemo(() => {
    return addNode ?? (() => {});
  }, [addNode]);

  const renderFn: RenderNode<NodeType> = useMemo(() => {
    return renderNode ?? (() => <></>);
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
        canAdd={Boolean(canAdd)}
        onAdd={addFn}
        onActivate={activateFn}
        render={renderFn}
        renderActivated={renderActivatedNode}
      />
    </div>
  );
}

interface TreeNodeProps<NodeType extends TreeNode<NodeType>> {
  node: NodeType;

  nodeId: NodeId;

  activatedNode: NodeId | null;

  canAdd: boolean;

  render: RenderNode<NodeType>;
  renderActivated?: RenderNode<NodeType>;
  onAdd: AddNode;
  onActivate: ActivateNode;
}

function TreeNode<NodeType extends TreeNode<NodeType>>({
  node,
  nodeId,
  ...passedDownProps
}: TreeNodeProps<NodeType>): JSX.Element {
  const activated =
    passedDownProps.activatedNode &&
    isPartOfNode(nodeId, passedDownProps.activatedNode);

  let renderedContent: JSX.Element | undefined;

  if (activated && passedDownProps.renderActivated) {
    renderedContent = passedDownProps.renderActivated(nodeId, node);
  } else {
    renderedContent = passedDownProps.render(nodeId, node);
  }

  return (
    <div className={styles.nodeContainer}>
      <button
        className={clsx(styles.node, {
          [styles.nodeActivated]: activated,
        })}
        onClick={() => passedDownProps.onActivate(nodeId)}
      >
        {renderedContent}
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
          {passedDownProps.canAdd && (
            <div className={styles.nodeContainer}>
              <button
                className={clsx(styles.node, styles.addNode)}
                onClick={() =>
                  passedDownProps.onAdd(
                    nodeId.concat({ position: Number(node.children?.length) }),
                  )
                }
              >
                <span className={styles.addNodeText}>+</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
