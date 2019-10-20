import React from "react";
import DoctorNav from "../navigation/DoctorNvigate";

export default class Doctor extends React.Component {


  state={
    id:''
  }

  componentDidMount(){
    var id=this.props.navigation.getParam('id');
    this.setState({
      id:id
    })
    this.props.navigation.setParam({'id':this.state.id});
  }

  render() {
    return <DoctorNav />;
  }
}