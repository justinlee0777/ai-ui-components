/*
 * \$\{[a-zA-Z0-9]+(?:\:(.+))?\}
 * ex. "You are a fitness and nutrition coach.

    I want to lose weight ${endingDate}.
    I have the following health circumstances:
    ${healthCircumstances:array}
    I have the follow dietary restrictions:
    ${dietaryRestrictions:array}"
 */

import styles from './form-chatbot.module.css';

import { useMemo, useRef, useState } from 'react';

import { FormItem, FormItemType } from './inputs/FormItem';

export { FormItemType };

interface ArrayConfig {
  transform: (value: Array<string>) => string;
  type: FormItemType.ARRAY;
}

interface StringConfig {
  transform: (value: string) => string;
  type: FormItemType.STRING;
}

type Config = ArrayConfig | StringConfig;

interface Props {
  promptTemplate: string;

  tokenConfig: {
    [propertyName: string]: Config;
  };

  loading?: boolean;
  onChange?: (prompt: string) => void;
}

// Need to add a "Is that all?" step
export function FormChatbot({ promptTemplate, tokenConfig, onChange }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  const [generatedPrompt, setGeneratedPrompt] = useState('');

  const templateRegex = /\${([^:]+?(:.+)?)}/g;

  const formInputs = useMemo(
    () =>
      [...promptTemplate.matchAll(templateRegex)].map(([, prop]) => {
        return (
          <FormItem key={prop} propName={prop} type={tokenConfig[prop].type} />
        );
      }),
    [promptTemplate, tokenConfig],
  );

  return (
    <>
      <form
        ref={formRef}
        className={styles.promptTemplateForm}
        onChange={(event) => {
          event.preventDefault();

          if (formRef.current) {
            const formData = new FormData(formRef.current);

            const parsedObject = [...formData.entries()].reduce(
              (acc, [inputName, value]) => {
                const [propName, index] = inputName.split('.');

                if (index) {
                  const existingArray = acc[propName] as
                    | Array<string>
                    | undefined;

                  if (existingArray) {
                    return {
                      ...acc,
                      [propName]: existingArray.concat(value as string),
                    };
                  } else {
                    return {
                      ...acc,
                      [propName]: [value as string],
                    };
                  }
                } else {
                  return {
                    ...acc,
                    [propName]: value as string,
                  };
                }
              },
              {} as {
                [propName: string]: string | Array<string>;
              },
            );

            let finalPrompt = promptTemplate;

            [...Object.entries(parsedObject)].forEach(([propName, value]) => {
              finalPrompt = finalPrompt.replace(
                new RegExp(`\\\${${propName}(?::.+)?}`),
                tokenConfig[propName].transform(value as unknown as any),
              );
            });

            setGeneratedPrompt(finalPrompt);
            onChange?.(finalPrompt);
          }
        }}
      >
        {formInputs}
      </form>
      {generatedPrompt && (
        <p className={styles.generatedPrompt}>{generatedPrompt}</p>
      )}
    </>
  );
}
