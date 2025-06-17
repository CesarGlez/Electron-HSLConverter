import { add_icon, upload_file } from '../../../image-collection/imageCollection';
import { useDragDrop } from './hooks/useDragDrop';
import './drag_drop_styles.scss';
import { useTranslation } from 'react-i18next';
import { dialog } from 'electron';

interface Props {
   enable: boolean;
   openFileExplorer: () => void;
}

export const DragDrop = ({ enable, openFileExplorer }: Props) => {

   const { t } = useTranslation();
   
   const { dropRef, isOver } = useDragDrop();

   return (
      <div className="drop-zone" ref={dropRef}>
         <div className='label-container'>
            <img className='upload-icon' src={upload_file.url} alt={upload_file.alt}/>

            <p>{ t('drop_component.drag_here') }</p>

            <p>{ t('drop_component.or') }</p>
         </div>

         <div className='btn-upload' onClick={ openFileExplorer }>
            <p>{ t('drop_component.choose_file') }</p>
         </div>

         <div className={`overlay ${ isOver ? 'active' : 'hide' }`}>
            <div className='icon-container'>
               <img
                  className='add-icon' 
                  src={ add_icon.url }
                  alt={ add_icon.alt }
               />
            </div>
            <p>{ t('drop_component.drop_here') }</p>
         </div>

         {
            enable &&
            <div className='disable-overlay'/>
         }
      </div>
   );
}