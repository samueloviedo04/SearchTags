import React from 'react'
import PropTypes from 'prop-types'
import Autosuggest from 'react-autosuggest'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem'
import { withStyles } from '@material-ui/core/styles'
import ChipInput from 'material-ui-chip-input'
import Chip from '@material-ui/core/Chip'


const Condition = {
  string: [{ name: '=' }, { name: '!=' }],
  integer: [{ name: '=' }, { name: '!=' }, { name: '<' }, { name: '<=' }, { name: '>' }, { name: '>=' }]
}


function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.name, query)
  const parts = parse(suggestion.name, matches)
  return (
    <MenuItem
      selected={isHighlighted}
      component='div'
      onMouseDown={(e) => e.preventDefault()} // prevent the click causing the input to be blurred
    >
      <div>
        {parts.map((part, index) => {
          return part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </span>
          ) : (
              <span key={String(index)}>
                {part.text}
              </span>
            )
        })}
      </div>
    </MenuItem>
  )
}

function renderSuggestionsContainer(options) {
  const { containerProps, children } = options

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  )
}

function getSuggestionValue(suggestion) {
  return suggestion.name
}

function getSuggestions(sugesstion, value) {
  const inputValue = value.trim().toLowerCase()
  const inputLength = inputValue.length
  let count = 0

  return inputLength === 0
    ? []
    : sugesstion.filter(suggestion => {
      const keep =
        count < 5 && suggestion.name.toLowerCase().slice(0, inputLength) === inputValue

      if (keep) {
        count += 1
      }

      return keep
    })
}

const styles = theme => ({
  container: {
    flexGrow: 1,
    position: 'relative'
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 3,
    left: 0,
    right: 0,
    zIndex: 1
  },
  suggestion: {
    display: 'block'
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none'
  },
  textField: {
    width: '100%'
  }
})

class ReactAutosuggest extends React.Component {
  state = {
    // value: '',,
    selectItem: {},
    suggestions: [],
    value: [],
    valueChips: [],
    textFieldInput: '',
    step: 0,
    index: 1
  };


  LimtStep = 3;

  renderInput = (inputProps) => {

    const { isdelete, valueChips, value, onChange, chips, ref, ...other } = inputProps
    return (
      <ChipInput
        clearInputValueOnChange
        dataSource={valueChips}
        dataSourceConfig={{ text: 'text', value: 'value', delete: 'isdelete', index: 'index' }}
        value={valueChips}
        onUpdateInput={onChange}
        inputRef={ref}
        onDelete={(c, i) => this.handleDeleteChipInput(c, i)}
        {...other}
        chipRenderer={(
          { className,
            chip,
            handleClick
          },
          key
        ) => {
          if (chip.text.value !== undefined) return null
          const style = {
            backgroundColor: "#dddddd",
            borderRadius: "2px",
            ...this.props.styleChip
          }
          if (!chip.delete)
            style.margin = '0px 0px 8px 0px';

          return (
            <Chip
              key={key}
              className={className}
              style={style}
              onClick={handleClick}
              label={chip.text}
              onDelete={chip.delete ? () => this.handleDeleteChip(chip.index) : undefined}
            />
          )
        }}
      />
    )
  }

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(this.getSugsstion(), value)
    })
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    })
  };

  handletextFieldInputChange = (event, { newValue }) => {
    console.log(event)
    this.setState({
      textFieldInput: newValue
    })
  };

  getSugsstion() {
    console.log(this.state.step)
    switch (this.state.step) {
      case 0:
        return this.props.data.map(e => ({ name: e.name }));
      case 1:
        return Condition[this.state.selectItem.type];
      case 2:
        return this.state.selectItem.data;
      default:
        this.setState({ step: 0 })
        return this.props.data.map(e => e.name);
    }
  }

  getStepRegression() {
    switch (this.state.step) {
      case 0:
        return 2;
      case 1:
        return 0;
      case 2:
        return 1;
      default:
        return 0;
    }
  }

  handleAddChip(chip) {
    if (typeof (chip) != 'string') return
    if (this.props.allowDuplicates || this.state.value.indexOf(chip) < 0) {
      this.setState(({ value, step, valueChips, index, selectItem }) => {
        let dataSelect = step === 0 ? this.props.data.find(e => e.name === chip).value : chip
        let data_ = { index: index, delete: this.state.step === (this.LimtStep - 1) ? true : false, value: dataSelect, text: chip }
        return ({
          value: [...value, chip],
          valueChips: [...valueChips, data_],
          textFieldInput: ' ',
          step: step + 1,
          index: index + 1,
          selectItem: step === 0 ? this.props.data.find(e => e.name === chip) : selectItem,
        })
      })
    }

  }

  handleDeleteChip(index_) {
    this.setState(({ valueChips }) => {

      let filt = valueChips.filter((e) => {
        return !(e.index <= index_ && e.index >= (index_ - 2))
      })
      return {
        value: filt.map(e => e.value),
        valueChips: filt,
        index: index_ - 2
      }
    })
  };

  handleDeleteChipInput(chips, index) {
    if (index === 0 && this.state.valueChips.length === 0) return
    index = (index + 1)
    this.setState(({ value, valueChips, step }) => {
      let filt = valueChips.filter((e) => {
        return e.index !== index
      })
      return {
        value: filt.map(e => e.value),
        valueChips: filt,
        step: this.getStepRegression(),
        index: index
      }
    })
  };

  result = () => {
    return this.state.valueChips.map((e) => (e.value))
  }

  render() {
    console.log(this.result())
    const { classes, styleChip, ...other } = this.props
    let inputProps = {
      chips: this.state.value,
      value: this.state.textFieldInput,
      valueChips: this.state.valueChips,
      isdelete: false,
      onChange: this.handletextFieldInputChange,
      onAdd: (chip) => this.handleAddChip(chip),
    }
    if (this.state.step === this.LimtStep) {
      inputProps.isdelete = true
    }
    return (
      <Autosuggest
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion
        }}
        renderInputComponent={this.renderInput}
        suggestions={this.getSugsstion()}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        renderSuggestionsContainer={renderSuggestionsContainer}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        onSuggestionSelected={(e, { suggestionValue }) => { this.handleAddChip(suggestionValue); e.preventDefault() }}
        alwaysRenderSuggestions={true}
        onBlur={e => console.log(e)}
        inputProps={{
          ...inputProps,
          ...other,
        }}
      />
    )
  }
}

ReactAutosuggest.defaultProps = {
  styleChip: {}
};

ReactAutosuggest.propTypes = {
  allowDuplicates: PropTypes.bool,
  classes: PropTypes.object.isRequired
}

export const MyReactAutosuggest = withStyles(styles)(ReactAutosuggest)