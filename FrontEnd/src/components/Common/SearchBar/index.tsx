import { useEffect, useRef, useState } from 'react';
import styled from './style.module.scss'

import { SearchIcon } from '../../../assets/Common/Search'

import SeachBarItem from '../../Common/SeachBarItem'

import { Device } from '../../../interfaces/Device'
import { Generator } from '../../../interfaces/Generator'

import { Room } from '../../../interfaces/Room'

interface SearchBarProps {
  list: Device[] | Generator[],
  listRoom?: Room[],
  toggleEditModal: ( 
    status: boolean, 
    selectedItem?: Device | Generator
  ) => void,
  changeItemState: (id: string) => Promise<boolean>,
  loadItens: () => Promise<void>
}

const SearchBar = ({ list, listRoom, toggleEditModal, changeItemState, loadItens}: SearchBarProps) => {
  const [filteredList, setFilteredList] = useState<Device[] |Generator[]>([]);
  const [inputValue, setInputValue] = useState('');
  
  const listaRef = useRef<HTMLDivElement | null>(null);

  function isDevice(item: Device | Generator): item is Device {
    return (item as Device).roomId !== undefined;
  }

  const handleClickOutside = (e: MouseEvent) => {
    if (listaRef.current && !listaRef.current.contains(e.target as Node)) {
      setInputValue("");
    }
  };

  useEffect(() => {
    setFilteredList( list.filter((item) => 
      item.name.toLowerCase().trim().includes(inputValue.toLowerCase().trim())
  ))
  }, [ inputValue ]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={ styled.search } ref={ listaRef }>
      <div className={ styled.search__search_bar} >
        <SearchIcon className={ styled.search__search_bar__img }/>
        <input onClick={ loadItens } className={ styled.search__search_bar__input } 
          type="text" 
          placeholder="Pesquise"
          value={ inputValue }
          onChange={ (e) => setInputValue(e.target.value) }
        />
      </div>

      { inputValue != '' &&
        <ul className={ styled.search__list } >
          { filteredList.length !== 0 ? 
            filteredList.map((item) => (
              <SeachBarItem 
                key={ item.id }
                item={ item }
                room={ listRoom && isDevice(item) ? listRoom.find((room) => room.id === item.roomId) : undefined }
                toggleEditModal={ toggleEditModal }
                changeItemState={ changeItemState }
                loadItens={ loadItens }
              />
            )) :
            <span className={ styled.search__list__menssage }>Nenhum resultado encontrado</span>
          }
        </ul>
      }
    </div>
  )
}

export default SearchBar