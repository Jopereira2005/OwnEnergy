import { useEffect, useRef, useState } from 'react';

import styled from './style.module.scss'

import Header from '../../components/Common/Header'
import NavBar from '../../components/Common/NavBar'
import Card from '../../components/News/Card'

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

  const news_cards = [
    {
      id:0, 
      title: "Taxa de poluição, mercado de carbono e capital privado: como Reino Unido quer elevar verba do clima",
      subtitle: "Rachel Kyte destaca que definição de estratégias para financiamento está entre as prioridades COP-30, que ocorrerá em Belém, em novembro",
      author: "Paula Ferreira",
      news_org: "ESTADÃO",
      date: "04/06/2025 às 09:37",
      imageUrl: "/src/assets/News/img4.jpg", 
      imageCaption: "Rachel Kyte  • Foto: Wilton Junior / ESTADÃO",
      body: "BRASÍLIA - A revisão de subsídios para combustíveis fósseis e a definição de estratégias para financiamento estão entre as prioridades do governo do Reino Unido na 30.ª Conferência do Clima da ONU (COP-30), que ocorrerá em Belém, em novembro. [...]",
      onClick: () => {window.open("https://www.estadao.com.br/sustentabilidade/taxa-de-poluicao-mercado-de-carbono-e-capital-privado-como-reino-unido-quer-elevar-verba-do-clima/")}
    },
    {
      id:1, 
      title: "Investimentos em adaptação climática geram retorno financeiro 10 vezes maior, revela WRI",
      subtitle: "Estudo lançado nesta terça-feira, 3, considerou 320 aportes em 12 países e apontou para um ganho potencial de mais de US$ 1,4 trilhão com medidas visando tornar as cidades mais resilientes",
      author: "Sofia Schuck",
      news_org: "ESG",
      date: "03/06/2025 às 13:30",
      imageUrl: "/src/assets/News/img2.jpg", 
      imageCaption: "• Getty Images",
      body: "Em um cenário de alta dos riscos climáticos globais e crescente pressão sobre recursos financeiros, um novo estudo do World Resources Institute (WRI) lançado nesta terça-feira, 3, traz evidências robustas de que investir em adaptação e resiliência climática é bem mais interessante economicamente do que esperar o desastre acontecer. [...]",
      onClick: () => {window.open("https://exame.com/esg/investimentos-em-adaptacao-climatica-geram-retorno-financeiro-10-vezes-maior-revela-wri/")}
    },
    {
      id:2, 
      title: "Brasil quer ser líder na transição energética, diz secretário",
      subtitle: "Pietro Adamo Sampaio Mendes também ressaltou que governo aposta na expansão de data centers e de IA no país",
      author: "Cleber Rodrigues",
      news_org: "CNN",
      date: "02/06/2025 às 15:52",
      imageUrl: "/src/assets/News/img1.jpg", 
      imageCaption: "Placas solares • CNN",
      body: "Durante evento no Rio de Janeiro, a autoridade lembrou que o país já tem metade de sua matriz energética baseada em fontes renováveis, e que 90% da geração elétrica no estado fluminense vêm de energia limpa. Pietro também ressaltou que o governo aposta na expansão de data centers e de inteligência artificial (IA) no país, justamente por contar com uma matriz energética mais limpa e confiável. [...]",
      onClick: () => {window.open("https://www.cnnbrasil.com.br/economia/macroeconomia/brasil-quer-ser-lider-na-transicao-energetica-diz-secretario/")}
    },
    {
      id:3, 
      title: "UE deve propor meta climática mais flexível em julho para conter resistência ao Pacto Verde",
      subtitle: "Objetivo é manter a ambição climática sem comprometer o apoio político necessário para aprovar a medida",
      author: "Ernesto Neves",
      news_org: "VEJA",
      date: "02/06/2025 às 11:08",
      imageUrl: "/src/assets/News/img3.jpg", 
      imageCaption: "Queima de combustíveis fósseis: atividade humana é a principal responsável pelas mudanças climáticas • (Thinkstock Images/VEJA)",
      body: "A União Europeia deve apresentar no início de julho uma proposta revisada de meta climática, que prevê maior flexibilidade na trajetória de redução de emissões até 2040. A medida é uma tentativa de preservar a agenda ambiental do bloco diante do avanço de forças políticas conservadoras em diversos países-membros. [...]",
      onClick: () => {window.open("https://veja.abril.com.br/agenda-verde/ue-deve-propor-meta-climatica-mais-flexivel-em-julho-para-conter-resistencia-ao-pacto-verde/")}
    },
    {
      id:4, 
      title: "Dia Mundial da Energia: Brasil se consolida potência global em biometano e renováveis",
      subtitle: "Em ano de COP30, país investe em tecnologias de baixo carbono e avança em biocombustíveis; Usina do Grupo Multilixo em São Paulo se torna a primeira usina 100% autossustentável do setor",
      author: "Sofia Schuck",
      news_org: "ESG",
      date: "29/05/2025 às 12:51",
      imageUrl: "/src/assets/News/img5.jpg", 
      imageCaption: "Cerca de 50% da matriz energética brasileira é proveniente de renováveis, como a eólica e solar e em plena expansão",
      body: "Apostando na diversificação, o Brasil é líder em energias renováveis e investe massivamente em tecnologias de baixo carbono -- como biocombustíveis com potencial de escalar a descarbonização global.Atualmente, cerca de 50% da matriz energética brasileira é proveniente de fontes limpas: hidrelétrica, eólica, solar, biomassa e outros combustíveis verdes, e 80% da eletricidade já é gerada a partir delas. [...]",
      onClick: () => {window.open("https://exame.com/esg/dia-mundial-da-energia-brasil-se-consolida-potencia-global-em-biometano-e-renovaveis/")}
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

export default News
