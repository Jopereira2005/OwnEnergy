import React, { useEffect, useState } from 'react';

import styled from './style.module.scss'

import InputSelect from '../../Common/InputSelect';

import { GeneratorType } from '../../../interfaces/GeneratorType'

interface CreateModalProps {
  type: "device" | "generator";
  generatorTypes?: GeneratorType[]
  isOpen: boolean;
  toggleCreateModal: (status: boolean) => void;
  onSubmit: (dados: FormData) => void;
}

const CreateModal = ({ type, generatorTypes, isOpen, toggleCreateModal, onSubmit }: CreateModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("no_scroll");
    } else {
      document.body.classList.remove("no_scroll");
    }
  }, [isOpen]);

  const [name, setName] = useState('');
  const [power, setPower] = useState('');
  const [isDimmable, setIsDimmable] = useState(false);
  const [generatorType, setGeneratorType] = useState('');

  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit(formData);
    handleClose();
  }

  const handleClear = () => {
    setName('');
    setPower('');
    setIsDimmable(false);
  }

  const handleClose = () => {
    handleClear();
    toggleCreateModal(false)
  }

  useEffect(() => {
    setOptions(
      generatorTypes?.map((generatorTypes) => ({
        value: generatorTypes.typeName,
        label: generatorTypes.typeName,
      })) || []
    );
  }, [generatorTypes]);
  return (
    <>
      <div className={ `${styled.modal} ${isOpen ? styled.modal__open : styled.modal__closed}` }>
        <h1 className={ styled.modal__title }>Criar { type == "device" ? "Dispositivo" : "Gerador"}</h1>
        <form onSubmit={ handleSubmit } className={ styled.modal__form }>
          <div className={ styled.modal__form__container_input}>
            <div className={ styled.modal__form__container_input__input}>
              <label htmlFor="nome">Nome: </label>
              <input
                type="text"
                id="name"
                name="name"
                value={ name }
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite o nome..."
                required
                autoComplete="off"
              /> 
            </div>

            <div className={ styled.modal__form__container_input__input}>
              <label htmlFor="power">Potência({ type == "device" ? "W": "kW/h"}) : </label>
              <input
                type="number"
                id="power"
                name="power"
                value={ power }
                onChange={(e) => setPower(e.target.value)}
                placeholder="Digite a potência..."
                required
                autoComplete="off"
              /> 
            </div>

            { type == "device" &&
              <div className={ styled.modal__form__container_input__switch}>
              <h2 className={ styled.modal__form__container_input__switch__text }>Iluminação Ajustável</h2>
              <label className={ styled.modal__form__container_input__switch__input }>
                <input 
                  type="checkbox" 
                  id="dimmable"
                  name="dimmable"
                  checked={ isDimmable }
                  onChange={(e) => setIsDimmable(e.target.checked)}
                />
                <span className={ styled.modal__form__container_input__switch__slider }></span>
              </label>
              </div> 
            }

            { type == "generator" &&
              <div className={ styled.modal__form__container_input__select }>
                <label htmlFor="typeName">Tipo de Gerador:</label>
                <InputSelect 
                  id="typeName"
                  name="typeName"
                  options={ options } 
                  inputValue={ options.find(option => option.value === generatorType) || null }
                  onChangeFunc={ (option: { value: string; label: string; } | null) => setGeneratorType(option ? option.value : '') }
                  placeholder="Selecione uma tipo..." 
                  required
                />
            </div>
            }
          </div>
          <button type="submit" className={ styled.modal__form__button }>Criar</button>
        </form>
      </div>
      { isOpen && <div className={ styled.backdrop } onClick={ handleClose }></div> }
    </>
    
  )
}

export default CreateModal
