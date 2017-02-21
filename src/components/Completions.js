import React from 'react';
import ObjectTable from './ObjectTable';
import CompletionRow from './CompletionRow';
let tools = require('../clientTools');


let id = 0;

function genId() {
    return id++;
}

class HC_members extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };

    }

    componentDidMount() {

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
            </div>);
    }
}

export default HC_members;