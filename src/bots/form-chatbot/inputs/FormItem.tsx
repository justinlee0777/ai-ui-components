import startCase from 'lodash-es/startCase';
import { useMemo, useState } from 'react';
import { DynamicList } from '../../../shared/dynamic-list/dynamic-list';

export enum FormItemType {
  STRING = 'string',
  ARRAY = 'array',
}

interface FormItemProp {
  propName: string;
  type: FormItemType;
}

export function FormItem({ propName, type }: FormItemProp) {
  const propInputId = `${propName}-input`;

  switch (type) {
    case FormItemType.STRING:
      return (
        <>
          <label htmlFor={propInputId}>{startCase(propName)}</label>
          <input id={propInputId} name={propName} type="text" />
        </>
      );
    case FormItemType.ARRAY:
      return (
        <>
          <FormArray propName={propName} />
        </>
      );
  }
}

interface FormArrayProps {
  propName: string;
}

function FormArray({ propName }: FormArrayProps) {
  const [items, setItems] = useState<Array<string>>(['']);

  const onAddItem = useMemo(
    () => () => setItems((prev) => prev.concat('')),
    [setItems],
  );

  const onDeleteItem = useMemo(
    () => (index: number) =>
      setItems((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)]),
    [setItems],
  );

  const Template = useMemo(
    () => (props: { element: string; index: number }) => (
      <PromptTemplateArrayInput
        propName={propName}
        onChange={(value) => {
          setItems((prev) => [
            ...prev.slice(0, props.index),
            value,
            ...prev.slice(props.index + 1),
          ]);
        }}
        {...props}
      />
    ),
    [propName, setItems],
  );

  return (
    <>
      <label>{startCase(propName)}</label>
      <DynamicList<string>
        items={items}
        onAddItem={onAddItem}
        onDeleteItem={onDeleteItem}
        Template={Template}
      />
    </>
  );
}

interface PromptTemplateArrayInputProps {
  propName: string;
  index: number;
  element: string;
  onChange?: (value: string) => void;
}

function PromptTemplateArrayInput({
  propName,
  index,
  element,
  onChange,
}: PromptTemplateArrayInputProps) {
  const [value, setValue] = useState(element);

  const itemInputId = `${propName}-${index}`;

  return (
    <>
      <input
        id={itemInputId}
        name={`${propName}.${index}`}
        type="text"
        value={value}
        onChange={(event) => {
          const { value } = event.target;
          setValue(event.target.value);
          onChange?.(value);
        }}
      />
    </>
  );
}
