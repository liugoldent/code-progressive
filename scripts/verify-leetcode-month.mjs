// Run with Node.js >= 18 and Python >= 3.9. Uses the installed TypeScript compiler.
// Extract the actual Markdown code so checks cannot silently drift from the notes.
import { readFile, writeFile, mkdir, mkdtemp, readdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const require = createRequire(import.meta.url);
const index = await readFile(join(root, 'docs/career-blueprint/06-leetcode-month-01.md'), 'utf8');
const paths = [...new Set([...index.matchAll(/\]\(\/(docs\/algorithms\/leetcode\/[^)]+)\)/g)].map(m => `${m[1]}.md`))];
const existing = new Set([1, 217, 242]);
const workspace = await mkdtemp(join(tmpdir(), 'leetcode-month-'));
const sources = [];
let checks = 0;

function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 });
  if (result.status !== 0) throw new Error(`${command} ${args.join(' ')}\n${result.error ?? ''}${result.stdout ?? ''}${result.stderr ?? ''}`);
  return result.stdout.trim();
}
function blocks(text, language) {
  return [...text.matchAll(new RegExp('```' + language + '\\n([\\s\\S]*?)```', 'g'))].map(m => m[1].trim());
}
function part(text, from, to) {
  const start = text.indexOf(from), end = to ? text.indexOf(to, start + from.length) : text.length;
  if (start < 0 || end < 0) throw new Error(`Missing section: ${from} / ${to}`);
  return text.slice(start, end);
}
let seed = 94721;
function random(max) { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed % max; }
function randomArgs(id) {
  const length = random(9) + 1;
  const array = Array.from({ length }, () => random(9) - 4);
  const text = Array.from({ length }, () => 'ABC'[random(3)]).join('');
  switch (id) {
    case 3: return [text];
    case 11: return [Array.from({ length: length + 1 }, () => random(10))];
    case 15: return [[...array, 0, 0]];
    case 36: {
      const board = Array.from({ length: 9 }, () => Array(9).fill('.'));
      for (let i = 0; i < 12; i++) board[random(9)][random(9)] = String(random(9) + 1);
      return [board];
    }
    case 42: return [array.map(Math.abs)];
    case 49: return [Array.from({ length }, () => Array.from({ length: random(6) }, () => 'abc'[random(3)]).join(''))];
    case 121: return [array.map(Math.abs)];
    case 125: return [Array.from({ length }, () => 'aA12 ,!b'[random(8)]).join('')];
    case 128: return [array];
    case 167: {
      const numbers = [...new Set(array)].sort((a, b) => a - b);
      if (numbers.length < 2) return [[0, 1], 1];
      // Sum of the two smallest distinct values is a unique pair.
      return [numbers, numbers[0] + numbers[1]];
    }
    case 238: return [[...array, 1]];
    case 347: {
      const counts = new Map();
      for (const x of array) counts.set(x, (counts.get(x) ?? 0) + 1);
      const ordered = [...counts.values()].sort((a, b) => b - a);
      const validK = ordered.flatMap((c, i) => i === ordered.length - 1 || c > ordered[i + 1] ? [i + 1] : []);
      return [array, validK[random(validK.length)]];
    }
    case 424: return [text, random(length + 1)];
    default: throw new Error(`Unknown problem ${id}`);
  }
}
function largeCase(id) {
  switch (id) {
    case 3: return [[Array.from({ length: 100000 }, (_, i) => String.fromCharCode(32 + i % 95)).join('')], 95];
    case 11: return [[Array(100000).fill(1)], 99999];
    case 15: return [[Array(3000).fill(0)], [[0, 0, 0]]];
    case 42: return [[[1, ...Array(19998).fill(0), 1]], 19998];
    case 49: return [[Array(10000).fill('a')], [Array(10000).fill('a')]];
    case 121: return [[Array(100000).fill(1)], 0];
    case 125: return [['a'.repeat(200000)], true];
    case 128: return [[Array.from({ length: 100000 }, (_, i) => i)], 100000];
    case 167: return [[[...Array(29998).fill(-1000), 0, 1], 1], [29999, 30000]];
    case 238: return [[Array(100000).fill(1)], Array(100000).fill(1)];
    case 347: return [[Array(100000).fill(1), 1], [1]];
    case 424: return [['AB'.repeat(50000), 0], 1];
    default: return null;
  }
}

try {
  await mkdir(join(workspace, 'compiled'));
  for (const path of paths) {
    const id = Number(path.match(/\/l(\d+)/)[1]);
    if (existing.has(id)) continue;
    const text = await readFile(join(root, path), 'utf8');
    const stageB = part(text, '## Stage B', '## Stage C');
    const brute = part(stageB, '### 2.', '### 3.');
    const implementation = stageB.match(/^### \d+\. 完整實作\n[\s\S]*?(?=^### |$(?![\s\S]))/m)?.[0];
    if (!implementation) throw new Error(`Missing implementation section: ${path}`);
    const testSection = part(stageB, '### 13.');
    const ts = [blocks(brute, 'ts')[0], blocks(implementation, 'ts')[0], blocks(testSection, 'ts')[0]];
    const py = [blocks(brute, 'python')[0], blocks(implementation, 'python')[0], blocks(testSection, 'python')[0]];
    if ([...ts, ...py].some(x => !x)) throw new Error(`Missing bilingual code: ${path}`);
    const fn = ts[1].match(/function (\w+)/)[1], pyfn = py[1].match(/def (\w+)/)[1];
    const tuple = ts[2].match(/args: (.*?); expected:/)[1];
    const generated = Array.from({ length: 100 }, () => randomArgs(id));
    const big = largeCase(id);
    ts.push(`const generated: (${tuple})[] = ${JSON.stringify(generated)};
for (const args of generated) {
  const before = JSON.stringify(args);
  const expected = ${fn}Brute(...args);
  const actual = ${fn}(...args);
  if (normalize(actual) !== normalize(expected) || JSON.stringify(args) !== before) throw new Error('Differential failure: ' + JSON.stringify(args));
}
${big ? `const largeArgs: ${tuple} = ${JSON.stringify(big[0])};
if (normalize(${fn}(...largeArgs)) !== normalize(${JSON.stringify(big[1])})) throw new Error('Large input failure');` : ''}`);
    py.push(`generated = json.loads(r'''${JSON.stringify(generated)}''')
for args in generated:
    before = copy.deepcopy(args)
    expected = ${pyfn}_brute(*args)
    actual = ${pyfn}(*args)
    assert normalize(actual) == normalize(expected), (args, actual, expected)
    assert args == before
${big ? `large = json.loads(r'''${JSON.stringify(big)}''')
assert normalize(${pyfn}(*large[0])) == normalize(large[1])` : ''}`);
    // Typecheck engineering examples together with the exact functions they reuse.
    ts.push(...blocks(part(text, '## Stage C'), 'ts'));
    ts.push('export {};');
    const tsPath = join(workspace, `p${id}.ts`), pyPath = join(workspace, `p${id}.py`);
    await writeFile(tsPath, ts.join('\n\n'));
    await writeFile(pyPath, py.join('\n\n'));
    sources.push(tsPath);
    console.log(`Python ${run(process.env.LEETCODE_PYTHON || 'python3', [pyPath])}; +100 differential${big ? ' +maximum-length' : ''}`);
    checks++;
  }
  // Day 2 is also linked in this month's review: validate its migrated standalone tests.
  const anagramPath = paths.find(p => /l0242-/.test(p));
  const anagram = await readFile(join(root, anagramPath), 'utf8');
  const tests = part(anagram, '### 10. 可執行測試', '### 11. 複雜度分析');
  const tsPath = join(workspace, 'p242.ts'), pyPath = join(workspace, 'p242.py');
  await writeFile(tsPath, blocks(tests, 'ts')[0] + '\nexport {};\n');
  await writeFile(pyPath, blocks(tests, 'python')[0]);
  sources.push(tsPath);
  console.log(`Python ${run(process.env.LEETCODE_PYTHON || 'python3', [pyPath])}`);
  let compiler;
  try { compiler = require.resolve('typescript/lib/tsc.js'); }
  catch {
    const packages = await readdir(join(root, 'node_modules/.pnpm'));
    const packageName = packages.find(p => /^typescript@/.test(p));
    if (!packageName) throw new Error('Install the project dependencies, including TypeScript, first.');
    compiler = join(root, 'node_modules/.pnpm', packageName, 'node_modules/typescript/lib/tsc.js');
  }
  run(process.execPath, [compiler, '--strict', '--target', 'ES2020', '--module', 'commonjs', '--skipLibCheck', '--outDir', join(workspace, 'compiled'), ...sources]);
  for (const path of sources) {
    const file = path.split('/').at(-1).replace(/\.ts$/, '.js');
    console.log(`TypeScript ${run(process.execPath, [join(workspace, 'compiled', file)])}`);
  }
  if (checks !== 13) throw new Error(`Expected 13 future notes, found ${checks}`);
  console.log('Verified 13 future notes + migrated 242: strict TypeScript, Python, official/edge cases, 100 differential cases per future note, and maximum-length inputs.');
} finally {
  if (process.env.KEEP_LEETCODE_CHECKS) console.log(`Check files: ${workspace}`);
  else await rm(workspace, { recursive: true, force: true });
}
