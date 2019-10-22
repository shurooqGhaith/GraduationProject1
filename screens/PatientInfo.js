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
  CheckBox
} from "react-native";
import { Block, Text, theme } from "galio-framework";

import { Button,Icon,Input } from "../components";
import { Images, argonTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import fire from "../constants/firebaseConfigrations";
import DateTimePicker from "react-native-modal-datetime-picker";
import MapView,{Marker} from "react-native-maps";
import { Col, Row, Grid } from "react-native-easy-grid";
import { Divider,Header } from 'react-native-elements';
import { Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger} from "react-native-popup-menu";
const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

class PatientInfo extends React.Component {

  constructor(props){
    super(props);
    this.authListener=this.authListener.bind(this);
    this.addMedicineName=this.addMedicineName.bind(this);
    this.handleChange=this.handleChange.bind(this);
    this.submit=this.submit.bind(this);
        this.state={
      username:"",
      idDoctor:"",
      idPatient:'',
      nodata:false,
      info:[],
      email:'',
      session:'',
      checkedTemporary:false,
      checkedPermanent:false,
      checkedRepairing:false,
      checkedWindmillDressing:false,
      medicinesName:[],
      medicine:'',
      medicineNameFromPicker:'',
      medicineNameFromDB:[],
      noMedicine:true,
      checkedMoney:false,
      money:'',
      appointments:[],
      appointmentsPatient:[],
      date:'',
      time:''
    }
  }

  componentDidMount(){
    this.authListener();
    //this.getLocation();
  }

  
  
  authListener(){
  
    const { navigation } = this.props;  
    var idD=navigation.getParam('idDoctor');
    var idP=navigation.getParam('idPatient');
    var date=navigation.getParam('date');
    var time=navigation.getParam('time');

     this.setState({
         idDoctor:idD,
         idPatient:idP,
         date:date,
         time:time
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
    

  }


  addMedicineName(){
    this.setState({
        medicinesName:[...this.state.medicinesName,""]
    })
  }

  handleChange(e,index){
    this.state.medicinesName[index]=e;
    this.setState({medicinesName:this.state.medicinesName})
        }
  
        submit(){

          fire.database().ref("users").child(this.state.idDoctor).child("appointment").on('value',(result)=>{
              
            if(result.val()){
                let appointment = Object.values(result.val());
                this.setState({appointments:appointment})

                //map appointments state
                this.state.appointments.map((element,index)=>{
                    if(element.timeSelected==this.state.time  && element.dateSelected==this.state.date && element.idPatient==this.state.idPatient  ){                         
                      //alert(Object.keys(result.val())[index]);  
                      fire.database().ref("users").child(this.state.idDoctor).child("appointment").child(Object.keys(result.val())[index]).child("available").set(true);

                    }

                })
            }
            
        })
	
          var process=[];
          if(this.state.checkedPermanent){process.push("permanent dental filling")}
          if(this.state.checkedTemporary){process.push("temporary dental filling")}
          if(this.state.checkedRepairing){process.push("repairing")}
          if(this.state.checkedWindmillDressing){process.push("windmill dressing")}


          if(!this.state.checkedMoney){this.setState({money:0})}
        
          fire.database().ref("users").child(this.state.idDoctor).child("patients").push().set(
          {
            'idPatient':this.state.idPatient,
            'sessionNumber':this.state.session,
            'process':process,
            'money':this.state.money,
            'medicine':this.state.medicinesName
            
            
          }
          )
          fire.database().ref("users").child(this.state.idPatient).child("session").push().set(
            {
              'idDoctor':this.state.idDoctor,
              'sessionNumber':this.state.session,
              'process':process,
              'money':this.state.money,
              'medicine':this.state.medicinesName
              
              
            }
            )
            //////اعمل الموعد هاد متوفر
            //لازم اكبس مرتين مشان تتعدل !!!
          
        }


  render() {
    return (
      <Block flex style={styles.profile}>
        <Block flex>
         
        <Header
                  leftComponent={<Text>{this.state.username}</Text>}
                  centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}
                  
           />
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ width, marginTop: '25%' }}
            >
              

                  <Block middle>
                  <Text>{this.state.username}</Text>
                  <Text>{this.state.email}</Text>
                  </Block>
                  
                  <View style={{flexDirection:'column',marginTop:150,marginLeft:50}}>
                   
                       <Input  
                               borderless
                              placeholder="Enter session Number"  
                               
                             style={{width:width*0.5}}  
                             onChangeText={value => this.setState({session:value})}
                             keyboardType = 'numeric'
                              />

                              <View style={{flexDirection:'column',borderRadius: 10, borderWidth: 1, borderColor: '#009688',marginRight:10}}>
                              <View style={{flexDirection:'row' }}>
                              <CheckBox
                                       value={this.state.checkedTemporary}
                                       onValueChange={() => this.setState({ checkedTemporary: !this.state.checkedTemporary })}
                                 />
                                  <Text style={{marginTop: 5}}> Temporary dental filling</Text>
                                  </View>
                                  <View style={{flexDirection:'row'}}>
                                  <CheckBox
                                       value={this.state.checkedPermanent}
                                       onValueChange={() => this.setState({ checkedPermanent: !this.state.checkedPermanent })}
                                 />
                                  <Text style={{marginTop: 5}}> Permanent dental filling</Text>
                                  </View>
                              
                              <View style={{flexDirection:'row'}}>
                              <View style={{flexDirection:'row'}}>
                              <CheckBox
                                       value={this.state.checkedRepairing}
                                       onValueChange={() => this.setState({ checkedRepairing: !this.state.checkedRepairing })}
                                 />
                                  <Text style={{marginTop: 5}}> Repairing</Text>
                                  </View>
                                  <View style={{flexDirection:'row'}}>
                                  <CheckBox
                                       value={this.state.checkedWindmillDressing}
                                       onValueChange={() => this.setState({ checkedWindmillDressing: !this.state.checkedWindmillDressing })}
                                 />
                                  <Text style={{marginTop: 5}}> Windmill Dressing</Text>
                                  </View>
                              </View>
                              </View>
                              <View style={{flexDirection:'column'}}>
                             <View style={{flexDirection:'row',marginLeft:50}}>
                             <CheckBox
                                       value={this.state.checkedMoney}
                                       onValueChange={() => this.setState({ checkedMoney: !this.state.checkedMoney })}
                                 />
                                  <Text style={{marginTop: 5}}>Paid </Text>
                             </View>
                             { this.state.checkedMoney &&<Input
                                 style={{marginTop:10,width:width*0.5}}  
                         keyboardType = 'numeric'
                        placeholder="Amount paid"
                        onChangeText={(money)=>this.setState({money})}
                        value={this.state.money}
                      /> }
                             </View>
                              {this.state.medicinesName.map((name,index)=>{
                      return(
                          <View key={index} style={{marginLeft:50,width:width*0.5}}>
                          <Input
                        
                        borderless
                        placeholder="medicine name"
                        onChangeText={(Mname)=>this.handleChange(Mname,index)}
                        value={name}
                        iconContent={
                            <Icon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name="shop"
                            family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                          
                        }
                      />
                          </View>
                      )
                    })}

                    <Button
                      style={{ backgroundColor: argonTheme.COLORS.GRADIENT_START,marginTop:10, width: width * 0.5,borderRadius:10,marginLeft:50}}
                      onPress={this.addMedicineName}
                    >
                     add medicine name
                    </Button>


                    <Button style={{width:width*0.5}} 
                    onPress={()=>{
                      fire.database().ref("users").child(this.state.idPatient).child("appointment").once('value',(result)=>{
              
              if(result.val()){
                  let appointment = Object.values(result.val());
                  this.setState({appointmentsPatient:appointment})
  
                  //map appointments state
                  this.state.appointmentsPatient.map((element,index)=>{
                      if(element.timeSelected==this.state.time  && element.dateSelected==this.state.date && element.idDoctor==this.state.idDoctor  ){                         
                        //alert(Object.keys(result.val())[index]);  
                        fire.database().ref("users").child(this.state.idPatient).child("appointment").child(Object.keys(result.val())[index]).child("available").set(true);
  
                      }
  
                  })
              }
              
          })
                      fire.database().ref("users").child(this.state.idDoctor).child("appointment").once('value',(result)=>{
              
              if(result.val()){
                  let appointment = Object.values(result.val());
                  this.setState({appointments:appointment})
  
                  //map appointments state
                  this.state.appointments.map((element,index)=>{
                      if(element.timeSelected==this.state.time  && element.dateSelected==this.state.date && element.idPatient==this.state.idPatient  ){                         
                        //alert(Object.keys(result.val())[index]);  
                        fire.database().ref("users").child(this.state.idDoctor).child("appointment").child(Object.keys(result.val())[index]).child("available").set(true);
  
                      }
  
                  })
              }
              
          })
    
            var process=[];
            if(this.state.checkedPermanent){process.push("permanent dental filling")}
            if(this.state.checkedTemporary){process.push("temporary dental filling")}
            if(this.state.checkedRepairing){process.push("repairing")}
            if(this.state.checkedWindmillDressing){process.push("windmill dressing")}
  
  
            if(!this.state.checkedMoney){this.setState({money:0})}
          
            fire.database().ref("users").child(this.state.idDoctor).child("patients").push().set(
            {
              'idPatient':this.state.idPatient,
              'sessionNumber':this.state.session,
              'process':process,
              'money':this.state.money,
              'medicine':this.state.medicinesName
              
              
            }
            )
            fire.database().ref("users").child(this.state.idPatient).child("session").push().set(
              {
                'idDoctor':this.state.idDoctor,
                'sessionNumber':this.state.session,
                'process':process,
                'money':this.state.money,
                'medicine':this.state.medicinesName
                
                
              }
              )
                    }}>
                    <Text>add</Text>
                    
                    </Button>
                    </View>

               
            </ScrollView>
          
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  
  

  
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

export default PatientInfo;