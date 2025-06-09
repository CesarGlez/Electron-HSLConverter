import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import os from 'os';

import { getPreloadPath } from './pathResolver.js';
import { convertToHLS } from './ffmpegService.js';
import { isDev } from './utils.js';

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

    // ✅ Handler para conversión
    ipcMain.handle(
        'convert-to-hls-buffer',
        async (event, fileBuffer: Uint8Array, fileName: string) => {
            try {
                const tempDir = path.join(os.tmpdir(), 'electron-hls');
                if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

                const inputPath = path.join(tempDir, fileName);
                fs.writeFileSync(inputPath, Buffer.from(fileBuffer));

                const outputDir = path.join(
                    tempDir,
                    path.basename(fileName, path.extname(fileName)) + '-hls'
                );

                const onProgress = (fileGenerated: string) => {
                    event.sender.send('hls-progress', fileGenerated);
                };

                await convertToHLS(inputPath, outputDir, onProgress);

                return { success: true, outputPath: outputDir };
            } catch (error: any) {
                console.error('Error al convertir video:', error);
                return { success: false, message: error.message };
            }
        }
    );

    // ✅ Handler para mover archivos
    ipcMain.handle('mover-archivos', async (_event, sourceDir: string, destDir: string) => {
        try {
            if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

            const files = fs.readdirSync(sourceDir);
            for (const file of files) {
                const srcFile = path.join(sourceDir, file);
                const destFile = path.join(destDir, file);
                fs.copyFileSync(srcFile, destFile);
            }
            return { success: true };
        } catch (error: any) {
            console.error('Error moviendo archivos:', error);
            return { success: false, message: error.message };
        }
    });

    // ✅ ✅ NUEVO: Handler para seleccionar carpeta
    ipcMain.handle('seleccionar-carpeta', async () => {
        const result = await dialog.showOpenDialog({
            properties: ['openDirectory'],
        });

        if (result.canceled || result.filePaths.length === 0) {
            return null;
        }

        return result.filePaths[0]; // solo retorna la primera carpeta seleccionada
    });
});
