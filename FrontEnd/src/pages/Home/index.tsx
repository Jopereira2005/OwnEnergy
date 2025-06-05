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
import { GeneratorType } from '../../interfaces/GeneratorType'

import roomService from '../../services/roomService';
import deviceService from '../../services/deviceService';
import generatorService from '../../services/generatorService';

// import ConfirmModal from '../../components/Common/ConfirmModal';

function Home() {
  const deviceMain = useRef<HTMLDivElement>(null);
  const generatorMain = useRef<HTMLDivElement>(null);

  const [rooms, setRooms] = useState<Room[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [generators, setGenerator] = useState<Generator[]>([]);
  const [generatorTypes, setGeneratorTypes] = useState<GeneratorType[]>([]);

 
  const [selectedDeviceData, setSelectedDeviceData] = useState<Device>({name: "", roomId: ""});
  const [selectedGeneratorData, setSelectedGeneratorData] = useState<Generator>({name: ""});
  const [selectedRoomData, setSelectedRoomData] = useState<Room>({name: ""});

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditRoomModalOpen, setIsEditRoomModalOpen] = useState(false);
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);

  // const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  
  const [type, setType] = useState<'device' | 'generator'>("device")

  const [alert, setAlert] = useState(false);
  const [alertProps, setAlertProps] = useState({ message: '', timeDuration: 0, type: 'error' as 'success' | 'error'});

  function isDevice(item: Device | Generator): item is Device {
    return (item as Device).roomId !== undefined;
  }

  const switchDeviceGenerator = ( option: 'device' | 'generator' ) => {
    if( type != option )
      setType(option);
    type == "device" ? loadDevices(): loadGenerators(); 
  }

  //+---------------------------------------+
  //| Load Functions                        |
  //+---------------------------------------+
  
  const loadRooms = async () => {
    try {
      const response = await roomService.list_rooms();
      setRooms(response.data.items || []);      
    } catch (error) {
      toggleAlert(3000, "Erro ao carregar os Ambientes", "error");
    }
  };

  const loadDevices = async () => {
  try {
    const response = await deviceService.list_device();

    const devicesMapped: Device[] = (response.data?.items || []).map((raw: any) => ({
      id: raw.id,
      name: raw.name,
      roomId: raw.roomId,
      isDimmable: raw.isDimmable,
      intensity: raw.intensity ?? undefined,
      power: raw.powerWatts,
      status: raw.status,
    }));

    setDevices(devicesMapped);
  } catch (error) {
    toggleAlert(3000, "Erro ao carregar os Dispositivos", "error");
  }
};
  
  const loadGenerators = async () => {
    try {
      const response = await generatorService.list_generator();

      const generatorsMapped: Generator[] = (response.data || []).map((raw: any) => ({
        id: raw.id,
        name: raw.name,
        typeName: raw.generatorTypeName,
        power: raw.generationRateWattsPerHour ,
        status: raw.isActive ?  "On" : "Off",
      }));

      setGenerator(generatorsMapped);
      console.log(generatorsMapped)
    } catch (error) {
      toggleAlert(3000, "Erro ao carregar os Geradores", "error");
    }
  }

  const loadGeneratorTypes = async () => {
    try {
      const response = await generatorService.list_generatorType();

      setGeneratorTypes(response.data?.items || []);
    } catch (error) {
      toggleAlert(3000, "Erro ao carregar os Tipos de Geradores", "error");
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

    toggleAlert(3000, `Ambiente ${name} criado com sucesso.`, "success");

      loadRooms();
    } catch(error: any) {
      toggleAlert(3000, error, "error")
    }
  };

  const createDeviceGenerator = async ( formData: FormData ) => {
    const name = String(formData.get('name'));
    const typeName = String(formData.get('typeName'));
    const power = Number(formData.get('power'));
    const ajustavel = Boolean(formData.get('dimmable')); 

    if(type == "device") {
      try {
        await deviceService.create_device(selectedRoomData.id || '', power, name, ajustavel);
        toggleAlert(3000, `Dispositivo ${name} criado com sucesso.`, "success");

        loadDevices();
      } catch (error) {
        toggleAlert(3000, "Erro ao criar Dispositivo", "error");
        return error;
      }
    } else {
       try {
        await generatorService.create_generator(name, typeName, power);
        toggleAlert(3000, `Gerador ${name} criado com sucesso.`, "success");

        loadGenerators();
      } catch (error) {
        toggleAlert(3000, "Erro ao criar Gerador", "error");
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

        toggleAlert(3000, "Ambiente atualizado com sucesso.", "success");
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

    if(type == "device") {
      let cont = 0;

      if(selectedDeviceData.name != name )  {
        await deviceService.update_device_name(id, name);
        cont++;
      } if(selectedDeviceData.power != power )  {
        await deviceService.update_device_power(id, power);
        cont++;
      } if(selectedDeviceData.roomId != room) {
        await deviceService.update_device_room(id, room);
        cont++;
      } if(selectedDeviceData.intensity != intensity) {
        await deviceService.update_device_dim(id, intensity);
        cont++;
      } 
      
      if(cont) {
        toggleAlert(3000, "Dispositivo alterado com sucesso", "success");
      }
    loadDevices();

    } else {
      let cont = 0;

      if(selectedGeneratorData.name != name )  {
        await generatorService.update_generator_name(id, name);
        cont++;
      } if(selectedGeneratorData.power != power )  {
        await generatorService.update_generator_power(id, power);
        cont++;
      } 
      
      if(cont) {
        toggleAlert(3000, "Gerador alterado com sucesso", "success");
      }
      loadGenerators();
    }

  };

  //+---------------------------------------+
  //| Delete Functions                      |
  //+---------------------------------------+
  
  const deleteRoom = async ( id: string ) => {
    try {
      await roomService.delete_room(id);
      toggleAlert(3000, "Ambiente deletado com sucesso", "success");
      setSelectedRoomData({name: ""});
      loadRooms();
    } catch (error: any) {
      toggleAlert(3000, error, "error")
    }
  };

  const deleteDevice = async ( id: string ) => {
    try {
      await deviceService.delete_device(id);
      toggleAlert(3000, "Dispositivo deletado com sucesso", "success");
      loadDevices()  
    } catch (error: any) {
      toggleAlert(3000, error, "error")
    }
  };

  const deleteGenerator = async ( id: string ) => {
    try {
      await generatorService.delete_generator(id);
      toggleAlert(3000, "Gerador deletado com sucesso", "success");
      loadGenerators()  
    } catch (error: any) {
      toggleAlert(3000, error, "error")
    }
  };

  //+---------------------------------------+
  //| Change State Functions                |
  //+---------------------------------------+

  const changeDeviceState = async( id: string ) => {
    try {
      await deviceService.device_switch( id );
      return true
    } catch(error: any) {
      toggleAlert(3000, "Erro ao tentar mudar o estado do dispositivo.", "error")
      return false
    }
  };

  const changeGeneratorState = async( id: string ) => {
    try {
      const generator = generators.find(item => item.id === id);
      generator?.status == "Off" ? await generatorService.generator_active( id ) : await generatorService.generator_desactive( id )
      return true
    } catch(error: any) {
      toggleAlert(3000, "Erro ao tentar mudar o estado do dispositivo.", "error");
      return false
    }
  };

  //+---------------------------------------+
  //| Toggle Functions                      |
  //+---------------------------------------+ 

  const toggleCreateRoomModal = (state: boolean) => {
    setIsCreateRoomModalOpen(state);
  }

  const toggleEditRoomModal = (state: boolean, selectedRoom?: Room) => {
    if(state) {
      setSelectedRoomData(selectedRoom || selectedRoomData);
    }
    setIsEditRoomModalOpen(state);
  };

  const toggleCreateModal = (state: boolean, selectedRoom?: Room) => {
    if(state) {
      setSelectedRoomData(selectedRoom || selectedRoomData);
    }
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

  const toggleAlert = ( timeDuration: number, message: string, type: 'success' | 'error') => {
    setAlertProps({
      message: message,
      timeDuration: timeDuration,
      type: type,
    })
    setAlert(true);
  }; 
  
  useEffect(() => {
    loadRooms();
    loadDevices();
    loadGenerators();
    loadGeneratorTypes();
  }, []);

  useEffect(() => {
    const generator = generatorMain.current!;
    const device = deviceMain.current!;
  
    if (type != "device") {
      generator.style.display = 'flex';
  
      requestAnimationFrame(() => {
        generator.classList.remove(styled.main__device_generator__generator__closed);
        device.classList.add(styled.main__device_generator__device__closed);
      });
  
      setTimeout(() => {
        device.style.display = 'none';
      }, 500);
    } else {
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
          list={ type === "device" ? devices : generators }
          listRoom={ type === "device" ? rooms : undefined }
          toggleEditModal = { toggleEditModal }
          changeItemState={ type === "device" ? changeDeviceState : changeGeneratorState }
          loadItens={ type === "device" ? loadDevices : loadGenerators }
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
              toggleCreateModal = { toggleCreateModal }
              toggleEditModal = { toggleEditModal }
              toggleCreateRoomModal = { toggleCreateRoomModal }
              toggleEditRoomModal = { toggleEditRoomModal }
              changeDeviceState={ changeDeviceState }
            />
          </div>

          <div ref={ generatorMain } className={ styled.main__device_generator__generator }>
            <MainGenerator
              listGenerators = { generators }
              listGeneratorTypes = { generatorTypes }
              toggleCreateModal = { toggleCreateModal }
              toggleEditModal = { toggleEditModal }
              changeGeneratorState={ changeGeneratorState }
            />
          </div>
        </div>
      </main>
      <NavBar />

      <CreateModal 
        type={ type }
        generatorTypes={ generatorTypes }
        isOpen={ isCreateModalOpen } 
        toggleCreateModal={ toggleCreateModal } 
        onSubmit={ createDeviceGenerator }
      />

      <CreateRoomModal 
        isOpen={ isCreateRoomModalOpen } 
        toggleCreateRoomModal={ toggleCreateRoomModal } 
        onSubmit={ createRoom }
      />

      <EditModal
        selectedItem={ type === "device" ? selectedDeviceData : selectedGeneratorData }
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
