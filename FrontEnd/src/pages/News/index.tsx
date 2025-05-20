import { useEffect, useRef, useState } from 'react';

import styled from './style.module.scss'

import Header from '../../components/Common/Header'
import NavBar from '../../components/Common/NavBar'
import Card from '../../components/News/Card'

import { SearchIcon } from '../../assets/Home/Search'

function Home() {
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

  const news_cards = [
    {
      id:1, 
      title: "Maior usina solar de São Paulo é instalada em Sorocaba",
      subtitle: "Placas solares do Parque Tecnológico da cidade geram 10 GWh/ano, energia suficiente para abastecer 3.400 casas em 27 municípios do estado.",
      author: "Carolina Brito",
      news_org: "CNN",
      date: "25/03/2025 às 15:47",
      imageUrl: "/src/assets/News/teste.jpg", 
      imageCaption: "Usina conta com quase 10 mil placas solares e tem capacidade de gerar 10 GWh/ano. - Divulgação/Parque Tecnológico de Sorocaba",
      body: "A cidade de Sorocaba, no interior de São Paulo, agora abriga a maior usina solar do estado. A nova estrutura ocupa uma área de 53 mil metros quadrados e foi instalada há pouco mais de um mês no Parque Tecnológico da cidade. [...]",
      onClick: () => console.log("Ler mais")
    },
    {
      id:2, 
      title: "TESTEMaior usina solar de São Paulo é instalada em Sorocaba",
      subtitle: "Placas solares do Parque Tecnológico da cidade geram 10 GWh/ano, energia suficiente para abastecer 3.400 casas em 27 municípios do estado.",
      author: "Carolina Brito",
      news_org: "CNN",
      date: "25/03/2025 às 15:47",
      imageUrl: "/src/assets/News/teste.jpg", 
      imageCaption: "Usina conta com quase 10 mil placas solares e tem capacidade de gerar 10 GWh/ano. - Divulgação/Parque Tecnológico de Sorocaba",
      body: "A cidade de Sorocaba, no interior de São Paulo, agora abriga a maior usina solar do estado. A nova estrutura ocupa uma área de 53 mil metros quadrados e foi instalada há pouco mais de um mês no Parque Tecnológico da cidade. [...]",
      onClick: () => console.log("Ler mais")
    },
  ]

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
                  {news_cards.map((cards) => (
                    <li key={cards.id} className={ styled.main__search__list__item }>
                    <div className={ styled.main__search__list__item__text }>
                      <div className={ styled.main__search__list__item__text__name }>
                        { cards.title } |   
                      </div>
                      {/* <span className={ styled.main__search__list__item__text__room }>
                        { "kkkanalha" }
                      </span> */}
                    </div>
                  </li>
                  ))}
                  {/* <li className={ styled.main__search__list__item }>
                    <div className={ styled.main__search__list__item__text }>
                      <div className={ styled.main__search__list__item__text__name }>
                        { "Se vira pae" } |   
                      </div>
                      <span className={ styled.main__search__list__item__text__room }>
                        { "kkkanalha" }
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
                  </li> */}

              { /* <span className={ styled.search__list__menssage }>Nenhum resultado encontrado</span> */}
            </ul>
          }
        </div>
        <h1 className={ styled.page_title } >Noticias</h1>
        {news_cards.map((card) => (
          <Card
            key={card.id}
            title={card.title}
            subtitle={card.subtitle}
            author={card.author}
            news_org= {card.news_org}
            date={card.date}
            imageUrl={card.imageUrl}
            imageCaption={card.imageCaption}
            body= {card.body}
            onClick={card.onClick}
          />
        ))}
      </main>
      <NavBar />
    </div>
  )
}

export default Home
