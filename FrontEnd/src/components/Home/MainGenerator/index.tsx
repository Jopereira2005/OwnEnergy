import styled from './style.module.scss'

import CardGenerator from '../CardGenerator'

import { Generator } from '../../../interfaces/Generator'
import { GeneratorType } from '../../../interfaces/GeneratorType'


import { AddIcon } from '../../../assets/Common/Add'

interface mainGeneratorProps {
  listGenerators: Generator[],
  listGeneratorTypes: GeneratorType[],
  toggleCreateModal: (status: boolean) => void,
  toggleEditModal: (
    status: boolean, 
    selectedItem: Generator
  ) => void,
  changeGeneratorState: (id: string) => Promise<boolean>
}

const MainGenerator = ({listGenerators, listGeneratorTypes, toggleCreateModal, toggleEditModal, changeGeneratorState}: mainGeneratorProps) => {  
  return (
    <>
      <div className={ styled.main_generator }>
        <div className={ styled.main_generator__cards }>
          <div className={ styled.main_generator__cards__header }>
            <h1 className={ styled.main_generator__cards__header__text }>Geradores</h1>       
            <AddIcon onClick={ () => toggleCreateModal(true) } className={ styled.main_generator__cards__header__icon }/>
          </div>
          { listGenerators.length == 0 ?
            <h1 className={ styled.main_generator__cards__menssage }>Cadastre algum gerador para começar ;)</h1> :
            <div className={ styled.main_generator__cards__body }>
              { listGenerators.map((generator) => (
                <CardGenerator
                  key = { generator.id }
                  generator = { generator }
                  isRenewable = { (listGeneratorTypes.find(item => item.typeName === generator.typeName))?.isRenewable }
                  chanceGeneratorState = { changeGeneratorState }
                  toggleEditModal = { () => toggleEditModal(true, generator) }
                />
              ))}
            </div>
          }
        </div>
      </div>
    </> 
  )
}

export default MainGenerator