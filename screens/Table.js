import React, { Component } from 'react';
import { Agenda,Calendar } from 'react-native-calendars';
import { Modal, Text,TouchableHighlight, View, StyleSheet, Alert ,Dimensions,ScrollView} from 'react-native';
import { Icon } from 'react-native-elements'
import fire from "../constants/firebaseConfigrations";
import { isString } from 'util';
import { Images, argonTheme } from "../constants";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Notifications } from 'expo';
import { Button } from "../components";
import { slotCreator } from "react-native-slot-creator";

import * as Permissions from 'expo-permissions';

const { width, height } = Dimensions.get("screen");

export default class DoctorAgenda extends Component {
  constructor(props) {
    super(props);
    this.selectedDay = null;
    this.selectedCalenderDay = null;
    this.state = {
      modalVisible: false,
      items: {},
      calendarDots: {},
      USER_ID:'',
      patientName:'',
      clinicName:'',
      patientId:'',
      token:'',
      token2:[],
      available:false,

      modal2Visible:false,
      change:false,
      availableSlots:[],
      newDate:'',
      newDay:'',
      currentTime:'',
      currentDate:'',
      idP:''
     // notification:''
    };
  }

  componentDidMount() {
    if(this.selectedDay === null) {
      this.selectedDay = new Date().toISOString().substring(0, 10);
    }
    this.loadItems();
    

   
  }

  loadItems() {
    const { navigation } = this.props;
   var USER_ID = navigation.getParam("id");
   this.setState({
    USER_ID:USER_ID
        })


    
    
    const database = fire.database();
    const users = database.ref('users');

    
   // this.USER_ID = 'BUKOkPApLGdjVpYWj5AreEmdAWT2';

    users.child(USER_ID).child("appointment").on('value', (datasnapshot) => {
      if (datasnapshot.val()) {
        let items = {};
        let calendarDots = {};
        let appointments = datasnapshot;

        appointments.forEach((appointment) => {
        
      fire.database().ref("users").child(appointment.val().idPatient).child("token").on('value',(datasnapshot)=>{
        this.setState({
          token:datasnapshot.val()
        })
     })
         
          item = {
            'startAt': appointment.val().timeSelected,
            'patient': appointment.val().idPatient,
            'patientName':appointment.val().patientName,
            'DoctorName':appointment.val().doctorName,
           'clincName': appointment.val().clinicName,
             'date':appointment.val().dateSelected,
            'key': appointment.key
          };
        
         
         

          if (items[appointment.val().dateSelected]) {
            items[appointment.val().dateSelected].push(item);
          } else {
            items[appointment.val().dateSelected] = [item];
          }

          calendarDots[appointment.val().dateSelected] = { selected: true, marked: true, selectedColor: 'gray', disabled: true, disableTouchEvent:true};
        });

        for (const key in items) {
          if (items.hasOwnProperty(key)) {
            const element = items[key];
            element.push({'appointments': element.length, 'date':key});
          }
        }

        this.setState({ items: items, calendarDots:calendarDots});
     
      }
    })
  }

  deleteAppointmet(appointmentId,patient,date,time) {

    
    Alert.alert(
      'Cancel Appointment',
      'Are you sure that you want to cancle this appointment !',
      [
        {
          text: 'Cancel',
          onPress: () => { },
          style: 'cancel',
        },
        {
          text: 'OK', onPress: () => {
           fire.database().ref('users').child(this.state.USER_ID).child("appointment").child(appointmentId).remove();//delete for doctor
           fire.database().ref("users").child(patient).child("appointment").once('value',(snapshot)=>{
            if(snapshot.val()){
      let appointments = Object.values(snapshot.val());
      appointments.map((va,i)=>{
      if(va.idDoctor == this.state.USER_ID && va.dateSelected ==date && va.timeSelected==time){
      fire.database().ref("users").child(patient).child("appointment").child(Object.keys(snapshot.val())[i]).remove();  //delete for patient
      }
      fire.database().ref("users").child(patient).child("token").on('value',(datasnapshot)=>{
        this.setState({
          token:datasnapshot.val()
        })
      })
      
      })//map app p
            }
      
          })//app patient
      
           this.loadItems();

          }


  
        },
      //  this.callNotification()

      ],
      { cancelable: true },
    );
    
    this.callNotification()
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
      messageTitle = "Your Doctor delete your appointment"
      messageBody = " click"
      sound=true
      priority="high" 
      this.registerForPushNotificationsAsync()
     this.sendNotification(title=messageTitle, body=messageBody, token=to_token)
  }
  _openShiftAppointmetsModal(date) {
    this.selectedCalenderDay = date;
    this.setModalVisible(true);
  }
  _openShiftAppointmetsModal2(date,id,time) {
    this.selectedCalenderDay = date;
    this.setState({idP:id,currentTime:time})
    this.setModal2Visible(true);
  }


  _beforeChange(fromDate,toDate){
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var d = new Date(toDate);
    var dayName = days[d.getDay()];
    this.setState({newDay:dayName.toLowerCase(),newDate:toDate,currentDate:fromDate});
    //بفحص ازا اليوم الجديد يوم دوام
    var ar=[];
    fire.database().ref("users").child(this.state.USER_ID).child("workingHours").on('value',(datasnapshot) =>{
      if(datasnapshot.val()){
       let items = Object.values(datasnapshot.val());
       items.map((value,index)=>{
        if(value.enable){
          ar.push(value.days)
        }
       
      })
      }
   })
   if(ar.includes(dayName.toLowerCase())){
    Alert.alert(
      'Shift All Appointments',
      'Are you sure that you want to update this appointments from ' + fromDate + ' to ' + toDate +' ?',
      [
        {
          text: 'Cancel',
          onPress: () => { },
          style: 'cancel',
        },
        {
          text: 'OK', onPress: () => {this._changeTime(fromDate,toDate,dayName)}
        },
      ],
      { cancelable: true },
    );
   
   }
   if(!ar.includes(dayName.toLowerCase())){
     alert("No work at this day !");
   }
    

  }
  _changeTime(fromDate,toDate,dayName) {
    console.log(toDate);
    console.log(dayName);

    var ar=[];
    fire.database().ref("users").child(this.state.USER_ID).child("workingHours").on('value',(work)=>{
      let workHour=Object.values(work.val());
      workHour.map(w=>{
        if(w.days == dayName.toLowerCase() && w.enable){
          this.setState({change:true});
          
         let requiredArray = slotCreator.createSlot(w.start,w.end,"30");//2 2.5 3 3.5
         ar=requiredArray;
         requiredArray.map(v=>{ar.push({time:v})})
         console.log(ar.length);//ما طبع شي ، شكله م بيدخل هون أصلا !!!!!!1

         requiredArray.map((slot,index)=>{
           // var flag=false;
          
           fire.database().ref("users").child(this.state.USER_ID).child("appointment").on('value',(app)=>{
             let appointment=Object.values(app.val());
             appointment.map((ap)=>{
               if(ap.dateSelected == toDate && ap.timeSelected==slot && !ap.available){
                 ar = ar.filter(function( obj ) {
                   return obj.time !== slot;
               });
               }
          
             })//app map
           })//app fire

           //if(flag){ar.push({time:slot}) }
         })//slot arrays
        }
       
      })//work map
      if(ar.length==0){this.setState({change:false})}
  // console.log(ar.length);//0
       this.setState({
        availableSlots:ar
      })
    })//working hour database
    
  } 
  updateTime(time){
        
    fire.database().ref("users").child(this.state.idP).child("appointment").once('value',(snapshot)=>{
      if(snapshot.val()){
let appointments = Object.values(snapshot.val());

appointments.map((va,i)=>{
if(va.idDoctor == this.state.USER_ID && va.dateSelected ==this.state.currentDate && va.timeSelected==this.state.currentTime){

fire.database().ref("users").child(this.state.idP).child("appointment").child(Object.keys(snapshot.val())[i]).child("timeSelected").set(time);
fire.database().ref("users").child(this.state.idP).child("appointment").child(Object.keys(snapshot.val())[i]).child("dateSelected").set(this.state.newDate);
fire.database().ref("users").child(this.state.idP).child("appointment").child(Object.keys(snapshot.val())[i]).child("daySelected").set(this.state.newDay)
.then(()=>{
  fire.database().ref("users").child(this.state.USER_ID).child("appointment").once('value',(s)=>{
    let appointments = Object.values(s.val());
    appointments.map((v,ind)=>{
      if(v.idPatient == this.state.idP && v.dateSelected ==this.state.currentDate && v.timeSelected==this.state.currentTime){//وصلت الموعد يلي بدي اغيره
        fire.database().ref("users").child(this.state.USER_ID).child("appointment").child(Object.keys(s.val())[ind]).child("timeSelected").set(time);
        fire.database().ref("users").child(this.state.USER_ID).child("appointment").child(Object.keys(s.val())[ind]).child("dateSelected").set(this.state.newDate);
        fire.database().ref("users").child(this.state.USER_ID).child("appointment").child(Object.keys(s.val())[ind]).child("daySelected").set(this.state.newDay);

      }
    })//app doctor map
   
  })//app doctor

})//then end

}
})//map app p
      }

    })//app patient
  }
  _beforeMoveAppointmets(fromDate,toDate) {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var d = new Date(toDate);
    var dayName = days[d.getDay()];

    //بفحص ازا اليوم الجديد يوم دوام
    var ar=[];
    fire.database().ref("users").child(this.state.USER_ID).child("workingHours").on('value',(datasnapshot) =>{
      if(datasnapshot.val()){
       let items = Object.values(datasnapshot.val());
       items.map((value,index)=>{
        if(value.enable){
          ar.push(value.days)
        }
       
      })
      }
   })
  // ar.map(v=>console.log(v));
  //  console.log(dayName.toLowerCase());
  //  console.log(ar.includes(dayName.toLowerCase()));
   if(ar.includes(dayName.toLowerCase())){
    Alert.alert(
      'Shift All Appointments',
      'Are you sure that you want to shift all appointments of ' + fromDate + ' to ' + toDate +' ?',
      [
        {
          text: 'Cancel',
          onPress: () => { },
          style: 'cancel',
        },
        {
          text: 'OK', onPress: () => {this._moveAppointmets(fromDate,toDate,dayName)}
        },
      ],
      { cancelable: true },
    );
   
   }
   if(!ar.includes(dayName.toLowerCase())){
     alert("No work at this day!!");
   }
    
    
  }

  _moveAppointmets(fromDate,toDate,dayName) {
    const appointments = fire.database().ref("users").child(this.state.USER_ID).child("appointment");

    //select appointment in specific date
    const query = appointments
            .orderByChild('dateSelected')
            .equalTo(fromDate);
            
    //iterate over all appointment in that date and update there time 				
    query.once('value', sanp => {
      sanp.forEach(appointment => {
        

        appointment.ref.update({'dateSelected' : toDate})
        appointment.ref.update({'daySelected' : dayName.toLowerCase()})
        fire.database().ref("users").child(appointment.val().idPatient).child("appointment").once('value',(snapshot)=>{
          if(snapshot.val()){
    let appointments = Object.values(snapshot.val());
    appointments.map((va,i)=>{
    if(va.idDoctor == this.state.USER_ID && va.dateSelected ==fromDate ){
    fire.database().ref("users").child(appointment.val().idPatient).child("appointment").child(Object.keys(snapshot.val())[i]).child("dateSelected").set(toDate);  
    fire.database().ref("users").child(appointment.val().idPatient).child("appointment").child(Object.keys(snapshot.val())[i]).child("daySelected").set(dayName.toLowerCase());  
    //// بدي أعدل اليوم كيف أجيبه ؟؟  
  }
    })//map app p
          }
    
        })//app patient
      });
      this.selectedDay = toDate;
      this.setModalVisible(false);
    });
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  setModal2Visible(visible){
    this.setState({modal2Visible:visible})
  }
  render() {
    return (
      <View style={{flex:1}}>
          <Modal
              style={{flex:1,marginTop: 22}}
              animationType="slide"
              transparent={false}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                this.setModalVisible(!this.state.modalVisible);
              }}>
              <View style={{
                  flex:1,
                  flexDirection:'column',
                  marginTop: 22,
                  padding:10,
                  backgroundColor: '#f4f4f4',
                  borderRadius:10
                  }}>
                <View>
                <TouchableHighlight
                    style={{alignSelf:'flex-end'}}
                    onPress={() => {
                      this.setModalVisible(!this.state.modalVisible);
                    }}>
                      <Icon
                          name='close'
                          type='material'
                          color='#517fa4'
                          size={28}/>
                  </TouchableHighlight>
                  <Text style={{fontSize:22}}>Selecte a day</Text>
                  <Calendar
                    style={{borderRadius:5,marginTop:10}}
                    current={this.selectedCalenderDay}
                    minDate={'2019-01-01'}
                    maxDate={'2022-01-01'} 
                    markedDates={this.state.calendarDots}
                    onDayPress={(day) => {this._beforeMoveAppointmets(this.selectedCalenderDay, day.dateString)}}
                  />
                </View>
              </View>
            </Modal>

            {/* change appointment */}
            <Modal
              style={{flex:1,marginTop: 22}}
              animationType="slide"
              transparent={false}
              visible={this.state.modal2Visible}
              onRequestClose={() => {
                this.setModal2Visible(!this.state.modal2Visible);
              }}>
              <View style={{
                  flex:1,
                  flexDirection:'column',
                  marginTop: 22,
                  padding:10,
                  backgroundColor: '#f4f4f4',
                  borderRadius:10
                  }}>
                <View>
                <TouchableHighlight
                    style={{alignSelf:'flex-end'}}
                    onPress={() => {
                      this.setState({change:false});
                      this.setModal2Visible(!this.state.modal2Visible);
                    }}>
                      <Icon
                          name='close'
                          type='material'
                          color='#517fa4'
                          size={28}/>
                  </TouchableHighlight>
                  <Text style={{fontSize:22}}>Selecte a day</Text>
                  <Calendar
                    style={{borderRadius:5,marginTop:10}}
                    current={this.selectedCalenderDay}
                    minDate={'2019-01-01'}
                    maxDate={'2022-01-01'} 
                    markedDates={this.state.calendarDots}
                    onDayPress={(day) => {this._beforeChange(this.selectedCalenderDay, day.dateString)}}
                  />
                </View>
                <ScrollView showsVerticalScrollIndicator={true}>
                {this.state.change && <View style={{marginLeft:120}}><Text>available times</Text></View>}
                <View style={{flexDirection:'row',flexWrap:'wrap',marginTop:10,marginLeft:40}}>
                {this.state.change && this.state.availableSlots.map((slot,index)=>{
                      if(slot.time){
                           return(
                                   <View style={{marginTop:5}} key={index} >
                                     <Button style={{backgroundColor:'#eee',marginLeft:10,width:width*0.3}}  
                                     onPress={()=>this.updateTime(slot.time)}
                                     >
                                     <Text style={{color:'#00897b'}}>{slot.time}</Text>
                                      </Button>
                                      </View>
                              )
                            }
                })}
                
                </View>
                
                {this.state.change && <View>
                  <Button small style={{marginTop:5,marginLeft:120,backgroundColor:'#3E2723'}}  
                 onPress={() => {this.setState({change:false})}}>
                  <Text color="#fff">cancel</Text></Button>

                </View>}
                </ScrollView>
              </View>
            </Modal>


          <Agenda
              items={this.state.items}
              selected={this.selectedDay}
              loadItemsForMonth={this.loadItems.bind(this)}
              renderItem={this.renderItem.bind(this)}
              // renderEmptyDate={this.renderEmptyDate.bind(this)}
              renderEmptyDate={() => {return (<View><Text>Test</Text></View>);}}
              rowHasChanged={this.rowHasChanged.bind(this)}
          />
      </View>
    );
  }

  renderItem(item) {
    if(item.appointments !== undefined) {
      return(
        <TouchableOpacity
        style={{flex:1,justifyContent:'center'}}
        onPress={() => { this._openShiftAppointmetsModal(item.date) }}>
        <View  style={styles.shftItem}>

        <Icon
              name='timer'
              type='material'
             // color='#517fa4'
             color={argonTheme.COLORS.ICON}
             style={styles.inputIcons}

              size={25}
            />
        <Text bold size={14} style={{color:'white'}}>Shift The Appointments({item.appointments})</Text>

        
         </View>
        
        </TouchableOpacity>
      );      
    } else {
    const sessionPreiod = 30; //In mins
    const endAt = new Date(new Date("1970/01/01 " + item.startAt).getTime() + sessionPreiod * 60000).toLocaleTimeString('en-UK', { hour: '2-digit', minute: '2-digit', hour12: false });
    return (
      <View style={styles.item} key={item.key}>
       
        <View style={styles.appinfo}>
          <Text>{'clinc Name:'+item.clincName} </Text>
          <Text>{'Time:'+item.startAt} - {endAt} </Text>
          <Text>{'Patient Name:'+item.patientName}</Text>

          </View>

        
        <View style={styles.appActions}>
          
            <Icon
              name='delete'
              type='material'
              color={argonTheme.COLORS.ICON}
             style={styles.inputIcons}

              size={30}
              onPress={() => { this.deleteAppointmet(item.key,item.patient,item.date,item.startAt) }} />

            <Icon
              name='timer' ///لسا هاد
              type='material'
              color={argonTheme.COLORS.ICON}
              style={styles.inputIcons}
              size={30}
              onPress={() => { this._openShiftAppointmetsModal2(item.date,item.patient,item.startAt) }}
               />
          
          
       </View>
      </View>
    );
    }
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}><Text>You have no appointments at this day.</Text></View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.clinicName !== r2.clinicName;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'row',
    justifyContent:'space-between',
    borderRadius: 5,
    padding: 0,
    marginRight: 10,
    marginTop: 17,
    height: 100,
  },
  shftItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#606369',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  appinfo: {
    flex: 2,
    marginLeft: 5,
    padding: 10,
    alignItems:'center',
    justifyContent:'center',
    //flexDirection: 'row',

  },
  appActions: {
    flex: 1,
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'center'
  },
  delete: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  move: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  },
  inputIcons: {
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
    
  },
  
});