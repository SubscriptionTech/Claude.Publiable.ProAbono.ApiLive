#!/usr/bin/env node
/**
 * gen-design.mjs — builds the design-token stylesheet and copies the design assets
 * of the Front2026 design system.
 *
 * Run from the website root:  node scripts/gen-design.mjs [<Front2026 root> [<DocApi root>]]
 *   (or `npm run gen-design`). The Front2026 root defaults to ../shared/Front2026,
 *   the DocApi root to ../shared/DocApi.
 *
 * Output 1: src/css/design-tokens.css — one custom property per token, built from the
 *   markdown tables of <Front2026>/tokens/ (the files listed by tokens/index.md), by
 *   the rules of tokens/generation.md. Viewport modes are mobile-first, at the
 *   breakpoints of tokens/layout.md. Colours that vary by theme hold light-dark() pairs;
 *   a gradient whose geometry varies by theme is redeclared under [data-theme='dark'].
 *   Then the DocApi code syntax tokens, from <DocApi>/functional/code-syntax.md: each
 *   aliases a Front2026 semantic colour, or holds the value of a Front2026 primitive.
 *   Then the DocApi dimension tokens, from <DocApi>/functional/dimensions.md: each varies
 *   by viewport mode, a fraction a / b being that share of the viewport width.
 * Output 2: static/img/design/ — emptied, then filled with the logos and the ICONS below.
 *
 * The script fails, naming the file and the line, on any table it cannot parse and on
 * any token it cannot resolve: it never drops a token silently. Nothing is written
 * unless every token and every asset resolves.
 *
 * Node >= 20, built-ins only.
 */
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

/** Icons copied to static/img/design/, from <Front2026>/assets/icons/icon-<name>.svg. */
const ICONS = [
  'search-01',
  'menu-09',
  'cancel-01',
  'arrow-right-01-round',
  'arrow-down-01-round',
  'arrow-left-02',
  'arrow-right-02',
  'copy-01',
  'tick-02',
  'link-01',
  'information-circle',
  'bulb',
  'alert-02',
  'alert-diamond',
  'github',
  'mouse-left-click-04',
  'status',
];

/** Logos copied to static/img/design/, from <Front2026>/assets/logos/. */
const LOGOS = ['logo-wordmark.svg', 'logo-mark.svg'];

/** Portraits copied to static/img/design/, from <Front2026>/assets/portraits/. */
const PORTRAITS = ['avatar-demo.jpg'];

const FRONT_ROOT = path.resolve(process.cwd(), process.argv[2] ?? '../shared/Front2026');
const TOKENS_DIR = path.join(FRONT_ROOT, 'tokens');
const DOCAPI_ROOT = path.resolve(process.cwd(), process.argv[3] ?? '../shared/DocApi');
const CODE_SYNTAX_FILE = 'functional/code-syntax.md';
const DOCAPI_DIMENSIONS_FILE = 'functional/dimensions.md';
const OUT_CSS = path.resolve(process.cwd(), 'src/css/design-tokens.css');
const OUT_ASSETS = path.resolve(process.cwd(), 'static/img/design');

/** The viewport modes, mobile first: the base, then one min-width query each. */
const VIEWPORT_MODES = ['mobile', 'tablet', 'desktop', 'big screen'];
const DARK_SELECTOR = "[data-theme='dark']";

// ---------------------------------------------------------------------------
// Errors and small value helpers
// ---------------------------------------------------------------------------

class GenError extends Error {}
function fail(message) {
  throw new GenError(message);
}

const lc = (s) => s.toLowerCase();
const normMinus = (s) => s.replace(/−/g, '-').trim();
const DASH = '—';

/** A decimal number written in a cell, returned as written (Unicode minus normalised). */
function num(cell, src, what = 'a number') {
  const s = normMinus(cell);
  if (!/^-?\d+(\.\d+)?$/.test(s)) fail(`${src}: expected ${what}, found "${cell}"`);
  return s;
}

/** A computed number, without float noise or trailing zeros. */
function fmt(n, src) {
  if (!Number.isFinite(n)) fail(`${src}: computed a non-finite number`);
  return String(parseFloat(n.toFixed(4)));
}

function hex(cell, src) {
  const s = cell.trim();
  if (!/^#([0-9a-f]{6}|[0-9a-f]{8})$/i.test(s)) fail(`${src}: expected a 6- or 8-digit hex colour, found "${cell}"`);
  return s.toUpperCase();
}

/** generation.md rule 2: alpha folded into the colour, as an 8-digit hex. */
function foldAlpha(hexValue, alpha, src) {
  if (alpha === 100) return hexValue;
  if (hexValue.length !== 7) fail(`${src}: cannot fold an alpha into ${hexValue}, which already carries one`);
  if (!(alpha >= 0 && alpha <= 100)) fail(`${src}: alpha ${alpha}% is out of range`);
  const a = Math.round((alpha * 255) / 100);
  return hexValue + a.toString(16).toUpperCase().padStart(2, '0');
}

function tokenName(cell, src) {
  const s = cell.trim();
  const name = s.startsWith('--') ? s : `--${s}`; // generation.md rule 1
  if (!/^--[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(name)) fail(`${src}: "${cell}" is not a valid token name`);
  return name;
}

// ---------------------------------------------------------------------------
// Markdown reading
// ---------------------------------------------------------------------------

function cleanCell(c) {
  return c.replace(/\\\|/g, '|').replace(/`/g, '').trim();
}

function splitRow(text) {
  let s = text.trim();
  if (s.startsWith('|')) s = s.slice(1);
  if (s.endsWith('|') && !s.endsWith('\\|')) s = s.slice(0, -1);
  return s.split(/(?<!\\)\|/).map(cleanCell);
}

/** Reads a markdown file: its headings and its tables, each table with its heading path. */
function readDoc(fileName, root = TOKENS_DIR, relPrefix = 'tokens/') {
  const file = path.join(root, fileName);
  const rel = `${relPrefix}${fileName}`;
  if (!fs.existsSync(file)) fail(`${rel}: file not found under ${root}`);
  const lines = fs.readFileSync(file, 'utf8').replace(/\r\n?/g, '\n').split('\n');
  const doc = { rel, lines, tables: [], headings: [] };
  const stack = [];
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const h = /^(#{1,6})\s+(.*?)\s*#*\s*$/.exec(line);
    if (h) {
      const heading = { level: h[1].length, text: cleanCell(h[2]), line: i + 1 };
      while (stack.length && stack.at(-1).level >= heading.level) stack.pop();
      stack.push(heading);
      doc.headings.push(heading);
      continue;
    }
    if (line.trimStart().startsWith('|')) {
      const start = i;
      const block = [];
      while (i < lines.length && lines[i].trimStart().startsWith('|')) {
        block.push({ text: lines[i], line: i + 1 });
        i++;
      }
      i--;
      if (block.length < 2 || !/^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$/.test(block[1].text)) {
        fail(`${rel}:${start + 1}: table without a separator row under its header`);
      }
      const header = splitRow(block[0].text);
      const rows = block.slice(2).map((r) => ({ cells: splitRow(r.text), line: r.line }));
      for (const r of rows) {
        if (r.cells.length !== header.length) {
          fail(`${rel}:${r.line}: row has ${r.cells.length} cells where the header has ${header.length}`);
        }
      }
      doc.tables.push({ doc, line: start + 1, headings: [...stack], header, rows, consumed: false });
    }
  }
  return doc;
}

const src = (doc, line) => `${doc.rel}:${line}`;
const headerIs = (t, ...names) => t.header.length === names.length && t.header.every((h, i) => lc(h) === lc(names[i]));
const under = (t, text) => t.headings.some((h) => lc(h.text) === lc(text));

/** Takes (consumes) every unconsumed table matching `pred`; fails when there is none. */
function take(doc, pred, what) {
  const found = doc.tables.filter((t) => !t.consumed && pred(t));
  if (!found.length) fail(`${doc.rel}: no table found for ${what}`);
  for (const t of found) t.consumed = true;
  return found;
}

/** The text of a section: the lines under a heading, up to the next heading of the same or a higher level. */
function sectionText(doc, headingText) {
  const h = doc.headings.find((x) => lc(x.text) === lc(headingText));
  if (!h) fail(`${doc.rel}: heading "${headingText}" not found`);
  const next = doc.headings.find((x) => x.line > h.line && x.level <= h.level);
  return { text: doc.lines.slice(h.line, next ? next.line - 1 : undefined).join('\n'), line: h.line };
}

/** Maps the mode columns of a header (from index `from`) to the viewport modes; all four, once each. */
function modeColumns(t, from, to = t.header.length) {
  const cols = {};
  for (let i = from; i < to; i++) {
    const m = lc(t.header[i]);
    if (!VIEWPORT_MODES.includes(m)) return null;
    if (m in cols) fail(`${src(t.doc, t.line)}: mode column "${t.header[i]}" appears twice`);
    cols[m] = i;
  }
  return VIEWPORT_MODES.every((m) => m in cols) ? cols : null;
}

/** Token/Value pairs of a (possibly multi-column) table, read column by column. */
function pairs(t) {
  const starts = [];
  t.header.forEach((h, i) => {
    if (lc(h) === 'token' && lc(t.header[i + 1] ?? '') === 'value') starts.push(i);
  });
  if (!starts.length) fail(`${src(t.doc, t.line)}: no Token / Value column pair in the header`);
  const out = [];
  for (const c of starts) {
    for (const r of t.rows) {
      const [tok, val] = [r.cells[c], r.cells[c + 1]];
      if (!tok && !val) continue;
      if (!tok || !val) fail(`${src(t.doc, r.line)}: a token without a value, or a value without a token`);
      out.push({ token: tok, value: val, line: r.line });
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Token registry
// ---------------------------------------------------------------------------

/**
 * A token: { name, area, src, value } for one value everywhere, or
 * { name, area, src, modes: {mobile, tablet, desktop, 'big screen'} } for a viewport-varying one,
 * a mode holding null where the table writes —; `dark` (same shape as modes) for a geometry
 * that varies by theme.
 */
const tokens = [];
const byName = new Map();
const pendingRefs = []; // { ref, src } checked once every file is read
const primitives = new Map(); // name -> hex
const semantic = new Map(); // name -> { light, dark }
const notes = []; // things worth reporting

function add(tok) {
  if (byName.has(tok.name)) fail(`${tok.src}: token ${tok.name} is already defined at ${byName.get(tok.name).src}`);
  if (tok.modes) {
    for (const m of VIEWPORT_MODES) if (tok.modes[m] === undefined) fail(`${tok.src}: ${tok.name} has no value for ${m}`);
  } else if (typeof tok.value !== 'string' || !tok.value) {
    fail(`${tok.src}: ${tok.name} has no value`);
  }
  tokens.push(tok);
  byName.set(tok.name, tok);
}

function ref(name, where) {
  pendingRefs.push({ ref: name, src: where });
  return `var(${name})`;
}

// ---------------------------------------------------------------------------
// One handler per token file
// ---------------------------------------------------------------------------

/** Files that state no token: their tables are rules and examples. */
function noTokens(doc) {
  for (const t of doc.tables) t.consumed = true;
}

function generation(doc) {
  noTokens(doc);
  const rules = doc.headings.filter((h) => h.level === 2 && /^\d+\./.test(h.text));
  if (rules.length !== 9) {
    fail(`${doc.rel}: holds ${rules.length} numbered rules; this generator implements rules 1 to 9 — update it before regenerating`);
  }
}

function colorPrimitives(doc) {
  for (const t of take(doc, (t) => headerIs(t, 'Token', 'Value'), 'the primitive ramps')) {
    for (const p of pairs(t)) {
      const where = src(doc, p.line);
      const name = tokenName(p.token, where);
      if (!name.startsWith('--color-base-')) fail(`${where}: ${name} is not a colour primitive`);
      const value = hex(p.value, where);
      primitives.set(name, value);
      add({ name, area: 'Colour primitives', src: where, value });
    }
  }
}

function colorSemantic(doc) {
  const tables = take(doc, (t) => headerIs(t, 'Token', 'Light', 'Dark'), 'the semantic colours');
  const parseRow = (r) => {
    const where = src(doc, r.line);
    const name = tokenName(r.cells[0], where);
    if (!name.startsWith('--color-')) fail(`${where}: ${name} is not a colour token`);
    const light = hex(r.cells[1], where);
    const dark = /^\*same\*$/i.test(r.cells[2]) ? light : hex(r.cells[2], where);
    return { name, light, dark, same: /^\*same\*$/i.test(r.cells[2]), where };
  };
  // The tables directly under a level-2 heading are the ramp; a table under a deeper heading
  // illustrates a rule and restates rows of the ramp, which are checked against it.
  const main = tables.filter((t) => t.headings.at(-1)?.level === 2);
  const restated = tables.filter((t) => t.headings.at(-1)?.level !== 2);
  let differ = 0;
  for (const t of main) {
    for (const r of t.rows) {
      const c = parseRow(r);
      semantic.set(c.name, { light: c.light, dark: c.dark });
      if (c.light !== c.dark) differ++;
      // generation.md rule 9
      const value = c.light === c.dark ? c.light : `light-dark(${c.light}, ${c.dark})`;
      add({ name: c.name, area: 'Semantic colours', src: c.where, value });
    }
  }
  for (const t of restated) {
    for (const r of t.rows) {
      const c = parseRow(r);
      const m = semantic.get(c.name);
      if (!m) fail(`${c.where}: ${c.name} is restated here but absent from the semantic tables`);
      if (m.light !== c.light || m.dark !== c.dark) fail(`${c.where}: ${c.name} disagrees with its row in the semantic tables`);
    }
  }
  const intro = doc.lines.join('\n');
  const total = /\*\*(\d+) tokens/.exec(intro);
  if (total && Number(total[1]) !== semantic.size) {
    fail(`${doc.rel}: announces ${total[1]} tokens, the tables hold ${semantic.size}`);
  }
  const d = /(\d+) tokens differ/.exec(intro);
  if (d && Number(d[1]) !== differ) fail(`${doc.rel}: announces ${d[1]} tokens that differ by theme, the tables hold ${differ}`);
}

function typography(doc) {
  // Families — generation.md rule 3.
  const [famTable] = take(doc, (t) => under(t, 'Family') && headerIs(t, 'Token', 'Value', 'Sets'), 'the families');
  const fontExpr = new Map();
  for (const r of famTable.rows) {
    const where = src(doc, r.line);
    const name = tokenName(r.cells[0], where);
    const m = /^--typo-(default|code)$/.exec(name);
    if (!m) fail(`${where}: generation.md rule 3 names no font property for ${name}`);
    const family = r.cells[1];
    if (!family || /[;{}()"',]/.test(family)) fail(`${where}: "${family}" is not a family name`);
    const value = `var(--font-${m[1]}, ${family})`;
    fontExpr.set(name, value);
    add({ name, area: 'Typography — families', src: where, value });
  }
  if (!fontExpr.has('--typo-default')) fail(`${src(doc, famTable.line)}: --typo-default is missing`);

  // Weight ramp.
  for (const t of take(doc, (t) => under(t, 'Weight ramp — primitives') && t.header[0] === 'Token', 'the weight ramp')) {
    for (const p of pairs(t)) {
      const where = src(doc, p.line);
      const value = num(p.value, where, 'a weight');
      add({ name: tokenName(p.token, where), area: 'Typography — weights', src: where, value });
    }
  }

  // Font-size ramp.
  for (const t of take(doc, (t) => under(t, 'Size ramp — primitives') && t.header[0] === 'Token', 'the size ramp')) {
    for (const p of pairs(t)) {
      const where = src(doc, p.line);
      add({ name: tokenName(p.token, where), area: 'Typography — font sizes', src: where, value: `${num(p.value, where)}px` });
    }
  }

  // Token names of the semantic ramp.
  const [namesTable] = take(doc, (t) => headerIs(t, 'Pattern', 'Example'), 'the token names');
  const suffixes = namesTable.rows.map((r) => {
    const m = /^--typo-<family>-<step>-([a-z-]+)$/.exec(r.cells[0]);
    if (!m) fail(`${src(doc, r.line)}: unrecognised pattern "${r.cells[0]}"`);
    if (!['family', 'size', 'weight'].includes(m[1])) fail(`${src(doc, r.line)}: no value source for the "${m[1]}" suffix`);
    return m[1];
  });

  // Semantic size ramp, one table per family.
  const rampTables = take(
    doc,
    (t) => under(t, 'Semantic size ramp') && lc(t.header[0]) === 'step' && modeColumns(t, 1),
    'the semantic size ramp',
  );
  for (const t of rampTables) {
    const heading = t.headings.at(-1);
    const hm = /^([a-z]+) — weight (\d+)$/.exec(heading.text);
    if (!hm) fail(`${src(doc, heading.line)}: expected a heading "<family> — weight <n>", found "${heading.text}"`);
    const [, family, weight] = hm;
    const cols = modeColumns(t, 1);
    for (const r of t.rows) {
      const where = src(doc, r.line);
      const step = r.cells[0];
      if (!/^[a-z0-9]+$/.test(step)) fail(`${where}: "${step}" is not a step name`);
      for (const suffix of suffixes) {
        const name = tokenName(`--typo-${family}-${step}-${suffix}`, where);
        if (suffix === 'family') {
          add({ name, area: 'Typography — semantic ramp', src: where, value: fontExpr.get('--typo-default') });
        } else if (suffix === 'weight') {
          add({ name, area: 'Typography — semantic ramp', src: where, value: weight });
        } else {
          const modes = {};
          for (const m of VIEWPORT_MODES) modes[m] = `${num(r.cells[cols[m]], where, 'a size in px')}px`;
          add({ name, area: 'Typography — semantic ramp', src: where, modes });
        }
      }
    }
  }

  // Line heights and letter spacings.
  for (const t of take(doc, (t) => under(t, 'Line height') && headerIs(t, 'Token', 'Value'), 'the line heights')) {
    for (const p of pairs(t)) {
      const where = src(doc, p.line);
      add({ name: tokenName(p.token, where), area: 'Typography — line heights', src: where, value: num(p.value, where) });
    }
  }
  for (const t of take(doc, (t) => under(t, 'Letter spacing') && headerIs(t, 'Token', 'Value'), 'the letter spacings')) {
    for (const p of pairs(t)) {
      const where = src(doc, p.line);
      const v = normMinus(p.value);
      if (!/^-?\d+(\.\d+)?(em|px|rem)$/.test(v)) fail(`${where}: "${p.value}" is not a letter spacing`);
      add({ name: tokenName(p.token, where), area: 'Typography — letter spacings', src: where, value: v });
    }
  }

  // Line height and letter spacing by step: no token name is defined for them (see "Token names"),
  // so nothing is emitted; every token they name must exist.
  for (const t of take(doc, (t) => under(t, 'Line height and letter spacing by step and family'), 'the line heights by step')) {
    for (const r of t.rows) {
      for (const c of r.cells.slice(1)) pendingRefs.push({ ref: tokenName(c, src(doc, r.line)), src: src(doc, r.line) });
    }
  }
  notes.push(
    `${doc.rel}: the "Line height and letter spacing by step and family" table maps steps to tokens, but "Token names" defines no -line-height / -letter-spacing property per step; it is validated, not emitted.`,
  );
}

function scales(doc) {
  const spacing = take(doc, (t) => under(t, 'Spacing') && t.header[0] === 'Token', 'the spacing ramp');
  let count = 0;
  for (const t of spacing) {
    for (const p of pairs(t)) {
      const where = src(doc, p.line);
      const name = tokenName(p.token, where);
      if (!name.startsWith('--size-')) fail(`${where}: ${name} is not a spacing step`);
      add({ name, area: 'Scales — spacing', src: where, value: `${num(p.value, where)}px` });
      count++;
    }
  }
  const announced = /(\d+) tokens:/.exec(sectionText(doc, 'Spacing').text);
  if (announced && Number(announced[1]) !== count) fail(`${doc.rel}: announces ${announced[1]} spacing tokens, the tables hold ${count}`);

  const radiusText = sectionText(doc, 'Radius').text;
  for (const t of take(doc, (t) => under(t, 'Radius') && headerIs(t, 'Token', 'Value'), 'the radius ramp')) {
    for (const p of pairs(t)) {
      const where = src(doc, p.line);
      const name = tokenName(p.token, where);
      let value = `${num(p.value, where)}px`;
      // scales.md: radius-full is the 999 sentinel, emitted as 9999px.
      if (name === '--radius-full') {
        if (!/Emit it as `9999px`/.test(radiusText)) fail(`${where}: the emission rule of radius-full has changed`);
        value = '9999px';
      }
      add({ name, area: 'Scales — radius', src: where, value });
    }
  }

  for (const t of take(doc, (t) => under(t, 'Border widths') && headerIs(t, 'Token', 'Value'), 'the border widths')) {
    for (const p of pairs(t)) {
      const where = src(doc, p.line);
      add({ name: tokenName(p.token, where), area: 'Scales — border widths', src: where, value: `${num(p.value, where)}px` });
    }
  }

  // Opacity: stated in prose, no table.
  const op = sectionText(doc, 'Opacity');
  const m = /(\d+) steps, (\d+) to (\d+) in increments of (\d+), named `opacity-(\d+)` through `opacity-(\d+)`/.exec(op.text);
  if (!m) fail(`${src(doc, op.line)}: the opacity ramp is not stated as "<n> steps, <a> to <b> in increments of <c>, named opacity-<a> through opacity-<b>"`);
  if (!/Divide by 100/.test(op.text)) fail(`${src(doc, op.line)}: the opacity ramp no longer states its 0–100 to 0–1 conversion`);
  const [steps, from, to, inc] = m.slice(1, 5).map(Number);
  if (Number(m[5]) !== from || Number(m[6]) !== to || (to - from) / inc + 1 !== steps) {
    fail(`${src(doc, op.line)}: the opacity ramp statement is inconsistent`);
  }
  for (let v = from; v <= to; v += inc) {
    add({ name: `--opacity-${v}`, area: 'Scales — opacity', src: src(doc, op.line), value: fmt(v / 100, doc.rel) });
  }
}

/** Dimensions (rule 6) and semantic spacings (rule 7). */
function namedSizes(doc, prefix, area) {
  const tables = take(doc, (t) => lc(t.header[0]) === 'token', area);
  for (const t of tables) {
    const modeCols = modeColumns(t, 1, 5);
    const isConst = t.header.length === 3 && lc(t.header[1]) === 'value';
    if (!modeCols && !isConst) fail(`${src(doc, t.line)}: unrecognised table header "${t.header.join(' | ')}"`);
    for (const r of t.rows) {
      const where = src(doc, r.line);
      const name = tokenName(r.cells[0], where);
      if (!name.startsWith(prefix)) fail(`${where}: ${name} does not start with ${prefix}`);
      const isRatio = prefix === '--dimension-' && /-ratio(-|$)/.test(name);
      const value = (cell) => {
        if (cell === DASH) {
          if (isConst) fail(`${where}: ${DASH} is only allowed in a table by viewport mode`);
          return null;
        }
        if (cell.startsWith('--')) return ref(tokenName(cell, where), where);
        const ratio = /^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/.exec(cell);
        if (ratio) {
          if (!isRatio) fail(`${where}: a proportion is only allowed on a -ratio dimension`);
          return `${ratio[1]} / ${ratio[2]}`;
        }
        if (isRatio) fail(`${where}: ${name} is a ratio but holds "${cell}"`);
        return `${num(cell, where, 'a value in px or a token')}px`;
      };
      if (isConst) {
        add({ name, area, src: where, value: value(r.cells[1]) });
      } else {
        const modes = {};
        for (const m of VIEWPORT_MODES) modes[m] = value(r.cells[modeCols[m]]);
        add({ name, area, src: where, modes });
        const vals = VIEWPORT_MODES.map((m) => modes[m]);
        const firstDashAfterValue = vals.findIndex((v, i) => v === null && vals.slice(0, i).some((x) => x !== null));
        if (firstDashAfterValue !== -1) {
          notes.push(
            `${where}: ${name} has a value up to ${VIEWPORT_MODES[firstDashAfterValue - 1]} and ${DASH} at ${VIEWPORT_MODES[firstDashAfterValue]}; rules 6/7 give no declaration there, so the mobile-first value stays in force (the component does not apply the token there).`,
          );
        }
      }
    }
  }
}

/** A colour named by a shadow or a gradient stop. */
function colourOf(name, where) {
  if (primitives.has(name)) {
    const v = primitives.get(name);
    return { name, kind: 'primitive', light: v, dark: v, full: v };
  }
  if (semantic.has(name)) {
    const v = semantic.get(name);
    return { name, kind: 'semantic', light: v.light, dark: v.dark, full: `var(${name})` };
  }
  return fail(`${where}: unknown colour token ${name}`);
}

function effects(doc) {
  // Shadows — generation.md rule 5.
  const [sh] = take(doc, (t) => under(t, 'Shadows') && headerIs(t, 'Token', 'x', 'y', 'Blur', 'Spread', 'Colour'), 'the shadows');
  let current = null;
  for (const r of sh.rows) {
    const where = src(doc, r.line);
    if (r.cells[0]) {
      current = { name: tokenName(r.cells[0], where), area: 'Effects — shadows', src: where, layers: [] };
      add(Object.assign(current, { value: 'pending' }));
    } else if (!current) {
      fail(`${where}: a shadow layer with no token above it`);
    }
    const [x, y, blur, spread] = r.cells.slice(1, 5).map((c) => `${num(c, where, 'a length in px')}px`);
    const cm = /^(--[a-z0-9-]+)(?:\s+at\s+(\d+(?:\.\d+)?)%)?$/.exec(r.cells[5]);
    if (!cm) fail(`${where}: unrecognised shadow colour "${r.cells[5]}"`);
    const c = colourOf(cm[1], where);
    const alpha = cm[2] === undefined ? 100 : Number(cm[2]);
    let colour;
    if (c.kind === 'primitive') colour = foldAlpha(c.full, alpha, where);
    else if (alpha === 100) colour = c.full;
    else fail(`${where}: generation.md rule 5 states no form for a semantic token at an alpha`);
    current.layers.push(`${x} ${y} ${blur} ${spread} ${colour}`);
    current.value = current.layers.join(', ');
  }

  // Blurs — generation.md rule 4.
  for (const t of take(doc, (t) => under(t, 'Blurs') && headerIs(t, 'Token', 'Radius'), 'the blurs')) {
    for (const r of t.rows) {
      const where = src(doc, r.line);
      const radius = Number(num(r.cells[1], where, 'a radius'));
      add({ name: tokenName(r.cells[0], where), area: 'Effects — blurs', src: where, value: `${fmt(radius / 2, where)}px` });
    }
  }

  // Focus outline: a table of properties resolving through other tokens, no token of its own.
  const [fo] = take(doc, (t) => under(t, 'Focus outline') && headerIs(t, 'Property', 'Value'), 'the focus outline');
  notes.push(
    `${src(doc, fo.line)}: the focus outline names no token of its own (width --border-2, colour --color-border-brand-default-focus / --color-border-on-neutral-strong-default, offset --size-1); nothing is emitted for it.`,
  );
}

function gradients(doc) {
  const GEOMETRY = {
    linear: /^-?\d+(\.\d+)?deg$/,
    radial: /^\d+(\.\d+)?% \d+(\.\d+)?% at -?\d+(\.\d+)?% -?\d+(\.\d+)?%$/,
    conic: /^from -?\d+(\.\d+)?deg at -?\d+(\.\d+)?% -?\d+(\.\d+)?%$/,
  };

  // Geometry by viewport mode, and by theme and viewport mode.
  const byMode = new Map();
  for (const t of take(doc, (t) => under(t, 'By viewport mode') && lc(t.header[0]) === 'token', 'the geometry by viewport mode')) {
    const cols = modeColumns(t, 1);
    if (!cols) fail(`${src(doc, t.line)}: unrecognised header "${t.header.join(' | ')}"`);
    for (const r of t.rows) {
      const where = src(doc, r.line);
      const name = tokenName(r.cells[0], where);
      if (byMode.has(name)) fail(`${where}: ${name} is given twice`);
      const modes = {};
      for (const m of VIEWPORT_MODES) modes[m] = r.cells[cols[m]];
      byMode.set(name, { modes, where, used: false });
    }
  }
  const byTheme = new Map();
  for (const t of take(doc, (t) => under(t, 'By theme and viewport mode') && lc(t.header[0]) === 'token', 'the geometry by theme')) {
    if (lc(t.header[1]) !== 'theme') fail(`${src(doc, t.line)}: expected a Theme column`);
    const cols = modeColumns(t, 2);
    if (!cols) fail(`${src(doc, t.line)}: unrecognised header "${t.header.join(' | ')}"`);
    for (const r of t.rows) {
      const where = src(doc, r.line);
      const name = tokenName(r.cells[0], where);
      const theme = lc(r.cells[1]);
      if (theme !== 'light' && theme !== 'dark') fail(`${where}: unknown theme "${r.cells[1]}"`);
      const entry = byTheme.get(name) ?? { where, used: false };
      if (entry[theme]) fail(`${where}: ${name} gives ${theme} twice`);
      entry[theme] = {};
      for (const m of VIEWPORT_MODES) entry[theme][m] = r.cells[cols[m]];
      byTheme.set(name, entry);
    }
  }

  const main = take(doc, (t) => headerIs(t, 'Token', 'Stops', 'Geometry'), 'the gradients');
  for (const t of main) {
    for (const r of t.rows) {
      const where = src(doc, r.line);
      const name = tokenName(r.cells[0], where);
      const sm = /^--gradient-(linear|radial|conic)-/.exec(name);
      if (!sm) fail(`${where}: ${name} does not name its shape`);
      const shape = sm[1];
      const stopsCss = gradientStops(r.cells[1], where);
      const build = (geometry) => {
        if (!GEOMETRY[shape].test(geometry)) fail(`${where}: "${geometry}" is not a ${shape} geometry`);
        return `${shape}-gradient(${geometry}, ${stopsCss})`;
      };
      const geometry = lc(r.cells[2]);
      if (geometry === 'by viewport mode') {
        const g = byMode.get(name);
        if (!g) fail(`${where}: ${name} varies by viewport mode, but the "By viewport mode" table has no row for it`);
        g.used = true;
        const modes = {};
        for (const m of VIEWPORT_MODES) modes[m] = build(g.modes[m]);
        add({ name, area: 'Gradients', src: where, modes });
      } else if (geometry === 'by theme and viewport mode') {
        const g = byTheme.get(name);
        if (!g || !g.light || !g.dark) fail(`${where}: ${name} varies by theme, but "By theme and viewport mode" lacks its Light or Dark row`);
        g.used = true;
        const modes = {};
        const dark = {};
        for (const m of VIEWPORT_MODES) {
          modes[m] = build(g.light[m]);
          dark[m] = build(g.dark[m]);
        }
        add({ name, area: 'Gradients', src: where, modes, dark });
      } else {
        add({ name, area: 'Gradients', src: where, value: build(r.cells[2]) });
      }
    }
  }
  for (const [name, g] of [...byMode, ...byTheme]) {
    if (!g.used) fail(`${g.where}: ${name} has a geometry by mode but no row in the gradient tables, or its row does not say it varies`);
  }
}

/** The stops of a gradient — generation.md rule 8, and the clear-stop rule of gradients.md. */
function gradientStops(cell, where) {
  const stops = cell.split('→').map((s, i) => {
    const m = /^(--[a-z0-9-]+)(?:\s+at\s+(-?\d+(?:\.\d+)?)%)?,\s*(-?\d+(?:\.\d+)?)%$/.exec(normMinus(s));
    if (!m) fail(`${where}: stop ${i + 1} "${s.trim()}" is not "<token>[ at <alpha>%], <position>%"`);
    const colour = colourOf(m[1], where);
    const alpha = m[2] === undefined ? 100 : Number(m[2]);
    if (!(alpha >= 0 && alpha <= 100)) fail(`${where}: stop ${i + 1} has an alpha out of range`);
    const stop = { colour, alpha, pos: Number(m[3]), posText: `${m[3]}%`, clear: false };
    if (alpha === 0) {
      // A token written at 0%: its colour at full alpha is the token itself.
      stop.clear = true;
      stop.clearColour = colour;
    } else if (colour.kind === 'semantic' && /00$/.test(colour.light) && colour.light.length === 9) {
      if (!(/00$/.test(colour.dark) && colour.dark.length === 9)) fail(`${where}: ${colour.name} is clear in Light only`);
      // A clear token: its colour at full alpha is step 100 of its family.
      const full = colour.name.replace(/-0$/, '-100');
      if (full === colour.name) fail(`${where}: ${colour.name} is clear but is not step 0 of a family`);
      stop.clear = true;
      stop.clearColour = colourOf(full, where);
    } else if (colour.kind === 'semantic' && /00$/.test(colour.dark) && colour.dark.length === 9) {
      fail(`${where}: ${colour.name} is clear in Dark only`);
    }
    return stop;
  });
  if (stops.length < 2) fail(`${where}: a gradient needs two stops or more`);

  const css = (s) => {
    if (s.colour.kind === 'primitive') return `${foldAlpha(s.colour.full, s.alpha, where)} ${s.posText}`;
    if (s.alpha === 100) return `${s.colour.full} ${s.posText}`;
    return `color-mix(in srgb, ${s.colour.full} ${fmt(s.alpha, where)}%, transparent) ${s.posText}`;
  };
  const out = [];
  stops.forEach((s, i) => {
    out.push(css(s));
    const next = stops[i + 1];
    if (!next || s.clear === next.clear) return;
    const [clear, solid] = s.clear ? [s, next] : [next, s];
    const c = clear.clearColour;
    // A clear stop whose colour equals its neighbour's in each theme takes no stop.
    if (c.light === solid.colour.light && c.dark === solid.colour.dark) return;
    const fullOf = (x) => (x.clear ? x.clearColour.full : x.colour.full);
    const mix = `color-mix(in srgb, ${fullOf(s)}, ${fullOf(next)})`;
    out.push(`color-mix(in srgb, ${mix} ${fmt(solid.alpha / 2, where)}%, transparent) ${fmt((s.pos + next.pos) / 2, where)}%`);
  });
  return out.join(', ');
}

let breakpoints = null; // { tablet, desktop, 'big screen' } -> min width in px

function layout(doc) {
  const [vars] = take(doc, (t) => under(t, 'Variables') && headerIs(t, 'Token'), 'the layout variables');
  const declared = vars.rows.map((r) => tokenName(r.cells[0], src(doc, r.line)));

  const [values] = take(doc, (t) => under(t, 'Values') && lc(t.header[0]) === 'mode', 'the layout values');
  const names = values.header.slice(1).map((h) => tokenName(h, src(doc, values.line)));
  if (names.join() !== declared.join()) fail(`${src(doc, values.line)}: the value columns do not match the Variables table`);
  const rowsByMode = {};
  for (const r of values.rows) {
    const m = lc(r.cells[0]);
    if (!VIEWPORT_MODES.includes(m)) fail(`${src(doc, r.line)}: unknown mode "${r.cells[0]}"`);
    if (rowsByMode[m]) fail(`${src(doc, r.line)}: mode "${r.cells[0]}" given twice`);
    rowsByMode[m] = r;
  }
  for (const m of VIEWPORT_MODES) if (!rowsByMode[m]) fail(`${src(doc, values.line)}: no row for ${m}`);
  names.forEach((name, i) => {
    const modes = {};
    for (const m of VIEWPORT_MODES) modes[m] = `${num(rowsByMode[m].cells[i + 1], src(doc, rowsByMode[m].line))}px`;
    add({ name, area: 'Layout', src: src(doc, values.line), modes });
  });

  const [bp] = take(doc, (t) => under(t, 'The breakpoints') && headerIs(t, 'Mode', 'Range'), 'the breakpoints');
  const ranges = {};
  for (const r of bp.rows) {
    const where = src(doc, r.line);
    const m = lc(r.cells[0]);
    if (!VIEWPORT_MODES.includes(m)) fail(`${where}: unknown mode "${r.cells[0]}"`);
    const range = r.cells[1].replace(/\s+/g, ' ');
    let x;
    if ((x = /^< ?(\d+)$/.exec(range))) ranges[m] = { min: 0, max: Number(x[1]) - 1, where };
    else if ((x = /^(\d+) ?[–-] ?(\d+)$/.exec(range))) ranges[m] = { min: Number(x[1]), max: Number(x[2]), where };
    else if ((x = /^(≥|>=) ?(\d+)$/.exec(range))) ranges[m] = { min: Number(x[2]), max: Infinity, where };
    else fail(`${where}: unrecognised range "${r.cells[1]}"`);
  }
  VIEWPORT_MODES.forEach((m, i) => {
    if (!ranges[m]) fail(`${src(doc, bp.line)}: no range for ${m}`);
    if (i === 0 && ranges[m].min !== 0) fail(`${ranges[m].where}: mobile must be the unqueried base`);
    if (i > 0 && ranges[m].min !== ranges[VIEWPORT_MODES[i - 1]].max + 1) fail(`${ranges[m].where}: ${m} does not start where the previous mode ends`);
  });
  if (ranges['big screen'].max !== Infinity) fail(`${ranges['big screen'].where}: big screen must be open-ended`);
  breakpoints = Object.fromEntries(VIEWPORT_MODES.slice(1).map((m) => [m, ranges[m].min]));
}

const HANDLERS = {
  'token-grammar.md': noTokens,
  'modes.md': noTokens,
  'color-primitives.md': colorPrimitives,
  'color-semantic.md': colorSemantic,
  'typography.md': typography,
  'scales.md': scales,
  'dimensions.md': (doc) => namedSizes(doc, '--dimension-', 'Dimensions'),
  'spacing-semantic.md': (doc) => namedSizes(doc, '--spacing-', 'Semantic spacings'),
  'effects.md': effects,
  'gradients.md': gradients,
  'layout.md': layout,
  'generation.md': generation,
};

// ---------------------------------------------------------------------------
// Reading the catalogue
// ---------------------------------------------------------------------------

function readTokens() {
  if (!fs.existsSync(TOKENS_DIR)) fail(`Front2026 tokens folder not found: ${TOKENS_DIR}`);
  const index = readDoc('index.md');
  const [catalogue] = take(index, (t) => headerIs(t, 'File', 'Specifies'), 'the token catalogue');
  const files = catalogue.rows.map((r) => {
    const m = /^\[[^\]]+\]\(([^)#]+)\)$/.exec(r.cells[0]);
    if (!m) fail(`${src(index, r.line)}: "${r.cells[0]}" is not a link to a token file`);
    if (!HANDLERS[m[1]]) fail(`${src(index, r.line)}: ${m[1]} is catalogued, but this generator has no handler for it`);
    return m[1];
  });
  const onDisk = fs.readdirSync(TOKENS_DIR).filter((f) => f.endsWith('.md') && f !== 'CLAUDE.md' && f !== 'index.md');
  for (const f of onDisk) if (!files.includes(f)) fail(`tokens/${f}: not listed in tokens/index.md`);

  const docs = files.map((f) => {
    const doc = readDoc(f);
    HANDLERS[f](doc);
    return doc;
  });

  for (const doc of docs) {
    for (const t of doc.tables) {
      if (!t.consumed && t.header.some((h) => lc(h) === 'token')) {
        fail(`${src(doc, t.line)}: a token table this generator does not read (header "${t.header.join(' | ')}")`);
      }
    }
  }
  for (const p of pendingRefs) if (!byName.has(p.ref)) fail(`${p.src}: unknown token ${p.ref}`);
  if (!breakpoints) fail('tokens/layout.md: the breakpoints were not read');

  codeSyntax();
  docapiDimensions();
}

/**
 * The DocApi dimension tokens (functional/dimensions.md, "How they hold their values"):
 * one value per viewport mode, `—` giving no declaration, a fraction a / b being that share
 * of the viewport width, emitted calc(100vw * a / b).
 */
function docapiDimensions() {
  const doc = readDoc(DOCAPI_DIMENSIONS_FILE, DOCAPI_ROOT, 'DocApi/');
  sectionText(doc, 'How they hold their values'); // fails if the rules section is gone
  const area = `DocApi — dimension tokens (${DOCAPI_DIMENSIONS_FILE})`;
  const [t] = take(
    doc,
    (t) => under(t, 'The tokens') && lc(t.header[0]) === 'token' && t.header.length === 6 && lc(t.header[5]) === 'sizes' && modeColumns(t, 1, 5),
    'the DocApi dimension tokens',
  );
  if (!t.rows.length) fail(`${src(doc, t.line)}: the dimension table has no row`);
  const cols = modeColumns(t, 1, 5);
  for (const r of t.rows) {
    const where = src(doc, r.line);
    const name = tokenName(r.cells[0], where);
    if (!name.startsWith('--dimension-docapi-')) fail(`${where}: ${name} does not start with --dimension-docapi-`);
    if (byName.has(name)) fail(`${where}: ${name} collides with the token defined at ${byName.get(name).src}`);
    const modes = {};
    for (const m of VIEWPORT_MODES) {
      const cell = r.cells[cols[m]];
      if (cell === DASH) {
        modes[m] = null;
        continue;
      }
      const f = /^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/.exec(cell);
      if (!f) fail(`${where}: ${name} at ${m}: "${cell}" is neither ${DASH} nor a fraction a / b`);
      if (Number(f[2]) === 0) fail(`${where}: ${name} at ${m}: a fraction with a zero denominator`);
      modes[m] = `calc(100vw * ${f[1]} / ${f[2]})`;
    }
    if (VIEWPORT_MODES.every((m) => modes[m] === null)) fail(`${where}: ${name} has a value at no viewport mode`);
    add({ name, area, src: where, modes });
  }
  for (const other of doc.tables) {
    if (!other.consumed && other.header.some((h) => lc(h) === 'token')) {
      fail(`${src(doc, other.line)}: a token table this generator does not read (header "${other.header.join(' | ')}")`);
    }
  }
}

/**
 * The DocApi code syntax tokens (functional/code-syntax.md, "How they hold their values"):
 * one value in both themes; an Aliases token gives var(<semantic token>), a Value of
 * primitive gives that primitive's value as hex — never a reference to the private primitive.
 */
function codeSyntax() {
  if (!fs.existsSync(DOCAPI_ROOT)) fail(`DocApi root not found: ${DOCAPI_ROOT}`);
  const doc = readDoc(CODE_SYNTAX_FILE, DOCAPI_ROOT, 'DocApi/');
  sectionText(doc, 'How they hold their values'); // fails if the rules section is gone
  const area = `DocApi — code syntax tokens (${CODE_SYNTAX_FILE})`;
  const [t] = take(
    doc,
    (t) => under(t, 'The tokens') && headerIs(t, 'Token', 'Aliases', 'Value of', 'Colours'),
    'the code syntax tokens',
  );
  if (!t.rows.length) fail(`${src(doc, t.line)}: the code syntax table has no row`);
  for (const r of t.rows) {
    const where = src(doc, r.line);
    const name = tokenName(r.cells[0], where);
    if (!name.startsWith('--code-syntax-')) fail(`${where}: ${name} is not written --code-syntax-<kind>`);
    const filled = (c) => c !== '' && c !== DASH;
    const [aliases, valueOf] = [r.cells[1], r.cells[2]];
    if (filled(aliases) === filled(valueOf)) {
      fail(`${where}: ${name} must fill exactly one of Aliases and Value of (found "${aliases}" and "${valueOf}")`);
    }
    let value;
    if (filled(aliases)) {
      const sem = tokenName(aliases, where);
      if (!semantic.has(sem)) fail(`${where}: ${name} aliases ${sem}, which is not a Front2026 semantic colour`);
      value = `var(${sem})`;
    } else {
      const prim = tokenName(valueOf, where);
      if (!primitives.has(prim)) fail(`${where}: ${name} takes the value of ${prim}, which is not a Front2026 primitive`);
      value = primitives.get(prim);
    }
    add({ name, area, src: where, value });
  }
  for (const other of doc.tables) {
    if (!other.consumed && other.header.some((h) => lc(h) === 'token')) {
      fail(`${src(doc, other.line)}: a token table this generator does not read (header "${other.header.join(' | ')}")`);
    }
  }
}

// ---------------------------------------------------------------------------
// Writing the stylesheet
// ---------------------------------------------------------------------------

function buildCss() {
  const rules = []; // { media, selector, decls: [{area, name, value}] }
  const blocks = VIEWPORT_MODES.map(() => ({ root: [], dark: [] }));
  const state = new Map(); // name -> { light, dark } in force so far

  VIEWPORT_MODES.forEach((mode, k) => {
    for (const tok of tokens) {
      const light = tok.modes ? tok.modes[mode] : k === 0 ? tok.value : null;
      const s = state.get(tok.name) ?? { light: null, dark: null };
      // Light (and every non-theme value): declared where it changes; — gives no declaration.
      if (light !== null && light !== s.light) {
        blocks[k].root.push({ area: tok.area, name: tok.name, value: light });
        s.light = light;
        s.dark = light; // same specificity, later in source: wins under dark too
      }
      // Dark geometry (rule 8): redeclared wherever the value in force under dark is not the Dark value.
      if (tok.dark) {
        const dark = tok.dark[mode];
        if (dark === null) fail(`${tok.src}: ${tok.name} has no Dark value at ${mode}`);
        if (dark !== s.dark) {
          blocks[k].dark.push({ area: tok.area, name: tok.name, value: dark });
          s.dark = dark;
        }
      }
      state.set(tok.name, s);
    }
  });

  const out = [];
  out.push(
    '/*',
    ' * Design tokens of the Front2026 design system.',
    ' *',
    ' * GENERATED FILE — DO NOT EDIT.',
    ' * Regenerate with `npm run gen-design` (scripts/gen-design.mjs).',
    ' * Sources:',
    ' * - the Front2026 tokens (tokens/*.md of the Front2026 shared utility),',
    ' *   turned into custom properties by the rules of tokens/generation.md;',
    ' * - the DocApi code syntax tokens (functional/code-syntax.md of the DocApi',
    ' *   shared utility), each aliasing a Front2026 semantic colour or holding the',
    ' *   value of a Front2026 primitive;',
    ' * - the DocApi dimension tokens (functional/dimensions.md of the DocApi shared',
    ' *   utility), varying by viewport mode, a fraction a / b being that share of',
    ' *   the viewport width.',
    ' */',
    '',
  );
  const emit = (selector, decls, indent) => {
    if (!decls.length) return;
    out.push(`${indent}${selector} {`);
    let area = null;
    for (const d of decls) {
      if (d.area !== area) {
        if (area !== null) out.push('');
        out.push(`${indent}  /* ${d.area} */`);
        area = d.area;
      }
      out.push(`${indent}  ${d.name}: ${d.value};`);
    }
    out.push(`${indent}}`);
  };
  emit(':root', blocks[0].root, '');
  if (blocks[0].dark.length) out.push('');
  emit(DARK_SELECTOR, blocks[0].dark, '');
  VIEWPORT_MODES.slice(1).forEach((mode, i) => {
    const b = blocks[i + 1];
    if (!b.root.length && !b.dark.length) return;
    out.push('', `/* Viewport mode: ${mode} */`, `@media (min-width: ${breakpoints[mode]}px) {`);
    emit(':root', b.root, '  ');
    if (b.root.length && b.dark.length) out.push('');
    emit(DARK_SELECTOR, b.dark, '  ');
    out.push('}');
  });
  out.push('');
  const css = out.join('\n');

  // Sanity checks on the result.
  if (/\bundefined\b|\bNaN\b|\[object /.test(css)) fail('generated CSS holds undefined, NaN or an object');
  const opens = (css.match(/{/g) ?? []).length;
  const closes = (css.match(/}/g) ?? []).length;
  if (opens !== closes) fail('generated CSS has unbalanced braces');
  for (const tok of tokens) {
    if (!blocks.some((b) => b.root.some((d) => d.name === tok.name))) fail(`${tok.src}: ${tok.name} produced no declaration`);
  }
  return { css, blocks };
}

// ---------------------------------------------------------------------------
// Assets
// ---------------------------------------------------------------------------

function assetSources() {
  const list = [
    ...LOGOS.map((f) => ({ from: path.join(FRONT_ROOT, 'assets', 'logos', f), to: f, what: `logo ${f}` })),
    ...ICONS.map((n) => ({ from: path.join(FRONT_ROOT, 'assets', 'icons', `icon-${n}.svg`), to: `icon-${n}.svg`, what: `icon ${n}` })),
    ...PORTRAITS.map((f) => ({ from: path.join(FRONT_ROOT, 'assets', 'portraits', f), to: f, what: `portrait ${f}` })),
  ];
  const missing = list.filter((a) => !fs.existsSync(a.from));
  if (missing.length) fail(`asset(s) not found: ${missing.map((a) => `${a.what} (${a.from})`).join(', ')}`);
  const dup = list.map((a) => a.to).find((t, i, all) => all.indexOf(t) !== i);
  if (dup) fail(`asset ${dup} is listed twice`);
  return list;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  readTokens();
  const { css, blocks } = buildCss();
  const assets = assetSources();

  fs.mkdirSync(path.dirname(OUT_CSS), { recursive: true });
  fs.writeFileSync(OUT_CSS, css);

  fs.rmSync(OUT_ASSETS, { recursive: true, force: true });
  fs.mkdirSync(OUT_ASSETS, { recursive: true });
  for (const a of assets) fs.copyFileSync(a.from, path.join(OUT_ASSETS, a.to));

  const perArea = new Map();
  for (const d of blocks[0].root) perArea.set(d.area, (perArea.get(d.area) ?? 0) + 1);
  console.log(`gen-design: ${tokens.length} tokens -> ${path.relative(process.cwd(), OUT_CSS)}`);
  for (const [area, n] of perArea) console.log(`  :root  ${String(n).padStart(4)}  ${area}`);
  if (blocks[0].dark.length) console.log(`  ${DARK_SELECTOR}  ${blocks[0].dark.length}`);
  VIEWPORT_MODES.slice(1).forEach((m, i) => {
    const b = blocks[i + 1];
    console.log(`  @media (min-width: ${breakpoints[m]}px) ${m}: ${b.root.length} redeclared, ${b.dark.length} under dark`);
  });
  console.log(`gen-design: ${assets.length} assets -> ${path.relative(process.cwd(), OUT_ASSETS)}`);
  for (const n of notes) console.log(`  note: ${n}`);
}

try {
  main();
} catch (e) {
  if (e instanceof GenError) {
    console.error(`gen-design: ${e.message}`);
    process.exit(1);
  }
  throw e;
}
