import { spawn, ChildProcess } from 'child_process';
import { promises as fsPromises } from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import ffprobe from 'ffprobe-static';
import { app } from 'electron';
import path from 'path';
import fs from 'fs';

export class ffmpegService {
   private static currentInstance: ffmpegService | null = null;
   private ffmpegProcess: ChildProcess | null = null;

   private constructor(private ffmpegPath: string) {}

   // static async create(): Promise<ffmpegService> {
   //    const ffmpegPath = await this.getFfmpegPath();

   //    ffmpeg.setFfprobePath(ffprobe.path);

   //    const instance = new ffmpegService(ffmpegPath);
   //    ffmpegService.currentInstance = instance;
   //    return instance;
   // }

   static async create(): Promise<ffmpegService> {
      const ffmpegPath = await this.getFfmpegPath();
      const ffprobePath = await this.getFfprobePath();
   
      ffmpeg.setFfprobePath(ffprobePath);
   
      const instance = new ffmpegService(ffmpegPath);
      ffmpegService.currentInstance = instance;
      return instance;
   }

   static cancelCurrent(): void {
      if (this.currentInstance) {
         this.currentInstance.stopConversion();
      }
   }

   public stopConversion(): void {
      if (this.ffmpegProcess) {
         this.ffmpegProcess.kill('SIGINT');
         this.ffmpegProcess = null;
      }
   }

   public async convertToHLS(
      inputPath: string,
      outputDir: string,
      onProgress?: (msg: string) => void
   ): Promise<void> {
      if (!fs.existsSync(inputPath)) {
         throw new Error(`El archivo de entrada no existe: ${inputPath}`);
      }

      await this.ensureOutputDir(outputDir);

      const { name } = path.parse(inputPath);
      const outputFile = path.join(outputDir, `${name}.m3u8`);

      const duration = await this.getVideoDuration(inputPath);
      const hlsTime = 20;
      const totalSegments = Math.ceil(duration / hlsTime);
      let currentSegment = 0;

      const args = [
         '-i', inputPath,
         '-c:v', 'libx264',
         '-profile:v', 'high',
         '-preset', 'fast',
         '-crf', '20',
         '-c:a', 'aac',
         '-b:a', '192k',
         '-start_number', '0',
         '-hls_time', String(hlsTime),
         '-hls_list_size', '0',
         '-f', 'hls',
         outputFile,
      ];

      this.ffmpegProcess = spawn(this.ffmpegPath, args, {
         stdio: ['ignore', 'ignore', 'pipe'],
      });

      if (this.ffmpegProcess.stderr) {
         this.ffmpegProcess.stderr.on('data', (data) => {
            const text = data.toString();
            // console.log(text);

            if (text.includes('Exiting normally, received signal 2.')) {
               onProgress?.(`Converssion cancelde — 0%`);
            }

            if (text.includes('.ts')) {
               currentSegment++;
               
               const percent = Math.min((currentSegment / totalSegments) * 100, 100);
               
               console.log(percent === 100 );

               percent === 100
               ? onProgress?.('Conversion process completed successfully - 100%')
               : onProgress?.(`compressing segment ${name}${currentSegment} - ${percent.toFixed(2)}%`)
               
            }
         });
      }

      return new Promise((resolve, reject) => {
         this.ffmpegProcess?.on('close', (code, signal) => {
            this.ffmpegProcess = null;
            ffmpegService.currentInstance = null;

            if (signal === 'SIGINT') {
               return reject(new Error('Conversión cancelada por el usuario.'));
            }

            if (code === 0) {
               onProgress?.('Conversion process completed successfully - 100%');
               return resolve();
            } else {
               if( code === 255 ) {
                  return;
               }
               else {
                  return reject(new Error(`FFmpeg finalizó con código ${code}`));
               }
            }
         });

         this.ffmpegProcess?.on('error', (err) => {
            this.ffmpegProcess = null;
            ffmpegService.currentInstance = null;
            reject(err);
         });
      });
   }

   private async ensureOutputDir(outputDir: string): Promise<void> {
      try {
         await fsPromises.mkdir(outputDir, { recursive: true });
      } catch (err) {
         throw new Error(`No se pudo crear el directorio de salida: ${outputDir}`);
      }
   }

   private getVideoDuration(inputPath: string): Promise<number> {
      return new Promise((resolve, reject) => {
         ffmpeg.ffprobe(inputPath, (err, metadata) => {
            
            if (err) return reject(err);
            
            const duration = metadata?.format?.duration;
            
            if (duration) {
               resolve(duration);
            } else {
               reject(new Error('Duración no disponible en el archivo'));
            }
         });
      });
   }

   private static async getFfmpegPath(): Promise<string> {
      if (app.isPackaged) {
         const unpackedPath = path.join(
            process.resourcesPath,
            'app.asar.unpacked',
            'node_modules',
            'ffmpeg-static',
            'ffmpeg' + (process.platform === 'win32' ? '.exe' : '')
         );

         if (!fs.existsSync(unpackedPath)) {
            throw new Error(`No se encontró FFmpeg en: ${unpackedPath}`);
         }

         return unpackedPath;
      } else {
         const ffmpegModule = await import('ffmpeg-static');
         return (ffmpegModule.default || ffmpegModule) as unknown as string;
      }
   }

   private static async getFfprobePath(): Promise<string> {
      if (app.isPackaged) {
         const unpackedPath = path.join(
            process.resourcesPath,
            'app.asar.unpacked',
            'node_modules',
            'ffprobe-static',
            'bin',
            process.platform,
            process.arch,
            'ffprobe' + (process.platform === 'win32' ? '.exe' : '')
         );
         
         // const unpackedPath = path.join(
         //    process.resourcesPath,
         //    'app.asar.unpacked',
         //    'node_modules',
         //    'ffprobe-static',
         //    'ffprobe' + (process.platform === 'win32' ? '.exe' : '')
         // );
   
         if (!fs.existsSync(unpackedPath)) {
            throw new Error(`No se encontró ffprobe en: ${unpackedPath}`);
         }
   
         return unpackedPath;
      } else {
         const ffprobeModule = await import('ffprobe-static');
         return (ffprobeModule.default || ffprobeModule).path;
      }
   }
   
}
