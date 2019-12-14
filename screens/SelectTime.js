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
  TouchableHighlight,
  ToastAndroid

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
import { Notifications } from 'expo';


const { width, height } = Dimensions.get("screen");
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
const thumbMeasure = (width - 48 - 32) / 3;

export default class SelectTime extends React.Component {

  constructor(props){
    super(props);
    this.authListener=this.authListener.bind(this);
    this.makeAppointment=this.makeAppointment.bind(this);
    this.update=this.update.bind(this);
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
      availableSlots:[],
      isShow:false,
      message:'',
      noAvailable:false,
      token:''

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
    var clinic =navigation.getParam("clinic");

    
    this.setState({
        idDoctor:id,
        idPatient:idP,
        daySelected:day,
        dateSelected:date,
        clinicSelected:clinic
    })

    var ar=[];
    fire.database().ref("users").child(id).child("workingHours").on('value',(work)=>{
      let workHour=Object.values(work.val());
      workHour.map(w=>{
        if(w.days == day && w.enable){
         // this.setState({change:true});
          
         let requiredArray = slotCreator.createSlot(w.start,w.end,"30");//2 2.5 3 3.5
         ar=requiredArray;
         requiredArray.map(v=>{ar.push({time:v})})
         requiredArray.map((slot,index)=>{
           var flag=false;
          
           fire.database().ref("users").child(id).child("appointment").on('value',(app)=>{
             if(app.val()){
              let appointment=Object.values(app.val());
              appointment.map((ap)=>{
                if(ap.dateSelected == date && ap.timeSelected==slot && !ap.available){
                  ar = ar.filter(function( obj ) {
                    return obj.time !== slot;
                });
                }
              })//app map
             }
             
           })//app fire
  
         })//slot arrays
        }
        
      })//work map
   // alert("1");
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
 fire.database().ref("users").child(id).child("token").on('value',(datasnapshot)=>{
  this.setState({
    token:datasnapshot.val()
  })
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

      //     this.state.workingHours.map((value,index)=>{
      //       if(value.days==this.state.daySelected  && value.enable){
      //         alert("clinic");
      //           this.setState({
      //             clinicSelected:value.selectedClinic
      //           })
      //       }
      // }) ع الفاضي هاي م بيدخل عليها 
  
     }
    else{
      this.setState({
        nodata:true
      })
    }
    
  })

  
  }

  
  makeAppointment(time){
   
    fire.database().ref("users").child(this.state.idDoctor).child("appointment").push().set({
      'idPatient':this.state.idPatient,
      'daySelected':this.state.daySelected,
      'dateSelected':this.state.dateSelected,
      'timeSelected':time,
      'clinicName':this.state.clinicSelected,
      'patientName':this.state.patientName,
      'doctorName':this.state.username,
      'available':false
  }).then(()=>{
    fire.database().ref("users").child(this.state.idPatient).child("appointment").push().set({
      'idDoctor':this.state.idDoctor,
      'daySelected':this.state.daySelected,
      'dateSelected':this.state.dateSelected,
      'timeSelected':time,
      'clinicName':this.state.clinicSelected,
      'patientName':this.state.patientName,
      'doctorName':this.state.username,
      'available':false
  });
  
  this.callNotification()

  this.setState({isShow:true,message:'Added successfully !'});
  setTimeout(function(){
   this.setState({isShow:false});
  }.bind(this),5000);

  }).catch((error)=>{
    this.setState({isShow:true,message:error.message});
    setTimeout(function(){
     this.setState({isShow:false});
    }.bind(this),5000);
  })

   // alert("The time is changed to "+this.state.dateToSearch+"\n"+this.state.timeToSearch);
   // this.setState({availableSlots:[]});

   this.update();
  }

  update(){
    var ar=[];
    var id=this.state.idDoctor;
    var day=this.state.daySelected;
    var date=this.state.dateSelected;
    fire.database().ref("users").child(id).child("workingHours").on('value',(work)=>{
      let workHour=Object.values(work.val());
      workHour.map(w=>{
        if(w.days == day && w.enable){
         // this.setState({change:true});
          
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
   // alert("1");
   console.log(ar.length);
   if(ar.length==0){this.setState({noAvailable:true})}
      this.setState({
        availableSlots:ar
      })
  
    })//working hour database
  }
  async sendNotification(title="hello", body="sending a fucking notification", token="ExponentPushToken[OVK81WCGfOHwHyu1s3FRua]"){
	
    PUSH_ENDPOINT = 'https://exp.host/--/api/v2/push/send'
    let response =  await fetch(PUSH_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
    "to": token,
    "title":title,
    "body": body,
  }),
    })
    return response
  }

  
  
  async  registerForPushNotificationsAsync(){
    var id;
    id=fire.auth().currentUser.uid;
  
    try {
      // Get the token that uniquely identifies this device
      let token = await Notifications.getExpoPushTokenAsync();
      console.log("hi there this is my device tokennnnnn")
  
      console.log(token)
      fire.database().ref("users").child(id).child("token").set(token);

     
    } catch (error) {
      console.log(error);
    }
    return token
  }
  
    
  
    
  
    
    
   
  callNotification(){
      to_token = this.state.token
      messageTitle = "You have a new Appointment "
      messageBody = "  New Appointment"
      sound=true
      priority="high" 
      this.registerForPushNotificationsAsync()
     this.sendNotification(title=messageTitle, body=messageBody, token=to_token)
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
                  {/* <View  style={{ marginTop: 10,flexDirection:'column' }}>
                  <Text size={14} >Doctor name : {this.state.username}</Text>
                  <Text>The appointment will be on : {this.state.dateSelected}</Text>
                  <Text  size={14} color="#000000">At :{this.state.clinicSelected}</Text>
                    </View> */}

                    <View style={{flexDirection:'column',marginTop:10,marginLeft:20}}>
                          <View style={{flexDirection:'row'}}>
                              <Text bold size={14} style={{color:'#004D40'}}>DoctorName:</Text>
                              <Text style={{color:'#aaa'}}>{this.state.username}</Text>
                          </View>
                          <View style={{flexDirection:'row',marginTop:10}}>
                              <Text bold size={14} style={{color:'#004D40'}}>Clinic name:</Text>
                              <Text style={{color:'#aaa'}}>{this.state.clinicSelected}</Text>
                          </View>

                       </View>

                       
                  </Block>
                  </Block>
                  <Block middle>
                 
                
                    <Divider style={{backgroundColor:'#000000',width:width*0.9}}/>
                    <Text bold style={{color:'#004D40',marginLeft:140,marginTop:15}}>{this.state.dateSelected}</Text>
                    <Text bold style={{color:'#004D40',marginLeft:15,marginTop:20}}>Available times</Text>

                    <View style={{marginTop:60,flexDirection:'row',flexWrap:'wrap',marginLeft:15}}>

                    { this.state.availableSlots.map((slot,index)=>{
   if(slot.time){
    return(
     <View style={{marginTop:5}} key={index}>
      <Button style={{backgroundColor:'#eee',marginLeft:10}} small onPress={()=>this.makeAppointment(slot.time)}>
      <Text style={{color:'#00897b'}}>{slot.time}</Text>
      </Button>
         </View>
   )
   }
   
          
                })}

                {this.state.noAvailable && <View style={{marginTop:150}}><Text bold size={20}>Doctor is busy this day</Text></View>}
                </View>


                    
                  </Block>
                  <Divider style={{backgroundColor:'#000000',marginTop:10}}/>
                  <Toast visible={this.state.isShow} message={this.state.message}/> 

                
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

