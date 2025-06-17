import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import ffmpegPath from 'ffmpeg-static';

import path from 'path';
import fs from 'fs';
import os from 'os';

import { getPreloadPath } from './pathResolver.js';
import { getPathName, isDev } from './utils.js';
import { ffmpegService } from './ffmpegService.js';

app.on("ready", () => {

    try {
        if (!fs.existsSync(ffmpegPath.toString())) {
            console.error("FFmpeg binary does not exist at path:", ffmpegPath);
        } else {
            console.log("FFmpeg binary found at:", ffmpegPath);
            try {
                fs.chmodSync(ffmpegPath.toString(), 0o755);
                console.log("chmod +x applied successfully");
            } catch (chmodError) {
                console.error("Error applying chmod +x:", chmodError);
            }
        }
    } catch (fsError) {
        console.error("Error verifying FFmpeg binary:", fsError);
    }

    const mainWindow = new BrowserWindow({
        width: 770,
        height: 595,
        backgroundColor: '#151515',
        resizable: false,
        webPreferences: {

            preload: getPreloadPath(),
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: true,
            sandbox: false,
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

    ipcMain.handle('drop-file', async (event, filePath) => {
        console.log('Archivo recibido en Electron:', filePath);

        return { filePath, status: 'ok' };
    });     

    ipcMain.handle( 'convert-to-hls-path', async (_event, filePath: string, fileName: string) => {
        try {
            const tempDir = path.join(os.tmpdir(), 'electron-hls');

            const outputDir = path.join(
                tempDir,
                path.basename(fileName, path.extname(fileName)) + '-hls'
            );

            const onProgress = (fileGenerated: string) => {
                _event.sender.send('hls-progress', fileGenerated);
            };

            const ffmpeg = await ffmpegService.create();
            
            await ffmpeg.convertToHLS(filePath, outputDir, onProgress);

            return { success: true, outputPath: outputDir };
        } catch (error: any) {
            console.error('Error al convertir video desde path:', error);
            return { success: false, message: error.message };
        }
    });
    ipcMain.handle('cancel-conversion', () => {
        try {
           ffmpegService.cancelCurrent();
           
           console.log('cancel');
           return { success: true, message: 'Conversión cancelada' };

        } catch (err: any) {
           return { success: false, message: err.message };
        }
     });

    ipcMain.handle('select-folder-to-save', async () => {
        const result = await dialog.showOpenDialog({
            properties: ['openDirectory'],
        });

        if (result.canceled || result.filePaths.length === 0) {
            return null;
        }

        return result.filePaths[0];
    });

    ipcMain.handle('copy-files', async (_event, sourceDir: string, destDir: string) => {
        try {

            if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

            const files = fs.readdirSync(sourceDir);

            const path_name_file = getPathName(sourceDir).name.replace('-hls', '');
            const new_folder_name = `M3U8-Content-${path_name_file}`;
            const targetFolderPath = path.join(destDir, new_folder_name);

            fs.mkdirSync(targetFolderPath, { recursive: true });

            for (const file of files) {

                const srcFile = path.join(sourceDir, file);
                const destFile = path.join(targetFolderPath, file);
                fs.copyFileSync(srcFile, destFile);
            }

            return { success: true };
        } catch (error: any) {
            console.error('Error moviendo archivos:', error);
            return { success: false, message: error.message };
        }
    });
});
