import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  seleccionarVideo: () => ipcRenderer.invoke('select-video-file'),
  
  convertToHLS: (filePath: string, fileName: string) => ipcRenderer.invoke('convert-to-hls-path', filePath, fileName),

  seleccionarCarpeta: () => ipcRenderer.invoke('seleccionar-carpeta'),
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
  moverArchivos: (origen: string, destino: string) =>
    ipcRenderer.invoke('mover-archivos', origen, destino),
});
