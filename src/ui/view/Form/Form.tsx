import { ActionButton } from '../Components/ActionButton/ActionButton';
import { DragDrop } from '../Components/DragDrop/DragDrop';
import { useM3u8Converter } from '../hooks/useM3u8Converter';
import './form_styles_.scss';

export const FormConverter = () => {

   const {
      selectedFile,
      readyToConvert,
      readyToDownload,
      fileConvertedMessage, 
      
      dropFile,
      handleConvert,
      handleFileChange,
      saveFilesInSystem,
      
   } = useM3u8Converter();

   return (
      <div className='main-container'>
         <div className='drop-container'>
            <DragDrop openFileExplorer={ handleFileChange }/>
         </div>
         
         <div className='process-container'>
            <div className='file-info-container'>
               <div className='description'>
                  <div className='info-row'>
                     <p className='info-file label'>Video cargado:</p>
                     <p className='info-file uploaded'>
                        { selectedFile ? selectedFile.fileName : ''}
                     </p>
                  </div>

                  <div className='info-row'>
                     <p className='info-file label'>Tamaño de archivo:</p>
                     <p className='info-file uploaded'>
                        {selectedFile ? `${(selectedFile.fileSize / (1024 * 1024)).toFixed(2)} MB` : ''}
                     </p>
                  </div>
               </div>

               <div className='start-btn-container'>
                  <ActionButton
                     label='Comenzar conversión'
                     enable={ readyToConvert }
                     onClick={ handleConvert }
                  />
               </div>
            </div>
            
            <div className='divine-container'>
               <div className='line-divine'/>
            </div>

            <div className='process-convert-container'>
               <div className='convert-desc'>
                  <div className='file-converted-container'>
                     <p className='file-converted-label'>{ fileConvertedMessage }</p>
                  </div>

                  {/* <div className='progress-bar-container'>
                     <div className='progress-bar'>
                        <div className='bar'>
                           {
                              Array.from({ length: 20 }).map((_, index) => (
                                 <div key={index} className='bar-element'></div>
                              ))
                           }
                        </div>
                        <p className='percent-label'>35%</p>
                     </div>
                  </div> */}
               </div>
               
               <div className='btn-container'>
                  <ActionButton
                     label='Descargar conversión'
                     enable={ readyToDownload }
                     onClick={ saveFilesInSystem }
                  />
               </div>
            </div>
         </div>
      </div>
   );
};