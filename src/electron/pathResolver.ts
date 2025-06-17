import { fileURLToPath } from 'url';
import { app } from 'electron';
import path from 'path';

import { isDev } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getPreloadPath() {
    const preloadPath = isDev()
        ? path.join(app.getAppPath(), 'dist-electron', 'preload.cjs')
        : path.join(__dirname, 'preload.cjs');

    console.log('preloadPath:', preloadPath);
    return preloadPath;
}