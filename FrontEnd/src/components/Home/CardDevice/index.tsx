import { useState, useEffect } from 'react';

import styled from './style.module.scss'

import Switch from '../../Common/Switch'

import { MoreIcon } from '../../../assets/Common/More';

import { Device } from '../../../interfaces/Device';

interface CardDeviceProps {
  device: Device,
  toggleEditModal: (status: boolean, device?: Device) => void
  chanceDeviceState: (id: string) => Promise<boolean>
}

const CardDevice = ({ device, toggleEditModal, chanceDeviceState }: CardDeviceProps) => {
  const [isOn, setIsOn] = useState(false);

  const toggleSwitch = async () => {
    if(await chanceDeviceState(device.id || ''))
      setIsOn(!isOn);
  }

  useEffect(() => {
    setIsOn(device.status != 'Off');
  }, [device]);

  return (
    <>
      <div className={ `${styled.card} ${ isOn ? styled.card__on : '' }` }>
        <div className={ styled.card__container }>
          <div className={ styled.card__container__name }>{ device.name }</div>

          <div className={ styled.card__container__div }>
            <Switch state={ isOn } toggleSwitch={ toggleSwitch } />
            <MoreIcon onClick={ () => toggleEditModal(true, device) } className={ styled.card__container__div__icon }/>
          </div>
        </div>
      </div>
    </>
  )
}

export default CardDevice