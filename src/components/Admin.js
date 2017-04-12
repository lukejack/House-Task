import React from 'react';
import HC_members from './HC_members';
import HC_image from './HC_image';
import ObjectTable from './ObjectTable';
var Loader = require('halogen/MoonLoader');
var spinner_css = require('../react-styles.js').spinner;
let tools = require('../clientTools');
var base64url = require('base64-url');

class Admin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            admin: null,
            page: 'addMembers'
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.addMembers = this.addMembers.bind(this);
        this.setImage = this.setImage.bind(this);
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
            } else {
                this.props.getMembers(this.props.house);
            }
        }, 'house=' + this.props.house + "&members=" + JSON.stringify(members));
    }

    setImage(image) {
        if (!image.preview) {
            sessionStorage.setItem(this.props.house, JSON.stringify({ icon: image }));
            tools.post('/post/imageadd', this, (data, stateRef) => {
                stateRef.props.getIcon(stateRef.props.house);
                stateRef.props.pageChange({ target: { value: 'housestats' }, preventDefault: () => { } });
            }, 'house=' + this.props.house + '&image=' + base64url.escape(image));
        }
    }

    render() {
        let content;
        let b_m = '';
        let b_t = '';
        let b_c = '';
        let b_d = '';
        let b_i = '';
        switch (this.state.page) {
            case 'addMembers':
                b_m = 'activeTab';
                b_t = '';
                b_c = '';
                b_d = '';
                b_i = '';
                content = <div>
                    <HC_members houseName={this.props.house} incrementStep={() => { }} setMembers={this.addMembers} />
                    {/*Add member removal HTTP call here*/}
                    <div className="pad"><ObjectTable items={this.props.members} headings={['fname', 'lname', 'email']} delete={(id) => { this.props.delete(id, 'members'); }} /></div>
                </div>
                break;
            case 'deleteTasks':
                b_m = '';
                b_t = 'activeTab';
                b_c = '';
                b_d = '';
                b_i = '';
                content = <div className="pad">
                    <div className='comp_title'>
                        <h2 className='float_left expand'>Delete tasks from selection</h2>
                    </div>
                    <ObjectTable items={this.props.tasks} headings={['name', 'difficulty']} delete={(id) => this.props.delete(id, 'tasks')} />
                </div>
                break;

            case 'deleteCompletions':
                b_m = '';
                b_t = '';
                b_c = 'activeTab';
                b_d = '';
                b_i = '';
                content = <div className="pad">
                    <div className='comp_title'>
                        <h2 className='float_left expand'>Delete task completions</h2>
                    </div>
                    <ObjectTable items={this.props.completions} headings={['fname', 'lname', 'name', 'date']} delete={(id) => this.props.delete(id, 'completions')} />
                </div>
                break;
            case 'deleteHouse':
                b_m = '';
                b_t = '';
                b_c = '';
                b_d = 'activeTab';
                b_i = '';
                content = <div className="pad">
                    <div className='comp_title'>
                        <h2 className='float_left expand'>Delete {this.props.house}</h2>
                    </div>
                    <h4>WARNING: THIS CANNOT BE UNDONE</h4>
                    <button onClick={() => {
                        this.props.delete(this.props.houseId, 'houses');
                        if (typeof (Storage) !== 'undefined') {
                            localStorage.removeItem('houseSelection');
                        }
                        setTimeout(() => location.reload(), 1000);
                    }}>Delete</button>

                </div>
                break;
            case 'image':
                b_m = '';
                b_t = '';
                b_c = '';
                b_d = '';
                b_i = 'activeTab';
                content = <div className="pad">
                    <div className='comp_title'>
                        <h2 className='float_left expand'>Set House Icon</h2>
                    </div>
                    <HC_image setImage={this.setImage} />
                </div>
                break;
            default:
                content = <div></div>
                break;
        }

        if (this.state.admin === null) {
            return (<div style={spinner_css}><Loader color={'#000000'} /></div>);
        } else if (this.state.admin === false) {
            return (<span>User is not admin</span>);
        } else if (this.state.admin === true) {
            return (
                <div>
                    <div className='row'>
                        <button className={'one-fifth_button ' + b_m} onClick={() => { this.setState({ page: 'addMembers' }); }}>Members</button>
                        <button className={'one-fifth_button ' + b_t} onClick={() => { this.setState({ page: 'deleteTasks' }); }}>Tasks</button>
                        <button className={'one-fifth_button ' + b_c} onClick={() => { this.setState({ page: 'deleteCompletions' }); }}>Completions</button>
                        <button className={'one-fifth_button ' + b_d} onClick={() => { this.setState({ page: 'deleteHouse' }); }}>Delete house</button>
                        <button className={'one-fifth_button ' + b_i} onClick={() => { this.setState({ page: 'image' }); }}>Image</button>
                    </div>

                    <div>{content}</div>
                </div>
            );
        }
    }
}



export default Admin;