import { useEffect, useState } from 'react';

import styled from './style.module.scss'

import AlertNotification from '../../Common/AlertNotification'
import CardGenerator from '../CardGenerator'

import { Generator } from '../../../interfaces/Generator'

import { AddIcon } from '../../../assets/Home/Add'

import deviceService from '../../../services/deviceService';

interface mainGeneratorProps {
  listGenerators: Generator[],
  toggleCreateModal: () => void,
  openEditModal: () => void,
  loadGenerators: () => Promise<void>
}

const MainGenerator = ({listGenerators, toggleCreateModal, loadGenerators}: mainGeneratorProps) => {
  const _ = {  name: "", }
  
  const [alertProps, setAlertProps] = useState({ message: '', timeDuration: 0, type: 'error' as 'success' | 'error' });
  const [alertOpen, setAlertOpen] = useState(false);

  const [generators, setGenerators] = useState<Generator[]>(listGenerators);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // const toggleCreateModal = () => {
  //   setIsCreateModalOpen(!isCreateModalOpen);
  // };

  const changeGeneratorState = async( id: string ) => {
    try {
      // await deviceService.device_switch( id );
      // loadDevices();
    } catch(error: any) {
      toggleAlertOpen(3000, "Erro ao tentar mudar o estado do dispositivo.", "error")
    }
  };

  const sendDeviceData = (id: string) => {
    const selectedCard = generators.find((generator: Generator) => generator.id === id);
    // if (selectedCard) 
    //   setSelectDeviceData(selectedCard);
  };

  const toggleAlertOpen = ( timeDuration: number, message: string, type: 'success' | 'error') => {
    setAlertProps({
      message: message,
      timeDuration: timeDuration,
      type: type,
    })
    setAlertOpen(true);
  };
  
 
  return (
    <>
      <div className={ styled.main_generator }>
        <div className={ styled.main_generator__cards }>
          <div className={ styled.main_generator__cards__header }>
            <h1 className={ styled.main_generator__cards__header__text }>Geradores</h1>       
            <AddIcon onClick={ toggleCreateModal } className={ styled.main_generator__cards__header__icon }/>
          </div>
          { generators.length == 0 ?
            <h1 className={ styled.main_generator__cards__menssage }>Cadastre algum gerador para começar ;)</h1> :
            <div className={ styled.main_generator__cards__body }>
              { generators.map((generator) => (
                <CardGenerator
                  key = { generator.id }
                  generator = { generator }
                  chanceStateFunc = { changeGeneratorState }
                  onClickFunc = { toggleCreateModal }
                  sendData={ sendDeviceData }
                />
              ))}
            </div>
          }
        </div>
      </div>

      <AlertNotification
        {...alertProps}
        state={alertOpen}
        handleClose={() => setAlertOpen(false)}      
      />
    </> 
  )
}

export default MainGenerator