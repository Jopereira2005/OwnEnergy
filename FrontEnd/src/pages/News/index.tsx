import { useEffect, useRef, useState } from 'react';

import styled from './style.module.scss'

import Header from '../../components/Common/Header'
import NavBar from '../../components/Common/NavBar'

import { SearchIcon } from '../../assets/Common/Search'

function News() {
  const [inputValue, setInputValue] = useState('');
    
  const listaRef = useRef<HTMLDivElement | null>(null);
  const handleClickOutside = (e: MouseEvent) => {
    if (listaRef.current && !listaRef.current.contains(e.target as Node)) {
      setInputValue("");
    }
  };
  
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={ styled.home }>
      <Header />
      <main className={ styled.main }>
        <div className={ styled.main__search}>
          <div className={ styled.main__search__search_bar} >
            <SearchIcon className={ styled.main__search__search_bar__img }/>
            <input className={ styled.main__search__search_bar__input } 
              type="text" 
              placeholder="Pesquise"
              value={ inputValue }
              onChange={ (e) => setInputValue(e.target.value) }
            />
          </div>
          { inputValue != '' &&
            <ul className={ styled.main__search__list } >
                  <li className={ styled.main__search__list__item }>
                    <div className={ styled.main__search__list__item__text }>
                      <div className={ styled.main__search__list__item__text__name }>
                        { "Se vira pae" } |   
                      </div>
                      <span className={ styled.main__search__list__item__text__room }>
                        { "kkk" }
                      </span>
                    </div>
                  </li>

                  <li className={ styled.main__search__list__item }>
                    <div className={ styled.main__search__list__item__text }>
                      <div className={ styled.main__search__list__item__text__name }>
                        { "Se vira pae" } |   
                      </div>
                      <span className={ styled.main__search__list__item__text__room }>
                        { "kkk" }
                      </span>
                    </div>
                  </li>

              { /* <span className={ styled.search__list__menssage }>Nenhum resultado encontrado</span> */}
            </ul>
          }
        </div>

      </main>
      <NavBar />
    </div>
  )
}

export default News
