import { JSX, useState } from 'react';
import {
  FormChatbot,
  FormItemType,
} from '../src/bots/form-chatbot/form-chatbot';
import ReactDOM from 'react-dom/client';

const fitnessPromptTemplate = `
    You are a fitness and nutrition coach.

    I want to lose weight \${endingDate}.
    \${healthCircumstances}
    \${dietaryRestrictions}

    Please give me a dietary and exercise plan.
`;

const root = ReactDOM.createRoot(document.body);

function App(): JSX.Element {
  const [prompt, setPrompt] = useState(() => {
    const finalPrompt = fitnessPromptTemplate;

    return fitnessPromptTemplate.replaceAll(/\$\{.+?\}/g, '__');
  });

  return (
    <>
      <FormChatbot
        promptTemplate={fitnessPromptTemplate}
        onChange={setPrompt}
        tokenConfig={{
          endingDate: {
            transform: (value) => value,
            type: FormItemType.STRING,
          },
          healthCircumstances: {
            transform: (value) => {
              value = value.filter(Boolean);
              if (value.length > 0) {
                return `I have the following health circumstances:\n${value.map((str) => `- ${str}`).join('\n')}`;
              } else {
                return '';
              }
            },
            type: FormItemType.ARRAY,
          },
          dietaryRestrictions: {
            transform: (value) => {
              value = value.filter(Boolean);
              if (value.length > 0) {
                return `I have the follow dietary restrictions:\n${value.map((str) => `- ${str}`).join('\n')}`;
              } else {
                return '';
              }
            },
            type: FormItemType.ARRAY,
          },
        }}
      />
    </>
  );
}

root.render(<App />);
