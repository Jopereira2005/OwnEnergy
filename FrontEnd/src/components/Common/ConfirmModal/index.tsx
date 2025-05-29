import { useEffect, useState } from 'react';

import styled from './style.module.scss'

interface CreateModalProps {
  message: string;
  isOpen: boolean;
  funcToConfirm: () => void;
  handleClose: () => void;
}

const ConfirmModal = ({ message, isOpen, funcToConfirm, handleClose }: CreateModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("no_scroll");
    } else {
      document.body.classList.remove("no_scroll");
    }
  }, [isOpen]);

  const [text, setText] = useState(message);

  const handleConfirm = () => {
    setText('');
    funcToConfirm();
    handleClose();
  }

  const handleCancel = () => {
    setText('');
    handleClose();
  }

  return (
    <>
      <div className={ `${styled.modal} ${isOpen ? styled.modal__open : styled.modal__closed}` }>
        <h1 className={ styled.modal__text }>{ text }</h1>
        <div className={ styled.modal__buttons }>
          <button onClick={ handleConfirm } className={ styled.modal__buttons__confirm }>Confirmar</button>
          <button onClick={ handleCancel } className={ styled.modal__buttons__cancel }>Cancelar</button>
        </div>    
      </div>
      { isOpen && <div className={ styled.backdrop } onClick={ handleConfirm }></div> }
    </>
    
  )
}

export default ConfirmModal
