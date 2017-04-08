import React from 'react';
import HC_members from './HC_members';
import ObjectTable from './ObjectTable';
var Loader = require('halogen/MoonLoader');
var spinner_css = require('../react-styles.js').spinner;
let tools = require('../clientTools');

class Admin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            admin: null,
            page: null
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.addMembers = this.addMembers.bind(this);
    }

    componentDidMount() {
        tools.get('/json/admin/' + this.props.house, this, (data, stateRef) => {
            stateRef.setState({ admin: data.admin });
        });
    }

    addMembers(members) {
        tools.post('/post/memberadd', this, (data, stateRef) => {
            if (data.error) {
                alert('There has been an error adding members');
            }
        }, 'house=' + this.props.house + "&members=" + JSON.stringify(members));
        this.setState({ page: null });
    }

    render() {
        let content;
        switch (this.state.page) {
            case 'addMembers':
                content = <HC_members houseName={this.props.house} incrementStep={() => { }} setMembers={this.addMembers} />;
                break;
            case 'deleteTasks':
                content = <div>
                    <h2>Delete tasks from selection</h2>
                    <ObjectTable items={this.props.tasks} headings={['name', 'difficulty']} delete={(id) => this.props.delete(id, 'tasks')} />
                </div>
                break;
            case 'deleteCompletions':
                content = <div>
                    <h2>Delete task completions</h2>
                    <ObjectTable items={this.props.completions} headings={['fname', 'lname', 'name', 'date']} delete={(id) => this.props.delete(id, 'completions')} />
                </div>
                break;
            default:
                content = <div></div>
                break;
        }

        if (this.state.admin === null) {
            return (<div style={spinner_css}><Loader color={'#000000'}/></div>);
        } else if (this.state.admin === false) {
            return (<span>User is not admin</span>);
        } else if (this.state.admin === true) {
            return (
                <div>
                    <div className='comp_title'>
                        <h2 className='float_left expand'>Admin Tools: {this.props.house}</h2>
                    </div>
                    <div className='row'>
                        <button className='four columns' onClick={() => { this.setState({ page: 'addMembers' }); }}>Add house members</button>
                        <button className='four columns' onClick={() => { this.setState({ page: 'deleteTasks' }); }}>Delete tasks</button>
                        <button className='four columns' onClick={() => { this.setState({ page: 'deleteCompletions' }); }}>Delete completions</button>
                    </div>
                    <div>{content}</div>
                </div>
            );
        }
    }
}



export default Admin;