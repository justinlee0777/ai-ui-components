import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import postcss from 'rollup-plugin-postcss';

const dir = 'dist';
const format = 'esm';

const output = {
  dir,
  format,
};

const pkg = JSON.parse(readFileSync('./package.json', { encoding: 'utf-8' }));

const externalPackages = [...Object.keys(pkg.peerDependencies || {})];

delete pkg.devDependencies;

// Creating regexes of the packages to make sure subpaths of the
// packages are also treated as external
const external = [
  ...externalPackages.map(
    (packageName) => new RegExp(`^${packageName}(\/.*)?`),
  ),
  'react/jsx-runtime', // add explicitly for the JSX runtime
];

mkdirSync(dir);
writeFileSync(`${dir}/package.json`, JSON.stringify(pkg, null, 2));
copyFileSync('LICENSE', `${dir}/LICENSE`);

const exports = [
  'src/Chatbot.ts',
  'src/FormChatbot.ts',
  'src/JournalChatbot.ts',
  'src/Tree.ts',
  'src/TreeChatbot.ts',
];

const input = exports.reduce((acc, value) => {
  const [, entryName] = value.split(/\/|\./);

  return {
    ...acc,
    [entryName]: value,
  };
}, []);

export default [
  {
    input,
    output: {
      ...output,
      preserveModules: true,
    },
    plugins: [
      commonjs(),
      nodeResolve({
        moduleDirectories: ['node_modules'],
      }),
      typescript({
        tsconfig: 'tsconfig.prod.json',
      }),
      postcss({
        modules: {
          generateScopedName: 'ai-ui__[local]',
        },
        inject: (cssVariableName) =>
          `import styleInject from 'style-inject';\nstyleInject(${cssVariableName});`,
      }),
    ],
    external,
  },
];
