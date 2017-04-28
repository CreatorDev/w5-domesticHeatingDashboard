import React from 'react';
import TextField from 'material-ui/TextField';

class VariableComponent extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            variable: this.props.variable,
        }
        
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
    }

    render() {
        return (
            <div>
                <TextField
                    hintText="Variable name"
                    value={this.props.variable.name}
                    onChange={this.handleNameChange}
                />
                <TextField
                    hintText="Value"
                    style={{ "width": "80px", "margin-left":"24px" }}
                    value={this.props.variable.value}
                    type="number"
                    onChange={this.handleValueChange}
                />
                
            </div>
        )
    }

    handleNameChange(event) {
        this.state.variable.name = event.target.value;
        this.setState({ variable: this.state.variable });
        this.props.onChange(this.state.variable);
    }

    handleValueChange(event) {
        this.state.variable.value = event.target.value;
        this.setState({ variable: this.state.variable });
        this.props.onChange(this.state.variable);
    }
}


export default VariableComponent;