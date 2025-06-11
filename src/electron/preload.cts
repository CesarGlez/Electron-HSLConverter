import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
   selectVideo: () => ipcRenderer.invoke('select-video-file'),

   selectFolder: () => ipcRenderer.invoke('select-folder-to-save'),

   convertToHLS: (filePath: string, fileName: string) => ipcRenderer.invoke('convert-to-hls-path', filePath, fileName),

   onHLSProgress: (callback: (fileName: string) => void) => {
      ipcRenderer.on('hls-progress', (_event, fileName) => {
         callback(fileName);
      });
   },
   
   dropFile: (filePath: string) => ipcRenderer.invoke('drop-file', filePath),
});

let progressCallback: ((event: Electron.IpcRendererEvent, fileName: string) => void) | null = null;

contextBridge.exposeInMainWorld('hlsEvents', {
   onProgress: (callback: (fileName: string) => void) => {
      progressCallback = (_event, fileName) => callback(fileName);
      ipcRenderer.on('hls-progress', progressCallback);
   },
   offProgress: () => {
      if (progressCallback) {
         ipcRenderer.removeListener('hls-progress', progressCallback);
         progressCallback = null;
      }
   },
   copyFiles: (originFolder: string, saveFolder: string) => ipcRenderer.invoke('copy-files', originFolder, saveFolder),
});
