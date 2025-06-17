import { useTranslation } from 'react-i18next';
import './footer_styles.scss';

interface Props {
   process_label: string
}

export const Footer = ({ process_label }: Props) => {
   
   const { t } = useTranslation();
   
   return(
      <div className='footer-main-contianer'>
         <div className='footer-content'>
            <div className='section-one'>
               <p className='txt-progress-label'>{ process_label }</p>
            </div>
            
            <div className='section-two'>
               <p className='txt-version-label'>{`${ t('footer.app_name') } - ${ t('footer.verssion') }`}</p>
            </div>
         </div>
      </div>
   );
}