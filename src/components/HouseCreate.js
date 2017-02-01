import React from 'react';
import HC_name from './HC_name';
import HC_members from './HC_members';


class HouseCreate extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            step: 0,
            houseName: '',
            members: []
        };
        this.incrementStep = this.incrementStep.bind(this);
        this.setHouseName = this.setHouseName.bind(this);
        this.setMembers = this.setMembers.bind(this);
    }

    incrementStep(){
        this.setState((prevState, props)=>{
            return {
                step: prevState.step + 1
            }
        });
        console.log(this.state.step);
    }

    setHouseName(name){
        this.setState((prevState, props)=>{
            return {
                houseName: name
            }
        });
        console.log(name);
    }

    setMembers(members){
        this.setState((prevState, props)=>{return {members: members}});
        console.log(members);
    }

   render() {
       let currentStep;
       switch(this.state.step){
                case 0:
                    currentStep = <HC_name setHouseName={this.setHouseName} incrementStep={this.incrementStep}/>;
                    break;
                case 1:
                    currentStep = <HC_members houseName={this.state.houseName} incrementStep={this.incrementStep} setMembers={this.setMembers}/>
                    break;
                default:
                    currentStep = <p>Illegal step</p>
                    break;
        }

      return (
        <div>
            {currentStep}
        </div>
      );
   }
}

export default HouseCreate;