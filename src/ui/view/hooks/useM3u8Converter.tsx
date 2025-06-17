import { useEffect, useState } from 'react';

export const useM3u8Converter = () => {
   const [selectedFile, setSelectedFile] = useState<{ filePath: string; fileName: string; fileSize: number } | null>(null);
   const [conversionLogs, setConversionLogs] = useState<string[]>([]);

   const [isConverting, setIsConverting] = useState(false);
   const [percentConverted, setPercentConverted] = useState(0);
   const [filesConverted, setFileConverted] = useState('');
   const [fileConvertedMessage, setFileConvertedMessage] = useState('');

   const [readyToConvert, setReadyToConvert] = useState(false);
   const [readyToDownload, setReadyToDownload] = useState(false);

   useEffect(() => {
      window.electronAPI.onHLSProgress((fileName: string) => {
         const output_slice = fileName.split(' - ');
         
         setFileConverted(output_slice[0]);
         setFileConvertedMessage(output_slice[0]);
         setPercentConverted(parseInt(output_slice[1]));
      });
   }, []);


   const openSelectionFile = () => {
      const input_file = document.getElementsByName('upload-file')[0];

      input_file.click()
   }

   const handleFileChange = async () => {
      const result = await window.electronAPI.selectVideo();
      setReadyToDownload(false);

      if (result) {
         setReadyToConvert(true);
         setSelectedFile(result);
         setConversionLogs([]);
      }
   };

   const dropFile = async (file: React.ChangeEvent<HTMLInputElement>) => {
      // const result = await window.electronAPI.dropFile('');

      // if ( result ) {
      //    setReadyToConvert(true);
      //    setSelectedFile(result);
      //    setConversionLogs([]);
      // } 
   };

   const handleConvert = async () => {
      if (!selectedFile) return;

      setIsConverting(true);

      try {
         
         const filePath = selectedFile.filePath ?? '';
         const fileName = selectedFile.fileName ?? '';

         const result = await window.electronAPI.convertToHLS(filePath, fileName);
         
         if (result.success && result.outputPath) {

            const output_slice = result.outputPath.split(' - ');

            setFileConverted(output_slice[0]);
            setFileConvertedMessage(output_slice[0]);
            setPercentConverted(parseInt(output_slice[1]));

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

   const cancelProsses = async () => {
      try {
         const result = await window.electronAPI.cancelConversion();         
         console.log(result);

         setIsConverting(false);
         setPercentConverted(0);
         setFileConverted('');
         setFileConvertedMessage('Process canceled');

      } catch (error: any) {
         alert(`Error: ${error.message}`);
      }
   }

   const saveFilesInSystem = async () => {
      const savePath = await window.electronAPI.selectFolder();
      if (savePath) {

         await window.hlsEvents.copyFiles(filesConverted, savePath);

         alert('Conversión completada y archivos guardados.');

      } else {
         alert('Guardado cancelado.');
      }
   }

   return {
      selectedFile,
      isConverting,
      conversionLogs,
      readyToConvert,
      readyToDownload,
      percentConverted,
      fileConvertedMessage,

      dropFile,
      handleConvert,
      cancelProsses,
      handleFileChange,
      saveFilesInSystem,
      openSelectionFile,
   };
}