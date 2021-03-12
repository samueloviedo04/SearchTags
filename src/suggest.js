// al completar el Chip, osea que se unan 3, deberia cerrarme las opciones. OK

// importante, que se pueda escribir algo despues de la condicion, ejm: status > *escrito a mano* y que al darle enter o espacio (uno de los dos) se agrege al chip osea se unan los 3

// ignorar cualquier cosa que haya en el campo de texto que no tenga el formato de Columna, condicion, valor. ejm: status = 2 esta bien pero que diga algo como: status nombre = carlos ahi se deberia el ouput decir: nombre = carlos sin el status


// si ya elegi una opcion y la complete ejm: nombre = jose, al abrirlo otra vez no deberia ofrecerme como opcion nombre otra vez OK 
// alguna posibilidad de que en las opciones tengan iconos? que yo le ponga el icono en el objeto que se le pasa por prop, o como lo veas OK


// es valor no condicion ok
//el borrar
//cambio la key enter   ok
//loading' ok


import React, { useEffect, useState } from 'react';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import ChipInput from 'material-ui-chip-input';
import Chip from '@material-ui/core/Chip';
import Icon from '@material-ui/core/Icon';


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
        {parts.map((part, index) =>
          <span key={String(index)} style={{ fontWeight: 500 }}>
            {suggestion.icon !== undefined ? <Icon>{suggestion.icon}</Icon> : undefined}
            {part.text}
          </span>)}
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

const getSuggestionValue = (suggestion) => { return suggestion.name };


const AutoSuggest = ({
  data, classes, styleChip, allowDuplicates, loading, searchCondition, setAutoSuggestResult = () => { }, ...other
}) => {
  const limitStep = 3;
  const [selectItem, setSelectItem] = useState({});
  const [value, setValue] = useState([]);
  const [focus, setFocus] = useState(false);
  const [valueChips, setValueChips] = useState([]);
  const [textFieldInput, setTextFieldInput] = useState('');
  const [step, setStep] = useState(0);
  const [index, setIndex] = useState(1);


  useEffect(() => {
    let secondAcc = [];
    const acc = [];

    valueChips.forEach((val) => {
      if (val.delete) {
        secondAcc.push(val);
        acc.push(secondAcc);
        secondAcc = [];
      } else {
        secondAcc.push(val);
      }
    });

    setAutoSuggestResult(acc);
  }, [valueChips, setAutoSuggestResult]);

  const arrayResults = () => {
    return valueChips.map((e) => (e.value));
  }

  const getSugesstion = () => {
    switch (step) {
      case 0:
        return data.map((e) => ({ name: e.name, icon: e.icon }));
      case 1:
        return Condition[selectItem.type];
      case 2:
        let values = arrayResults();
        console.log(values)
        let filter = selectItem.data.filter((e) => (!values.includes(e.name)))
        return filter;
      default:
        setStep(0);
        if (valueChips.length > 0) {
          setFocus(false)
        }
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
    if (step === 2 && searchCondition)
      searchCondition(newValue)//adham aqui va la funcion
  };

  const handleAddChip = (chip, origin) => {

    if (typeof (chip) !== 'string') {
      return;
    }

    if (allowDuplicates || value.indexOf(chip) < 0) {
      const Select = data.find((e) => e.name === chip);
      if (Select === undefined && step !== 2 && origin === "key") return
      const dataSelect = step === 0 ? Select.value : chip;
      const iconSelect = Select !== undefined ? Select.icon : undefined;

      const newData = {
        index, delete: step === (limitStep - 1), value: dataSelect, text: chip, icon: iconSelect
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

    console.log(valueChips)
    const chipNewIndex = valueChips.length;
    let filteredChips = valueChips.filter((e) => e.index !== chipNewIndex);
    filteredChips = reCalculatorId(filteredChips);

    setValue(filteredChips.map((e) => e.value));
    setValueChips(filteredChips);
    setStep(getStepRegression());
    setIndex(chipNewIndex);
  };

  const renderInput = ({ onAdd, onChange, ref }) => (
    <ChipInput
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      onClick={() => setFocus(true)}
      newChipKeys={[" "]}
      disableUnderline
      value={valueChips}
      onUpdateInput={onChange}
      onAdd={onAdd}
      inputRef={ref}
      onDelete={(c, i) => deleteChipInput(c, i)}
      chipRenderer={({ className, chip, handleClick }, key) => {

        if (chip.text.value !== undefined) {
          return null;
        }

        const style = {
          backgroundColor: '#f0f0f0',
          borderRadius: '2px',
          margin: 'auto',
          marginRight: '8px',
          ...styleChip,
        };

        if (!chip.delete) {
          style.marginRight = '0px';
        }

        return (
          <Chip
            icon={chip.icon ? <Icon>{chip.icon}</Icon> : undefined}
            key={key}
            className={`${className}`}
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
    onAdd: (chip) => handleAddChip(chip, "key"),
  };


  return (
    <div style={{ display: 'flex' }}>
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
        onSuggestionSelected={(e, { suggestionValue }) => { handleAddChip(suggestionValue, "suggest"); e.preventDefault(); }}
        shouldRenderSuggestions={() => false}
        alwaysRenderSuggestions={!loading && focus}
        inputProps={{
          ...inputProps,
          ...other,
        }}
      />
      {loading && <p style={{ marginLeft: 20 }}>loading</p>}
    </div>
  );
};

const styles = (theme) => ({
  container: {
    flexGrow: 1,
    position: 'relative',
    border: '1px solid #E4E6EF',
    borderRadius: '0.42rem',
    paddingLeft: '0.65rem',
    paddingRight: '0.65rem',
    // paddingTop: 10,
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
