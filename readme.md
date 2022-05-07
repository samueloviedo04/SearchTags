# SearchTag

search engine in the form of a group tag!

## Installation
```bash
npm install
```
## props
```bash
setAutoSuggestResult(function)
```

## Return
```bash
array elements select
```

## props
```bash
searchCondition(function)
```

## Return
```bash
string value
```

## Example use
```bash
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
            label='Advanced search'
            placeholder='Search'
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
```


## License
[MIT](https://choosealicense.com/licenses/mit/)