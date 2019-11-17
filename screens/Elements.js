import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  Picker,
  TextInput,
  CheckBox,
  TouchableOpacity
} from "react-native";
import { Block, Text, theme } from "galio-framework";

import { Button,Icon,Input } from "../components";
import { Images, argonTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import fire from "../constants/firebaseConfigrations";
import DateTimePicker from "react-native-modal-datetime-picker";
import MapView,{Marker} from "react-native-maps";
import { Col, Row, Grid } from "react-native-easy-grid";
import { Divider,Header ,Card } from 'react-native-elements';
import Autocomplete from 'react-native-autocomplete-input';
const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

class Info extends React.Component {

  constructor(props){
    super(props);
    this.authListener=this.authListener.bind(this);
    
        this.state={
      username:"",
      email:'',
      idDoctor:"",
      idPatient:'',
      patientInfo:[],
      search:[],
      view:false,
      noInfo:false,
      process:[],
      medicines:[],
      type:'',
      session:[],
      appointment:[],
      noSession:false,
    
      date:'',
      time:'',
      clinic:'',
      available:false
    }
  }

  componentDidMount(){
    this.authListener();
    //this.getLocation();
  }

  
  
  authListener(){
  
    const { navigation } = this.props;  
    var idP=navigation.getParam('id');
    var idD=navigation.getParam('idDoctor');
    var t=navigation.getParam('type');

    var date=navigation.getParam('date');
    var time=navigation.getParam('time');
    var clinic=navigation.getParam('clinic');
    var av=navigation.getParam('available');

    

     this.setState({
      idPatient:idP,
      idDoctor:idD,
      type:t,
      date:date,
      time:time,
      clinic:clinic,
      available:av
     })
     
   fire.database().ref("users").child(idP).child("name").on('value',(datasnapshot)=>{
    this.setState({
      username:datasnapshot.val()
    })
 })
    
 fire.database().ref("users").child(idP).child("email").on('value',(datasnapshot)=>{
    this.setState({
      email:datasnapshot.val()
    })
 })
 fire.database().ref("users").child(idD).child("patients").on('value',(snapshot)=>{
     if(snapshot.val()){
        let data = Object.values(snapshot.val());
    this.setState({
      patientInfo:data,
      noInfo:false
    })
     }
    
     else{
         this.setState({
          noInfo:true
         })
     }

   })
 

   fire.database().ref("users").child(idP).child("session").on('value',(snapshot)=>{
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

 



  render() {

    return(
    <Block flex style={styles.profile}>
        <Block flex>
         

       
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ width, marginTop: '25%' }}
            >
              <Block flex style={styles.profileCard}>
                
                <Block style={styles.info}>
                  
                <View style={{marginTop:20,backgroundColor:"#000",width:width,height:40,color:"#fff",flexDirection:'row',alignContent:'center'}}>
                         <Text size={16} bold color="#fff" style={{marginLeft:5,padding:5}}>{this.state.username}</Text>
                         <Text color="#fff" style={{marginLeft:80,padding:5}}>{this.state.email}</Text>   
                </View>

              
                  
                  
                  <Block middle>
                    <View style={styles.itemsList} >
                  {this.state.type=="doctor" && !this.state.noInfo && this.state.patientInfo.map((value,index)=>{
                      if(value.idPatient==this.state.idPatient){
                        var money,medicine,exam;
                        if(!value.money){money="no";}else{money=value.money}
                        if(!value.medicine){medicine="no medicine";}else{medicine=value.medicine}
                        if(!value.medicalExaminations){exam="no checkup needed";}else{exam=value.medicalExaminations}
                                return(
                                  
                             <Card title={"session number :"+value.sessionNumber}> 
                             <View style={{flexDirection:'column',marginTop:20}}>
                             <Text>process : {value.process}</Text>
                             <Text>medicine:{medicine}</Text>
                             <Text>money:{money}</Text>
                             <Text>checkup : {exam}</Text>
                             </View>
                             </Card> 
                                )
                              }
                             
                   })}
                   {this.state.type=="doctor" && this.state.noInfo && <View style={{marginTop:100}}><Text bold >Not been made yet </Text></View>}
                    </View>
                  </Block>

                  <Block middle>
                    <View style={styles.itemsList} >
                  
                    {this.state.available && !this.state.noSession && this.state.type=="patient" && this.state.session.map((session,ind)=>{
                      var flag=false;
          if(this.state.date == session.date && this.state.time== session.time && this.state.clinic ==session.clinic && this.state.idDoctor==session.idDoctor){
           flag=true;
            if(!session.money){money="no";}else{money=session.money}
            if(!session.medicine){medicine="no medicine";}else{medicine=session.medicine}
            if(!session.medicalExaminations){exam="no checkup needed";}else{exam=session.medicalExaminations}

           return(
             
      
<Card title={"session number :"+session.sessionNumber}> 
       <View style={{flexDirection:'column'}}>
       <Text>{"process:"+session.process}</Text>
       <Text>medicine:{medicine}</Text>
          <Text>money:{money}</Text>
          <Text>checkup : {exam}</Text>
          
       </View>
       </Card>
           )
          }//if 1
          
         
        })//end session map
        
      }

      {!this.state.available && this.state.type=="patient" && <View style={{marginTop:100}}><Text bold size={14}>Not been made yet</Text></View>}

      <Button onPress={()=>{
        if(this.state.type=="doctor"){
          this.props.navigation.navigate("PatientAfterSession",{id:this.state.idDoctor})
        }

        if(this.state.type=="patient"){
          this.props.navigation.navigate("PatientAppointment",{idPatient:this.state.idPatient})
        }

      }}><Text>Back</Text></Button>
                    </View>
                  </Block>
                                  
                </Block>
              </Block>
            </ScrollView>
          
        </Block>
        
      </Block>

    
    
    

    )
    }
  
  }


const styles = StyleSheet.create({
  
  itemsList: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginTop:100
},

  
  profile: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    // marginBottom: -HeaderHeight * 2,
    flex: 1,
    backgroundColor:'#eee'
  },
  profileContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1
  },
  profileBackground: {
    width: width,
    height: height / 2
  },
  
  TextInputStyle: {  
    textAlign: 'center',  
    height: 40,  
    borderRadius: 10,  
    borderWidth: 2,  
    borderColor: '#009688',  
    marginBottom: 10  ,
    width:width*0.5,
    marginLeft:20
} ,

input: {
  borderRadius: 4,
  borderColor: argonTheme.COLORS.BORDER,
  height: 44,
  backgroundColor: '#FFFFFF',
  marginTop:10
},
  
});

export default Info;