import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  Picker
} from "react-native";
import { Block, Text, theme } from "galio-framework";

import { Button } from "../components";
import { Images, argonTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import fire from "../constants/firebaseConfigrations";
import DateTimePicker from "react-native-modal-datetime-picker";
import MapView,{Marker} from "react-native-maps";
import { Divider } from 'react-native-elements';
import firebase from 'react-native-firebase';
const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

class PatientProfile extends React.Component {

  constructor(props){
    super(props);
    this.authListener=this.authListener.bind(this);
    this.setReminder=this.setReminder.bind(this);
        this.state={
      user:[],
      username:"",
      from:'',
      to:'',
      email:'',
      id:'',
      closedAt:'',
      appointment:[],
      nodata:false,
      session:[],
      noSession:false,
      time:'',
      date:'',
      enableNotification:true
    };
  }

  componentDidMount(){
    this.authListener();
    this.setReminder();
  }


  setReminder = async () => {
    const  notificationTime = this.state.time;
    
    if (this.state.enableNotification) {
      // schedule notification       
      firebase.notifications().scheduleNotification(this.buildNotification(), {
        fireDate: notificationTime,
        repeatInterval: 'day',
        exact: true,
      });
    } else {
      return false;
    }
  };

  buildNotification = () => {
    const title = Platform.OS === "android" ? "Daily Reminder" : "";
    const notification = new firebase.notifications.Notification()
      .setNotificationId("1") // Any random ID
      .setTitle(title) // Title of the notification
      .setBody("This is a notification") // body of notification
      .android.setPriority(firebase.notifications.Android.Priority.High) // set priority in Android
      .android.setChannelId("reminder") // should be the same when creating channel for Android
      .android.setAutoCancel(true); // To remove notification when tapped on it
      return notification;
  };
  authListener(){
  
   var name,start,end,close;
   var user =fire.auth().currentUser;
   if(user != null){
     var id=user.uid;
     this.setState({
       id:id
     })
     fire.database().ref("users").child(id).child("name").on('value',datasnapshot =>{
     name=datasnapshot.val();//
    this.setState({
        username:datasnapshot.val()
    })
  })

  fire.database().ref("users").child(id).child("email").on('value',datasnapshot =>{
    e=datasnapshot.val();//
   this.setState({
       email:datasnapshot.val()
   })
 })

 var today=new Date();
 const day   = today.getDate();
 const dayName=today.getDay();
 const  month = today.getMonth()+1;
 const  year  = today.getFullYear();

    this.setState({
        date:day+'-'+month+'-'+year
    })

  fire.database().ref("users").child(id).child("appointment").on('value',(snapshot)=>{
    if(snapshot.val()){
      let app=Object.values(snapshot.val());
      app.map((value,index)=>{
        if(value.dateSelected == this.state.date){
            this.setState({time:value.timeSelected})
        }
      })
      this.setState({
          appointment:app,
          nodata:false
      })
    }
    else{
        this.setState({
            nodata:true
        })
    }
  })

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
   
  
  }

  
  
  
  render() {
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
                <Block middle style={styles.avatarContainer}>
                  <Image
                    source={{ uri: Images.ProfilePicture }}
                    style={styles.avatar}
                  />
                 <Block>
                   
                 </Block> 
                </Block>
                <Block style={styles.info}>
                  <Block
                    middle
                    row
                    space="evenly"
                    style={{ marginTop: 20, paddingBottom: 24 }}
                  >
                    <Button
                      small
                      style={{ backgroundColor: argonTheme.COLORS.INFO }}
                     // onPress={()=> this.props.navigation.navigate("DoctorInfo",{id:this.state.id})}
                    >
                      Information
                    </Button>
                    <Button
                    onPress={()=>this.props.navigation.navigate("Chat",{sender:this.state.id,name:this.state.username,email:this.state.email,receiver:"8HN5vu95CDd7Ez56XQg0c9U5mr63"})}
                      small
                      style={{ backgroundColor: argonTheme.COLORS.DEFAULT }}
                    >

                      MESSAGE 
                    </Button>
                  </Block>
                  
                </Block>

                <Block flex>
                  <Block middle style={styles.nameInfo}>
                    <Text bold size={28} color="#32325D" id="name">
                      {this.state.username}
                    </Text>
                   
                  </Block>
                  <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                    <Block style={styles.divider} />
                  </Block>
                  <Block middle>
                  
                    
                  
                    {!this.state.nodata && this.state.appointment.map((item,index)=>{
                      if(item.available){//اذا المريض راح ع الموعد يعرض متى كان و شو الدكتور عمله
                         if(!this.state.noSession){
                           return this.state.session.map((session,ind)=>{
                             if(item.dateSelected == session.date && item.timeSelected== session.time && item.clinicName ==session.clinic && item.idDoctor==session.idDoctor){
                               if(!session.money){money="no";}else{money=session.money}
                               if(!session.medicine){medicine="no medicine";}else{medicine=session.medicine}
                               if(!session.medicalExaminations){exam="no checkup needed";}else{exam=session.medicalExaminations}

                              return(
                                <View key={index} style={{flexDirection:'column'}}>
                          
                          <View style={{flexDirection:'row'}}>
                          <Text style={{color:'#000'}}>{item.daySelected}</Text>
                          <Text style={{color:'#000'}}>-{item.dateSelected}</Text>
                          <Text style={{color:'#000'}}>-{item.timeSelected}</Text>
                          </View>
                          
                          <Text style={{color:'#888'}}>{item.clinicName}</Text>
                          
                          <View style={{flexDirection:'column'}}>
                          <Text>{session.sessionNumber}</Text>
                          <Text>{session.process}</Text>
                          <Text>medicine:{medicine}</Text>
                             <Text>money:{money}</Text>
                             <Text>checkup : {exam}</Text>
                          </View>
                          <Divider style={{backgroundColor:'#000000',marginTop:10}}/>

                         </View> 
                              )
                             }
                            
                           })//end session map
                         }
                       
                      }//end appointemnt available


                      if(!item.available){

                                 return(
                               <View key={index} style={{flexDirection:'column'}}>

                               <View style={{flexDirection:'row'}}>
                                         <Text style={{color:'#000'}}>{item.daySelected}</Text>
                                         <Text style={{color:'#000'}}>-{item.dateSelected}</Text>
                                         <Text style={{color:'#000'}}>-{item.timeSelected}</Text>
                                       </View>


                               <Text style={{color:'#888'}}>{item.clinicName}</Text>


                                           <Text>The appointment has not yet been made</Text>
                                           <Divider style={{backgroundColor:'#000000',marginTop:10}}/>

                                                   </View>

                                       )
                                         } 
                                       })
                    }
                    

                    
                    
                    
                  </Block>
                  


                  <Block
                    row
                    style={{ paddingVertical: 14, alignItems: "baseline" }}
                  >
                    
                  </Block>
                  <Block
                    row
                    style={{ paddingBottom: 20, justifyContent: "flex-end" }}
                  >
                    

                  </Block>
                  <Block style={{ paddingBottom: -HeaderHeight * 2 }}>
                  
                  <Button
                   onPress={() => this.props.navigation.navigate("Search",{idPatient:this.state.id})}
                       color="primary" style={styles.createButton} >
                        
                        <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                          make an appointment
                        </Text>
                                
                  </Button>
                   
                  <Button
                   onPress={() => this.props.navigation.navigate("ShowAllLocation")}
                       color="primary" style={styles.createButton} >
                        
                        <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                         location
                        </Text>
                                
                  </Button>
                  </Block>
                </Block>
              </Block>
            </ScrollView>
          </ImageBackground>
        </Block>
        
      </Block>
    );
  }
}

const styles = StyleSheet.create({
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
  }
});

export default PatientProfile;
