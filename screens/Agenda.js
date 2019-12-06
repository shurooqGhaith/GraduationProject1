import React, { Component } from 'react';
import { Agenda } from 'react-native-calendars';
import {  View, StyleSheet, Button, Alert } from 'react-native';
import { Icon } from 'react-native-elements'
import fire from "../constants/firebaseConfigrations";
import { Block, Text, theme } from "galio-framework";
import { Images, argonTheme } from "../constants";


import { FloatingAction } from "react-native-floating-action";

export default class AgendaScreen extends Component {
  constructor(props) {
    super(props);
    
    this.selectedDay = null;
    this.state = {
      items: {},
      USER_ID:'',
     idDoctor:''
    };
  }

  componentDidMount() {

    this.selectedDay = new Date().toISOString().substring(0, 10);
    this.loadItems();
  }
  loadItems() {
    const { navigation } = this.props;
    var USER_ID = navigation.getParam("idPatient");
    this.setState({
      USER_ID :USER_ID ,
      
        })

     fire.database().ref('users').child(USER_ID).child("appointment").on('value', (datasnapshot) => {
      if (datasnapshot.val()) {
        let items = {};
        let appointments = datasnapshot;

        appointments.forEach((appointment) => {
          this.setState({
            idDoctor:appointment.val().idDoctor
          })

         
          item = {
            'startAt': appointment.val().timeSelected,
            'Doctor': appointment.val().idDoctor,
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
        });

        this.setState({ items: items });
      }
    })
  }
 

  deleteAppointmet(appointmentId,idDoctor,date,time) {
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
            fire.database().ref('users').child(this.state.USER_ID).child("appointment").child(appointmentId).remove();//delete for patient
            // fire.database().ref('users').child(idDoctor).child("appointment").child(appointmentId).remove();//delete for doctor
            //console.log(idDoctor);
            fire.database().ref("users").child(idDoctor).child("appointment").once('value',(snapshot)=>{
                if(snapshot.val()){
          let appointments = Object.values(snapshot.val());
          appointments.map((va,i)=>{
          if(va.idPatient == this.state.USER_ID && va.dateSelected ==date && va.timeSelected==time){
          fire.database().ref("users").child(idDoctor).child("appointment").child(Object.keys(snapshot.val())[i]).remove();  //delete for doctor
          }
          })//map app 
                }
          
              })//app doctor
          }
        },
      ],
      { cancelable: true },
    );
  }



  render() {
    return (
     
      <Agenda
        items={this.state.items}
        selected={this.selectedDay}
        loadItemsForMonth={this.loadItems.bind(this)}
        renderItem={this.renderItem.bind(this)}
        renderEmptyDate={this.renderEmptyDate.bind(this)}
        rowHasChanged={this.rowHasChanged.bind(this)}
      //  onDayPress={this. deleteAll()}
        


      />
      
     /* <View  style={{marginBottom:0,alignItems:'center',justifyContent:'center',flex:1,}}   >    

          <Button
        color="#5E72E4"
        //onPress
        title="Delete all your Appointamnts today ">
        </Button>


      </View>*/
      

    );
    
  }
  
  renderItem(item) {
    const sessionPreiod = 30; //In mins
    const endAt = new Date(new Date("1970/01/01 " + item.startAt).getTime() + sessionPreiod * 60000).toLocaleTimeString('en-UK', { hour: '2-digit', minute: '2-digit', hour12: false });
    return (
      <Block>
      <View style={styles.item} key={item.key}>
      
        <View style={styles.appinfo}>

        <Text>{'clinc Name:'+item.clincName} </Text>
          <Text>{'Time:'+item.startAt} - {endAt} </Text>
          <Text>{'DoctorName:'+item.DoctorName}</Text>

        </View>
        
        <View style={styles.appActions}>
          <View style={styles.delete}>
            <Icon
              name='delete'
              type='material'
            color={argonTheme.COLORS.ICON}
            style={styles.inputIcons}
              size={30}
              onPress={() => { this.deleteAppointmet(item.key,item.Doctor,item.date,item.startAt) }} />
          </View>
         <View style={styles.move}>
            <Icon
              name='timer'
              type='material'
              color={argonTheme.COLORS.ICON}
              style={styles.inputIcons}
              size={30}
              onPress={() => this.props.navigation.navigate("Search",{id:item.Doctor,idPatient:this.state.USER_ID})} />
          </View>
       
        </View>

       
      </View>



      
      
      </Block>

    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}><Text>This is empty date!</Text></View>
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
    borderRadius: 5,
    padding: 0,
    marginRight: 10,
    marginTop: 17,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appinfo: {
    flex: 2,
    marginLeft: 5,
    padding: 10
  },
  appActions: {
    flex: 1,
    flexDirection: 'row',
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