import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

import { getFfmpegPath } from './ffmpegPath.js';

export const convertToHLSProd = async (inputPath: string,outputDir: string,onProgress?: (fileName: string) => void
 ): Promise<void> => {
   return new Promise(async (resolve, reject) => {
     try {
       const ffmpegPath = getFfmpegPath();
 
       if (!fs.existsSync(outputDir)) {
         fs.mkdirSync(outputDir, { recursive: true });
       }
 
       const { name } = path.parse(inputPath);
       const outputFile = path.join(outputDir, `${name}.m3u8`);
 
       const args = [
        '-i', inputPath,
        '-c:v', 'libx264',
        '-profile:v', 'high',
        '-preset', 'fast',
        '-crf', '20',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-start_number', '0',
        '-hls_time', '20',
        '-hls_list_size', '0',
        '-f', 'hls',
        outputFile,
      ];
      
 
       const ffmpeg = spawn(ffmpegPath, args);
 
       ffmpeg.stderr.on('data', (data) => {
         const text = data.toString();
         const fileConverted = text.split('/').pop();
         if (fileConverted && onProgress) {
           onProgress(fileConverted);
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
       reject(error);
     }
   });
 };
