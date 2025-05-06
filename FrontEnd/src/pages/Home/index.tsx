import { useEffect, useState, useRef } from 'react';
import styled from './style.module.scss'

import Header from '../../components/Common/Header'
import SeachBar from '../../components/Common/SearchBar'
import NavBar from '../../components/Common/NavBar'

import MainDevice from '../../components/Home/MainDevice';
import MainGenerator from '../../components/Home/MainGenerator';

import CreateModal from '../../components/Home/CreateModal'
import EditModal from '../../components/Home/EditModal'
import AlertNotification from '../../components/Common/AlertNotification'

import { Room } from '../../interfaces/Room'
import { Device } from '../../interfaces/Device'
import { Generator } from '../../interfaces/Generator'

import deviceService from '../../services/deviceService';
import roomService from '../../services/roomService';

function Home() {
  const _ = {  name: "", }

  const deviceMain = useRef<HTMLDivElement>(null);
  const generatorMain = useRef<HTMLDivElement>(null);

  const [rooms, setRooms] = useState<Room[]>([
    { id: "1", name: "Sala", userId: "1" }, 
    { id: "2", name: "Cozinha", userId: "1" },
    { id: "3", name: "Quarto", userId: "1"},
  ]);

  const [devices, setDevices] = useState<Device[]>([
    { id: "1", roomId: "1", name: "Dispositivo 1", status: "On" },
    { id: "2", roomId: "1", name: "Dispositivo 2", status: "On" },
    { id: "3", roomId: "1", name: "Dispositivo 3", status: "On" },
    { id: "4", roomId: "2", name: "Dispositivo 4", status: "On" },
    { id: "5", roomId: "2", name: "Dispositivo 5", status: "On" },
    { id: "6", roomId: "2", name: "Dispositivo 6", status: "On" },
    { id: "7", roomId: "3", name: "Dispositivo 7", status: "On" },
    { id: "8", roomId: "3", name: "Dispositivo 8", status: "On" },
    { id: "9", roomId: "3", name: "Dispositivo 9", status: "On" },
    { id: "10", roomId: "3", name: "Dispositivo 9", status: "On" },
    { id: "11", roomId: "3", name: "Dispositivo 9", status: "On" },
    { id: "12", roomId: "3", name: "Dispositivo 9", status: "On" },
    { id: "13", roomId: "3", name: "Dispositivo 9", status: "On" },
    { id: "14", roomId: "3", name: "Dispositivo 9", status: "On" },
    { id: "15", roomId: "3", name: "Dispositivo 9", status: "On" },
    { id: "16", roomId: "3", name: "Dispositivo 9", status: "On" },
    { id: "17", roomId: "3", name: "Dispositivo 9", status: "On" },
    { id: "18", roomId: "3", name: "Dispositivo 9", status: "On" },
    { id: "19", roomId: "3", name: "Dispositivo 9", status: "On" },
    { id: "20", roomId: "3", name: "Dispositivo 9", status: "On" },
    { id: "21", roomId: "3", name: "Dispositivo 9", status: "On" },
    { id: "22", roomId: "3", name: "Dispositivo 9", status: "On" },
    { id: "23", roomId: "3", name: "Dispositivo 9", status: "On" },
    { id: "24", roomId: "3", name: "Dispositivo 9", status: "On" },
    { id: "25", roomId: "3", name: "Dispositivo 9", status: "On" },
    { id: "26", roomId: "3", name: "Dispositivo 9", status: "On" },
    { id: "27", roomId: "3", name: "Dispositivo 9", status: "On" },
    { id: "28", roomId: "3", name: "Dispositivo 9", status: "On" },
    { id: "29", roomId: "3", name: "Dispositivo 9", status: "On" },
    { id: "30", roomId: "3", name: "Dispositivo 9", status: "On" },
  ]);

  const [generators, setGenerator] = useState<Generator[]>([
    { id: "1", name: "Dispositivo 1", status: "On" },
    { id: "2", name: "Dispositivo 2", status: "On" },
    { id: "3", name: "Dispositivo 3", status: "On" },
    { id: "4", name: "Dispositivo 4", status: "On" },
    { id: "5", name: "Dispositivo 5", status: "On" },
  ]);

  const [searchBarList, setSearchBarList] = useState<Device[] | Generator[]>([]);
  const [sendSearchBarData, setSendSearchBarData] = useState<Device | Generator>(_);
 
  const [selectDeviceData, setSelectDeviceData] = useState<Device>(_);
  const [selectGeneratorData, setSelectGeneratorData] = useState<Generator>(_);

  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const [type, setType] = useState<'device' | 'generator'>("device")

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertProps, setAlertProps] = useState({ message: '', timeDuration: 0, type: 'error' as 'success' | 'error'});


  const loadRooms = async () => {
    try {
      const response = await roomService.list_rooms();
      setRooms(response.data.items || [])
    } catch (error) {
      setRooms([]);
    }
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
  
  const loadGenerators = async () => {
    try {
      const response = await deviceService.list_device();
      const devices = response.data?.items || [];

      setDevices(devices);
    } catch (error) {
      // setDevices([]);
    }
  }

  const createDeviceGenerator = async ( formData: FormData ) => {
    const nome = formData.get('name');
    const ajustavel = formData.get('dimmable'); 

    if(type == "device") {
      try {
        // await deviceService.create_device(selectRoomData.id || '', String(nome), Boolean(ajustavel));
        loadGenerators();
      } catch (error) {
        return error;
      }
    } else {
      try {
        // await deviceService.create_device(selectRoomData.id || '', String(nome), Boolean(ajustavel));
        loadGenerators();
      } catch (error) {
        return error;
      }
    }
  };

  const editDevice = async ( data: FormData, id: string ) => {
    const name = String(data.get('name')).trim();
    const room = String(data.get('room'));
    const intensity = Number(data.get('intensity')); 
    
    if(selectDeviceData.name !== name )  {
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
  };

  const editGenerator = async ( data: FormData, id: string ) => {
    const name = String(data.get('name')).trim();
    const room = String(data.get('room'));
    const intensity = Number(data.get('intensity'));
    let cont = 0;

    if(type == "device") {
      if(selectDeviceData.name !== name )  {
        await deviceService.update_device_name(id, name);
        cont++;
      }
      if(selectDeviceData.roomId !== room) {
        await deviceService.update_device_room(id, room);
        cont++;
      }  
      if(selectDeviceData.intensity !== intensity) {
        await deviceService.update_device_dim(id, intensity);
        cont++;
      }
      if(!cont)
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

  const deleteGenerator = async ( id: string ) => {
    try {
      await deviceService.delete_device(id);
      toggleAlertOpen(3000, "Dispositivo deletado com sucesso", "success");
      loadDevices()  
    } catch (error) {
      // setDevices([]);
    }
  }

  const sendDeviceGeneratorData = ( id: string ) => {
    let selectedCard;
    if(type == "device") {
      if ((selectedCard = devices.find((device: Device) => device.id === id))) 
        setSelectDeviceData(selectedCard);
    } else {
      if ((selectedCard = generators.find((generator: Generator) => generator.id === id))) 
        setSelectDeviceData(selectedCard);
    }
  }

  const switchDeviceGenerator = ( option: 'device' | 'generator' ) => {
    if( type != option )
      setType(option);
  }

  const openEditModal = ( type : 'device' | 'generator') => {
    setType(type);
    setIsEditModalOpen(!isEditModalOpen);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };

  const toggleCreateModal = () => {
    setIsCreateModalOpen(!isCreateModalOpen);
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
    loadDevices();
    loadRooms();
    setSearchBarList(devices);
  }, []);

  useEffect(() => {
    const generator = generatorMain.current!;
    const device = deviceMain.current!;
  
    if (type != "device") {
      setSearchBarList(generators);
      generator.style.display = 'flex';
  
      requestAnimationFrame(() => {
        generator.classList.remove(styled.main__device_generator__generator__closed);
        device.classList.add(styled.main__device_generator__device__closed);
      });
  
      setTimeout(() => {
        device.style.display = 'none';
      }, 500);
    } else {
      setSearchBarList(devices);
      device.style.display = 'flex';
    
      requestAnimationFrame(() => {
        generator.classList.add(styled.main__device_generator__generator__closed);
        device.classList.remove(styled.main__device_generator__device__closed);
      });
  
      setTimeout(() => {
        generator.style.display = 'none';
      }, 500);
    }
  }, [ type ]);

  return (
    <div className={ styled.home }>
      <Header />
      <main className={ styled.main }>
        <SeachBar
          list={ searchBarList }
          listRoom={ rooms }
          handleModalFunc={ loadDevices }
          sendData={ sendDeviceGeneratorData }
        />

        <div className={ styled.main__buttons }>
          <button className={ `${styled.main__buttons__button} ${ type == "device" ? styled.main__buttons__button__active : '' }` } onClick={() => switchDeviceGenerator("device")}>Dispositivos</button>
          <button className={ `${styled.main__buttons__button} ${ type != "device" ? styled.main__buttons__button__active : '' }` } onClick={() => switchDeviceGenerator("generator")}>Geradores</button>
        </div>
        
        <div className={ styled.main__device_generator }>
          <div ref={ deviceMain } className={ styled.main__device_generator__device }>
            <MainDevice
              listRooms = { rooms }
              listDevices = { devices }
              loadRooms = { loadRooms }
              loadDevices = { loadDevices }
              toggleCreateModal = { toggleCreateModal }
              openEditModal = { () => openEditModal(type) }
            />
          </div>

          <div ref={ generatorMain } className={ styled.main__device_generator__generator }>
            <MainGenerator
              listGenerators = { generators }
              loadGenerators = { loadGenerators }
              toggleCreateModal = { toggleCreateModal }
              openEditModal = { () => openEditModal(type) }
            />
          </div>
        </div>
      </main>
      <NavBar />

      <CreateModal 
        type={ type }
        isOpen={ isCreateModalOpen } 
        toggleCreateModal={ toggleCreateModal } 
        onSubmit={ createDeviceGenerator }
      />

      <EditModal
        device={ selectDeviceData }
        rooms={ rooms }
        isOpen={ isEditModalOpen }
        closeEditModal={ closeEditModal }
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
