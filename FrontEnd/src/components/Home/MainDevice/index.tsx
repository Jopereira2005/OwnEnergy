import { useEffect, useState } from 'react';
import { SwiperSlide } from 'swiper/react'

import styled from './style.module.scss'

import Slider from '../Slider'
import CardDevice from '../CardDevice'

import { Room } from '../../../interfaces/Room'
import { Device } from '../../../interfaces/Device'

import { AddIcon } from '../../../assets/Common/Add'
import { EditIcon } from '../../../assets/Common/Edit'

interface mainDeviceProps {
  listDevices: Device[],
  listRooms: Room[],
  toggleCreateModal: ( 
    status: boolean, 
    selectedRoomId?: Room
  ) => void;
  toggleEditModal: ( 
    status: boolean, 
    selectedItem?: Device
  ) => void;
  toggleCreateRoomModal: (status: boolean) => void,
  toggleEditRoomModal: (
    status: boolean, 
    selectedRoom?: Room
  ) => void,
  changeDeviceState: (id: string) => Promise<boolean>
}

const MainDevice = ({listDevices, listRooms, toggleCreateModal, toggleEditModal, toggleCreateRoomModal, toggleEditRoomModal, changeDeviceState}: mainDeviceProps) => {
  const [filteredDevices, setfilteredDevices] = useState<Device[]>([]);

  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
  
  const [selectedRoomData, setSelectedRoomData] = useState<Room>({name: ""});

  const sendRoomData = (id_room: string | null) => {
    const selectededRoom = listRooms.find((room: Room) => room.id === id_room);
    if(selectededRoom !== selectedRoomData) 
      setSelectedRoomData(selectededRoom || {name: ""});  
  };

  const handleMouseDown = (room: Room) => {
    const timer = setTimeout(() => {
      toggleEditRoomModal(true, room)
    }, 100);
    setPressTimer(timer);
  };

  const handleMouseUp = () => {
    if(pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };
  

  useEffect(() => {
    if (selectedRoomData.id && !listRooms.find(room => room.id === selectedRoomData.id)) {
      setSelectedRoomData(listRooms[0] || { name: "" });
    }
  }, [listRooms]);

  useEffect(() => {
    selectedRoomData ?
     setfilteredDevices(listDevices.filter((item) => item.roomId === selectedRoomData.id))
     : setfilteredDevices([]); 
  }, [selectedRoomData, listDevices]);

  return (
    <>
      <div className={ styled.main_device }>
        <div className={ styled.main_device__carousel }>
          <Slider onSlideChangeFunc={ sendRoomData }>
            <SwiperSlide><button className="create_button" onClick={ () => toggleCreateRoomModal(true) }>Criar <AddIcon className="create_button__icon"/></button></SwiperSlide>
            { listRooms.map((room) => (
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
            { selectedRoomData.name !== '' ? 
                <h1 className={ styled.main_device__cards__header__text }>{ selectedRoomData.name }</h1> : 
                (listRooms.length !== 0) ? 
                  <h1 className={ styled.main_device__cards__menssage} >Selecione algum ambiente ;)</h1> : 
                  <h1 className={ styled.main_device__cards__menssage} >Crie algum ambiente para começar ;)</h1>
            }

            {
              selectedRoomData.name !== '' && 
              <div className={ styled.main_device__cards__header__icons }>
                <AddIcon onClick={ () => toggleCreateModal(true, selectedRoomData) } className={ styled.main_device__cards__header__icons__add }/>
                <EditIcon onClick={ () => toggleEditRoomModal(true, selectedRoomData)} className={ styled.main_device__cards__header__icons__edit }
                />
              </div>  
            }
          </div>
            { (filteredDevices.length == 0 && selectedRoomData.name !== '') ? 
              <h1 className={ styled.main_device__cards__menssage }>Cadastre algum dispositivo para começar ;)</h1>
            : undefined }
          <div className={ styled.main_device__cards__body }>
            { filteredDevices.map((device) => (
              <CardDevice
                key={ device.id }
                device={ device }
                chanceDeviceState={ changeDeviceState }
                toggleEditModal = { () => toggleEditModal(true, device) }
              />
            ))}
          </div>
        </div>
      </div>
    </> 
  )
}

export default MainDevice