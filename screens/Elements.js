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
      medicines:[]
      
      
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
    

     this.setState({
      idPatient:idP,
      idDoctor:idD
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
    return (
   
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
                  { !this.state.noInfo && this.state.patientInfo.map((value,index)=>{
                      if(value.idPatient==this.state.idPatient){
                        
                        
                                return(
                                  <Card title={"session number :"+value.sessionNumber}> 
                             <View style={{flexDirection:'column',marginTop:20}}>
                             <Text>process : {value.process}</Text>
                             <Text>medicine:{value.medicine}</Text>
                             <Text>money:{value.money}</Text>
                             <Text>checkup : {value.medicalExaminations==="" ? value.medicalExaminations:"no checkup"}</Text>
                             </View>
                             </Card> 
                                )
                              }
                             
                   })}
                    </View>
                    
                    
                    
                  </Block>
                  


                  
                  
                  
                </Block>
              </Block>
            </ScrollView>
          
        </Block>
        
      </Block>
    );
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