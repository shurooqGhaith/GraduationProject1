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
    this.getData=this.getData.bind(this);
        this.state={
      username:"",
      email:'',
      idDoctor:"",
      idPatient:'',
      patientInfo:[],
      search:[],
      view:false,
      noInfo:false,
      type:'',
      session:[],
      appointment:[],
      noSession:false,
    
      date:'',
      time:'',
      clinic:'',
      available:false,

      ///
      money:'',
      notes:'',
      process:[],
      medicines:[],
      exams:[],
      show:false

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

 getData(id,num){
   
    this.setState({show:true});
    this.state.patientInfo.map((value,index)=>{
        if(value.idPatient==id && value.sessionNumber==num){
            this.setState({
                money:value.money,
                notes:value.notes
            })
        }
    })///map patientInfo

    //get process
    var array1=[];
    fire.database().ref("users").child(this.state.idDoctor).child("processes").on('value',(pro)=>{
        let res=Object.values(pro.val());
        res.map((value)=>{
            if(value.idPatient ==id && value.sessionNumber==num){
                    array1.push({process:value.process});
            }
        })

        this.setState({
            process:array1
        })
    }) //pro fire

    //get medicines
    var array2=[];
    fire.database().ref("users").child(this.state.idDoctor).child("medicines").on('value',(med)=>{
        let res=Object.values(med.val());
        res.map((value)=>{
            if(value.idPatient ==id && value.sessionNumber==num){
                    array2.push({medicine:value.medicine});
            }
        })

        this.setState({
            medicines:array2
        })
    }) //medicine fire

     //get exams
     var array3=[];
     fire.database().ref("users").child(this.state.idDoctor).child("checkup").on('value',(ch)=>{
         let res=Object.values(ch.val());
         res.map((value)=>{
             if(value.idPatient ==id && value.sessionNumber==num){
                     array3.push({exam:value.exam});
             }
         })
 
         this.setState({
            exams:array3
         })
     }) //medicine fire
    
 }



  render() {

    return(
    
         

       <View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ width, marginTop: '25%' }}
            >
                    <View style={{flexDirection:'row'}} >
                  { !this.state.noInfo && this.state.patientInfo.map((value,index)=>{
                      if(value.idPatient==this.state.idPatient){//من هون بجيب ارقام الجلسات و بعرضهم بكبسات
                      // و كل ما يكبس كبسة 
                                return(
                                    <View >
                                        <Button small
                                        style={{marginLeft:10,backgroundColor:"#333"}}
                                        onPress={()=>this.getData(value.idPatient,value.sessionNumber)}
                                        >
                                            <Text style={{color:'#fff'}}>{value.sessionNumber}</Text>
                                        </Button>
                                    </View>
                                )
                              }
                   })}
                    </View>
                    <Divider style={{backgroundColor:'#E9ECEF',marginTop:10}}/>
                       <View style={{marginTop:10}}>
                                <Text bold size={20}>Session Report</Text>
                       </View>
                       <Divider style={{backgroundColor:'#000',marginTop:10,width:width*0.4}}/>

                       <View style={{flexDirection:'row'}}>
                          <View style={{flexDirection:'column',marginLeft:20}}>
                              <Text bold size={14}>Name</Text>
                              <Text style={{color:'#aaa'}}>{this.state.username}</Text>
                          </View>

                          <View style={{flexDirection:'column',marginLeft:60}}>
                              <Text bold size={14}>Email</Text>
                              <Text style={{color:'#aaa'}}>{this.state.email}</Text>
                          </View>
                       </View>
                       <Divider style={{backgroundColor:'#E9ECEF',marginTop:10}}/>

                    <View style={{marginTop:10,flexDirection:'column'}}>
                    <Text bold size={16}>Processes</Text>
                    <View style={{flexDirection:'row'}}>

                        {this.state.show && this.state.process.map((pro=>{
                            return(
                                <View style={{flexDirection:'row',marginLeft:10}}>
                                <Button small
                                   style={{backgroundColor:"#eee"}}
                                        >
                                            <Text>{pro.process}</Text>
                                        </Button>
                                </View>
                            )
                        }))}
                    </View>
                    </View>
                    <Divider style={{backgroundColor:'#E9ECEF',marginTop:10}}/>

                    <View style={{marginTop:10,flexDirection:'column'}}>
                    <Text bold size={16}>Medicines :</Text>
                           <View style={{flexDirection:'row'}}>
                        {this.state.show && this.state.medicines.map((med=>{
                            return(
                                <View style={{marginLeft:10}}>
                                <Button small
                                    style={{backgroundColor:"#eee"}}
                                        >
                                            <Text>{med.medicine}</Text>
                                        </Button>
                                </View>
                            )
                        }))}
                        </View>
                    </View>
                    <Divider style={{backgroundColor:'#E9ECEF',marginTop:10}}/>
                
                   
                    <View style={{marginTop:10,flexDirection:'column'}}>
                    <Text bold size={16}>Medical checkup :</Text>
                    <View style={{flexDirection:'row'}}>

                        {this.state.show && this.state.exams.map((ex=>{
                            return(
                                <View style={{flexDirection:'row',marginLeft:10}}>
                                <Button small
                                style={{backgroundColor:"#eee"}}
                                        >
                                            <Text>{ex.exam}</Text>
                                        </Button>
                                        
                                </View>
                            )
                        }))}
                        </View>
                    </View>
                    <Divider style={{backgroundColor:'#E9ECEF',marginTop:10}}/>

                         <View style={{flexDirection:'column',marginTop:10}}>
                             <Text bold size={16}>Money paid :</Text>
                            <Text style={{color:'#333',marginLeft:10}}>{this.state.money}</Text>
                         </View>
                         <Divider style={{backgroundColor:'#E9ECEF',marginTop:10,marginLeft:20}}/>
                         <View style={{flexDirection:'column',marginTop:10}}>
                             <Text bold size={16}>Any Notes :</Text>
                            <Text style={{color:'#333',marginLeft:10}} >{this.state.notes}</Text>
                         </View>
                         <Divider style={{backgroundColor:'#E9ECEF',marginTop:10}}/>

            </ScrollView>
          
            </View>
    
    
    

    )
    }
  
  }


const styles = StyleSheet.create({
  
  
  
 
  
});

export default DetailsAboutPatients;