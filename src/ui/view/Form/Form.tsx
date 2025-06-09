import { upload_file } from '../../image-collection/imageCollection';
import { ActionButton } from '../Components/ActionButton/ActionButton';
import { DragDrop } from '../Components/DragDrop/DragDrop';
import { useM3u8Converter } from '../hooks/useM3u8Converter';
import './form_styles_.scss';

export const FormConverter = () => {

   const {
      selectedFile,
      isConverting,
      conversionLogs,
      readyToConvert,
      readyToDownload,
      
      handleConvert,
      handleFileChange,
      openSelectionFile
   } = useM3u8Converter();

   return (
      <div className='main-container'>
         <div className='drop-container'>
            <DragDrop openFileExplorer={ openSelectionFile } handleChangeFile={ handleFileChange }/>
         </div>
         
         <div className='process-container'>
            <div className='file-info-container'>
               
               <div className='info-row'>
                  <p className='info-file label'>Video cargado:</p>
                  <p className='info-file uploaded'>
                     { selectedFile ? selectedFile.name : ''}
                  </p>
               </div>

               <div className='info-row'>
                  <p className='info-file label'>Tamaño de archivo:</p>
                  <p className='info-file uploaded'>
                     {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : ''}
                  </p>
               </div>

               <div className='start-btn-container'>
                  <ActionButton
                     label='Comenzar conversión'
                     enable={ readyToConvert }
                     onClick={() => {}}
                  />
               </div>
            </div>
            
            <div className='divine-container'>
               <div className='line-divine'/>
            </div>

            <div className='process-convert-container'>
               <div className='file-converted-container'>
                  <p className='file-converted-label'>lorem_ipsum_dolor_sit.mp4 coverted to lorem_ipsum_dolor_sit104.ts in 7.240567 sec.</p>
               </div>

               <div className='progress-bar-container'>
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
               </div>
               
               <div className='btn-container'>
                  <ActionButton
                     label='Descargar conversión'
                     enable={ readyToDownload }
                     onClick={() => {}}
                  />
               </div>
            </div>
         </div>

         {/* <input type="file" accept="video/mp4" onChange={handleFileChange} />
            <button disabled={!selectedFile || isConverting} onClick={handleConvert}>
                {isConverting ? 'Convirtiendo...' : 'Convertir a HLS'}
            </button>

            <div>
                <h3>Archivos generados:</h3>
                <ul>
                    {conversionLogs.map((log, idx) => (
                        <li key={idx}>{log}</li>
                    ))}
                </ul>
            </div> */}
      </div>
   );
};
