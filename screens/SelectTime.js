import React from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  View,
  CheckBox,
  Switch,
  Picker,
  Modal,
  TouchableHighlight
} from "react-native";
import { Block, Text, theme } from "galio-framework";
import { Ionicons } from '@expo/vector-icons';
import { Button ,Input,Icon } from "../components";
import { Images, argonTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import fire from "../constants/firebaseConfigrations";
import ToggleSwitch from 'toggle-switch-react-native';
import { Divider } from 'react-native-elements';
import { slotCreator } from "react-native-slot-creator";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from 'moment';
import { element } from "prop-types";

const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

export default class SelectTime extends React.Component {

  constructor(props){
    super(props);
    this.authListener=this.authListener.bind(this);
    this.determineAvailableSlot=this.determineAvailableSlot.bind(this);
    this.state={
      user:[],
      info:[],
      username:'',
      idDoctor:'',
      idPatient:'',
      patientName:'',
      Specialization:'',
      clinicName:[],
      clinicSelected:'',
      workingHours:[],
      slots:[],
      nodata:false,
      days:[],
      start:'',
      end:'',
      pickerSelection: 'Default value!',
      pickerDisplayed: false,
      isDateTimePickerVisibleFrom:false,
      daySelected:'',
      dateSelected:'',
      appointment:[],
      noAppointment:false,
      stop:false,
      buttonColor:'#4527A0',
      availableSlots:[]

    }
  }

  componentDidMount(){
    this.authListener();
  }

  authListener(){
    const { navigation } = this.props;  
    var id=navigation.getParam("idDoctor");
    var idP=navigation.getParam("idPatient");
    var day=navigation.getParam("selectedDay");
    var date =navigation.getParam("selectedDate");
    this.setState({
        idDoctor:id,
        idPatient:idP,
        daySelected:day,
        dateSelected:date
    })

    var ar=[];
    fire.database().ref("users").child(id).child("workingHours").on('value',(work)=>{
      let workHour=Object.values(work.val());
      workHour.map(w=>{
        if(w.days == day && w.enable){
          this.setState({change:true});
          
         let requiredArray = slotCreator.createSlot(w.start,w.end,"30");//2 2.5 3 3.5
         ar=requiredArray;
         requiredArray.map(v=>{ar.push({time:v})})
         requiredArray.map((slot,index)=>{
           var flag=false;
          
           fire.database().ref("users").child(id).child("appointment").on('value',(app)=>{
             let appointment=Object.values(app.val());
             appointment.map((ap)=>{
               if(ap.dateSelected == date && ap.timeSelected==slot && !ap.available){
                 ar = ar.filter(function( obj ) {
                   return obj.time !== slot;
               });
               }
             })//app map
           })//app fire
  
         })//slot arrays
        }
        
      })//work map
    alert("1");
      this.setState({
        availableSlots:ar
      })
  
    })//working hour database
  
     
  
    fire.database().ref("users").child(id).child("Specialization").on('value',(datasnapshot)=>{
        this.setState({
          Specialization:datasnapshot.val()
        })
     })
  
     fire.database().ref("users").child(id).child("name").on('value',(datasnapshot)=>{
      this.setState({
        username:datasnapshot.val()
      })
   })
   fire.database().ref("users").child(idP).child("name").on('value',(datasnapshot)=>{
    this.setState({
      patientName:datasnapshot.val()
    })
 })
      
  
    fire.database().ref("users").child(id).child("clinicName").on('value',(datasnapshot) =>{
      let nameClinic = Object.values(datasnapshot.val());
      this.setState({clinicName:nameClinic})
   })

   fire.database().ref("users").child(id).child("slots").on('value',(datasnapshot) =>{
    let slot = Object.values(datasnapshot.val());
    this.setState({slots:slot})
 })

 fire.database().ref("users").child(id).child("appointment").on('value',(datasnapshot) =>{
    if(datasnapshot.val()){
        let app = Object.values(datasnapshot.val());
        this.setState({
            appointment:app,
            noAppointment:false
        })
    }

    else{
        this.setState({
            noAppointment:true
        })
      }
    
 })
  
   fire.database().ref("users").child(id).child("workingHours").on('value',(datasnapshot) =>{
     if(datasnapshot.val()){
      let items = Object.values(datasnapshot.val());
      
      this.setState({
        workingHours:items,
        nodata:false
          })

          this.state.workingHours.map((value,index)=>{
            if(value.days==this.state.daySelected  && value.enable){
                this.setState({
                  clinicSelected:value.selectedClinic
                })
            }
      })
  
     }
    else{
      this.setState({
        nodata:true
      })
    }
    
  })

    
  
  }

  
determineAvailableSlot(){

}
  


  

  render() {
        const { navigate } = this.props.navigation;
        
    return (
      <Block flex style={styles.profile}>
        <Block flex>
          <ImageBackground
            source={Images.ProfileBackground}
            style={styles.profileContainer}
            imageStyle={styles.profileBackground}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ width, marginTop: '25%' }}
            >
              <Block flex style={styles.profileCard}>
                
                <Block style={styles.info}>
                  <Block
                    middle
                    row
                    space="evenly"
                    style={{ marginTop: 20, paddingBottom: 24 }}
                  >
                  <View  style={{ marginTop: 10,flexDirection:'column' }}>
                  <Text bold size={14} >Doctor name : {this.state.username}</Text>
                  <Text>The appointment will be on :   {this.state.dateSelected}-{this.state.daySelected}</Text>
                  <Text bold size={14} color="#000000">The appointment is at :{this.state.clinicSelected}</Text>
                    </View>
                  </Block>
                  </Block>
                  <Block middle>
                 
                
                    <Divider style={{backgroundColor:'#000000'}}/>
                    <View style={{marginTop:100,flexDirection:'column',alignItems:'center'}}>
                    { this.state.availableSlots.map((slot,index)=>{
   if(slot.time){
    return(
     <View>
      <Button style={{backgroundColor:'#eee'}} small onPress={()=>alert(slot.time)}>
      <Text style={{color:'#00897b'}}>{slot.time}</Text>
      </Button>
         </View>
   )
   }
   
          
                })}
                </View>
                <Divider style={{backgroundColor:'#000000',width:width*0.9}}/>

                    
                  </Block>
                  <Divider style={{backgroundColor:'#000000',marginTop:10}}/>
                
                
              </Block>
            </ScrollView>
          </ImageBackground>
        </Block>
        
      </Block>
    );
  }

}

const styles = StyleSheet.create({
  createButton: {
        width: width * 0.5,
        marginTop: 25,
        borderRadius:15
      },
  profile: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    // marginBottom: -HeaderHeight * 2,
    flex: 1
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
  profileCard: {
    // position: "relative",
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: 65,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2
  },
  info: {
    paddingHorizontal: 40
  },
  avatarContainer: {
    position: "relative",
    marginTop: -80
  },
  avatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 0
  },
  nameInfo: {
    marginTop: 35
  },
  divider: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#E9ECEF"
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure
  },
  vviwe:{
    margin: 20,
    padding: 20,
    backgroundColor: '#efefef',
    bottom: 20,
    left: 20,
    right: 20,
    width:300,
    height:250,
    alignItems: 'center',
    position: 'absolute'


}
});

