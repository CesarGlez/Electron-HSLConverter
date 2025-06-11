import { useEffect, useRef, useState } from 'react';

export const useDragDrop = () => {
   const dropRef = useRef<HTMLDivElement>(null);
   const dragCounter = useRef(0);

   const [isOver, setIsOver] = useState(false);


   // const handleDrop = async (file: File | null) => {
   //    if (!file) return;

   //    const fileWithPath = file as File & { path?: string };

   //    if (fileWithPath.type !== 'video/mp4') {
   //       alert('Solo se permiten archivos .mp4');
         
   //       return;
   //    }

   //    if (!fileWithPath.path) {
   //       console.warn('No se puede acceder a file.path. ¿Estás corriendo en Electron y arrastrando desde el sistema de archivos?');

   //       alert('No se pudo obtener la ruta del archivo.');
         
   //       return;
   //    }

   //    console.log("📁 Ruta del archivo:", fileWithPath.path);

   //    try {
   //       const fileInfo = await window.electronAPI.dropFile(fileWithPath.path);
   //       console.log("✅ Archivo procesado por Electron:", fileInfo);
   //    } catch (error) {
   //       console.error("❌ Error al procesar archivo en Electron:", error);
   //    }
   // };

   const handleDropEvent = (e: DragEvent) => {
      e.preventDefault();
    
      const files = e.dataTransfer?.files;
      if (!files || files.length === 0) {
        alert('No se detectaron archivos');
        return;
      }
    
      const file = files[0] as File & { path?: string };      
    
      if (!file.path) {
        alert('No se puede obtener la ruta del archivo. ¿Estás arrastrando desde el explorador?');
        return;
      }
    
      console.log('Ruta del archivo:', file.path);
    };
    
    // Esta sí se usará en el drag&drop
    const handleFileDrop = (file: File | null) => {
      if (!file) {
        alert('No se detectó ningún archivo.');
        return;
      }
    
      const fileWithPath = file as File & { path?: string };
    
      if (!fileWithPath.path) {
        alert('No se puede obtener la ruta del archivo. ¿Estás arrastrando desde el explorador?');
        return;
      }
    
      console.log('Ruta del archivo:', fileWithPath.path);
    
      // Lógica adicional si quieres comunicarte con el backend o Electron:
      // window.electronAPI.dropFile(fileWithPath.path)
    };
    

   const setupDragEvents = (
      element: HTMLElement,
      onEnter: () => void,
      onDrop: (file: File | null) => void,
      onLeave: () => void
   ) => {
      const handleDragEnter = (e: DragEvent) => {
         e.preventDefault();
         dragCounter.current++;
         if (dragCounter.current === 1) onEnter();
      };

      const handleDragOver = (e: DragEvent) => {
         e.preventDefault();
      };

      const handleDragLeave = (e: DragEvent) => {
         e.preventDefault();
         dragCounter.current--;
         if (dragCounter.current === 0) onLeave();
      };

      const handleDropEvent = (e: DragEvent) => {
         e.preventDefault();
         dragCounter.current = 0;

         const files = e.dataTransfer?.files;
         const file = files?.length ? files[0] : null;

         onDrop(file);
         onLeave();
      };

      element.addEventListener('dragenter', handleDragEnter);
      element.addEventListener('dragover', handleDragOver);
      element.addEventListener('dragleave', handleDragLeave);
      element.addEventListener('drop', handleDropEvent);

      return () => {
         element.removeEventListener('dragenter', handleDragEnter);
         element.removeEventListener('dragover', handleDragOver);
         element.removeEventListener('dragleave', handleDragLeave);
         element.removeEventListener('drop', handleDropEvent);
      };
   };

   useEffect(() => {
      const dropZone = dropRef.current;
      if (!dropZone) return;

      const cleanup = setupDragEvents(
         dropZone,
         () => setIsOver(true),
         (file) => {
            handleFileDrop(file),
            setIsOver(false);
         },
         () => setIsOver(false)
      );

      return cleanup;
   }, []);

   return {
      dropRef,
      isOver,
   };
};
