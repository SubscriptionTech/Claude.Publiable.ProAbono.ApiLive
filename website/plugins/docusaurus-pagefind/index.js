import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default function pagefindPlugin(_context, _options) {
  return {
    name: 'docusaurus-pagefind',
    getThemePath() {
      return path.resolve(__dirname, './theme');
    },
  };
}
