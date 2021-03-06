//House completions page

import React from 'react';
import ObjectTable from './ObjectTable';
import CompletionRow from './CompletionRow';
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar } from 'recharts';
let tools = require('../clientTools');


let id = 0;

function genId() {
    return id++;
}

class Completions extends React.Component {
    constructor(props) {
        super(props);

        //Put window dimensions in state for javascript-sized elements
        this.state = {
            window_width: window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth
        };
    }

    componentDidMount() {
        //Set window resize function to trigger resizing of javascript-sized elements
        window.onresize = (_) => {
            if (this.state.window_width != window.innerWidth) {
                this.setState({
                    window_width: window.innerWidth
                    || document.documentElement.clientWidth
                    || document.body.clientWidth
                });
            }
        };
    }

    render() {
        //Display an error message if an error exists
        let errorMessage;
        if (this.state.error) {
            errorMessage = this.state.error;
        } else
            errorMessage = '';

        //Map house task completions
        let completionRows = (this.props.tasks === null) ? (<tr><td>Loading</td></tr>) : this.props.tasks.map((completion) => {
            return (<CompletionRow completion={completion} key={completion._id} />);
        }).reverse();

        //Construct bar chart and determine if the user has completed a task recently for a reminder
        let barData = [];
        let use_last_week = false;
        if (this.props.tasks.length === 0) {
            completionRows = <tr><td>You don't have any task completions. Select 'Tasks' from the top to submit some!</td></tr>;
        } else {
            if (this.props.tasks) {
                let date = new Date();
                for (let i = 0; i < this.props.tasks.length; i++) {
                    if ((this.props.tasks[i].userId === this.props.id) && ((date.getTime() - this.props.tasks[i].date ) / 1000 < 604800)){
                        use_last_week = true;
                    }
                    let found = false;
                    for (let b = 0; b < barData.length; b++) {
                        if (barData[b].id === this.props.tasks[i].userId) {
                            found = true;
                            barData[b].score = barData[b].score + this.props.tasks[i].difficulty;
                        }
                    }
                    if (!found) {
                        barData.push({ id: this.props.tasks[i].userId, name: this.props.tasks[i].fname, score: this.props.tasks[i].difficulty });
                    }
                }
            }
        }

        
        //Display house icon if it exists
        let img = this.props.icon ? <div className='icon' style={{backgroundImage: 'url(' + this.props.icon + ')'}}></div> : <div></div>;
        return (
            <div className="pad">
                <div className='comp_title'>
                    <h2 className='float_left'>Completions: {this.props.houseName}</h2>
                    {img}
                </div>
                <table>
                    <tbody>
                        {completionRows}
                    </tbody>
                </table>
                <div>{use_last_week ? '' : this.props.tasks.length > 0 ? 'You might want to consider completing a task as you haven\'t done any this past week' : ''}</div>
                <label>
                    <div>{errorMessage}</div>
                </label>
                <BarChart width={(this.state.window_width) > 1300 ?  910 : this.state.window_width * 0.75} height={250} data={barData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="#228B22" />
                </BarChart>

            </div>);
    }
}

export default Completions;