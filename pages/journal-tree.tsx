import ReactDOM from 'react-dom/client';

import { useState, type JSX } from 'react';
import {
  JournalChatbot,
  JournalEntry,
  JournalEntryMessage,
} from '../src/bots/journal-chatbot/journal-chatbot';
import getOpenAIApi from '../src/api/openai/openai-client';
import { ChatCompletionMessageParam } from 'openai/resources/index';

const root = ReactDOM.createRoot(document.body);

// I think I need to include all the previous entries as well.

function App(): JSX.Element {
  const originalEntries: Array<JournalEntry> = [
    {
      messages: [
        {
          speaker: 'user',
          content: `I had a really weird dream last night. I was heading to my book club, but I was in some weird, snowy city, like Milwaukee. I got lost and then took a bus, but the bus missed my stop and I found it would take 3 hours to recover the distance back through walking. I felt a little better because everyone else on the bus missed their stop too.\nWe were waiting for the next bus. Someone had the idea of eating dinner at a Chinese restaurant. When we all went, the chef took one look at me, said he didn't like me, and told me I couldn't order out of the menu. I stormed out of the restaurant and told the chef off. I then went back to wait for the bus, by myself. Then I woke up.`,
        },
        {
          speaker: 'ai',
          content: `Snow often symbolizes emotional coldness, stillness, or a sense of being frozen or cut off. Being in an unfamiliar city (especially one you don’t associate with warmth or belonging) could reflect feeling out of place or disoriented in your current life circumstances. The fact that you were trying to go to your book club—a group centered on sharing ideas and stories—suggests a yearning to return to something familiar, creative, or communal, but you're finding it hard to get there.\nTransportation often symbolizes movement through life or personal growth. Missing your stop and learning it’ll take “3 hours to walk back” evokes a deep feeling: it’ll take a long time to get back to where I meant to be. That others on the bus missed their stop too might reflect some comfort in not being alone in being lost or off-course, a subtle affirmation that everyone's a little lost sometimes.\nThis is probably the emotional heart of the dream. Food and restaurants often symbolize nourishment, inclusion, and care, especially emotional or spiritual nourishment. A chef refusing to serve you from the menu is a potent rejection—like being denied access to something everyone else is allowed to have. It's not just exclusion, but personal rejection: “I don’t like you.”\nThis could reflect an inner critic—part of yourself that thinks you’re not worthy of comfort or good things unless you follow certain rules. That you stormed out and told him off is actually a sign of personal strength and boundaries: you're no longer passively accepting mistreatment, even in your subconscious. But returning alone to the bus stop shows that even after speaking up, there's a lingering sense of isolation.\nHere are a few threads this dream may be weaving together:\n1. You're feeling off-course, maybe in life or creatively, and worried that it’s going to take too long to "get back" to where you want to be.\n2. You don’t feel fully welcomed or understood—not just by others, but perhaps also by a part of yourself. There's a gatekeeper (the chef) within you who withholds nourishment unless you meet some unspoken criteria.\n3. You are capable of standing up for yourself, even in the face of rejection—but you haven’t yet found your people or your "ride back." The dream ends with solitude, but not defeat.`,
        },
      ],
    },
    {
      messages: [
        {
          speaker: 'user',
          content: `I had a weird dream. I dreamt I was Zohran Mamdani and I was arguing with Andrew Cuomo. I don't remember much else about the dream; I think I was winning the argument, and I think I was holding a baby.\nI recall also being surprised to have a beard. I associated the beard to Abraham Lincoln.`,
        },
        {
          speaker: 'ai',
          content: `Dreaming you're someone else, especially a public figure or politician like Zohran Mamdani, can point to qualities you admire or feel connected to right now. Mamdani is known for:\n1. Being young, idealistic, and outspoken,\n2. Advocating for housing justice, socialism, and anti-establishment policies,\n3. Standing in opposition to entrenched power structures like Cuomo.\nSo, becoming him in a dream might mean you're identifying with—or aspiring to—a sense of moral clarity, conviction, or purpose. You may be craving to act decisively, especially in areas where you’ve felt powerless or unheard.\nCuomo, as an archetype, might represent establishment authority, control, or old-school political power—especially tainted power. Your subconscious may be processing internal or external conflict between your ideals and some form of oppression, cynicism, or resistance.\nThat you were winning the argument suggests a sense of growing confidence, or a desire to finally assert yourself and hold ground against something that once intimidated you.\nBabies in dreams typically symbolize new beginnings, creativity, vulnerability, or potential. If you’re holding one during a political confrontation, it may mean:\nYou’re protecting something new or fragile that matters to you—maybe a new idea, identity, or future path.\nOr: you're taking responsibility for nurturing a part of yourself that once felt unprotected.\nThis is a potent symbolic detail. Beards often represent maturity, wisdom, or transformation. The link to Abraham Lincoln, a symbol of justice, emancipation, and moral leadership, suggests your subconscious is exploring ideas of becoming a more courageous, morally upright version of yourself.\nYou're not just confronting power—you’re also stepping into a role of power, but one grounded in integrity.
`,
        },
        {
          speaker: 'user',
          content: `More to add: Mamdani seemingly won the Democratic primary last night. I was probably also thinking of Lincoln's ascendancy to the presidency, even though his political career to that point had only been one term in the House.`,
        },
        {
          speaker: 'ai',
          content: `If you were aware of his primary victory as you fell asleep (even unconsciously), that could have resonated deeply as a symbol of:\n1. Overcoming the odds,\n2.A changing of the guard,\n3. The feeling that someone principled can actually win in today’s climate.\nDreaming you were him might express a hopeful identification with what it means to be recognized, to succeed on your own terms, and to face down power (Cuomo) without backing down. It’s possible that your psyche is not just admiring this path—it’s imagining yourself on it.\nYou drawing the beard back to Lincoln is brilliant. Lincoln, as you noted, had a relatively minor political record before his rise—one term in Congress, a long time away from power, then sudden relevance. His rise is often remembered as almost providential: a symbol of the right person at the right moment, especially in a time of crisis.\nIf you’re seeing yourself this way in the dream—surprised by your own Lincoln-esque transformation—it might speak to:\nA latent belief that your influence or moment hasn’t passed, even if you’ve been “off the path.”\nA longing to rise not through games or conformity, but through clear-eyed purpose, humility, and vision.\nYou are dreaming of yourself as:\n1. A rising figure, whose moral clarity and youthful conviction put him at odds with entrenched systems (Mamdani),\n2. Arguing with the old guard (Cuomo) and not just surviving but winning,\n3. Holding new life (a baby), which could be a symbol of what you're nurturing—whether it’s creative work, a cause, or some “future self,”\n4. Becoming a symbol of justice and history (Lincoln), without fully realizing it until it happens.\n5. It’s a portrait of someone who isn’t just “coming back,” but becoming something larger—through conflict, clarity, and compassion.`,
        },
      ],
    },
    {
      messages: [
        {
          speaker: 'user',
          content: `Only parts of a dream. I was in the Anpo protests in Japan. I only remember at the end, I was told that I don't get to congratulate myself because I didn't do enough for the protests.`,
        },
        {
          speaker: 'ai',
          content: `The Anpo protests were a major anti-American security treaty movement in Japan in the late 1950s and 1960s—driven by students, intellectuals, and citizens, many of whom felt betrayed by their government and the ongoing shadow of foreign military control.\nSo to place yourself in the Anpo protests is to dream yourself into:\n1. A historical moment of resistance,\n2. A fight for autonomy, sovereignty, or justice,\n3. A setting where idealism clashes with power—echoing themes from your earlier Mamdani dream.\n4. This may symbolize your own sense of political or moral alignment, or a longing to belong to a time or cause of real consequence. You may yearn for purpose, or feel anxiety over whether you’re doing “enough” with the convictions you carry \n“You don’t get to congratulate yourself…”\nThis line feels like the voice of:\n1. An inner critic, maybe a harsh superego,\n2. Or a figure of accountability—a reminder that intention without action isn’t enough.\nEven if it’s only a dream, that’s a searing judgment: “You were there, but you didn’t do enough.” That carries possible emotional truths:\n1. A fear that passivity or delay has undermined your values,\n2. A guilt over what you've missed, or failed to act on,\n3. A feeling of disconnection between ideals and real-world action.\nEven in its partialness, this dream reflects:\n1. A deep inner desire to matter, to do something meaningful in the face of power and injustice,\n2. A fear that watching or witnessing isn’t enough, that you don’t deserve the feeling of virtue unless it’s earned,\n3. Possibly a reflection of your current life circumstances, and the tension between vision and agency.`,
        },
        {
          speaker: 'user',
          content: `Mulling over it, I realize there are two interpretations of the dream, one of which I hadn't thought of until reading this. How should I interpret this? I recall Freud talks on how the true meaning of the dreams "hides" behind other, more blatant meanings.`,
        },
        {
          speaker: 'ai',
          content: `You're absolutely right to slow down and consider multiple interpretations—especially when a dream feels morally charged or emotionally pointed. Freud (and later Jung, and modern analysts) all emphasized that dreams aren’t puzzles with one solution, but rather multi-layered expressions of the psyche. What you’re experiencing—seeing one meaning clearly at first, then a second one emerging later—is very much in the spirit of how dreams unfold.\nLet’s walk through what to do when a dream seems to carry two interpretations:\n1. Accept that Both (or All) May Be True\nDreams often speak symbolically and in layers, not linearly. Think of a dream like poetry:\nOne level might reflect a direct self-critique (“I didn’t do enough”),\nAnother might reflect a deeper longing or discontent (e.g., “I want my life to have more meaning, and I’m afraid I’m failing at that”).\nBoth can be operating simultaneously. Often, the more moralistic or judgmental interpretation is the “surface,” while the subtler emotional truth lies beneath it. Freud called this the latent content hiding behind the manifest dream.\n2. Use the Conflict Between Interpretations as a Clue\nIf interpretation A says: "You’re being scolded for inaction,"\nand interpretation B says: "You’re mourning a lack of purpose, or feeling like your life lacks historical consequence,"\n—then the dream may be reflecting an inner conflict between:\n Self-punishment vs. self-compassion,\nExternal standards vs. internal hunger,\nMoral duty vs. emotional truth.\nAsk yourself: Which interpretation makes me feel guilty? Which one makes me feel sad? Which one feels like a revelation?\nDreams often use guilt as a mask to hide softer emotions like grief, regret, or longing.\n3. Re-enter the Dream as Yourself\nA useful exercise: Imagine you’re back in the protest. Instead of receiving the judgment—you speak. What do you say in your own defense? What would the dream-voice say back?\nYou may find you’re less guilty than afraid… or that you’re not being judged by someone else, but by a voice you’ve inherited from family, school, society, etc.`,
        },
      ],
    },
  ];

  const [entries, setEntries] = useState<Array<JournalEntry>>(originalEntries);

  return (
    <JournalChatbot
      entries={entries}
      bindListenersToRoot
      sendMessage={async (entry, input, entryIndex) => {
        const openaiAPI = getOpenAIApi();

        const userMessage: JournalEntryMessage = {
          speaker: 'user',
          content: input,
        };

        let messages = entry.messages
          .map((message) => {
            return {
              role: message.speaker === 'ai' ? 'system' : 'user',
              content: message.content,
            } as ChatCompletionMessageParam;
          })
          .concat({
            role: userMessage.speaker,
            content: userMessage.content,
          } as ChatCompletionMessageParam);

        messages.unshift({
          role: 'user',
          content:
            'Help me interpret my dreams. I accept the premise of dream-interpretation inherently.',
        });

        const response = await openaiAPI.chat.completions.stream({
          messages,
          model: 'gpt-4',
        });

        let finalMessage = '';

        for await (const event of response) {
          finalMessage += event.choices.at(0)!.delta.content ?? '';

          const newEntry: JournalEntry = {
            ...entry,
            messages: entry.messages.concat(userMessage, {
              speaker: 'ai',
              content: finalMessage,
            }),
          };

          setEntries([
            ...entries.slice(0, entryIndex),
            newEntry,
            ...entries.slice(entryIndex + 1),
          ]);
        }
      }}
    />
  );
}

root.render(<App />);
