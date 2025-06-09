import { useEffect, useState } from 'react';

export const useM3u8Converter = () => {
   const [selectedFile, setSelectedFile] = useState<File | null>(null);
   const [conversionLogs, setConversionLogs] = useState<string[]>([]);
   const [isConverting, setIsConverting] = useState(false);
   
   const [readyToConvert, setReadyToConvert] = useState(false);
   const [readyToDownload, setReadyToDownload] = useState(false);

   useEffect(() => {
      const listener = (_event: any, fileName: string) => {
         setConversionLogs((logs) => [...logs, fileName]);
      };

      window.hlsEvents.onProgress(listener);

      return () => {
         window.hlsEvents.offProgress(listener);
      };
   }, []);

   const openSelectionFile = () => {
      const input_file = document.getElementsByName('upload-file')[0];
      input_file.click()
   }

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;

      if( file ) {
         setReadyToConvert(true);
         setSelectedFile(file);
         setConversionLogs([]);
      }
   };

   const handleConvert = async () => {
      if (!selectedFile) {
         alert('Selecciona un archivo primero');
         return;
      }
      setIsConverting(true);

      const buffer = await selectedFile.arrayBuffer();
      const uint8Buffer = new Uint8Array(buffer);

      try {
         const result = await window.electronAPI.convertToHLS(uint8Buffer, selectedFile.name);

         if (result.success && result.outputPath) {

            const savePath = await window.electronAPI.seleccionarCarpeta();
            if (savePath) {

               await window.hlsEvents.moverArchivos(result.outputPath, savePath);

               alert('Conversión completada y archivos guardados.');
            } else {
               alert('Guardado cancelado.');
            }
         } else {
            alert(`Error: ${result.message || 'Error desconocido'}`);
         }
      } catch (error: any) {
         alert(`Error: ${error.message}`);
      } finally {
         setIsConverting(false);
      }
   };

   return {
      selectedFile,
      conversionLogs,
      isConverting,
      readyToConvert,
      readyToDownload,
      handleConvert,
      handleFileChange,
      openSelectionFile
   };
}