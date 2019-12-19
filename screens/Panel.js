import * as React from 'react';
import {Text,ToastAndroid} from 'react-native';
import { DataTable } from 'react-native-paper';
import fire from "../constants/firebaseConfigrations";

const Toast = (props) => {
  if (props.visible) {
    ToastAndroid.showWithGravityAndOffset(
      props.message,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
    return null;
  }
  return null;
};
export default class MyPanel extends React.Component {
  
  constructor(props){
    super(props);
    this.authListener=this.authListener.bind(this);
    this.show=this.show.bind(this);
    this.state={
      page:0,
      numberOfPages:'',
      perPage:4,
      id:'',
      appointment:[],
      noDate:false,
      showToast:false,
      session:[],
      noSession:false
    }
  }
  componentDidMount(){
    this.authListener();
    }
  
  authListener(){
    const { navigation } = this.props;  
    var id=navigation.getParam('idPatient');

    this.setState({id:id});
    var a=[];
    var n;
    fire.database().ref("users").child(id).child("appointment").on('value',(snap)=>{
      if(snap.val()){
        let app=Object.values(snap.val());
        a=app;
        app.map((item)=>{
          if(item.available){
            a.push({idDoctor:item.idDoctor,dateSelected:item.dateSelected,timeSelected:item.timeSelected,clinicName:item.clinicName,available:item.available});
          }
        })
       
        n=Math.ceil(app.length / 8)
        console.log(app.length);
        this.setState({
          numberOfPages:n,
          appointment:app,
          noDate:false
        })
      }
      else{
          this.setState({
            noDate:true
          })
      }
    });

    fire.database().ref("users").child(id).child("session").on('value',(snapshot)=>{
      if(snapshot.val()){
        let app=Object.values(snapshot.val());
        this.setState({
            session:app,
            noSession:false
        })
      }
      else{
          this.setState({
            noSession:true
          })
      }
    })
  
  }

  show(id,date,time,clinic,av){
    // console.log(id);
    // console.log(date);
    // console.log(time);
    // console.log(clinic);
    // console.log(av);
    if(!av){
      this.setState({showToast:true});
    setTimeout(function(){
     this.setState({showToast:false});
         }.bind(this),7000);
}
var flag=false;
if(av){

 this.state.session.map((session,index)=>{
   if(date == session.date && time== session.time && clinic ==session.clinic && id==session.idDoctor){//الموعد صار و في اله جلسة
     flag=true;
   }
 })
}
if(flag){
this.props.navigation.navigate("Info",{id:this.state.id,idDoctor:id,type:"patient",date:date,time:time,clinic:clinic,available:av})
}

if(!flag){ // الموعد ما صار تأجل او التغى
this.setState({showToast:true});
setTimeout(function(){
this.setState({showToast:false});
    }.bind(this),7000);
}
}
  render() {
    //حطي كي لكل خليه
    return (
      <DataTable style={{marginTop:100}}>
        <DataTable.Header>
          <DataTable.Title >Date</DataTable.Title>
          <DataTable.Title >Time</DataTable.Title>
          <DataTable.Title >Clinic</DataTable.Title>
        </DataTable.Header>

     

       
        <Toast  visible={this.state.showToast} message="Cancelled or delayed or not made yet "/>

        {this.state.appointment
        .slice(this.state.perPage * this.state.page, this.state.perPage * (this.state.page + 1))
        .map((item, i) => {
          if(item.available){
          return (
            <DataTable.Row key={i}
             onPress={()=>
             {this.show(item.idDoctor,item.dateSelected,item.timeSelected,item.clinicName,item.available);
             } }>
              
                  <DataTable.Cell  >
                    <Text>{item.dateSelected}</Text>
                  </DataTable.Cell>

                  <DataTable.Cell >
                    <Text>{item.timeSelected}</Text>
                  </DataTable.Cell>

                  <DataTable.Cell >
                    <Text>{item.clinicName}</Text>
                  </DataTable.Cell>
               
              
            </DataTable.Row>
          );
          }
        })}
        
        <DataTable.Pagination
          page={this.state.page}
          numberOfPages={this.state.numberOfPages}
          onPageChange={page => {
          //console.log('change', page);
          this.setState({ ...this.state, page });
        }}
        label={this.state.page + 1 + ' of ' + this.state.numberOfPages}
        />
      </DataTable>
    );
  }
}