import React, { useEffect, useState } from 'react';

import styled from './style.module.scss'

import InputSelect from '../../Common/InputSelect';

import { Room } from '../../../interfaces/Room'
import { Device } from '../../../interfaces/Device'
import { Generator } from '../../../interfaces/Generator'


import { TrashIcon } from '../../../assets/Common/Trash'

interface EditModalProps {
  selectedItem: Device | Generator,
  rooms?: Room[],
  isOpen: boolean,
  toggleEditModal: (status: boolean) => void,
  deleteFunc: ( id: string ) => Promise<void>,
  onSubmit: (dados: FormData, id: string) => void,
}

const EditModal = ({ selectedItem, rooms, isOpen, toggleEditModal, deleteFunc, onSubmit }: EditModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("no_scroll");
    } else {
      document.body.classList.remove("no_scroll");
    }
  }, [isOpen]);

  const [item, setItem] = useState<Device | Generator>({name: ''});
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  
  const [name, setName] = useState('');
  const [power, setPower] = useState(0);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [intensity, setIntensity] = useState<number | null>(null);

  function isDevice(item: Device | Generator): item is Device {
    return (item as Device).roomId !== undefined;
  }

  const setDefaultData = () => {
    setName(item.name ?? '')
    setPower(item.power ?? 0);
    if ( isDevice(item) ) {
      setRoomId(item.roomId ?? '');
      setIntensity(item.intensity ?? 100);
    } 
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit(formData, item.id || '');
    toggleEditModal(false);
  }
  
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (item.id) {
      deleteFunc(item.id);
    }
    toggleEditModal(false);
  }

   useEffect(() => {
    setOptions(
      rooms?.map((room) => ({
        value: room.id!,
        label: room.name,
      })) || []
    );
  }, [rooms]);

  useEffect(() => {
    setItem(selectedItem);
    setName(selectedItem.name ?? '');
    setPower(selectedItem.power ?? 0);

    if (isDevice(selectedItem)) {
      setRoomId(selectedItem.roomId ?? '');
      setIntensity(selectedItem.intensity ?? 100);
    }
  }, [isOpen == true]);

  return (
    <>
      <div className={ `${styled.modal} ${isOpen ? styled.modal__open : styled.modal__closed}` }>
        <h1 onClick={ setDefaultData } className={ styled.modal__title }>Editar { isDevice(item) ? "Dispositivo" : "Gerador"}</h1>
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
                placeholder="Digite o nome do dispositivo..."
                required
                autoComplete="off"
              /> 
            </div>

            <div className={ styled.modal__form__container_input__input}>
              <label htmlFor="power">Potência({ isDevice(item) ? "W": "kW/h"}) : </label>
              <input
                type="number"
                id="power"
                name="power"
                value={ power }
                onChange={(e) => setPower(Number(e.target.value))}
                placeholder="Digite a potência..."
                required
                autoComplete="off"
              /> 
            </div>

            { isDevice(item) && item.isDimmable && 
              <div className={ styled.modal__form__container_input__range }>
                <label htmlFor="intensity" >Intensidade: { intensity }</label>
                <input
                  id="intensity"
                  name="intensity"
                  type="range" 
                  min="0" 
                  max="100" 
                  value={ intensity ?? 0 }
                  onChange={(e) => setIntensity(Number(e.target.value))}
                />
              </div>
            }

            { isDevice(item) &&
              <div className={ styled.modal__form__container_input__select }>
                <label htmlFor="room">Selecione a Sala:</label>
                <InputSelect 
                  id="room"
                  name="room"
                  options={ options } 
                  inputValue={ options.find(option => option.value === roomId) || null }
                  onChangeFunc={ (option: { value: string; label: string; } | null) => setRoomId(option ? option.value : '') }
                  placeholder="Selecione uma sala..." 
                  required
                />
              </div>
            }
          </div>

          <div className={ styled.modal__form__button_group }>
            <button className={ styled.modal__form__button_group__button_trash } onClick={ handleDelete }><TrashIcon className={ styled.modal__form__button_group__button_trash__icon }/></button>
            <button type="submit" className={ styled.modal__form__button_group__button }>Editar</button>
          </div>
        </form>
      </div>
      { isOpen && <div className={ styled.backdrop } onClick={ () => toggleEditModal(false) }></div> }
    </> 
  )
}

export default EditModal