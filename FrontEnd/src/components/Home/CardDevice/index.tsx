import { useState } from 'react';

import styled from './style.module.scss'

import Switch from '../../Common/Switch'

import { MoreIcon } from '../../../assets/Common/More';

import { Device } from '../../../interfaces/Device';

interface CardDeviceProps {
  device: Device,
  onClickFunc: (status: boolean, device?: Device) => void
  chanceStateFunc: (id: string) => Promise<void>
}

const CardDevice = ({ device, onClickFunc, chanceStateFunc }: CardDeviceProps) => {
  const [isOn, setIsOn] = useState(device.status != 'Off');

  const toggleSwitch = () => {
    setIsOn(!isOn);
    chanceStateFunc(device.id || '');
  }

  return (
    <>
      <div className={ `${styled.card} ${ isOn ? styled.card__on : '' }` }>
        <div className={ styled.card__container }>
          <div className={ styled.card__container__name }>{ device.name }</div>

          <div className={ styled.card__container__div }>
            <Switch state={ isOn } toggleSwitch={ toggleSwitch } />
            <MoreIcon onClick={ () => onClickFunc(true, device) } className={ styled.card__container__div__icon }/>
          </div>
        </div>
      </div>
    </>
  )
}

export default CardDevice