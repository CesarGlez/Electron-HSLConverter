import './action_button_cstyles.scss'

interface Props {
   label:      string;
   enable:     boolean
   onClick:    () => void;
}

export const ActionButton = ({ label, enable, onClick }: Props) => {
   return(
      <div
         className={`btn-start-convert ${ enable ? 'btn-enable' : 'btn-disable'}`}
         onClick={() => { enable ? onClick() : null }}
      >
         <p className='btn-convert-label'>{ label }</p>
      </div>
   );
}