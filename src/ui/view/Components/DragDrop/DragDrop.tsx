import { useEffect, useRef, useState } from 'react';
import { add_icon, upload_file } from '../../../image-collection/imageCollection';
import './drag_drop_styles.scss';
import { useDragDrop } from './hooks/useDragDrop';

interface Props {
   handleChangeFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
   openFileExplorer: () => void;
}

export const DragDrop = ({ handleChangeFile, openFileExplorer }: Props) => {

   const { dropRef, elmentInZone } = useDragDrop(handleChangeFile);

   return (

      <div
         className="drop-zone"
         ref={dropRef}
      >
         <img
            className='upload-icon'
            src={upload_file.url}
            alt={upload_file.alt}
         />
         <p>Arrastra tu video aquí</p>

         <p>o</p>

         <div className='btn-upload' onClick={openFileExplorer}>
            <p>Selecciona el archivo</p>
         </div>

         <input
            type="file"
            name="upload-file"
            className="file-input"
            accept='video/mp4'
            onChange={handleChangeFile}
         />

         <div className={`overlay ${ elmentInZone ? 'active' : 'hide' }`}>
            <div className='icon-container'>
               <img
                  className='add-icon' 
                  src={ add_icon.url }
                  alt={ add_icon.alt }
               />
            </div>
            <p>Soltar video aquí</p>
         </div>
      </div>
   );
}