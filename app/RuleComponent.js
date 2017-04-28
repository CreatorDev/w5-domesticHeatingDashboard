import React from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TimePicker from 'material-ui/TimePicker';
import { Grid, Row, Col } from 'react-flexbox-grid'
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';

class RuleComponent extends React.Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            rule: this.props.rule,
            variables: this.props.variables
        }
    
    }

    render() {
        // alert(this.state.variables.length);
        return (
            
            <Grid>
                <Row >
                    <Col key="col1">
                        <SelectField
                            floatingLabelText="Day of week"
                            onChange={this.handleWeekDayChange.bind(this)}
                            value={this.state.rule.weekDay}
                            style={{ "width": "150px" }}>
                            
                            <MenuItem value={"every"} primaryText="Every" />
                            <MenuItem value={"monday"} primaryText="Monday" />
                            <MenuItem value={"tuesday"} primaryText="Tuesday" />
                            <MenuItem value={"wednesday"} primaryText="Wednesday" />
                            <MenuItem value={"thursday"} primaryText="Thursday" />
                            <MenuItem value={"friday"} primaryText="Friday" />
                            <MenuItem value={"saturday"} primaryText="Saturday" />
                            <MenuItem value={"sunday"} primaryText="Sunday" />
                        </SelectField>
                    </Col>
                    <Col key="col2">
                        <TimePicker
                            format="24hr"
                            hintText=""
                            value={this.props.rule.hour}
                            onChange={this.handleTimeChange.bind(this)}
                            textFieldStyle={{ "margin-top": "24px" }}
                            autoOk={true}
                            />
                    </Col>    
                    <Col key="col3">
                        <SelectField
                            floatingLabelText="Temperature"
                            onChange={this.handleTemperatureChange.bind(this)}
                            value={this.props.rule.temperature}>
                            {this.props.variables.map((variable) => {
                                return (
                                    <MenuItem value={variable.id} primaryText={variable.name} key={variable.id} />
                                )
                            })}
                            
                        </SelectField>
                    </Col>
                    <Col key={'col4'}>
                        <IconButton onClick={this.handleButtonClick.bind(this, this.props.rule)} style={{"margin-top":"24px"}}>
                        <ActionDelete />
                        </IconButton>
                    </Col>
                    
                </Row>    

                
            </Grid>
        )
    }


    handleWeekDayChange(event, index, value) {
        let rule = this.state.rule;
        rule.weekDay = value;
        this.setState({ rule: rule });
        this.props.onChange(rule);
    }

    handleTemperatureChange(event, index, value) {
        let rule = this.state.rule;
        rule.temperature = value;
        this.setState({ rule: rule });
        this.props.onChange(rule);
    }

    handleTimeChange(event, time) {
        let rule = this.state.rule;
        rule.hour = time;
        this.setState({ rule: rule });
        this.props.onChange(rule);
    }

    handleButtonClick(rule) {
        this.props.onButtonClick(rule);
    }

}


export default RuleComponent;