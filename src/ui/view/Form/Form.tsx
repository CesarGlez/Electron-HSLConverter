import { useTranslation } from 'react-i18next';
import { ActionButton } from '../Components/ActionButton/ActionButton';
import { DragDrop } from '../Components/DragDrop/DragDrop';
import { Footer } from '../Components/Footer/Footer';
import { useM3u8Converter } from '../hooks/useM3u8Converter';
import './form_styles_.scss';

export const FormConverter = () => {

   const { t } = useTranslation();

   const {
      selectedFile,
      isConverting,
      readyToConvert,
      readyToDownload,
      percentConverted,
      fileConvertedMessage,

      handleConvert,
      cancelProsses,
      handleFileChange,
      saveFilesInSystem,
   } = useM3u8Converter();

   return (
      <div className='main-container'>
         <section className='wokespace-container'>
            <div className='drop-container'>
               <DragDrop
                  enable={ isConverting }
                  openFileExplorer={ handleFileChange }
               />
            </div>
            
            <div className='process-container'>
               <div className='file-info-container'>
                  <div className='description'>
                     <div className='info-row'>
                        <p className='info-file label'>{ t('form.file_uploaded') }</p>
                        <p className='info-file uploaded'>
                           { selectedFile ? selectedFile.fileName : ''}
                        </p>
                     </div>

                     <div className='info-row'>
                        <p className='info-file label'>{ t('form.file_size') }</p>
                        <p className='info-file uploaded'>
                           {selectedFile ? `${(selectedFile.fileSize / (1024 * 1024)).toFixed(2)} MB` : ''}
                        </p>
                     </div>
                  </div>

                  <div className='start-btn-container'>
                     <ActionButton
                        label={
                           !isConverting
                           ? t('form.btn_label.start_conversion')
                           : t('form.btn_label.cancel_conversion')
                        }
                        enable={ readyToConvert }
                        onClick={() => !isConverting ? handleConvert() : cancelProsses() }
                     />
                  </div>
               </div>
               
               <div className='divine-container'>
                  <div className='line-divine'/>
               </div>

               <div className='process-convert-container'>
                  <div className='convert-desc'>
                     <div className='file-converted-container'>
                        <p className='file-converted-label'>{`${percentConverted}%`}</p>
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
                        label={ t('form.btn_label.save_files') }
                        enable={ readyToDownload }
                        onClick={ saveFilesInSystem }
                     />
                  </div>
               </div>

            </div>

         </section>
         
         <section className='footer-space'>
            <Footer process_label={ fileConvertedMessage }/>
         </section>
      </div>
   );
};