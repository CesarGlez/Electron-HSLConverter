interface Window {
  electronAPI: {
    convertToHLS: (
      filePath: string,
      fileName: string
    ) => Promise<{ success: boolean; outputPath?: string; message?: string }>;

    onHLSProgress: (callback: (fileName: string) => void) => void;
    
    selectFolder: () => Promise<string | null>;

    selectVideo: () => Promise<{ filePath: string; fileName: string; fileSize: number } | null>;
    
    dropFile: (filePath: string) => Promise<{ filePath: string; fileName: string; fileSize: number } | null>;
  };

  hlsEvents: {
    onProgress: (callback: (fileName: string) => void) => void;
    offProgress: () => void;
    
    copyFiles: (origen: string, destino: string) => Promise<void>;
  };
}

interface File {
  path: string;
}
