/**
 * Extracts API reference content from shared/ProAbonoLive/resources/ and
 * writes Docusaurus-ready MDX files to website/docs/api-reference/.
 *
 * Run from the repo root:
 *   node scripts/extract.mjs
 *
 * Re-run after every `shared/ProAbonoLive` submodule update. Commit the output.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const RESOURCES_DIR = join(REPO_ROOT, 'shared/ProAbonoLive/resources');
const OUTPUT_DIR = join(REPO_ROOT, 'website/docs/api-reference');

// Order matches shared/ProAbonoLive/specs/resources-index.md
const RESOURCES = [
  ['customer',                   'Customers'],
  ['offer',                      'Offers'],
  ['feature',                    'Features'],
  ['subscription',               'Subscriptions'],
  ['invoice',                    'Invoices'],
  ['balance-line',               'Balance Lines'],
  ['customer-address-billing',   'Customer Address Billing'],
  ['customer-address-shipping',  'Customer Address Shipping'],
  ['customer-payment-settings',  'Customer Payment Settings'],
  ['usage',                      'Usage'],
  ['quoting',                    'Quoting'],
];

// ─── Link rewriting ───────────────────────────────────────────────────────────

function rewriteLinks(text) {
  // index-<resource>.md#anchor  →  ./index#anchor
  text = text.replace(/\(index-[\w-]+\.md(#[\w-]+)?\)/g, (_, anchor) => `(./index${anchor ?? ''})`);
  // Cross-resource: ../resource/resource.action.md  →  ../resource/action
  text = text.replace(/\(\.\.\/([\w-]+)\/([\w-]+)\.([\w-]+)\.md\)/g, '(../$1/$3)');
  // Same-resource: resource.action.md  →  ./action
  text = text.replace(/\(([\w-]+)\.([\w-]+)\.md\)/g, '(./$2)');
  // ../../specs/enum.md#anchor  →  strip link, keep label text
  text = text.replace(/\[([^\]]+)\]\(\.\.\/\.\.\/specs\/enum\.md#[^)]+\)/g, '`$1`');
  return text;
}

// ─── Table processing ─────────────────────────────────────────────────────────

function isSeparatorRow(cells) {
  return cells.length > 0 && cells.every(c => /^:?-+:?$/.test(c));
}

function parseTableLines(lines) {
  const rows = lines.map(l => l.split('|').slice(1, -1).map(c => c.trim()));
  if (rows.length < 2) return null;
  const headers = rows[0];
  if (isSeparatorRow(rows[1])) {
    return { headers, dataRows: rows.slice(2) };
  }
  return null;
}

/**
 * Filter out Documented:no rows, remove the Documented column, rewrite links.
 * Returns the rendered table string, or '' if nothing remains.
 * Returns the original lines joined if there is no Documented column.
 */
function processTable(tableLines) {
  const parsed = parseTableLines(tableLines);
  if (!parsed) return tableLines.map(rewriteLinks).join('\n');

  const { headers, dataRows } = parsed;
  const docIdx = headers.findIndex(h => h.toLowerCase() === 'documented');

  if (docIdx === -1) {
    return tableLines.map(rewriteLinks).join('\n');
  }

  const filteredRows = dataRows.filter(r => (r[docIdx] ?? '').toLowerCase() === 'yes');
  if (filteredRows.length === 0) return '';

  const newHeaders = headers.filter((_, i) => i !== docIdx);
  const newRows = filteredRows.map(r => r.filter((_, i) => i !== docIdx));

  const headerLine = '| ' + newHeaders.join(' | ') + ' |';
  const sepLine = '|' + newHeaders.map(() => ' --- ').join('|') + '|';
  const rowLines = newRows.map(r => '| ' + r.map(rewriteLinks).join(' | ') + ' |');

  return [headerLine, sepLine, ...rowLines].join('\n');
}

// ─── Content processing ───────────────────────────────────────────────────────

/**
 * Process an array of lines: collect table blocks, filter them,
 * rewrite links in all other lines.
 */
function processLines(lines) {
  const out = [];
  let tableBlock = [];

  function flushTable() {
    if (tableBlock.length === 0) return;
    const rendered = processTable(tableBlock);
    if (rendered) out.push(rendered);
    tableBlock = [];
  }

  for (const line of lines) {
    if (line.startsWith('|')) {
      tableBlock.push(line);
    } else {
      flushTable();
      out.push(rewriteLinks(line));
    }
  }
  flushTable();
  return out.join('\n');
}

/**
 * Extract the h1 title from the first `# ...` line.
 */
function extractH1(lines) {
  const l = lines.find(l => l.startsWith('# '));
  return l ? l.replace(/^#+ /, '').replace(/`/g, '').trim() : '';
}

// ─── Index file processing ────────────────────────────────────────────────────

/**
 * Parse the Actions table from the index file to get a list of documented actions.
 * Returns [{ action, description }] for actions where Documented === 'yes'.
 */
function extractDocumentedActions(indexContent) {
  const lines = indexContent.split('\n');
  const actions = [];
  let inActionsSection = false;
  let tableStarted = false;
  let headerCols = null;

  for (const line of lines) {
    if (line.startsWith('## Actions')) {
      inActionsSection = true;
      tableStarted = false;
      headerCols = null;
      continue;
    }
    if (inActionsSection && line.startsWith('## ')) {
      break; // left the Actions section
    }
    if (!inActionsSection || !line.startsWith('|')) continue;

    const cells = line.split('|').slice(1, -1).map(c => c.trim());

    if (!headerCols) {
      headerCols = cells.map(c => c.toLowerCase());
      continue;
    }
    if (isSeparatorRow(cells)) continue;

    const docIdx = headerCols.indexOf('documented');
    if (docIdx !== -1 && (cells[docIdx] ?? '').toLowerCase() !== 'yes') continue;

    // Extract action slug from the filename in the link: ](resource.action.md)
    const actionCell = cells[headerCols.indexOf('action')] ?? '';
    const linkMatch = actionCell.match(/\]\(([\w-]+)\.([\w-]+)\.md\)/);
    if (!linkMatch) continue;

    const action = linkMatch[2];
    const descIdx = headerCols.indexOf('description');
    const description = descIdx !== -1 ? cells[descIdx] : '';
    actions.push({ action, description });
  }
  return actions;
}

function processIndexFile(content) {
  const allLines = content.split('\n');
  const title = extractH1(allLines);

  // Drop the first # heading line
  let droppedTitle = false;
  const bodyLines = allLines.filter(l => {
    if (!droppedTitle && l.startsWith('# ')) { droppedTitle = true; return false; }
    return true;
  });

  const body = processLines(bodyLines);
  const fm = `---\ntitle: "${title}"\n---`;
  return fm + '\n\n' + body.replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}

// ─── Action file processing ───────────────────────────────────────────────────

function processActionFile(content, description) {
  const allLines = content.split('\n');

  // Drop the first # heading line
  let droppedTitle = false;
  const bodyLines = allLines.filter(l => {
    if (!droppedTitle && l.startsWith('# ')) { droppedTitle = true; return false; }
    return true;
  });

  // Filter endpoint bullet items marked "· Documented: no"
  const filteredLines = bodyLines.filter(l => !/·\s*Documented:\s*no/i.test(l));

  const body = processLines(filteredLines);
  // Escape double quotes in description for YAML frontmatter
  const safeTitle = description.replace(/"/g, '\\"');
  const fm = `---\ntitle: "${safeTitle}"\n---`;
  return fm + '\n\n' + body.replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}

// ─── Main ─────────────────────────────────────────────────────────────────────

mkdirSync(OUTPUT_DIR, { recursive: true });

for (let i = 0; i < RESOURCES.length; i++) {
  const [resource, label] = RESOURCES[i];
  const srcDir = join(RESOURCES_DIR, resource);
  const outDir = join(OUTPUT_DIR, resource);
  mkdirSync(outDir, { recursive: true });

  // _category_.json
  writeFileSync(
    join(outDir, '_category_.json'),
    JSON.stringify({ label, position: i + 1 }, null, 2) + '\n',
  );

  // index.mdx
  const indexPath = join(srcDir, `index-${resource}.md`);
  const indexContent = readFileSync(indexPath, 'utf-8');
  writeFileSync(join(outDir, 'index.mdx'), processIndexFile(indexContent));

  // Action files
  const documentedActions = extractDocumentedActions(indexContent);
  for (const { action, description } of documentedActions) {
    const srcPath = join(srcDir, `${resource}.${action}.md`);
    let actionContent;
    try {
      actionContent = readFileSync(srcPath, 'utf-8');
    } catch {
      console.warn(`  [warn] Missing: ${resource}.${action}.md`);
      continue;
    }
    writeFileSync(join(outDir, `${action}.mdx`), processActionFile(actionContent, description));
    process.stdout.write(`  + ${resource}/${action}.mdx\n`);
  }

  console.log(`✓ ${resource} (${documentedActions.length} actions)`);
}

console.log('\nDone — website/docs/api-reference/ updated.');
