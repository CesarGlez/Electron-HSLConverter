import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import os from 'os';

import { getPreloadPath } from './pathResolver.js';
import { convertToHLS } from './ffmpegService.js';
import { getPathName, isDev } from './utils.js';

app.on("ready", () => {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: getPreloadPath(),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    if (isDev()) {
        mainWindow.loadURL('http://localhost:5123');
    } else {
        mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'));
    }


    ipcMain.handle('select-video-file', async () => {
        const { canceled, filePaths } = await dialog.showOpenDialog({
          properties: ['openFile'],
          filters: [{ name: 'Videos', extensions: ['mp4', 'mov', 'avi', 'mkv'] }],
        });
      
        if (canceled || filePaths.length === 0) {
          return null;
        }
      
        const filePath = filePaths[0];
        const stats = fs.statSync(filePath);
      
        return {
            filePath: filePath,
            fileName: path.basename(filePath),
            fileSize: stats.size
        };
      });
    
    ipcMain.handle(
        'convert-to-hls-path',
        async (_event, filePath: string, fileName: string) => {
            try {
                const tempDir = path.join(os.tmpdir(), 'electron-hls');

                const outputDir = path.join(
                    tempDir,
                    path.basename(fileName, path.extname(fileName)) + '-hls'
                );

                const onProgress = (fileGenerated: string) => {
                    _event.sender.send('hls-progress', fileGenerated);
                };

                await convertToHLS(filePath, outputDir, onProgress);

                return { success: true, outputPath: outputDir };
            } catch (error: any) {
                console.error('Error al convertir video desde path:', error);
                return { success: false, message: error.message };
            }
        }
    );

    ipcMain.handle('seleccionar-carpeta', async () => {
        const result = await dialog.showOpenDialog({
            properties: ['openDirectory'],
        });

        if (result.canceled || result.filePaths.length === 0) {
            return null;
        }

        return result.filePaths[0];
    });

    ipcMain.handle('mover-archivos', async (_event, sourceDir: string, destDir: string) => {
        try {

            if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

            const files = fs.readdirSync(sourceDir);

            const path_name_file = getPathName(sourceDir).replace('-hls', '')
            const new_folder_name = `M3U8-Content-${path_name_file}`;
            const targetFolderPath = path.join(destDir, new_folder_name);

            fs.mkdirSync(targetFolderPath, { recursive: true });

            for (const file of files) {

                const srcFile = path.join(sourceDir, file);
                const destFile = path.join(targetFolderPath, file);
                fs.copyFileSync(srcFile, destFile);
            }

            // const parentDir = path.dirname(sourceDir);
            // fs.rmSync(parentDir, { recursive: true, force: true });

            return { success: true };
        } catch (error: any) {
            console.error('Error moviendo archivos:', error);
            return { success: false, message: error.message };
        }
    });
});
