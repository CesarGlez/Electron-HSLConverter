import path from 'path';
import fs from 'fs';
import { app } from 'electron';

const isProd = app.isPackaged;

export function getFfmpegPath(): string {
  if (isProd) {
    const unpackedPath = path.join(
      process.resourcesPath,
      'app.asar.unpacked',
      'node_modules',
      'ffmpeg-static',
      'ffmpeg' + (process.platform === 'win32' ? '.exe' : '')
    );

    if (!fs.existsSync(unpackedPath)) {
      throw new Error(`FFmpeg binary not found at ${unpackedPath}`);
    }

    return unpackedPath;
  } else {
    const ffmpegPath: string = require('ffmpeg-static');
    return ffmpegPath;
  }
}
