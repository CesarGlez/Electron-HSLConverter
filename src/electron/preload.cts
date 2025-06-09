// const electron = require('electron');

// electron.contextBridge.exposeInMainWorld("electron", {
//     subscibreStattistcs: (callback: (stattiscs: any) => void) => callback({}),
//     getStaticData: () => console.log('static')
// })

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  convertToHLS: (fileBuffer: Uint8Array, fileName: string) =>
    ipcRenderer.invoke('convert-to-hls-buffer', fileBuffer, fileName),

  seleccionarCarpeta: () =>
    ipcRenderer.invoke('seleccionar-carpeta'),
});

contextBridge.exposeInMainWorld('hlsEvents', {
  onProgress: (callback: (fileName: string) => void) => {
    ipcRenderer.on('hls-progress', (_event, fileName) => callback(fileName));
  },
  offProgress: (callback: (fileName: string) => void) => {
    ipcRenderer.removeListener('hls-progress', (_event, fileName) =>
      callback(fileName)
    );
  },
  moverArchivos: (origen: string, destino: string) =>
    ipcRenderer.invoke('mover-archivos', origen, destino),
});