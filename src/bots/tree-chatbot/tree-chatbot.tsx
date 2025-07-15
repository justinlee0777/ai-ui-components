import styles from './tree-chatbot.module.css';

import { JSX, useEffect, useMemo, useState } from 'react';
import { MdArrowUpward } from 'react-icons/md';
import cloneDeep from 'lodash-es/cloneDeep';

import { NodeId, Tree, TreeNode } from '../../shared/Tree';
import clsx from 'clsx';

export interface MessageTreeNode extends TreeNode<MessageTreeNode> {
  message?: {
    query: string;
    answer: string;
  };

  /** Internal only. */
  openChat?: boolean;
}

interface Props {
  root?: MessageTreeNode;

  sendMessage?: (
    nodes: Array<MessageTreeNode>,
    input: string,
    nodeId: NodeId,
  ) => void;
}

export function TreeChatbot({ root, sendMessage }: Props): JSX.Element {
  const createTrueRoot = useMemo(
    () => (proposedRoot: MessageTreeNode | undefined) => {
      return {
        children: [proposedRoot].filter(Boolean) as Array<MessageTreeNode>,
      };
    },
    [],
  );

  const [trueRoot, setTrueRoot] = useState<MessageTreeNode>(() =>
    createTrueRoot(root),
  );

  useEffect(() => {
    setTrueRoot(() => createTrueRoot(root));
  }, [root]);

  return (
    <Tree<MessageTreeNode>
      root={trueRoot}
      canAdd={(_, node) => {
        const isChatNode = Boolean(node.openChat),
          isParentToChatNode = node.children?.length
            ? node.children.every((node) => Boolean(node.openChat))
            : false;

        return !(isChatNode || isParentToChatNode);
      }}
      classes={{
        node: (_, node) => {
          return clsx(styles.chatNode, {
            [styles.chatForm]: node.openChat,
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

        nodes.splice(positionToAdd.position, 0, { openChat: true });

        setTrueRoot(cloneDeep(trueRoot));
      }}
      activateNode={(_, node) => {
        if (node.openChat) {
        } else {
        }
      }}
      renderNode={(nodeId, node) => {
        if (node.openChat) {
          return (
            <form
              onSubmit={(event) => {
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

                sendMessage?.(
                  relevantNodes.slice(1, -1),
                  input,
                  nodeId.slice(1, -1),
                );
              }}
            >
              <textarea name="input" />
              <button type="submit">
                <MdArrowUpward />
              </button>
            </form>
          );
        } else if (node.message) {
          // SHOW ANSWER ON EXPANSION INSTEAD
          return (
            <div>
              <p className={styles.chatNodeQuery}>{node.message.query}</p>
              <p>{node.message.answer}</p>
            </div>
          );
        } else {
          return <></>;
        }
      }}
    />
  );
}
