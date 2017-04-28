import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import VariableComponent from './VariableComponent';
import RuleComponent from './RuleComponent';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider'
import { Grid, Row, Col } from 'react-flexbox-grid';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { HorizontalBar } from 'react-chartjs-2';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import DropDownMenu from 'material-ui/DropDownMenu';
import IconMenu from 'material-ui/IconMenu';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import Request from 'SuperAgent'

import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin();

class App extends React.Component {

    constructor() {
        super();
        this.getVariableIndex.bind(this);
        this.init.bind(this);
        this.generateConfig.bind(this);
        this.state = {
            variables: [], // [new Variable(34, "day", 23), new Variable(37, "night", 18)],
            rules:[],// [new Rule(35, "every", new Date(0,0,0,17,0,0), 34), new Rule(36, "every", new Date(0,0,0,21,0,0), 37), new Rule(38, "tuesday", new Date(0,0,0,13,0,0), 34)],
            index: 0,
            data: [],
            colors: ['rgb(0, 153, 204)', 'rgb(0, 204, 136)', 'rgb(153, 102, 255)', 'rgb(204, 102, 153)', 'rgb(255, 80, 80)'],
            chartData: {
                labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                datasets: [
                    {
                        label: 'My First dataset',
                        backgroundColor: 'rgba(255,99,132,0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                        hoverBorderColor: 'rgba(255,99,132,1)',
                        data: [65, 59, 80, 81, 56, 55, 40]
                    }
                ],
            },
            isProgressVisible: false,
            chartColors: [],
            options: {
                tooltips : {
                    enabled: false      
                },
                animation : false,
                legend: {
                    display: false
                },
        
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            max: 20

                        },
                        stacked: true
                    }],
                    xAxes: [{
                        ticks: {
                            mirror: true,
                            beginAtZero: true,
                            max: 24,
                            callback: function(value) { 
                                return value + ":00" 
                            },
                    
                        },
                        
                        stacked: true
                    }
                    ]
                }
            }
        }

        
    }

    componentDidMount() {
        this.reloadConfig();
    }

    render() {
        return (
            <MuiThemeProvider>
                <div>  
                    <Toolbar>
                        <ToolbarGroup firstChild={true}>
                        
                        </ToolbarGroup>
                        <ToolbarGroup>
                        
                        <FontIcon className="muidocs-icon-custom-sort" />
                        {/*<ToolbarSeparator />*/}
                        {this.state.isProgressVisible ? <CircularProgress /> : ''}
                        
                        <RaisedButton label="Reload from server" primary={true} onClick={this.reloadConfig.bind(this)} />    
                        <RaisedButton label="Save" primary={true} onClick={this.saveSchedule.bind(this)} />
                        </ToolbarGroup>
                    </Toolbar>
                    
                    <Grid>
                        <h1 key="h1_variable" style={{ "font-family": "Roboto" }}>Variables</h1>
                        
                        {this.state.variables.map((variable) => {
                            return (
                                <Row key={variable.id}>
                                    <Col xs={4} xsOffset={3} key={'col1' + variable.id}>
                                    {console.log("variable " + variable.toString())}    
                                        <VariableComponent variable={variable} key={variable.id} onChange={this.onVariableChange.bind(this)} />
                                    </Col>    
                                    <Col xs={1} key={'col2' + variable.id}>
                                        <IconButton key={'remove_variable_' + variable.id} onClick={this.removeVariable.bind(this, variable.id)}>
                                            <ActionDelete />
                                        </IconButton>

                                    </Col>
                                </Row>
                            )    
                        })}
                        <Row key="row_add_variable">
                            <Col>
                                <RaisedButton label="Add variable" onClick={this.addVariable.bind(this)} />
                            </Col>    
                        </Row>    
                        <Divider style={{"margin-top":"24px", "margin-bottom":"24px"}}/>
                        <h1 key="h1_rule" style={{ "font-family": "Roboto" }}>Rules</h1>             
                        {this.state.rules.map((rule) => {
                            return (
                                
                                <Row key={"rule_row"+rule.id}>
                                    <Col xs={6} xsOffset={3} key={'rule_col1' + rule.id}>
                                        <RuleComponent key={rule.id} rule={rule} variables={this.state.variables} onChange={this.onRuleChange.bind(this)} onButtonClick={this.onRuleButtonClick.bind(this)} />
                                    </Col>    
                                </Row>
                            )    
                        })}
                        
                        <Row key="row_add_rule">
                            <Col>
                                <RaisedButton label="Add rule" onClick={this.addRule.bind(this)} />
                            </Col>
                        </Row>

                        {/*<Row key="row_save">
                            <Col>
                                <RaisedButton label="Save" onClick={this.save.bind(this)} />
                            </Col>    
                        </Row>*/}
                        <Divider style={{"margin-top":"24px", "margin-bottom":"24px"}}/>
                        <h1 key="h1_schedule" style={{ "font-family": "Roboto" }}>Schedule</h1>
                        <HorizontalBar data={this.state.chartData} options={this.state.options}/>
                    </Grid>    

                    <Dialog
                        title={this.state.dialogTitle}
                        modal={true}
                        open={this.state.isProgressVisible}>
                        <Grid fluid={true}>
                            <Row middle={"xs"}>
                                <Col xs={1} key="dialog_col1">
                                    <CircularProgress />
                                </Col>
                                <Col xs={1} key="dialog_col2" />
                                <Col xs={10} key="dialog_col3">
                                    {this.state.dialogMessage}
                                </Col>    
                            </Row>
                        </Grid>
                        

                     </Dialog>
                </div>    
            </MuiThemeProvider>
        )
    }

    addVariable() {
        this.state.index++;
        const variable = new Variable(this.state.index, "", "");
        this.state.variables.push(variable);
        
        this.setState(this.state);
        this.generateData(this.state.rules);
    }

    removeVariable(key) {
        let variables = this.state.variables.filter(function (variable) {
            return variable.id != key;
        });
        let rules = this.state.rules.slice();
        variables = variables.slice();
        this.setState({variables: variables, rules: rules});
        this.generateData(rules);
 
    }

    addRule() {
        const rule = new Rule(this.state.index, "", "");
        this.setState({ index: this.state.index++ });
        
        this.state.rules.push(rule);
        this.setState(this.state);
    }

    onVariableChange(variable) {
        this.setState({ variables: this.state.variables });
        this.generateData(this.state.rules);
    }

    onRuleChange(rule) {
        console.log(rule.hour);
        this.setState({ rules: this.state.rules });
        this.generateData(this.state.rules);
    }

    onRuleButtonClick(rule) {
        let rules = this.state.rules.filter(function (item) {
            return rule.id != item.id;
        });
        rules = rules.slice();
        console.log("asdasfs %d", rules.length);
        this.setState({rules: rules});
        this.generateData(rules);
        
    }

    validate() {
        
    }

    generateConfig() {
        let i = 0;
        let data = "";
        this.state.variables.forEach(function (item) {
            if (item.isValid()) {
                data += "id: " + item.name + ", " + item.value + "\r\n"
            }    
        })
        this.state.rules.forEach(function (item) {
            data += "week: " + item.weekDay + " " + item.hour.getHours() + ":" + item.hour.getMinutes() + ", " + this.getVariableName(item.temperature) + "\r\n"
        }, this)
        console.log(data);
        return data;
            
        
    }

    reloadConfig() {
        this.setState({ isProgressVisible: true, dialogTitle : "Fetching data", dialogMessage : "Config is being fetched from server..." });
        Request.get('https://300286cf.ngrok.io/schedule')
            .set('Accept', 'application/json')    
            .end((err, res) => {
                
                if (!err && res.status == 200) {
                    console.log(res.body.schedule);
                    this.init(res.body.schedule);
                    this.setState({ isProgressVisible: false });
                } else {
                    console.log(res.status + " " + err);
                    this.setState({ isProgressVisible: false });
                }
            });
        
    }

    generateData(rules) {
        let i = 0;  
        let res = [];
        let resColors = [];
        for (i = 0; i < 7; i++) {
            this.state.data[i] = [];
            this.state.chartColors[i] = [];
        }
        console.log("Generating data: %d rules found", rules.length);
        rules.forEach(function(rule) {
            if (rule.weekDay === "every") {
                let i = 0;
                for (i = 0; i < 7; i++) {
                    this.state.data[i].push(
                        {
                            color: this.state.colors[this.getVariableIndex(rule.temperature)],
                            value: rule.hour.getHours() + (rule.hour.getMinutes() / 60)
                        })
                    
                }
            } else {
            
                this.state.data[this.getWeekDayIndex(rule.weekDay)].push(
                    {
                        color: this.state.colors[this.getVariableIndex(rule.temperature)],
                        value: rule.hour.getHours()
                    });
            }
        }, this);

        if (this.state.data.length == 0) {
            this.state.data[0].push({
                color: "red",
                value: 0
            })
        }
        
       
        let max = 0;        
        for (i = 0; i < 7; i++) {
            this.state.data[i] = this.state.data[i].sort(this.sortNumber);
            
            if (this.state.data[i][this.state.data[i].length - 1]) {
                this.state.data[i].push({
                    value: 24,
                    color: this.state.data[i][this.state.data[i].length - 1].color
                });
            } else {
                this.state.data[i].push({
                    value: 24,
                    color: "grey"
                });
            }    
            if (this.state.data[i].length > max) {
                max = this.state.data[i].length;
                
            }
        }

        for (i = 0; i < 7; i++) {
            let j = 0;
            let k = this.state.data[i].length-1;
            for (j = this.state.data[i].length; j < max; j++) {
                this.state.data[i][j] = { color: this.state.data[i][k].color, value: 24 };
            }
        }

        for (i = 0; i < 7; i++) {
            let j = 0;
            for (j = max-1; j > 0; j--) {
                if (this.state.data[i][j]) {
                    this.state.data[i][j].value = this.state.data[i][j].value - this.state.data[i][j - 1].value;
                }    
            }
        }

        for (i = 0; i < 7; i++) {
            let j = 0;
            for (j = this.state.data[i].length; j < max; j++) {
                if (this.state.data[i][j])
                    this.state.data[i][j].value = 0;
            }
        }

        res = [];
        resColors = [];
        for (i = 0; i < max; i++) {
            res[i] = [];
            resColors[i] = [];
        }

        for (i = 0; i < this.state.data.length; i++) {
            let j = 0;
            for (j = 0; j < this.state.data[i].length; j++) {
                console.log("daaaaataaa : " + this.state.data[i][j].color);
            }    
        }

        let index = 0;
        for (i = 0; i < 7; i++) {
            let j = 0;
            for (j = 0; j < max; j++) {
                if (!this.state.data[i][j]) {
                    break;
                }
                res[j].push(this.state.data[i][j].value);
                if (j === 0 && i === 0)
                    resColors[j].push("grey");
                else if (j === 0) {
                    console.log("max : " + max + " i : " + i + " xx: " + resColors[max - 1][i - 1]);
                    resColors[j].push(resColors[max - 1][i - 1]);
                }
                else
                    resColors[j].push(this.state.data[i][j-1].color);
            }    
        }

        for (i = 0; i < resColors.length; i++) {
            console.log("rescolors: " + resColors[i]);
        }
        
        while(this.state.chartData.datasets.length > 0) {
            this.state.chartData.datasets.pop();
        }
        
        
        for (i = 0; i < 7; i++) {
            console.log("xxx" + res[i]);
            
            this.state.chartData.datasets.push(
                {
                    label: 'My First dataset',
                    backgroundColor: resColors[i],
                    // borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 1,
                    // hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                    // hoverBorderColor: 'rgba(255,99,132,1)',
                    data: res[i]
                }
            )
            
        }
        console.log(this.state.chartData);
        this.setState({ chartData: this.state.chartData });
        
    }

    getVariableIndex(temperature) {
        let i = 0;
        for (i = 0; i < this.state.variables.length; i++) {
            if (this.state.variables[i].id === temperature) {
                return i;
            }
        }
        return 0;
    }

    getVariableID(variableName, variables) {
        if (!variables) {
            variables = this.state.variables;
        }
        let i = 0;
        for (i = 0; i < variables.length; i++) {
            if (variables[i].name === variableName) {
                return variables[i].id;
            }
        }
        return 0;
    }

    getVariableName(variableID) {
        let i = 0;
        for (i = 0; i < this.state.variables.length; i++) {
            if (this.state.variables[i].id === variableID) {
                return this.state.variables[i].name;
            }
        }
        return 0;
    }

    init(data) {
        let rules = [];
        let variables = [];
        let lines = data.match(/[^\r\n]+/g);
        lines.forEach(function (line) {
            if (line.startsWith("id:")) {
                let arr = line.split(":")[1].split(",");
                if (arr[0].trim() && arr[0].trim().length > 0 && arr[1].trim() && arr[1].trim().length > 0) {
                    let variable = new Variable(this.state.index++, arr[0].trim(), arr[1].trim());
                    variables.push(variable);
                    console.log(variable.toString());
                }
                
            } else if (line.startsWith("week:")) {
                let weekday = line.match(/week:\s*(\S*)/)[1].trim();
                let hour = line.match(/week:\s*\S*\s*(.*)/)[1].split(",")[0].trim();
                let variable = line.match(/week:\s*\S*\s*(.*)/)[1].split(",")[1].trim();
                let rule = new Rule(this.state.index++, weekday, new Date(0, 0, 0, hour.split(":")[0], hour.split(":")[1], 0), this.getVariableID(variable, variables));
                console.log(rule.toString());
                rules.push(rule);
            }
        }, this);
        this.state.variables = variables;
        this.state.rules = rules;
        this.generateData(rules);
    }

    getWeekDayIndex(weekDay) {
        switch (weekDay) {
            case "monday":
                return 0;
            case "tuesday":
                return 1;
            case "wednesday":
                return 2;
            case "thursday":
                return 3;
            case "friday":
                return 4;
            case "saturday":
                return 5;
            case "sunday":
                return 6;
        }
    }

    sortNumber(a,b) {
        return a.value - b.value;
    }

    saveSchedule() {
        this.setState({ isProgressVisible: true, dialogTitle: "Saving data", dialogMessage : "Saving config on server..." });
        let schedule = this.generateConfig();
        Request.put('https://300286cf.ngrok.io/schedule')
            .set('Content-Type', 'application/json')
            .send(JSON.stringify({ schedule: schedule }))
            .end((err, res) => {
                this.setState({ isProgressVisible: false });
                if (res.statusCode == 204) {
                    console.log(res.body);
                } else {
                    console.log(response.status + " " + err);
                }
            });
    }    
    

}

class Variable {
    constructor(id, name, value) {
        this.id = id;
        this.name = name;
        this.value = value;
    }

    toString() {
        return "Variable {id : " + this.id + ", name : " + this.name + ", value : " + this.value + "}";
    }

    isValid() {
        return this.id && this.name && this.name.trim().length > 0;
    }
}

class Rule {
    constructor(id, weekDay, hour, temperature) {
        this.id = id;
        this.weekDay = weekDay;
        this.hour = hour;
        this.temperature = temperature;
    }

    toString() {
        return "Rule {id : " + this.id + ", variableID : " + this.temperature + "}"
    }
}


ReactDOM.render(
  <App />,
  document.getElementById('app')
);