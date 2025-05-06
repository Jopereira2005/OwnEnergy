import { useState } from 'react';

import styled from './style.module.scss'

import Switch from '../../Common/Switch'

import { MoreIcon } from '../../../assets/Cards/More';

import FolhaIcon from '../../../assets/Home/Folha.svg'

import { Device } from '../../../interfaces/Device';

interface CardProps {
  generator: Device,
  onClickFunc: () => void
  chanceStateFunc: (id: string) => Promise<void>
  sendData: ( id_device: string ) => void;
}

const CardGenerator = ({ generator, onClickFunc, chanceStateFunc, sendData }: CardProps) => {
  const [isOn, setIsOn] = useState(generator.status != 'Off');

  const toggleSwitch = () => {
    setIsOn(!isOn);
    chanceStateFunc(generator.id || '');
  }

  return (
    <>
      <div className={ `${styled.card} ${ isOn ? styled.card__on : '' }` }>
        <div className={ styled.card__container }>
          <div className={ styled.card__container__top }>
            <div className={ styled.card__container__top__text }>
              <div className={ styled.card__container__top__text__name }>{ generator.name } </div>
              <p className={ styled.card__container__top__text__type }>Paínel Solar</p>
            </div>
            <img src={ FolhaIcon } className={ styled.card__container__top__icon } alt="icon" />
          </div> 
          <div className={ styled.card__container__bottom }>
            <Switch state={ isOn } toggleSwitch={ toggleSwitch } />
            <MoreIcon onClick={ () => { onClickFunc(); sendData(generator.id || '') }} className={ styled.card__container__bottom__icon }/>
          </div>
        </div>
      </div>
    </>
  )
}

export default CardGenerator