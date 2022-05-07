# SearchTag

search engine in the form of a group tag!

![img](https://raw.githubusercontent.com/samueloviedo04/SearchTags/main/img/element.png)

## Installation
```bash
npm install
```
## props
```bash
data(array[object])
```
## Object
* name:name to display <br/>
* value:value for name to be displayed (this can be a database table, ref to some variable or action) <br/>
* data: object array that will contain the list {name:"element"} <br/>
* type:type of conditional depending on the variable to compare. string,integer,boolean <br/>
* icon: icons to display https://mui.com/material-ui/material-icons/

## props
```bash
setAutoSuggestResult(function)
```

## Return
```bash
array of selected elements separated by groups
```

## props
```bash
searchCondition(function)
```

## Return
```bash
currently selected string
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