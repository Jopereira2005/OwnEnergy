import { useEffect, useRef, useState } from 'react';

import styled from './style.module.scss'

import Header from '../../components/Common/Header'
import NavBar from '../../components/Common/NavBar'
import Card from '../../components/Dashboard/Card'


import { FilterIcon } from '../../assets/Common/Filter'


function Dashboard () {
  const [filter, setFilter] = useState(
    
  );

  return (
    <div className={ styled.home }>
      <Header />
      <main className={ styled.main }>
        <div className={ styled.main__title }>
          <h1 className={ styled.main__title__text }>Dashboard</h1>
          <FilterIcon className={ styled.main__title__icon }/>
        </div>
        <div className={ styled.main__body }>  
          <div className={ styled.main__body__consumption}>
            <div className={ styled.main__body__consumption__title}>Ganhos</div>
            <div className={ styled.main__body__consumption__cards}>
              <Card 
                describe={ "Ganhos Diário" }
                value={ 9.15 }
                isGain={ false }
                isAppearing={ true }
              />
              <Card 
                describe={ "Ganhos Semanal" }
                value={ 9.15 }
                isGain={ true }
                isAppearing={ true }
              />
              <Card 
                describe={ "Ganhos Mensal" }
                value={ 9.15 }
                isGain={ true }
                isAppearing={ true }
              />
              <Card 
                describe={ "Ganhos Anual" }
                value={ 9.15 }
                isGain={ true }
                isAppearing={ true }
              />
            </div>
          </div>

          <div className={ styled.main__body__consumption}>
            <div className={ styled.main__body__consumption__title}>Gastos</div>
            <div className={ styled.main__body__consumption__cards}>
              <Card 
                describe={ "Gastos Diário" }
                value={ 9.15 }
                isGain={ false }
                isAppearing={ true }
              />
              <Card 
                describe={ "Gastos Semanal" }
                value={ 9.15 }
                isGain={ true }
                isAppearing={ true }
              />
              <Card 
                describe={ "Gastos Mensal" }
                value={ 9.15 }
                isGain={ true }
                isAppearing={ true }
              />
              <Card 
                describe={ "Gastos Anual" }
                value={ 9.15 }
                isGain={ true }
                isAppearing={ true }
              />
            </div>
          </div>
        </div>
      </main>
      <NavBar />
    </div>
  )
}

export default Dashboard
