import React from 'react';

class CompletionRow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            completion: this.props.completion
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        //this.remove = this.remove.bind(this);
    }

    componentDidMount() {

    }

    /*
    remove(){
        console.log('rows remove called');
        this.props.removeThis(this.state.item.id);
    }*/

    render() {
        let timeAgo;
        let minutesAgo = ((new Date().getTime()) - this.state.completion.date) / 60000;
        if (minutesAgo < 60)
            timeAgo = Math.floor(minutesAgo) + ' minutes ago';
        if ((minutesAgo > 60) && (minutesAgo < (60 * 24)))
            timeAgo = Math.floor((minutesAgo / 60)) + ' hours ago';
        if (minutesAgo > (60 * 24))
            timeAgo = Math.floor((minutesAgo / (60 * 24))) + ' days ago';
        
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
                        {(timeAgo)}
                    </span>
                </td>
            </tr>
        );
    }
}

export default CompletionRow;