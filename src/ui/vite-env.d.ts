interface Window {
  electronAPI: {
    convertToHLS: (
      filePath: string,
      fileName: string
    ) => Promise<{ success: boolean; outputPath?: string; message?: string }>;
    
    seleccionarCarpeta: () => Promise<string | null>;

    seleccionarVideo: () => Promise<{ filePath: string; fileName: string; fileSize: number } | null>;
  };

  hlsEvents: {
    onProgress: (callback: (fileName: string) => void) => void;
    offProgress: () => void;
    
    moverArchivos: (origen: string, destino: string) => Promise<void>;
  };
}
