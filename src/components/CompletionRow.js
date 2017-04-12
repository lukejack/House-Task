//Row in the task completions page

import React from 'react';
let time_format = require('../clientTools.js').time;

class CompletionRow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            completion: this.props.completion
        };

        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {

    }

    render() {
        //Set difficulty colour as one of 3 values
        let difficulty = this.state.completion.difficulty;
        let difficultyColour;
        switch(true){
            case (difficulty < 4):
                difficultyColour = '#00ff00';
                break;
            case (difficulty < 7):
                difficultyColour = '#ffff00';
                break;
            default:
                difficultyColour = '#ff0000';
                break;
        }
            

        let rowStyle = {
            borderRightStyle: 'solid',
            borderRightWidth: '5px',
            borderRightColor: difficultyColour
        };

        return (
            <tr style={rowStyle} onClick={()=>{alert('Description: ' + this.state.completion.description)}}>
                <td className="seperator-right">
                    <span className="padded-left">
                        {this.state.completion.name}
                    </span>
                </td>
                <td className="seperator-right">
                    {this.state.completion.fname[0].toUpperCase() + this.state.completion.lname[0].toUpperCase()}
                </td>
                <td>
                    <span className="padded-right">
                        {(time_format(this.state.completion.date))}
                    </span>
                </td>
            </tr>
        );
    }
}

export default CompletionRow;