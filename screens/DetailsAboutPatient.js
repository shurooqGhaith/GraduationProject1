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
import { Divider,Header ,Card ,ListItem} from 'react-native-elements';
const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

class DetailsAboutPatients extends React.Component {

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
 


  }

 



  render() {

    return(
    
         

       <View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ width, marginTop: '25%' }}
            >
                    <View >
                  { !this.state.noInfo && this.state.patientInfo.map((value,index)=>{
                      if(value.idPatient==this.state.idPatient){//من هون بجيب ارقام الجلسات و بعرضهم بكبسات
                      // و كل ما يكبس كبسة 
                        var money,medicine,exam,note;
                        if(!value.money){money="no";}else{money=value.money}
                        if(!value.medicine){medicine="no medicine";}else{medicine=value.medicine}
                        if(!value.medicalExaminations){exam="no checkup needed";}else{exam=value.medicalExaminations}
                        if(!value.notes){note="no notes";}else{note=value.notes}

                                return(
                                    <ListItem
                                            key={index}
                                            title={value.sessionNumber}
                                           // leftIcon={{ name: item.icon }}
                                            subtitle={
                                            <View style={{flexDirection:'column'}}>
                                              <Text>process : {value.process}</Text>
                                              <Text>medicine:{medicine}</Text>
                                              <Text>money:{money}</Text>
                                              <Text>checkup : {exam}</Text>
                                              <Text>Notes : {note}</Text>     
                                            </View>
                                            }
                                             bottomDivider
                                             chevron
                                                  />
                             
                                )
                              }
                             
                   })}
                    </View>
             
            </ScrollView>
          
            </View>
    
    
    

    )
    }
  
  }


const styles = StyleSheet.create({
  
  
  
 
  
});

export default DetailsAboutPatients;