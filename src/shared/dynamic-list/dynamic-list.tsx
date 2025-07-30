import styles from './dynamic-list.module.css';

import { ReactNode } from 'react';

interface Props<Element> {
  items: Array<Element>;
  Template: (props: { element: Element; index: number }) => ReactNode;

  onAddItem?: () => void;
  onDeleteItem?: (index: number) => void;
}

export function DynamicList<Element>({
  items,
  Template,
  onAddItem,
  onDeleteItem,
}: Props<Element>) {
  return (
    <div className={styles.dynamicList}>
      {items.map((element, i) => {
        return (
          <div key={i} className={styles.dynamicListRow}>
            <Template element={element} index={i} />
            <button type="button" onClick={() => onDeleteItem?.(i)}>
              x
            </button>
          </div>
        );
      })}
      <button type="button" onClick={onAddItem}>
        +
      </button>
    </div>
  );
}
