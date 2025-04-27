import { useEffect, useState } from 'react';
import styled from './style.module.scss'

import Header from '../../components/Common/Header'
import SeachBar from '../../components/Common/SearchBar'
import NavBar from '../../components/Common/NavBar'
import MainDevice from '../../components/Home/MainDevice';

import EditModal from '../../components/Home/EditModal'
import AlertNotification from '../../components/Common/AlertNotification'

import { Device } from '../../interfaces/Device'
import { Room } from '../../interfaces/Room'

import deviceService from '../../services/deviceService';
import roomService from '../../services/roomService';
import MainGenerator from '../../components/Home/MainGenerator';

function Home() {
  const _ = {  name: "", }

  const [devices, setDevices] = useState<Device[]>([
    { id: "1", roomId: "1", name: "Dispositivo 1", status: "On"  },
    { id: "2", roomId: "1", name: "Dispositivo 2", status: "On"  },
    { id: "3", roomId: "1", name: "Dispositivo 3", status: "On"  },
    { id: "4", roomId: "2", name: "Dispositivo 4", status: "On"  },
    { id: "5", roomId: "2", name: "Dispositivo 5", status: "On"  },
    { id: "6", roomId: "2", name: "Dispositivo 6", status: "On"  },
    { id: "7", roomId: "3", name: "Dispositivo 7", status: "On"  },
    { id: "8", roomId: "3", name: "Dispositivo 8", status: "On"  },
    { id: "9", roomId: "3", name: "Dispositivo 9", status: "On"  }
  ]);

  const [rooms, setRooms] = useState<Room[]>([
    { id: "1", name: "Sala", userId: "1" }, 
    { id: "2", name: "Cozinha", userId: "1" },
    { id: "3", name: "Quarto", userId: "1"},
  ]);

  const [alertProps, setAlertProps] = useState({ message: '', timeDuration: 0, type: 'error' as 'success' | 'error'});
  const [alertOpen, setAlertOpen] = useState(false)

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectDeviceData, setSelectDeviceData] = useState<Device>(_);

  const [deviceGenerator, setDeviceGenerator] = useState(true);


  const toggleEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };

  const loadDevices = async () => {
    try {
      const response = await deviceService.list_device();
      const devices = response.data?.items || [];

      setDevices(devices);
    } catch (error) {
      // setDevices([]);
    }
  }

  const loadRooms = async () => {
    try {
      const response = await roomService.list_rooms();
      setRooms(response.data.items || [])
    } catch (error) {
      setRooms([]);
    }
  };

  const editDevice = async (data: FormData, id: string) => {
    const name = String(data.get('name')).trim();
    const room = String(data.get('room'));
    const brightness = Number(data.get('brightness')); 
    
    if(selectDeviceData.name !== name )  {
      await deviceService.update_device_name(id, name);
      toggleAlertOpen(3000, "Dispositivo alterado com sucesso", "success");
    }
    if(selectDeviceData.roomId !== room) {
      await deviceService.update_device_room(id, room);
      toggleAlertOpen(3000, "Dispositivo alterado com sucesso", "success");
    }

    if(selectDeviceData.brightness !== brightness) {
      await deviceService.update_device_dim(id, brightness);
      toggleAlertOpen(3000, "Dispositivo alterado com sucesso", "success");
    }

    loadDevices();
  };

  const deleteDevice = async ( id: string ) => {
    try {
      await deviceService.delete_device(id);
      toggleAlertOpen(3000, "Dispositivo deletado com sucesso", "success");
      loadDevices()  
    } catch (error) {
      // setDevices([]);
    }
  }

  const sendDeviceData = (id: string) => {
    const selectedCard = devices.find((device: Device) => device.id === id);
    if (selectedCard) 
      setSelectDeviceData(selectedCard);
  }
  
  const toggleAlertOpen = ( timeDuration: number, message: string, type: 'success' | 'error') => {
    setAlertProps({
      message: message,
      timeDuration: timeDuration,
      type: type,
    })
    setAlertOpen(true);
  };

  const switchDeviceGenerator = ( option: boolean ) => {
    if( deviceGenerator != option )
      setDeviceGenerator(option);
  }
  
  useEffect(() => {
    loadDevices();
    loadRooms();
  }, []);

  return (
    <div className={ styled.home }>
      <Header />
      <main className={ styled.main }>
        <SeachBar
          list={ devices }
          listRoom={ rooms }
          handleModalFunc={ toggleEditModal }
          sendData={ sendDeviceData }
        />

        <div className={ styled.main__buttons }>
          <button className={ `${styled.main__buttons__button} ${ deviceGenerator ? styled.main__buttons__button__active : '' }` } onClick={() => switchDeviceGenerator(true)} >Dispositivos</button>
          <button className={ `${styled.main__buttons__button} ${ !deviceGenerator ? styled.main__buttons__button__active : '' }`} onClick={() => switchDeviceGenerator(false)}>Geradores</button>
        </div>
        
        <MainDevice
          listRooms = { rooms }
          listDevices = { devices }
          isOpen={ deviceGenerator }
          loadRooms = { loadRooms }
          loadDevices = { loadDevices }
        />
         
        {/* <MainGenerator />  */}
      </main>
      <NavBar />
      <EditModal
        device={ selectDeviceData }
        rooms={ rooms }
        isOpen={ isEditModalOpen }
        toggleEditModal={ toggleEditModal }
        deleteDeviceFunc={ deleteDevice }
        onSubmit={ editDevice }
      />

      <AlertNotification
      {...alertProps}
      state={alertOpen}
      handleClose={() => setAlertOpen(false)}      
      />
    </div>
  )
}

export default Home
