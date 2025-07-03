import clsx from 'clsx';
import styles from './Tree.module.css';

import { useMemo, useState, type JSX } from 'react';

export type NodeId = Array<{
  position: number;
}>;

export interface TreeNode<NodeType extends TreeNode<NodeType>> {
  children?: Array<NodeType>;
}

interface Classes<NodeType extends TreeNode<NodeType>> {
  node: (nodeId: NodeId, node: NodeType) => string;
}

interface AddNode {
  (nodeId: NodeId): void;
}

interface ActivateNode {
  (nodes: NodeId): void;
}

interface NodeState {
  activated: {
    partial: boolean;
    exact: boolean;
  };
}

interface RenderNode<NodeType extends TreeNode<NodeType>> {
  (nodeId: NodeId, node: NodeType, state: NodeState): JSX.Element;
}

interface Props<NodeType extends TreeNode<NodeType>> {
  root: NodeType;

  classes?: Classes<NodeType>;

  canAdd?: boolean;

  renderNode?: RenderNode<NodeType>;

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

function isNode(node: NodeId, path: NodeId): boolean {
  if (node.length !== path.length) {
    return false;
  }

  return isPartOfNode(node, path);
}

export function Tree<NodeType extends TreeNode<NodeType>>({
  root,
  canAdd,
  classes,
  addNode,
  renderNode,
}: Props<NodeType>): JSX.Element {
  const addFn: AddNode = useMemo(() => {
    return addNode ?? (() => {});
  }, [addNode]);

  const renderFn: RenderNode<NodeType> = useMemo(() => {
    return renderNode ?? (() => <></>);
  }, [renderNode]);

  /** TODO: Move out of component. */
  const [activatedNode, setActivatedNode] = useState<NodeId | null>(null);

  const activateFn: ActivateNode = useMemo(() => {
    return (nodeIds) => {
      setActivatedNode(nodeIds);
    };
  }, [setActivatedNode]);

  return (
    <div className={styles.tree}>
      <TreeNode
        classes={classes}
        node={root}
        nodeId={[{ position: 0 }]}
        activatedNode={activatedNode}
        canAdd={Boolean(canAdd)}
        onAdd={addFn}
        onActivate={activateFn}
        render={renderFn}
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
  onAdd: AddNode;
  onActivate: ActivateNode;

  classes?: Classes<NodeType>;
}

function TreeNode<NodeType extends TreeNode<NodeType>>({
  node,
  nodeId,
  ...passedDownProps
}: TreeNodeProps<NodeType>): JSX.Element {
  let partiallyActivated = false,
    exactActivated = false;

  if (passedDownProps.activatedNode) {
    partiallyActivated = isPartOfNode(nodeId, passedDownProps.activatedNode);

    exactActivated = isNode(nodeId, passedDownProps.activatedNode);
  }

  const renderedContent = passedDownProps.render(nodeId, node, {
    activated: { partial: partiallyActivated, exact: exactActivated },
  });

  return (
    <div className={styles.nodeContainer}>
      <button
        className={clsx(
          styles.node,
          passedDownProps.classes?.node(nodeId, node),
          {
            [styles.nodeActivated]: partiallyActivated,
            [styles.nodeExact]: exactActivated,
          },
        )}
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
