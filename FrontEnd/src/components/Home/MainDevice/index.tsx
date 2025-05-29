import { useEffect, useRef, useState } from 'react';
import { SwiperSlide } from 'swiper/react'

import styled from './style.module.scss'

import Slider from '../Slider'
import CardDevice from '../CardDevice'

import { Room } from '../../../interfaces/Room'
import { Device } from '../../../interfaces/Device'
import { Generator } from '../../../interfaces/Generator'


import { AddIcon } from '../../../assets/Common/Add'
import { TrashIcon } from '../../../assets/Common/Trash'

import roomService from '../../../services/roomService';
import deviceService from '../../../services/deviceService';

interface mainDeviceProps {
  listDevices: Device[],
  listRooms: Room[],
  toggleCreateModal: (status: boolean) => void,
  toggleEditModal: ( 
    status: boolean, 
    selectedItem?: Device | Generator
  ) => void;
  toggleCreateRoomModal: (status: boolean) => void,
  toggleEditRoomModal: (
    status: boolean, 
    selectedRoom?: Room
  ) => void,
  toggleAlert:(
    timeDuration: number, 
    message: string, 
    type: 'success' | 'error'
  ) => void,
  loadDevices: () => Promise<void>,
  loadRooms: () => Promise<void>
}

  

const MainDevice = ({listDevices, listRooms, toggleCreateModal, toggleEditModal, toggleCreateRoomModal, toggleEditRoomModal, toggleAlert,  loadDevices, loadRooms}: mainDeviceProps) => {
  const [devices, setDevices] = useState<Device[]>(listDevices);
  const [rooms, setRooms] = useState<Room[]>(listRooms);
  const [filteredDevices, setfilteredDevices] = useState<Device[]>([]);

  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
  
  const [selectDeviceData, setSelectDeviceData] = useState<Device>({name: "", roomId: ""});
  const [selectRoomData, setSelectRoomData] = useState<Room>({name: ""});
  const [selectRoomEditData, setSelectRoomEditData] = useState<Room>({name: ""});

  const listDevicesByRoom = async () => {
    try {
      let response: any = '';
      if(selectRoomData.id) {
        response = await deviceService.list_device_by_room(selectRoomData.id);
      }
      setfilteredDevices(response.data.items);
    } catch (error) {
      setfilteredDevices([]);
    }
  };

  const deleteDevice = async ( id: string ) => {
    try {
      await deviceService.delete_device(id);
      toggleAlert(3000, "Dispositivo deletado com sucesso", "success");
      loadDevices()
      listDevicesByRoom()
    } catch (error) {
      // setDevices([]);
    }
  };

  const createDevice = async (formData: FormData ) => {
    const nome = formData.get('name');
    const ajustavel = formData.get('dimmable'); 

    try {
      await deviceService.create_device(selectRoomData.id || '', String(nome), Boolean(ajustavel));
      loadDevices();
      listDevicesByRoom();
    } catch (error) {
      return error;
    }

  };

  const changeDeviceState = async( id: string ) => {
    try {
      await deviceService.device_switch( id );
      loadDevices()
    } catch(error: any) {
      toggleAlert(3000, "Erro ao tentar mudar o estado do dispositivo.", "error")
    }
  };

  const deleteRoom = async ( id: string ) => {
    try {
      await roomService.delete_room(id);
      toggleAlert(3000, "Ambiente deletado com sucesso", "success");
      loadRooms();
      setSelectRoomData({name: ""});
    } catch (error) {
      // setDevices([]);
    }
  };

  const createRoom = async (formData: FormData) => {
    const name = formData.get('name');
    
    try {
      const response = await roomService.create_room( String(name).trim() );
      if(response.error) 
        throw response.error
      loadRooms()
    } catch(error: any) {
      toggleAlert(3000, error, "error")
    }
  };
  
  const editRoom = async (data: FormData, id: string) => {
    const name = String(data.get('name')).trim();

    try {
      if(selectRoomData.name !== name) {
        const response = await roomService.update_room( id, String(name).trim() )
        if(response.error)
          throw response.error

        toggleAlert(3000, "Ambiente atualizado com sucesso.", "success")
        selectRoomData.id === id && setSelectRoomData({
          name: String(name).trim(),
        }) 
      }    
      loadRooms()
      
    } catch(error: any) {
      toggleAlert(3000, error, "error")
    }
  };

  const sendRoomData = (id_room: string | null) => {
    const selectedRoom = rooms.find((room: Room) => room.id === id_room);
    if(selectedRoom !== selectRoomData) 
      setSelectRoomData(selectedRoom || {name: ""});  
  };

  const handleMouseDown = (room: Room) => {
    const timer = setTimeout(() => {
      setSelectRoomEditData(room || {name: ""})
      toggleEditRoomModal(true)
    }, 1500);
    setPressTimer(timer);
  };

  const handleMouseUp = () => {
    if(pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  useEffect(() => {
    setfilteredDevices( devices.filter((item) => 
      item.roomId == selectRoomData.id));
  }, [ selectRoomData, devices, rooms ]);

  return (
    <>
      <div className={ styled.main_device }>
        <div className={ styled.main_device__carousel }>
          <Slider onSlideChangeFunc={ sendRoomData }>
            <SwiperSlide><button className="create_button" onClick={ () => toggleCreateRoomModal(true) }>Criar <AddIcon className="create_button__icon"/></button></SwiperSlide>
            { rooms.map((room) => (
              <SwiperSlide
                key={ room.id }
                data-id={ room.id }   
              ><button
                onMouseDown={() => handleMouseDown(room)}
                onMouseUp={ handleMouseUp }
                onMouseLeave={ handleMouseUp }
                onTouchStart={ () => handleMouseDown(room) }
                onTouchEnd={ handleMouseUp }
              >{ room.name }</button>
              </SwiperSlide>
            ))}
          </Slider>
        </div>

        <div className={ styled.main_device__cards }>
          <div className={ styled.main_device__cards__header }>
            { selectRoomData.name !== '' ? 
              <h1 className={ styled.main_device__cards__header__text }>{ selectRoomData.name }</h1> : 
              <h1 className={ styled.main_device__cards__menssage} >Selecione algum ambiente ;)</h1>
            }

            {
              selectRoomData.name !== '' && 
              <div className={ styled.main_device__cards__header__icons }>
                <AddIcon onClick={ () => toggleCreateModal(true) } className={ styled.main_device__cards__header__icons__add }/>
                {/* <TrashIcon onClick={ 
                  () => toggleConfirmModal(
                    `Você realmente deseja excluir este ambiente ${selectRoomData.name}`, 
                    () => deleteRoom(selectRoomData.id || '')
                  )} className={ styled.main_device__cards__header__icons__trash }
                /> */}
              </div>  
            }
          </div>
            { (filteredDevices.length == 0 && selectRoomData.name !== '') ? 
              <h1 className={ styled.main_device__cards__menssage }>Cadastre algum dispositivo para começar ;)</h1>
            : undefined }
          <div className={ styled.main_device__cards__body }>
            { filteredDevices.map((device) => (
              <CardDevice
                key={ device.id }
                device={ device }
                chanceStateFunc={ changeDeviceState }
                onClickFunc = { () => toggleEditModal(true, device)}
              />
            ))}
          </div>
        </div>
      </div>
    </> 
  )
}

export default MainDevice