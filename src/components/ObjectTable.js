import React from 'react';
import ObjectRow from './ObjectRow';

let id = 0;

function genId(){
    return id++;
}

class ObjectTable extends React.Component{
    constructor(props){
        super(props);

        this.state = {

        };

        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount(){
        
    }

    

    render(){
        let itemList = this.props.items ? this.props.items.map((item)=>{return (<ObjectRow key={genId()} item={item} headings={this.props.headings} removeThis={(id)=>this.props.delete(id)}/>)}) : <tr></tr>;
        let headings = this.props.headings.map((heading)=>{return (<th key={genId()}>{heading}</th>)});
        return (
            <table className="u-full-width">
                <thead>
                    <tr>
                        {headings}
                        <th>remove</th>
                    </tr>
                </thead>
                <tbody>
                    {itemList}
                </tbody>
                </table>
        );
    }
}

export default ObjectTable;