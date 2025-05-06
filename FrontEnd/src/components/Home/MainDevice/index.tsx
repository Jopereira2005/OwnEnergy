import { useEffect, useRef, useState } from 'react';
import { SwiperSlide } from 'swiper/react'

import styled from './style.module.scss'

import Slider from '../Slider'
import CardDevice from '../CardDevice'

import CreateModal from '../../Home/CreateModal'
import CreateRoomModal from '../../Home/CreateRoomModal'
import EditModal from '../../Home/EditModal'
import EditRoomModal from '../../Home/EditRoomModal'
import AlertNotification from '../../Common/AlertNotification'

import { Room } from '../../../interfaces/Room'
import { Device } from '../../../interfaces/Device'

import { AddIcon } from '../../../assets/Home/Add'

import roomService from '../../../services/roomService';
import deviceService from '../../../services/deviceService';

interface mainDeviceProps {
  listDevices: Device[],
  listRooms: Room[],
  toggleCreateModal: () => void,
  openEditModal: () => void,
  loadDevices: () => Promise<void>,
  loadRooms: () => Promise<void>
}

const MainDevice = ({listDevices, listRooms, toggleCreateModal, openEditModal, loadDevices, loadRooms}: mainDeviceProps) => {
  const _ = {  name: "", }

  const [devices, setDevices] = useState<Device[]>(listDevices);
  const [rooms, setRooms] = useState<Room[]>(listRooms);
  const [filteredDevices, setfilteredDevices] = useState<Device[]>([]);

  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [alertProps, setAlertProps] = useState({ message: '', timeDuration: 0, type: 'error' as 'success' | 'error'});
  const [alertOpen, setAlertOpen] = useState(false);
  
  const [selectDeviceData, setSelectDeviceData] = useState<Device>(_);
  const [selectRoomData, setSelectRoomData] = useState<Room>(_);
  const [selectRoomEditData, setSelectRoomEditData] = useState<Room>(_);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditRoomModalOpen, setIsEditRoomModalOpen] = useState(false);

  const toggleCreateRoomModal = () => {
    setIsCreateRoomModalOpen(!isCreateRoomModalOpen);
  };

  const toggleEditRoomModal = () => {
    setIsEditRoomModalOpen(!isEditRoomModalOpen);
  };

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
      toggleAlertOpen(3000, "Dispositivo deletado com sucesso", "success");
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
      toggleAlertOpen(3000, "Erro ao tentar mudar o estado do dispositivo.", "error")
    }
  };

  const editDevice = async (data: FormData, id: string) => {
    const name = String(data.get('name')).trim();
    const room = String(data.get('room'));
    const intensity = Number(data.get('intensity')); 
    
    if(selectDeviceData.name !== name)  {
      await deviceService.update_device_name(id, name);
      toggleAlertOpen(3000, "Dispositivo alterado com sucesso", "success");
    }
    
    if(selectDeviceData.roomId !== room) {
      await deviceService.update_device_room(id, room);
      toggleAlertOpen(3000, "Dispositivo alterado com sucesso", "success");
    }

    if(selectDeviceData.intensity !== intensity) {
      await deviceService.update_device_dim(id, intensity);
      toggleAlertOpen(3000, "Dispositivo alterado com sucesso", "success");
    }

    loadDevices();
    listDevicesByRoom();
  };

  const sendDeviceData = (id: string) => {
    const selectedCard = devices.find((device: Device) => device.id === id);
    if (selectedCard) 
      setSelectDeviceData(selectedCard);
  };

  const deleteRoom = async ( id: string ) => {
    try {
      await roomService.delete_room(id);
      toggleAlertOpen(3000, "Ambiente deletado com sucesso", "success");
      loadRooms();
      setSelectRoomData(_);
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
      toggleAlertOpen(3000, error, "error")
    }
  };
  
  const editRoom = async (data: FormData, id: string) => {
    const name = String(data.get('name')).trim();

    try {
      if(selectRoomData.name !== name) {
        const response = await roomService.update_room( id, String(name).trim() )
        if(response.error)
          throw response.error

        toggleAlertOpen(3000, "Ambiente atualizado com sucesso.", "success")
        selectRoomData.id === id && setSelectRoomData({
          name: String(name).trim(),
        }) 
      }    
      loadRooms()
      
    } catch(error: any) {
      toggleAlertOpen(3000, error, "error")
    }
  };

  const sendRoomData = (id_room: string | null) => {
    const selectedRoom = rooms.find((room: Room) => room.id === id_room);
    if(selectedRoom !== selectRoomData) 
      setSelectRoomData(selectedRoom || _);  
  };

  const handleMouseDown = (room: Room) => {
    const timer = setTimeout(() => {
      setSelectRoomEditData(room || _)
      toggleEditRoomModal()
    }, 1500);
    setPressTimer(timer);
  };

  const handleMouseUp = () => {
    if(pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const toggleAlertOpen = ( timeDuration: number, message: string, type: 'success' | 'error') => {
    setAlertProps({
      message: message,
      timeDuration: timeDuration,
      type: type,
    })
    setAlertOpen(true);
  };
 
  useEffect(() => {
    console.log(filteredDevices);
    setfilteredDevices( devices.filter((item) => 
      item.roomId == selectRoomData.id));
  }, [ selectRoomData, devices, rooms ]);

  return (
    <>
      <div className={ styled.main_device }>
        <div className={ styled.main_device__carousel }>
          <Slider onSlideChangeFunc={ sendRoomData }>
            <SwiperSlide><button className="create_button" onClick={ toggleCreateRoomModal }>Criar <AddIcon className="create_button__icon"/></button></SwiperSlide>
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
            { selectRoomData.name !== '' && <AddIcon onClick={ toggleCreateModal } className={ styled.main_device__cards__header__icon }/>}  
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
                onClickFunc = { openEditModal }
                sendData={ sendDeviceData }
              />
            ))}
          </div>
        </div>
      </div>

      <CreateRoomModal 
        isOpen={ isCreateRoomModalOpen } 
        toggleCreateRoomModal={ toggleCreateRoomModal } 
        onSubmit={ createRoom }
      />

      <EditRoomModal
        room={ selectRoomEditData }
        isOpen={ isEditRoomModalOpen }
        toggleEditRoomModal={ toggleEditRoomModal }
        deleteRoomFunc={ deleteRoom }
        onSubmit={ editRoom }
      />

      <AlertNotification
        {...alertProps}
        state={alertOpen}
        handleClose={() => setAlertOpen(false)}      
      />
    </> 
  )
}

export default MainDevice