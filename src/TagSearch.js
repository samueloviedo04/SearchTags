import React from 'react'
import MyReactAutosuggest from './suggest'

class CustomTags extends React.Component {

  data = [
    {
      name: 'Usuario', value: 'table_users', data: [
        { name: 'Samuel' },
        { name: 'Suichin' },
        { name: 'Adham' }
      ], type: 'string', icon: 'fingerprint'
    },
    {
      name: 'Dispositivo', value: 'table_devices', data: [
        { name: 'L200' },
        { name: 'Camion' },
        { name: 'Corse' }
      ], type: 'string', icon: 'settings_input_hdmi'
    },
    {
      name: 'Cliente', value: 'table_clients', data: [
        { name: 'Enrrique' },
        { name: 'Adham' },
        { name: 'Sofia' }
      ], type: 'string', icon: 'sentiment_satisfied_alt'
    },
    {
      name: 'Trama', value: 'table_queue', data: [
        { name: '100' },
        { name: '200' },
        { name: '300' }
      ], type: 'integer', icon: 'dynamic_feed'
    },
    {
      name: 'sam', value: 'My sam', type: 'boolean', icon: 'pregnant_woman'
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
            styleChip={{ color: "#000" }}
            fullWidth
            loading={false}
            allowDuplicates
            searchCondition={(text) => {
              console.log(text)
            }}
            setAutoSuggestResult={(element) => {
              console.log(element)
            }}
          />
        </div>
      </>
    )
  }
}

export default CustomTags;