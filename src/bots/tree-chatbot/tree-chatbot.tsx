import styles from './tree-chatbot.module.css';

import { JSX, useEffect, useMemo, useState } from 'react';
import { MdAdd, MdArrowUpward, MdClose } from 'react-icons/md';
import cloneDeep from 'lodash-es/cloneDeep';

import { NodeId, Tree, TreeNode } from '../../shared/Tree';
import clsx from 'clsx';

enum MessageTreeNodeState {
  ADD = 'ADD',
  OPEN_CHAT = 'OPEN_CHAT',
}

export interface MessageTreeNode extends TreeNode<MessageTreeNode> {
  message?: {
    query: string;
    answer: string;
  };

  /** Internal only. */
  state?: MessageTreeNodeState;
}

type AppearanceType = 'full' | 'query-only';

interface Props {
  appearance: AppearanceType;

  root?: MessageTreeNode;

  expandMessageNode?: (node: MessageTreeNode) => void;

  sendMessage?: (
    nodes: Array<MessageTreeNode>,
    input: string,
    nodeId: NodeId,
  ) => void | Promise<void>;
}

export function TreeChatbot({
  appearance,
  root,
  expandMessageNode,
  sendMessage,
}: Props): JSX.Element {
  const createTrueRoot = useMemo(
    () => (proposedRoot: MessageTreeNode | undefined) => {
      const topLevel = [proposedRoot].filter(Boolean) as Array<MessageTreeNode>;

      let treeNodes = [...topLevel];

      // Ensure every node has one ADD node as a child
      while (treeNodes.length > 0) {
        const treeNode = treeNodes.shift()!;

        treeNode.children ||= [];

        treeNodes = treeNodes.concat(
          treeNode.children.filter(
            (node) => node.state !== MessageTreeNodeState.ADD,
          ),
        );

        if (
          !treeNode.children.some(
            (node) => node.state === MessageTreeNodeState.ADD,
          )
        ) {
          treeNode.children = treeNode.children.concat({
            state: MessageTreeNodeState.ADD,
          });
        }
      }

      return {
        children: topLevel,
      };
    },
    [],
  );

  const [trueRoot, setTrueRoot] = useState<MessageTreeNode>(() =>
    createTrueRoot(root),
  );

  const forceTreeUpdate = useMemo(
    () => () => {
      setTrueRoot(cloneDeep(trueRoot));
    },
    [setTrueRoot, trueRoot],
  );

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setTrueRoot(() => createTrueRoot(root));
  }, [root]);

  return (
    <Tree<MessageTreeNode>
      root={trueRoot}
      classes={{
        node: (_, node) => {
          return clsx(styles.chatNode, {
            [styles.chatFormNode]:
              node.state === MessageTreeNodeState.OPEN_CHAT,
            [styles.addNode]: node.state === MessageTreeNodeState.ADD,
            [styles.disabled]: submitting,
          });
        },
      }}
      addNode={(nodeId) => {
        let nodes = [trueRoot];
        const positionToAdd = nodeId.pop()!;

        while (nodeId.length > 0) {
          const { position } = nodeId.shift()!;

          nodes = nodes![position].children! ||= [];
        }

        nodes.splice(positionToAdd.position, 0, {
          state: MessageTreeNodeState.OPEN_CHAT,
        });

        forceTreeUpdate();
      }}
      activateNode={(_, node) => {
        if (submitting) {
          return;
        }
        if (node.state === MessageTreeNodeState.ADD) {
          node.state = MessageTreeNodeState.OPEN_CHAT;

          forceTreeUpdate();
        } else if (!node.state) {
          expandMessageNode?.(node);
        }
      }}
      renderNode={(nodeId, node) => {
        if (node.state === MessageTreeNodeState.ADD) {
          return <MdAdd className={styles.addNodeText} />;
        } else if (node.state === MessageTreeNodeState.OPEN_CHAT) {
          console.log('open_chat', nodeId);
          return (
            <form
              className={styles.chatForm}
              onSubmit={async (event) => {
                event.preventDefault();

                let relevantNodes: Array<MessageTreeNode> = [],
                  nodes: Array<MessageTreeNode> = [trueRoot];

                while (nodeId.length > 0) {
                  const { position } = nodeId.shift()!;

                  const currentNode = nodes![position];

                  nodes = currentNode.children!;

                  relevantNodes.push(currentNode);
                }

                const input = new FormData(event.target as HTMLFormElement).get(
                  'input',
                ) as string;

                try {
                  setSubmitting(true);

                  await sendMessage?.(
                    relevantNodes.slice(1, -1),
                    input,
                    nodeId.slice(1, -1),
                  );
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              <textarea name="input" rows={2} />
              <button
                className={styles.submitChatForm}
                type="submit"
                disabled={submitting}
              >
                <MdArrowUpward />
              </button>
              <button
                className={styles.closeChatForm}
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  node.state = MessageTreeNodeState.ADD;

                  forceTreeUpdate();
                }}
              >
                <MdClose />
              </button>
            </form>
          );
        } else if (node.message) {
          return (
            <div
              className={clsx(styles.answeredNode, {
                [styles.queryOnly]: appearance === 'query-only',
              })}
            >
              <p className={styles.chatNodeQuery}>{node.message.query}</p>
              {appearance === 'full' && <p>{node.message.answer}</p>}
            </div>
          );
        } else {
          return <></>;
        }
      }}
    />
  );
}
