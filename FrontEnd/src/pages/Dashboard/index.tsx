import { useEffect, useRef, useState } from 'react';

import styled from './style.module.scss'

import Header from '../../components/Common/Header'
import NavBar from '../../components/Common/NavBar'
import Card from '../../components/Dashboard/Card'
import BarGraphEnergy from '../../components/Dashboard/BarGraphEnergy'


import { FilterIcon } from '../../assets/Common/Filter'


function Dashboard () {
  const [filter, setFilter] = useState();

  const [gainList, setGainList] = useState([
    { describe: "Ganhos Diário", value: 3.15, isGain: false, isAppearing: true },
    { describe: "Ganhos Semanal", value: 28.46, isGain: true, isAppearing: true },
    { describe: "Ganhos Mensal", value: 90.05, isGain: true, isAppearing: true },
    { describe: "Ganhos Anual", value: 1023.25, isGain: false, isAppearing: true },
  ]);

  const [consumptionList, setConsumptionList] = useState([
    { describe: "Gastos Diário", value: 9.15, isGain: true, isAppearing: true },
    { describe: "Gastos Semanal", value: 71.45, isGain: false, isAppearing: true },
    { describe: "Gastos Mensal", value: 277.89, isGain: true, isAppearing: true },
    { describe: "Gastos Anual", value: 3254.555, isGain: true, isAppearing: true },
  ]);

  return (
    <div className={ styled.home }>
      <Header />
      <main className={ styled.main }>
        <div className={ styled.main__title }>
          <h1 className={ styled.main__title__text }>Dashboard</h1>
          <FilterIcon className={ styled.main__title__icon }/>
        </div>
        <div className={ styled.main__body }>  
          <div className={ styled.main__body__subtitle }>Valor a Pagar no Mês</div>
          <div className={ styled.main__body__value }>
            <div className={ styled.main__body__value__container }>
              <h1 className={ styled.main__body__value__container__title }>Valor Total</h1>
              <p className={ styled.main__body__value__container__value }>R$150.00</p>
            </div>
            <div className={ styled.main__body__value__div}></div>
            <div className={ styled.main__body__value__container }>
              <h1 className={ styled.main__body__value__container__title }>Economia</h1>
              <p className={ styled.main__body__value__container__value }>R$100.00</p>
            </div>
            <div className={ styled.main__body__value__div}></div>
            <div className={ styled.main__body__value__container }>
              <h1 className={ styled.main__body__value__container__title }>Valor Final</h1>
              <p className={ styled.main__body__value__container__value }>R$50.00</p>
            </div>
          </div>

          <div className={ styled.main__body__subtitle}>Gráfico Energético</div>
          <BarGraphEnergy />

          <div className={ styled.main__body__subtitle}>Ganhos</div>
          <div className={ styled.main__body__gain}>
            <div className={ styled.main__body__gain__cards}>
              { gainList.map((item) => (
                <Card
                  key={ item.describe}
                  describe={ item.describe }
                  value={ item.value }
                  isGain={ item.isGain }
                  isAppearing={ item.isAppearing }
                />
              ))}
            </div>
          </div>

          <div className={ styled.main__body__subtitle}>Gastos</div>
          <div className={ styled.main__body__consumption}>
            <div className={ styled.main__body__consumption__cards}>
              { consumptionList.map((item) => (
                <Card
                  key={ item.describe}
                  describe={ item.describe }
                  value={ item.value }
                  isGain={ item.isGain }
                  isAppearing={ item.isAppearing }
                />
              ))}
            </div>
          </div>
        </div>
      </main>
      <NavBar />
    </div>
  )
}

export default Dashboard
