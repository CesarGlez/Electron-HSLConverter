import * as ffmpegStatic from 'ffmpeg-static';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const ffmpegPath = ffmpegStatic.default as unknown as string;

export const convertToHLS = (
  inputPath: string,
  outputDir: string,
  onProgress?: (fileName: string) => void
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const outputFile = path.join(outputDir, 'index.m3u8');

    const args = [
      '-i', inputPath,
      '-codec', 'copy',
      '-start_number', '0',
      '-hls_time', '10',
      '-hls_list_size', '0',
      '-f', 'hls',
      outputFile,
    ];

    const ffmpeg = spawn(ffmpegPath, args);

    ffmpeg.stdout.on('data', (data) => {
      console.log(`[ffmpeg stdout]: ${data}`);
    });

    ffmpeg.stderr.on('data', (data) => {
      const text = data.toString();
      console.error(`[ffmpeg stderr]: ${text}`);

      const match = text.match(/Opening '(.+?\.ts)' for writing/);
      if (match && onProgress) {
        onProgress(match[1]);
      }
    });

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        if (onProgress) onProgress('index.m3u8');
        resolve();
      } else {
        reject(new Error(`ffmpeg exited with code ${code}`));
      }
    });
  });
};
