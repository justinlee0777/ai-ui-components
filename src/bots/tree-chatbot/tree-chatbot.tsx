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
    () => (proposedRoot: MessageTreeNode) => {
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

      return proposedRoot;
    },
    [],
  );

  const [trueRoot, setTrueRoot] = useState<MessageTreeNode | undefined>(() => {
    if (root) {
      return createTrueRoot(root);
    }
  });

  const forceTreeUpdate = useMemo(
    () => () => {
      setTrueRoot(cloneDeep(trueRoot));
    },
    [setTrueRoot, trueRoot],
  );

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setTrueRoot(() => {
      if (root) {
        return createTrueRoot(root);
      }
    });
  }, [root]);

  if (!trueRoot) {
    return (
      <ChatForm
        nodeId={[]}
        node={{}}
        trueRoot={{}}
        setSubmitting={setSubmitting}
        submitting={submitting}
        sendMessage={sendMessage}
        forceTreeUpdate={forceTreeUpdate}
      />
    );
  } else {
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
            return (
              <ChatForm
                trueRoot={trueRoot}
                node={node}
                nodeId={nodeId}
                setSubmitting={setSubmitting}
                submitting={submitting}
                sendMessage={sendMessage}
                forceTreeUpdate={forceTreeUpdate}
              />
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
}

interface ChatFormProps {
  trueRoot: MessageTreeNode;

  setSubmitting: (state: boolean) => void;

  sendMessage?: (
    nodes: Array<MessageTreeNode>,
    input: string,
    nodeId: NodeId,
  ) => void;

  forceTreeUpdate: () => void;

  nodeId: NodeId;
  node: MessageTreeNode;

  submitting: boolean;
}

function ChatForm({
  trueRoot,
  nodeId,
  setSubmitting,
  sendMessage,
  forceTreeUpdate,
  node,
  submitting,
}: ChatFormProps): JSX.Element {
  return (
    <form
      className={styles.chatForm}
      onSubmit={async (event) => {
        event.preventDefault();

        let relevantNodes: Array<MessageTreeNode> = [],
          nodes: Array<MessageTreeNode> = [trueRoot];

        nodeId.forEach(({ position }) => {
          const currentNode = nodes![position];

          nodes = currentNode.children!;

          relevantNodes.push(currentNode);
        });

        const input = new FormData(event.target as HTMLFormElement).get(
          'input',
        ) as string;

        try {
          setSubmitting(true);

          await sendMessage?.(
            relevantNodes.slice(0, -1),
            input,
            nodeId.slice(0, -1),
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
      {nodeId.length > 0 && (
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
      )}
    </form>
  );
}
