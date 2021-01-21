import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import ChipInput from 'material-ui-chip-input';
import Chip from '@material-ui/core/Chip';


const Condition = {
  string: [{ name: '=' }, { name: '!=' }],
  integer: [{ name: '=' }, { name: '!=' }, { name: '<' }, { name: '<=' }, { name: '>' }, { name: '>=' }],
};


const renderSuggestion = (suggestion, { query, isHighlighted }) => {
  const matches = match(suggestion.name, query);
  const parts = parse(suggestion.name, matches);
  return (
    <MenuItem
      selected={isHighlighted}
      component="div"
      onMouseDown={(e) => e.preventDefault()} // prevent the click causing the input to be blurred
    >
      <div>
        {parts.map((part, index) => (part.highlight ? (
          <span key={String(index)} style={{ fontWeight: 500 }}>
            {part.text}
          </span>
        ) : (
          <span key={String(index)}>
            {part.text}
          </span>
        )))}
      </div>
    </MenuItem>
  );
};

const renderSuggestionsContainer = (options) => {
  const { containerProps, children } = options;

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  );
};

const getSuggestionValue = (suggestion) => suggestion.name;


const AutoSuggest = ({
  data, classes, styleChip, allowDuplicates, alwaysRenderSuggestions, ...other
}) => {
  const [selectItem, setSelectItem] = useState({});
  const [value, setValue] = useState([]);
  const [focus, setFocus] = useState(false);
  const [valueChips, setValueChips] = useState([]);
  const [textFieldInput, setTextFieldInput] = useState('');
  const [step, setStep] = useState(0);
  const [index, setIndex] = useState(1);

  const limitStep = 3;

  const getSugesstion = () => {
    switch (step) {
      case 0:
        return data.map((e) => ({ name: e.name }));
      case 1:
        return Condition[selectItem.type];
      case 2:
        return selectItem.data;
      default:
        setStep(0);
        return data.map((e) => e.name);
    }
  };

  const getStepRegression = () => {
    switch (step) {
      case 0:
        return 2;
      case 1:
        return 0;
      case 2:
        return 1;
      default:
        return 0;
    }
  };

  const handletextFieldInputChange = (event, { newValue }) => {
    setTextFieldInput(newValue);
  };

  const handleAddChip = (chip) => {
    if (typeof (chip) !== 'string') {
      return;
    }

    if (allowDuplicates || value.indexOf(chip) < 0) {
      const dataSelect = step === 0 ? data.find((e) => e.name === chip).value : chip;

      const newData = {
        index, delete: step === (limitStep - 1), value: dataSelect, text: chip,
      };

      setValue([...value, chip]);
      setValueChips([...valueChips, newData]);
      setTextFieldInput(' ');
      setStep(step + 1);
      setIndex(index + 1);
      setSelectItem(step === 0 ? data.find((e) => e.name === chip) : selectItem);
    }
  };

  const reCalculatorId = (filteredChips) => filteredChips.map((e, filteredIndex) => {
    e.index = filteredIndex + 1;
    return e;
  });

  const deleteChip = (chipIndex) => {
    let filteredChips = valueChips.filter((e) => !(e.index <= chipIndex && e.index >= (chipIndex - 2)));
    filteredChips = reCalculatorId(filteredChips);
    setValue(filteredChips.map((e) => e.value));
    setValueChips(filteredChips);
    setIndex(chipIndex + 1);
  };

  const deleteChipInput = (chips, chipIndex) => {
    if (step === 0 && valueChips.length === 0) { return; }
    if (index === 0 && valueChips.length === 0) {
      return;
    }

    const chipNewIndex = chipIndex + 1;
    let filteredChips = valueChips.filter((e) => e.index !== chipNewIndex);
    filteredChips = reCalculatorId(filteredChips);

    setValue(filteredChips.map((e) => e.value));
    setValueChips(filteredChips);
    setStep(getStepRegression());
    setIndex(chipNewIndex);
  };

  const renderInput = ({ onChange, ref }) => (
    <ChipInput
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      clearInputValueOnChange
      dataSource={valueChips}
      dataSourceConfig={{
        text: 'text', value: 'value', delete: 'isdelete', index: 'index',
      }}
      value={valueChips}
      onUpdateInput={onChange}
      inputRef={ref}
      onDelete={(c, i) => deleteChipInput(c, i)}
      chipRenderer={({ className, chip, handleClick }, key) => {
        if (chip.text.value !== undefined) {
          return null;
        }

        const style = {
          backgroundColor: '#dddddd',
          borderRadius: '2px',
          ...styleChip,
        };

        if (!chip.delete) {
          style.margin = '0px 0px 8px 0px';
        }

        return (
          <Chip
            key={key}
            className={className}
            style={style}
            onClick={handleClick}
            label={chip.text}
            onDelete={chip.delete ? () => deleteChip(chip.index) : undefined}
          />
        );
      }}
      {...other}
    />
  );

  const inputProps = {
    chips: value,
    value: textFieldInput,
    valueChips,
    autoFocus: true,
    isdelete: step === limitStep,
    onChange: handletextFieldInputChange,
    onAdd: (chip) => handleAddChip(chip),
  };

  const result = () => valueChips.map((e) => (e.value));

  console.log(result());
  return (
    <Autosuggest
      theme={{
        container: classes.container,
        suggestionsContainerOpen: classes.suggestionsContainerOpen,
        suggestionsList: classes.suggestionsList,
        suggestion: classes.suggestion,
      }}
      renderInputComponent={renderInput}
      suggestions={getSugesstion()}
      onSuggestionsFetchRequested={() => { }}
      onSuggestionsClearRequested={() => { }}
      renderSuggestionsContainer={renderSuggestionsContainer}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      onSuggestionSelected={(e, { suggestionValue }) => { handleAddChip(suggestionValue); e.preventDefault(); }}
      shouldRenderSuggestions={() => true}
      alwaysRenderSuggestions={focus}
      inputProps={{
        ...inputProps,
        ...other,
      }}
    />
  );
};

const styles = (theme) => ({
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
    left: 0,
    right: 0,
    zIndex: 1,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  textField: {
    width: '100%',
  },
});


export default withStyles(styles)(AutoSuggest);
