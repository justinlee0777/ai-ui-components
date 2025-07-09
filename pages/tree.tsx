import ReactDOM from 'react-dom/client';

import { type NodeId, Tree, type TreeNode } from '../src/shared/Tree';
import clsx from 'clsx';
import { useMemo, useState, type JSX } from 'react';
import { Tooltip } from 'react-tooltip';

interface CustomTreeNode extends TreeNode<CustomTreeNode> {
  label: string;

  text?: string;
  imageUrl?: string;
}

const treeNode: CustomTreeNode = {
  label: 'Who am I?',
  text: 'I am Justin Lee. I am very surprised by things.',
  imageUrl: '/portrait.jpg',
  children: [
    {
      label: 'What my career\nlooks like',
      children: [
        {
          label: 'College (2012-2016)',
          text: 'From 2012 to 2016 I attended Rensselaer Polytechnic Institute.\nI received a Dual Bachelors Degree in Psychology and Computer Science.',
          children: [
            {
              label: 'Unbound Commerce (2016-2017)',
              text: `After college, I was fortunate to find a software engineering job at Unbound Commerce.\nI began by debugging iPhone applications.`,
              children: [
                {
                  label: 'Verify.Ninja',
                  text: `I then built the Java Spring server and AngularJS dashboard for a very short-lived e-cigarette verification solution called Verify.Ninja.`,
                },
                {
                  label: 'Apptive',
                  text: `I then moved onto revamping the dashboard for Unbound's e-commerce solutions for quite small Shopify merchants, which helped merchants customize flash sales and notifications.`,
                },
                {
                  label: 'Acqui-hired',
                  text: `The engineering team for Unbound was "acqui-hired" for a greenfield project in SAP.`,
                  children: [
                    {
                      label: 'SAP (2017-2023)',
                      text: `The Unbound engineers were tasked with building an all-new e-commerce solution for SAP designed for small-to-mid-sized businesses (SAP Upscale). Basically making SAP, traditionally an enterprise solutions provider, "cool", "hip" and "start-uppy".`,
                      children: [
                        {
                          label: 'Merchant dashboard',
                          text: `We began with building a merchant dashboard that fulfilled several responsibilities: 1) handling a merchant's product and inventory, 2) configuring the look-and-feel for a merchant's iOS and Android apps, and 3) handling the deployment of the merchant's digital apps via the Apple store or Android marketplace.`,
                        },
                        {
                          label: 'Progressive web app',
                          text: 'We quickly found clients wanted an mobile and desktop storefront all-in-one, so we began building a Progressive Web App that was meant for mobile, fast, and supported all the nice stuff merchants wanted (carousels, autoplay videos) and all the practical stuff they needed (payment integrations, BOPIS).',
                        },
                        {
                          label: 'Scrum master',
                          text: 'In 2021 I underwent training to be a Scrum Master and took over some of the leadership duties in the team. I mentored developers, coordinated calls across different teams, and made profound decisions as to the design and architecture of the code.',
                        },
                        {
                          label: 'SAP Spartacus (2022)',
                          text: `Good times don't last forever. There was leadership shake-up in SAP, and Upscale was axed in favor of backing the legacy SAP Commerce Cloud and SAP Spartacus, the storefront over Commerce Cloud. All I remember from this time is being in constant discussions to unblock my team's development. Real toothache stuff.`,
                        },
                        {
                          label: 'Layoff (2023)',
                          text: `My team was affected in a large round of layoffs targeting North America. Separated by the Pandemic, we reunited in Boston, had a round of drinks and then departed.`,
                          children: [
                            {
                              label: 'Gap (2023)',
                              text: 'During my gap, I developed this website you see here (with Next.js) as a landing page for all the weird apps I conceived and will conceive; I also began work on prospero, a package to render text on the web as a book.',
                              children: [
                                {
                                  label: 'Distro (2023 - 2024)',
                                  text: 'Seeing I had quite a bit of knowledge on how to build apps and manage projects at this point, it felt logical to move into a startup to see what I could do.',
                                  children: [
                                    {
                                      label: 'HVAC quoting automation',
                                      text: `The first product in Distro I worked on was a process to automate the generation of a quote in the HVAC industry. Basically, contractors had complex specs for a fridge they needed. They submitted the specs, we would take them and find the products that most matched those specs and pass them onto a distributor. The distributor would then send the contractor a quote.`,
                                    },
                                    {
                                      label: 'Embeddable chatbot',
                                      text: `The second product I worked on was a chatbot that could be embedded into a manufacturer's website. The idea was to warn contractors of future environment regulations. We fed the bot with information (webpages, PDFs, spreadsheets, etc) we scraped from thousands of websites.`,
                                    },
                                    {
                                      label: 'Gap (2024 -)',
                                      text: 'I was let go from Distro. From here, I perfected the underlying engine for prospero, built an Elden Ring chatbot, started an HTML museum ... and other stuff.',
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      label: 'What my life\nlooks like',
      children: [
        {
          label: 'Literature',
          text: `Ever since I was a kid I was fascinated by reading and writing. I spent a good deal of my childhood reading classical literature (I'm not sure how I did it either) and I still write fiction as a hobby.`,
        },
        {
          label: 'Music',
          text: `I'm a big lover of music. I began listening to Radiohead at the end of high school, got really into punk music when I was in college, and now I'm more mellowed out and dig jazz and classical music.`,
        },
        {
          label: 'Art',
          text: `I'm a huge art aficionado. I used to go to the Museum of Fine Arts in Boston every weekend; I do the same now for the Metropolitan Museum of Art.`,
        },
        {
          label: 'Blogging',
          text: `In 2021 I started a blog, built initially with Gatsby.js and then Next.js, for my own musings on film and music, culminating in writing about one song a week in 2024. My pace has slowed down considerably since then, but I'd love to do it again.`,
        },
      ],
    },
    {
      label: 'Who I think\nI really am',
      children: [
        {
          label: 'Curiosity',
          text: `I like to think of myself as a curious person. When it comes down to it, I just don't know enough about the world. I like to question the reality I perceive and my ability to perceive it - which is why I'm always going on tangents.`,
        },
        {
          label: 'Ambitious',
          text: `It took me a while to realize I'm a very ambitious guy. I remember being obsessed with learning things and settings goals during my time in SAP, and when it comes to creativity I like to outdo myself and start and finish great projects.`,
        },
        {
          label: 'Modest',
          text: `Calling oneself ambitious and modest is a bit of a cliche, but it's true: I'm not the type of guy who thinks a lot about what I've done, but what it is I want to do. There's just a point where actions speak louder than words, and I am more what people say about me than what I can say about myself.`,
        },
        {
          label: 'Consistent',
          text: '',
        },
      ],
    },
    {
      label: 'Where I want\nto go',
      children: [
        {
          label: 'Books',
          text: `I'd like to write a number of books (I've already published a few under a pseudonym). I think I'm in the right place in the right mind to accomplish certain things.`,
        },
        {
          label: 'Videogame',
          text: `I'd like to develop a videogame from scratch one day. Something that can render on mobile and desktop, and something that invites curiosity, rather than the typical victory conditions of a game.`,
        },
        {
          label: 'Career',
          text: `The tech industry is a very different place from when I started. There used to be a belief that great teams make great products, and that great gains come from great ambition. Now there is only the belief that great products require a great amount of money, and that great gains come from a great many investors. I want to develop great teams and build products with great ambitions, but, alas, this is what the cards have dealt me.`,
        },
        {
          label: 'Graduate school',
          text: `Now seems to be as good a time as any to return to school, not for the sake of my career but for the sake of my curiosity. I know the most about myself compared to any other point in my life: I know what I can do under pressure, I know what I'm not interested in, I know my personality, and I know how I want to express myself. I just don't know what the future will look like.`,
        },
      ],
    },
  ],
};

const root = ReactDOM.createRoot(document.body);

function App(): JSX.Element {
  const [activatedNode, setActivatedNode] = useState<NodeId | undefined>();

  const tooltipId = useMemo(() => `node-tooltip`, []);

  return (
    <>
      <Tree
        root={treeNode}
        classes={{
          node: (nodeId, node) =>
            clsx('customTreeNode', {
              customRootNode: nodeId.length === 1,
              customTitleNode: !Boolean(node.text),
            }),
        }}
        activatedNode={activatedNode}
        renderNode={(path, node, { activated: { partial, exact } }) => {
          const treeDepth = path.length,
            deepIntoTree = path.length > 3,
            immediateChild =
              activatedNode?.every(
                (node, i) => node.position === path.at(i)?.position,
              ) && activatedNode.length + 1 === treeDepth;

          if (exact) {
            return (
              <>
                <p>{node.text}</p>
                {node.imageUrl && <img src={node.imageUrl} />}
              </>
            );
          } else if (deepIntoTree && !(partial || immediateChild)) {
            return (
              <div
                data-tooltip-id={tooltipId}
                data-tooltip-content={node.label}
                style={{ width: '1em', height: '1em' }}
              ></div>
            );
          } else {
            return <label className="nodeLabel">{node.label}</label>;
          }
        }}
        activateNode={(nodeId, node) => {
          if (node.text) {
            setActivatedNode(nodeId);
          }
        }}
      />
      <Tooltip
        id={tooltipId}
        place="right"
        style={{ backgroundColor: '#0f0f0f' }}
      />
    </>
  );
}

root.render(<App />);
