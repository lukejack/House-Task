import React from 'react';
import ObjectRow from './ObjectRow';

let id = 0;

function genId() {
    return id++;
}

class ObjectTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };

        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {

    }



    render() {
        let itemList = this.props.items ? this.props.items.map((item) => { return (<ObjectRow key={genId()} item={item} headings={this.props.headings} removeThis={(id) => this.props.delete(id)} />) }) : <tr></tr>;
        //let headings = this.props.headings.map((heading) => { return (<th key={genId()}>{heading.charAt(0).toUpperCase() + heading.slice(1)}</th>) });
        let newHeadings = [];
        for (let i = 0; i < this.props.headings.length; i++){
            if (this.props.headings[i] === 'fname') newHeadings.push(<th key={genId()}>{'Name'}</th>); 
            else if (this.props.headings[i] === 'lname') newHeadings.push(<th key={genId()}>{'Surname'}</th>); 
            else newHeadings.push(<th key={genId()}>{this.props.headings[i].charAt(0).toUpperCase() + this.props.headings[i].slice(1)}</th>);
        }
        let table = this.props.items.length > 0 ? <table className="u-full-width">
            <thead>
                <tr>
                    {newHeadings}
                    <th>Remove</th>
                </tr>
            </thead>
            <tbody>
                {itemList}
            </tbody>
        </table> : <div></div>;
        
        return (
            table
        );
    }
}

export default ObjectTable;