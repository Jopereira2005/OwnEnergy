import { useEffect, useRef, useState } from 'react';

import styled from './style.module.scss'

import Header from '../../components/Common/Header'
import NavBar from '../../components/Common/NavBar'

import { SearchIcon } from '../../assets/Home/Search'

function Dashboard () {

  return (
    <div className={ styled.home }>
      <Header />
      <main className={ styled.main }>
        

      </main>
      <NavBar />
    </div>
  )
}

export default Dashboard
