import React from 'react';
let time_format = require('../clientTools.js').time;

let id = 0;

function genId() {
    return id++;
}

class ObjectRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: props.item,
            headings: props.headings
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.remove = this.remove.bind(this);
    }

    componentDidMount() {

    }

    remove() {
        this.props.removeThis(this.state.item.id || this.state.item._id);
    }

    render() {
        let rowItems = [];
        for (let i = 0; i < this.state.headings.length; i++) {
            if (this.state.headings[i] === 'date') {
                rowItems.push(<td key={genId()}>{time_format(this.state.item[this.state.headings[i]])}</td>);
            } else {
                rowItems.push(<td key={genId()}>{this.state.item[this.state.headings[i]]}</td>);
            }
        }

        return (
            <tr>
                {rowItems}
                <td>
                    <button type="submit" onClick={() => this.remove()}>X</button>
                </td>
            </tr>
        );
    }
}

export default ObjectRow;