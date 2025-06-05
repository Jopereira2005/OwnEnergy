import { useState } from 'react';

import styled from './style.module.scss'

import Switch from '../../Common/Switch'

import { Device } from '../../../interfaces/Device';
import { Generator } from '../../../interfaces/Generator'

import { Room } from '../../../interfaces/Room';


interface SeachBarItemProps {
  item: Device | Generator,
  room?: Room,
  toggleEditModal: (status: boolean, item?: Device | Generator) => void,
  changeItemState: (id: string) => Promise<boolean>,
  loadItens: () => Promise<void>
}

const SeachBarItem = ({ item, room, toggleEditModal, changeItemState, loadItens}: SeachBarItemProps) => {
  const [isOn, setIsOn] = useState(item.status != 'Off');

  function isDevice(item: Device | Generator): item is Device {
      return (item as Device).roomId !== undefined;
  } 

  const toggleSwitch = async () => {
    if(await changeItemState(item.id || '')) {
      setIsOn(!isOn);
      loadItens();
    }
  }

  return (
    <>
      <li className={ styled.searchbar_item }>
        <div onClick={() => { toggleEditModal(true, item) }} className={ styled.searchbar_item__text }>
          <div className={ styled.searchbar_item__text__name }>{ item.name } | </div>
            <span className={ styled.searchbar_item__text__room }>
              { isDevice(item) ? room?.name : item.typeName }
            </span>
        </div>
        <div className={ styled.searchbar_item__btn }>
          <Switch state={ isOn ? true : false } toggleSwitch={ toggleSwitch } />
        </div>
    </li>
    </>
  )
}

export default SeachBarItem