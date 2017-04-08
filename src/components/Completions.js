import React from 'react';
import ObjectTable from './ObjectTable';
import CompletionRow from './CompletionRow';
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar } from 'recharts';
let tools = require('../clientTools');


let id = 0;

function genId() {
    return id++;
}

class HC_members extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: this.props.tasks,
            window_width: window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth
        };
    }

    componentDidMount() {
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
        let errorMessage;

        if (this.state.error) {
            errorMessage = this.state.error;
        } else
            errorMessage = '';
        let completionRows = (this.props.tasks.map === null) ? (<tr><td>Loading</td></tr>) : this.props.tasks.map((completion) => {
            return (<CompletionRow completion={completion} key={completion._id} />);
        });

        let barData = [];
        if (this.props.tasks.length == 0) {
            completionRows = <tr><td>You don't have any task completions. Select 'Tasks' in the top left to submit some!</td></tr>;
        } else {
            if (this.props.tasks) {
                for (let i = 0; i < this.props.tasks.length; i++) {
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

        let img = this.props.icon ? <img className='icon' src={this.props.icon}/> : <div></div>;
        return (
            <div>
                <div className='comp_title'>
                    <h2 className='float_left'>Completions: {this.props.houseName}</h2>
                    {img}
                </div>
                <table>
                    <tbody>
                        {completionRows}
                    </tbody>
                </table>
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

export default HC_members;