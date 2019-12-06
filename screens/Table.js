import React, { Component } from 'react';
import { Agenda,Calendar } from 'react-native-calendars';
import { Modal, Text,TouchableHighlight, View, StyleSheet, Button, Alert ,Dimensions} from 'react-native';
import { Icon } from 'react-native-elements'
import fire from "../constants/firebaseConfigrations";
import { isString } from 'util';
import { Images, argonTheme } from "../constants";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Notifications } from 'expo';
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
      available:false
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
            'patientName':appointment.val().PatientName,
            'DoctorName':appointment.val().doctortName,
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
    
  }
 
  _openShiftAppointmetsModal(date) {
    this.selectedCalenderDay = date;
    this.setModalVisible(true);
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
   console.log(dayName.toLowerCase());
   console.log(ar.includes(dayName.toLowerCase()));
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
     alert("select other day");
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

  render() {
    return (
      <View style={{flex:1}}>
          <Modal
              style={{flex:1,marginTop: 22}}
              animationType="slide"
              transparent={false}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
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
          <Text>{'Patient Name:'+item.patient}</Text>

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
              //onPress={() => this.props.navigation.navigate("Search",{id:item.Doctor,idPatient:this.state.USER_ID})}
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