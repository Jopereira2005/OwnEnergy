import Select from 'react-select'

interface selectProp {
  id: string,
  name: string,
  placeholder?: string,
  inputValue: { value: string; label: string } | null; // Valor compatível com o `react-select`
  options: { value: string; label: string }[]; // Array de opções
  onChangeFunc: (newValue: { value: string; label: string } | null, actionMeta: any) => void,
  required?: boolean | undefined
}

const InputSelectMult = ({ id, options, name, placeholder, inputValue, onChangeFunc}: selectProp) => {
  const inputStyles = {
    control: (provided : any) => ({ ...provided,
      width: "225px",
      border: "2px solid #003D4E",
      borderRadius: "10px",
      fontSize: "1.5rem",
      height:"40px",
      boxShadow: "0px 10px 10px -8px rgba(0,0,0,0.25)",
      margin: "5px 0px 0px"
     }), option: (styles: any) => ({ ...styles,
      fontSize: "1.5rem",
      borderRadius: "5px"
     }), menu: (provided: any) => ({
      ...provided,
      border: "2px solid #FFFF39",
      padding: "2px 5px",
      maxHeight: "200px"
    }),  menuList: (provided: any) => ({
      ...provided,
      maxHeight: "190px"
    
    }),
  }

  return (
    <Select 
      id={ id }
      name={ name }
      options={ options } 
      value={ inputValue }
      placeholder={ placeholder } 
      onChange={ (newValue, actionMeta) => onChangeFunc(newValue as unknown as { value: string; label: string } | null, actionMeta) }
      styles={ inputStyles }
      required
      className="basic-multi-select"
      classNamePrefix="select"
      theme={(theme : any) => ({
        ...theme,
        borderRadius: 10,
        colors: {
          ...theme.colors,
          primary: "#FFFF39",
          primary25: "#00647D",
          primary50: "#00647D",
          neutral0: "#003D4E",
          neutral5: "#FFFFEC",
          neutral10: "#00647D",
          neutral20: "#FFFFEC",
          neutral30: "#FFFF39",
          neutral40: "#FFFFEC",
          neutral50: "#BCBCBC",
          neutral60: "#FFFFEC",
          neutral80: "#FFFFEC"
        },
      })}
    />
  )
}

export default InputSelectMult
