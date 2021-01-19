import React from 'react'

import {
  MyReactAutosuggest,
} from './suggest'

class CustomTags extends React.Component {

  data = [
    {
      name: 'Usuario', value: 't365_Usuarios', data: [
        { name: 'Samuel' },
        { name: 'Suichin' },
        { name: 'Adham' }
      ], type: 'string'
    },
    {
      name: 'Dispositivo', value: 't365_Clientes', data: [
        { name: 'L200' },
        { name: 'Camion' },
        { name: 'Corse' }
      ], type: 'string'
    },
    {
      name: 'Cliente', value: 't365_ESOOO', data: [
        { name: 'Enrrique' },
        { name: 'Adham' },
        { name: 'Sofia' }
      ], type: 'string'
    },
    {
      name: 'Trama', value: 't365_Tramas', data: [
        { name: '100' },
        { name: '200' },
        { name: '300' }
      ], type: 'integer'
    }
  ]

  render() {
    return (
      <>
        <div style={{ margin: "auto", padding: "51px" }}>
          <MyReactAutosuggest
            label='Busqueda avanzada'
            placeholder='Buscar'
            data={this.data}
            styleChip={{ color: "#ff1122" }}
            fullWidth
            allowDuplicates
          />
        </div>
      </>
    )
  }
}

export default CustomTags;