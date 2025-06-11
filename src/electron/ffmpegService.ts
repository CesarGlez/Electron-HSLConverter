import * as ffmpegStatic from 'ffmpeg-static';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

import { getPathName } from './utils.js';

const ffmpegPath = ffmpegStatic.default as unknown as string;

export const convertToHLS = ( inputPath: string, outputDir: string, onProgress?: (fileName: string) => void): Promise<void> => {
   return new Promise((resolve, reject) => {
      try {
         if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
   
         const { name } = getPathName(inputPath);
   
         const outputFile = path.join(outputDir, `${name}.m3u8`);
   
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
   
         ffmpeg.stdout.on('data', (__) => { });
   
         ffmpeg.stderr.on('data', (data) => {
   
            const text = data.toString();
   
            const fileConverted = text.split('/').pop();
   
            const outputLog = `Original file transform to ${fileConverted}`
   
            if (outputLog && onProgress) {
               onProgress(outputLog);
            }
         });
   
         ffmpeg.on('close', (code) => {
            if (code === 0) {
               if (onProgress) onProgress(`${name} file successfully converted!`);
               resolve();
            } else {
               reject(new Error(`ffmpeg exited with code ${code}`));
            }
         });
      } catch (error: any) {
         throw error
      }
   });
};
