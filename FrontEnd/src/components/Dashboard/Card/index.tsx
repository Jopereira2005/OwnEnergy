import { useState } from 'react';

import styled from './style.module.scss'

import { ArrowIcon } from '../../../assets/Dashboard/Arrow'


interface CardProps {
  describe: string | null;
  value: number;
  isGain: boolean;
  isAppearing: boolean;
  onClickFunc?: () => void;
}

const CardDevice = ({ describe, value, isGain, isAppearing, onClickFunc }: CardProps) => {  
  return (
    <div onClick={ onClickFunc } className={ `${styled.card} ${ isAppearing ?  '' : styled.card__appearing }` }>
      <h2 className={ styled.card__describe }>{ describe }</h2>
      
      <div className={ styled.card__div }>
        <h1 className={ styled.card__div__value }>{ value } kW/h</h1>
        <div className={ styled.card__div__container }>
          <ArrowIcon className={ `${styled.card__div__container__icon} ${ isGain ? '' : styled.card__div__container__icon__down }` } />
        </div>
      </div>
    </div>
  )
}

export default CardDevice