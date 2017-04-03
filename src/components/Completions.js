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
            tasks: this.props.tasks
        };
    }

    componentDidMount() {

        /*
        */
    }

    render() {
        let errorMessage;

        if (this.state.error) {
            errorMessage = this.state.error;
        } else
            errorMessage = '';

        let completionRows = (this.props.tasks === null) ? (<tr><td>Loading</td></tr>) : this.props.tasks.map((completion) => {
            return (<CompletionRow completion={completion} key={completion._id} />);
        });

        let barData = [];
        if (this.props.tasks) {
            for (let i = 0; i < this.props.tasks.length; i++) {
                let found = false;
                for (let b = 0; b < barData.length; b++) {
                    if (barData[b].id === this.props.tasks[i].userId){
                        found = true;
                        barData[b].score = barData[b].score + this.props.tasks[i].difficulty;
                    }
                }
                if (!found){
                    barData.push({id: this.props.tasks[i].userId, name: this.props.tasks[i].fname, score: this.props.tasks[i].difficulty});
                }
            }
        }

        return (
            <div>

                <h2>{this.props.houseName}</h2>
                <h3>
                    Completions by all house members
                </h3>

                <table>
                    <tbody>
                        {completionRows}
                    </tbody>
                </table>
                <label>
                    <div>{errorMessage}</div>
                </label>
                <BarChart width={730} height={250} data={barData}>
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