import React from 'react'
import PropTypes from 'prop-types'
import Autosuggest from 'react-autosuggest'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem'
import { withStyles } from '@material-ui/core/styles'
import ChipInput from 'material-ui-chip-input'

const data = [
    {
        name: 'Usuario', value: 't365_Usuarios', data: [
            { name: 'Samuel' },
            { name: 'Suichin' },
            { name: 'Adham' }
        ], type: 'string', icon: 'fingerprint'
    },
    {
        name: 'Dispositivo', value: 't365_Clientes', data: [
            { name: 'L200' },
            { name: 'Camion' },
            { name: 'Corse' }
        ], type: 'string', icon: 'settings_input_hdmi'
    },
    {
        name: 'Cliente', value: 't365_ESOOO', data: [
            { name: 'Enrrique' },
            { name: 'Adham' },
            { name: 'Sofia' }
        ], type: 'string', icon: 'sentiment_satisfied_alt'
    },
    {
        name: 'Trama', value: 't365_Tramas', data: [
            { name: '100' },
            { name: '200' },
            { name: '300' }
        ], type: 'integer', icon: 'dynamic_feed'
    }
]



const Condition = {
    string: [{ name: '=' }, { name: '!=' }],
    integer: [{ name: '=' }, { name: '!=' }, { name: '<' }, { name: '<=' }, { name: '>' }, { name: '>=' }],
};


function renderInput(inputProps) {
    const { value, onChange, chips, ref, ...other } = inputProps

    return (
        <ChipInput
            clearInputValueOnChange
            onUpdateInput={onChange}
            value={chips}
            inputRef={ref}
            {...other}
        />
    )
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
        // value: '',
        suggestions: [],
        value: [],
        textFieldInput: '',
        valueChips: [],
        step: 0,
        selectItem: {}
    };

    handletextFieldInputChange = (event, { newValue }) => {
        this.setState({
            textFieldInput: newValue
        })
    };

    handleAddChip(chip) {
        if (this.props.allowDuplicates || this.state.value.indexOf(chip) < 0) {
            this.setState(({ value }) => ({
                value: [...value, chip],
                textFieldInput: ''
            }))
        }
    }

    handleDeleteChip(chip, index) {
        this.setState(({ value }) => {
            const temp = value.slice()
            temp.splice(index, 1)
            return {
                value: temp
            }
        })
    };

    arrayResults = () => {
        return this.state.valueChips.map((e) => (e.value));
    }

    getSugesstion = () => {
        switch (this.state.step) {
            case 0:
                let values = this.arrayResults();
                let filter = data.filter((e) => (!values.includes(e.value)))
                return filter.map((e) => ({ name: e.name, icon: e.icon }));
            case 1:
                return Condition[this.state.selectItem.type];
            case 2:
                return this.state.selectItem.data;
            default:

                return data.map((e) => e.name);
        }
    }

    render() {
        const { classes, ...other } = this.props

        return (
            <Autosuggest
                theme={{
                    container: classes.container,
                    suggestionsContainerOpen: classes.suggestionsContainerOpen,
                    suggestionsList: classes.suggestionsList,
                    suggestion: classes.suggestion
                }}
                renderInputComponent={renderInput}
                suggestions={this.getSugesstion()}
                onSuggestionsFetchRequested={() => { }}
                onSuggestionsClearRequested={() => { }}
                renderSuggestionsContainer={renderSuggestionsContainer}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                onSuggestionSelected={(e, { suggestionValue }) => { this.handleAddChip(suggestionValue); e.preventDefault() }}
                focusInputOnSuggestionClick
                inputProps={{
                    chips: this.state.value,
                    value: this.state.textFieldInput,
                    onChange: this.handletextFieldInputChange,
                    onAdd: (chip) => this.handleAddChip(chip),
                    onDelete: (chip, index) => this.handleDeleteChip(chip, index),
                    ...other
                }}
            />
        )
    }
}

ReactAutosuggest.propTypes = {
    allowDuplicates: PropTypes.bool,
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ReactAutosuggest)
