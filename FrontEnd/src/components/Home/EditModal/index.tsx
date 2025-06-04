import React, { useEffect, useState } from 'react';

import styled from './style.module.scss'

import InputSelect from '../../Common/InputSelect';

import { Room } from '../../../interfaces/Room'
import { Device } from '../../../interfaces/Device'
import { Generator } from '../../../interfaces/Generator'


import { TrashIcon } from '../../../assets/Common/Trash'

interface EditModalProps {
  device?: Device,
  generator?: Generator,
  rooms?: Room[],
  isOpen: boolean,
  toggleEditModal: (status: boolean) => void,
  deleteFunc: ( id: string ) => Promise<void>,
  onSubmit: (dados: FormData, id: string) => void,
}

const EditModal = ({ device, generator, rooms, isOpen, toggleEditModal, deleteFunc, onSubmit }: EditModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("no_scroll");
    } else {
      document.body.classList.remove("no_scroll");
    }
  }, [isOpen]);

  const [item, setItem] = useState<Device | Generator>({name: ''});

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

  const options = rooms?.map((room) => ({
    value: room.id!,
    label: room.name,
  })) || [];

  useEffect(() => {
    const selected = device || generator;
    if (!selected) return;

    setItem(selected);
    setName(selected.name ?? '');
    setPower(selected.power ?? 0);

    if (isDevice(selected)) {
      setRoomId(selected.roomId ?? '');
      setIntensity(selected.intensity ?? 100);
    }
  }, [isOpen == true]);

  return (
    <>
      <div className={ `${styled.modal} ${isOpen ? styled.modal__open : styled.modal__closed}` }>
        <h1 onClick={ setDefaultData } className={ styled.modal__title }>Editar Dispositivo</h1>
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

            {/* { item as Device && &&    
              <div className={ styled.modal__form__container_input__range }>
                <label htmlFor="brightness" >Brilho: { brightness }</label>
                <input
                  id="brightness"
                  name="brightness"
                  type="range" 
                  min="1" 
                  max="100" 
                  value={ brightness }
                  onChange={(e) => setBrightness(Number(e.target.value))}
                />
              </div>
            }
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
            </div> */}
          </div>

          <div className={ styled.modal__form__button_group }>
            <button className={ styled.modal__form__button_group__button_trash } onClick={ handleDelete }><TrashIcon className={styled.modal__form__button_group__button_trash__icon }/></button>
            <button type="submit" className={ styled.modal__form__button_group__button }>Editar</button>
          </div>
        </form>
      </div>
      { isOpen && <div className={ styled.backdrop } onClick={ () => toggleEditModal(false) }></div> }
    </> 
  )
}

export default EditModal