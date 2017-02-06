import React from 'react';
import HC_name from './HC_name';
import HC_members from './HC_members';
import HC_tasks from './HC_tasks';


class HouseCreate extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            step: 0,
            houseName: '',
            members: [],
            tasks: []
        };

        this.incrementStep = this.incrementStep.bind(this);
        this.setHouseName = this.setHouseName.bind(this);
        this.setMembers = this.setMembers.bind(this);
        this.setTasks = this.setTasks.bind(this);
    }

    incrementStep(){
        this.setState((prevState, props)=>{
            return {
                step: prevState.step + 1
            }
        });
    }

    setHouseName(name){
        this.setState((prevState, props)=>{
            return {
                houseName: name
            }
        });
    }

    setMembers(members){
        this.setState((prevState, props)=>{return {members: members}});
    }

    setTasks(tasks){
        this.setState((prevState, props)=>{return {
            tasks: tasks
        }});
        
    }

   render() {
       let currentStep;
       switch(this.state.step){
                case 0:
                    currentStep = <HC_name  incrementStep={this.incrementStep} setHouseName={this.setHouseName}/>;
                    break;
                case 1:
                    currentStep = <HC_members houseName={this.state.houseName} incrementStep={this.incrementStep} setMembers={this.setMembers}/>
                    break;
                case 2:
                    currentStep = <HC_tasks houseName={this.state.houseName} incrementStep={this.incrementStep} setTasks={this.setTasks}/>
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