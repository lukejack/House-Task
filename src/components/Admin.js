import React from 'react';
import HC_members from './HC_members';
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
            if (data.error){
                alert('There has been an error adding members');
            }
        }, 'house=' + this.props.house + "&members=" + JSON.stringify(members));
        this.setState({page: null});
    }

    render() {
        let content;
        switch (this.state.page) {
            case 'addMembers':
                content = <HC_members houseName={this.props.house} incrementStep={() => { }} setMembers={this.addMembers} />
                break;
            default:
                content = <span><br/>Select one of the above options</span>
                break;
        }

        if (this.state.admin === null) {
            return (<span>Loading...</span>);
        } else if (this.state.admin === false) {
            return (<span>User is not admin</span>);
        } else if (this.state.admin === true) {
            return (
                <div>
                    <button onClick={() => { this.setState({ page: 'addMembers' }); }}>Add house members</button>
                    {content}
                </div>
            );
        }
    }
}

export default Admin;