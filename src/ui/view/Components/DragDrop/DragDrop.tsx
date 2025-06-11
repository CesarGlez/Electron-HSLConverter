import { add_icon, upload_file } from '../../../image-collection/imageCollection';
import { useDragDrop } from './hooks/useDragDrop';
import './drag_drop_styles.scss';

interface Props {
   
   openFileExplorer: () => void;
}

export const DragDrop = ({ openFileExplorer }: Props) => {

   const { dropRef, isOver } = useDragDrop();

   return (
      <div className="drop-zone" ref={dropRef}>
         <img className='upload-icon' src={upload_file.url} alt={upload_file.alt}/>

         <p>Arrastra tu video aquí</p>

         <p>o</p>

         <div className='btn-upload' onClick={ openFileExplorer }>
            <p>Selecciona el archivo</p>
         </div>

         <div className={`overlay ${ isOver ? 'active' : 'hide' }`}>
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