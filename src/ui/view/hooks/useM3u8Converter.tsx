import { useEffect, useState } from 'react';

export const useM3u8Converter = () => {
   const [selectedFile, setSelectedFile] = useState<{ filePath: string; fileName: string; fileSize: number } | null>(null);
   const [conversionLogs, setConversionLogs] = useState<string[]>([]);
   const [isConverting, setIsConverting] = useState(false);
   const [filesConverted, setFileConverted] = useState('');
   
   const [readyToConvert, setReadyToConvert] = useState(false);
   const [readyToDownload, setReadyToDownload] = useState(false);

   useEffect(() => {
      const handleProgress = (fileName: string) => {
        setConversionLogs((prevLogs) => [...prevLogs, fileName]);
      };
    
      window.hlsEvents.onProgress(handleProgress);
    
      return () => {
        window.hlsEvents.offProgress();
      };
    }, []);
    

   const openSelectionFile = () => {
      const input_file = document.getElementsByName('upload-file')[0];
      input_file.click()
   }


   const handleFileChange = async () => {
      const result = await window.electronAPI.seleccionarVideo();
    
      if (result) {
         const { filePath } = result;
         
         setReadyToConvert(true);
         setSelectedFile(result);
         setConversionLogs([]);
         
         
      } else {
        console.log('Selección cancelada');
      }
   };

   const handleConvert = async () => {
      if (!selectedFile) return;
    
      setIsConverting(true);
    
      try {
         
         // @ts-ignore
        const filePath = selectedFile.filePath ?? '';
        const fileName = selectedFile.fileName ?? '';
        
        const result = await window.electronAPI.convertToHLS(filePath, fileName);
    
        if (result.success && result.outputPath) {
          setFileConverted(result.outputPath);
          setReadyToDownload(true);
        } else {
          alert(`Error: ${result.message || 'Error desconocido'}`);
        }
      } catch (error: any) {
        alert(`Error: ${error.message}`);
      } finally {
        setIsConverting(false);
      }
   };
    

   const saveFilesInSystem = async () => {
      const savePath = await window.electronAPI.seleccionarCarpeta();
      if (savePath) {

         await window.hlsEvents.moverArchivos(filesConverted, savePath);

         alert('Conversión completada y archivos guardados.');

      } else {
         alert('Guardado cancelado.');
      }
   }

   return {
      selectedFile,
      conversionLogs,
      isConverting,
      readyToConvert,
      readyToDownload,
      
      handleConvert,
      handleFileChange,
      saveFilesInSystem,
      openSelectionFile,
   };
}