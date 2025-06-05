import { useState, useEffect } from 'react';
import styled from './style.module.scss'

import Switch from '../../Common/Switch'

import FolhaIcon from '../../../assets/Common/Folha.svg';
import { MoreIcon } from '../../../assets/Common/More';

import { Generator } from '../../../interfaces/Generator';

interface CardProps {
  generator: Generator,
  toggleEditModal: (status: boolean, generator?: Generator) => void
  chanceGeneratorState: (id: string) => Promise<boolean>
  isRenewable: boolean | undefined
}

const CardGenerator = ({ generator, toggleEditModal, chanceGeneratorState, isRenewable}: CardProps) => {
  const [isOn, setIsOn] = useState(false);
  
    const toggleSwitch = async () => {
      if(await chanceGeneratorState(generator.id || ''))
        setIsOn(!isOn);
    }
  
    useEffect(() => {
      setIsOn(generator.status != 'Off');
    }, [generator]);

  return (
    <>
      <div className={ `${styled.card} ${ isOn ? styled.card__on : '' }` }>
        <div className={ styled.card__container }>
          <div className={ styled.card__container__top }>
            <div className={ styled.card__container__top__text }>
              <div className={ styled.card__container__top__text__name }>{ generator.name } </div>
              <p className={ styled.card__container__top__text__type }>{generator.typeName}</p>
            </div>
            { isRenewable &&
              <img src={ FolhaIcon } className={ styled.card__container__top__icon } alt="icon" />}
          </div> 
          <div className={ styled.card__container__bottom }>
            <Switch state={ isOn } toggleSwitch={ toggleSwitch } />
            <MoreIcon onClick={ () => toggleEditModal(true, generator)} className={ styled.card__container__bottom__icon }/>
          </div>
        </div>
      </div>
    </>
  )
}

export default CardGenerator