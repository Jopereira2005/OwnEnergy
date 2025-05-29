import { useEffect, useState, useRef } from 'react';
import styled from './style.module.scss'

import Header from '../../components/Common/Header'
import SeachBar from '../../components/Common/SearchBar'
import NavBar from '../../components/Common/NavBar'

import MainDevice from '../../components/Home/MainDevice';
import MainGenerator from '../../components/Home/MainGenerator';

import CreateModal from '../../components/Home/CreateModal'
import EditModal from '../../components/Home/EditModal'
import CreateRoomModal from '../../components/Home/CreateRoomModal'
import EditRoomModal from '../../components/Home/EditRoomModal'

import AlertNotification from '../../components/Common/AlertNotification'

import { Room } from '../../interfaces/Room'
import { Device } from '../../interfaces/Device'
import { Generator } from '../../interfaces/Generator'

import deviceService from '../../services/deviceService';
import roomService from '../../services/roomService';
import ConfirmModal from '../../components/Common/ConfirmModal';

function Home() {
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
    { id: "1", name: "Dispositivo 1", power: 200,  status: "On" },
    { id: "2", name: "Dispositivo 2", power: 200, status: "On" },
    { id: "3", name: "Dispositivo 3", power: 200, status: "On" },
    { id: "4", name: "Dispositivo 4", power: 200, status: "Off" },
    { id: "5", name: "Dispositivo 5", power: 200, status: "On" },
  ]);
  
  const [searchBarList, setSearchBarList] = useState<Device[] | Generator[]>([]);
  const [sendSearchBarData, setSendSearchBarData] = useState<Device | Generator | null>(null);
 
  const [selectedDeviceData, setSelectedDeviceData] = useState<Device>({name: "", roomId: ""});
  const [selectedGeneratorData, setSelectedGeneratorData] = useState<Generator>({name: ""});
  const [selectedRoomData, setSelectedRoomData] = useState<Room>({name: ""});

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditRoomModalOpen, setIsEditRoomModalOpen] = useState(false);
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  
  const [type, setType] = useState<'device' | 'generator'>("device")

  const [alert, setAlert] = useState(false);
  const [alertProps, setAlertProps] = useState({ message: '', timeDuration: 0, type: 'error' as 'success' | 'error'});

  function isDevice(item: Device | Generator): item is Device {
    return (item as Device).roomId !== undefined;
  }

  const switchDeviceGenerator = ( option: 'device' | 'generator' ) => {
    if( type != option )
      setType(option);
  }

  //+---------------------------------------+
  //| Load Functions                        |
  //+---------------------------------------+
  
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

  //+---------------------------------------+
  //| Create Functions                      |
  //+---------------------------------------+
  
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

  const createDeviceGenerator = async ( formData: FormData ) => {
    const nome = String(formData.get('name'));
    const power = formData.get('name');

    const ajustavel = Boolean(formData.get('dimmable')); 

    if(type == "device") {
      try {
        // await deviceService.create_device(selectedRoomData.id || '', nome, ajustavel);
        loadGenerators();
      } catch (error) {
        return error;
      }
    } else {
      try {
        // await deviceService.create_device(selectedRoomData.id || '', nome, ajustavel);
        loadGenerators();
      } catch (error) {
        return error;
      }
    }
  };

  //+---------------------------------------+
  //| Edit Functions                        |
  //+---------------------------------------+

  const editRoom = async (data: FormData, id: string) => {
    const name = String(data.get('name')).trim();

    try {
      if(selectedRoomData.name !== name) {
        const response = await roomService.update_room( id, String(name).trim() )
        if(response.error)
          throw response.error

        toggleAlert(3000, "Ambiente atualizado com sucesso.", "success")
        selectedRoomData.id === id && setSelectedRoomData({
          name: String(name).trim(),
        }) 
      }    
      loadRooms()
      
    } catch(error: any) {
      toggleAlert(3000, error, "error")
    }
  };

  const editDeviceGenerator = async ( data: FormData, id: string ) => {
    const name = String(data.get('name')).trim();
    const power = Number(data.get('power'));
    const room = String(data.get('room'));
    const intensity = Number(data.get('intensity'));
    let cont = 0;

    if(type == "device") {
      if(selectedDeviceData.name !== name )  {
        await deviceService.update_device_name(id, name);
        cont++;
      } if(selectedDeviceData.power !== power )  {
        await deviceService.update_device_name(id, name);
        cont++;
      } if(selectedDeviceData.roomId !== room) {
        await deviceService.update_device_room(id, room);
        cont++;
      } if(selectedDeviceData.intensity !== intensity) {
        await deviceService.update_device_dim(id, intensity);
        cont++;
      } 
      
      if(!cont) {
        toggleAlert(3000, "Dispositivo alterado com sucesso", "success");
      }
    } else {
      if(selectedDeviceData.name !== name )  {
        await deviceService.update_device_name(id, name);
        cont++;
      } 
      
      if(!cont) {
        toggleAlert(3000, "Gerador alterado com sucesso", "success");
      }
    }

    loadDevices();
  };

  //+---------------------------------------+
  //| Delete Functions                      |
  //+---------------------------------------+
  
  const deleteRoom = async ( id: string ) => {
    try {
      await roomService.delete_room(id);
      toggleAlert(3000, "Ambiente deletado com sucesso", "success");
      loadRooms();
      setSelectedRoomData({name: ""});
    } catch (error) {
      // setDevices([]);
    }
  };

  const deleteDevice = async ( id: string ) => {
    try {
      await deviceService.delete_device(id);
      toggleAlert(3000, "Dispositivo deletado com sucesso", "success");
      loadDevices()  
    } catch (error) {
      // setDevices([]);
    }
  };

  const deleteGenerator = async ( id: string ) => {
    try {
      await deviceService.delete_device(id);
      toggleAlert(3000, "Dispositivo deletado com sucesso", "success");
      loadDevices()  
    } catch (error) {
      // setDevices([]);
    }
  };

  //+---------------------------------------+
  //| Toggle Functions                      |
  //+---------------------------------------+ 

  const toggleCreateModal = (state: boolean) => {
    setIsCreateModalOpen(state);
  };

  const toggleEditModal = (state: boolean, selectedItem?: Device | Generator) => {
    if(state) {
      if(selectedItem) {
        if(isDevice(selectedItem)) {
          setSelectedDeviceData(selectedItem);
        } else {
          setSelectedGeneratorData(selectedItem);
        }
      }
    }
    setIsEditModalOpen(state);
  };

  const toggleCreateRoomModal = (state: boolean) => {
    setIsCreateRoomModalOpen(state);
  }

  const toggleEditRoomModal = (state: boolean, selectedRoom?: Room) => {
    if(state) {
      setSelectedRoomData(selectedRoom || selectedRoomData)
    }
    setIsEditModalOpen(state);
  };

  const toggleConfirmModal = (state: boolean) => {
    setIsEditModalOpen(state);
  };

  const toggleAlert = ( timeDuration: number, message: string, type: 'success' | 'error') => {
    setAlertProps({
      message: message,
      timeDuration: timeDuration,
      type: type,
    })
    setAlert(true);
  }; 
  
  useEffect(() => {
    loadDevices();
    loadRooms();
  }, []);

  useEffect(() => {
    setSearchBarList(devices);
  }, [devices]);

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
        {/* <SeachBar
          list={ searchBarList }
          listRoom={ rooms }
          handleModalFunc={ loadDevices }
          sendData={ sendDeviceGeneratorData }
        /> */}

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
              toggleEditModal = { toggleEditModal }
              toggleCreateRoomModal = { toggleCreateRoomModal }
              toggleEditRoomModal = { toggleEditRoomModal }
              toggleAlert= { toggleAlert }
            />
          </div>

          <div ref={ generatorMain } className={ styled.main__device_generator__generator }>
            {/* <MainGenerator
              listGenerators = { generators }
              loadGenerators = { loadGenerators }
              toggleCreateModal = { toggleCreateModal }
              openEditModal = { () => openEditModal(type) }
            /> */}
          </div>
        </div>
      </main>
      <NavBar />

      {/* <CreateModal 
        type={ type }
        isOpen={ isCreateModalOpen } 
        toggleCreateModal={ toggleCreateModal } 
        onSubmit={ createDeviceGenerator }
      /> */}

      {/* <CreateRoomModal 
        isOpen={ isCreateRoomModalOpen } 
        toggleCreateRoomModal={ toggleCreateRoomModal } 
        onSubmit={ createRoom }
      /> */}

      <EditModal
        device={ type === "device" ? selectedDeviceData : undefined }
        generator={ type === "generator" ? selectedGeneratorData : undefined }
        rooms={ rooms }
        isOpen={ isEditModalOpen }
        toggleEditModal={ toggleEditModal }
        deleteFunc={ type === "device" ? deleteDevice : deleteGenerator }
        onSubmit={ editDeviceGenerator }
      />

      <EditRoomModal
        room={ selectedRoomData }
        isOpen={ isEditRoomModalOpen }
        toggleEditRoomModal={ toggleEditRoomModal }
        deleteRoomFunc={ deleteRoom }
        onSubmit={ editRoom }
      />


     {/* <ConfirmModal
        {...confirmMessageProps}
        isOpen={ confirmMessageOpen }
        handleClose={() => setConfirmMessageOpen(false)} 
      /> */}

      <AlertNotification
        {...alertProps}
        state={alert}
        handleClose={() => setAlert(false)}      
      />
    </div>
  )
}

export default Home
