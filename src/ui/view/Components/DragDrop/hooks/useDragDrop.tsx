import { useEffect, useRef, useState } from 'react';

interface HookProps {
   handleChangeFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const useDragDrop = ( handleChangeFile: (e: React.ChangeEvent<HTMLInputElement>) => void) =>  {
   const dropRef = useRef<HTMLDivElement>(null);
   const dragCounter = useRef(0);

   const [elmentInZone, setElmentInZone] = useState(false);

   function setupDragAndDropEvents(
      element: HTMLElement,
      onEnter: () => void,
      onDrop: (file: File | null) => void,
      onLeave?: () => void
   ) {
      const handleDragEnter = (e: DragEvent) => {
         e.preventDefault();
         dragCounter.current++;
         if (dragCounter.current === 1) {
            onEnter();
         }
      };
   
      const handleDragOver = (e: DragEvent) => {
         e.preventDefault();
      };
   
      const handleDrop = (e: DragEvent) => {
         e.preventDefault();
         dragCounter.current = 0;
         const files = e.dataTransfer?.files;
         const file = files && files.length > 0 ? files[0] : null;
         onDrop(file);
      };
   
      const handleDragLeave = (e: DragEvent) => {
         e.preventDefault();
         dragCounter.current--;
         if (dragCounter.current === 0 && onLeave) {
            onLeave();
         }
      };
   
      element.addEventListener('dragenter', handleDragEnter);
      element.addEventListener('dragover', handleDragOver);
      element.addEventListener('drop', handleDrop);
      element.addEventListener('dragleave', handleDragLeave);
   
      return () => {
         element.removeEventListener('dragenter', handleDragEnter);
         element.removeEventListener('dragover', handleDragOver);
         element.removeEventListener('drop', handleDrop);
         element.removeEventListener('dragleave', handleDragLeave);
      };
   }
   
   useEffect(() => {
      const dropZone = dropRef.current;

      if (!dropZone) return;


      const cleanup = setupDragAndDropEvents(
         dropZone,
         () => {
            console.log('🔵 Entró archivo al área de drop');
            setElmentInZone(true);
         },
         (file) => {
            if (file && file.type === 'video/mp4') {
               // handleChangeFile(...) si quieres
               const fakeEvent = {
                  target: {
                    files: [file],
                  },
                } as unknown as React.ChangeEvent<HTMLInputElement>;
        
                handleChangeFile(fakeEvent);

               console.log('se solto');
            } else {
               alert('Solo se permiten archivos .mp4');
            }
            setElmentInZone(false);
            console.log('salio');
         },
         () => {
            console.log('salio');
            setElmentInZone(false);
         }
      );

      return cleanup;
   }, [handleChangeFile]);


   return { dropRef, dragCounter, elmentInZone };
}