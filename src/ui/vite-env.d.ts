interface Window {
  electronAPI: {
    convertToHLS: (
      fileBuffer: Uint8Array,
      fileName: string,
      outputDir?: string
    ) => Promise<{ success: boolean; outputPath?: string; message?: string }>;

    seleccionarCarpeta: () => Promise<string | null>;
  };

  hlsEvents: {
    onProgress: (callback: (_event: any, fileName: string) => void) => void;
    offProgress: (callback: (_event: any, fileName: string) => void) => void;
    moverArchivos: (origen: string, destino: string) => Promise<void>;
  };
}
