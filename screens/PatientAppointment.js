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
  ToastAndroid
} from "react-native";
import { Block, Text, theme } from "galio-framework";

import { Button } from "../components";
import { Images, argonTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import fire from "../constants/firebaseConfigrations";
import DateTimePicker from "react-native-modal-datetime-picker";
import MapView,{Marker} from "react-native-maps";
import { Divider } from 'react-native-elements';
import { Table, TableWrapper, Row, Cell, Col,Rows } from 'react-native-table-component';
const { width, height } = Dimensions.get("screen");
const Toast = (props) => {
  if (props.visible) {
    ToastAndroid.showWithGravityAndOffset(
      props.message,
      ToastAndroid.LONG,
      ToastAndroid.CENTER,
      25,
      50,
    );
    return null;
  }
  return null;
};
const thumbMeasure = (width - 48 - 32) / 3;

class PatientAppointment extends React.Component {

  constructor(props){
    super(props);
    this.authListener=this.authListener.bind(this);
    this.show=this.show.bind(this);
    this.filterResult=this.filterResult.bind(this);
    this.getAllAppointment=this.getAllAppointment.bind(this);  

    //this.setReminder=this.setReminder.bind(this);
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
      showSession:false,
      time:'',
      date:'',
      enableNotification:true,

      showToast:false,
      showToast2:false,
      head:["Date","Time","clinic",""],
      filterEnable:false,
      todayDate:''
    };
  }

  componentDidMount(){
    this.authListener();
    var today = new Date();
    const day   = today.getDate();
    const  month = today.getMonth()+1;
    const  year  = today.getFullYear();
    this.setState({
      todayDate:day + '-' + month + '-' + year
    })
    //this.setReminder();
  }




  authListener(){
  
 
    const { navigation } = this.props;  
    var id=navigation.getParam('idPatient');

    this.setState({id:id})
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

  fire.database().ref("users").child(id).child("appointment").on('value',(snapshot)=>{
    if(snapshot.val()){
      let app=Object.values(snapshot.val());
      // app.map((value,index)=>{
      //   if(value.dateSelected == this.state.date){
      //       this.setState({time:value.timeSelected})
      //   }
      // })
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

  show(id,date,time,clinic,av){
       console.log(id);
       console.log(date);
       console.log(time);
       console.log(clinic);
       console.log(av);
       if(!av){
         this.setState({showToast:true});
       setTimeout(function(){
        this.setState({showToast:false});
            }.bind(this),7000);
  }
  var flag=false;
  if(av){
  
    this.state.session.map((session,index)=>{
      if(date == session.date && time== session.time && clinic ==session.clinic && id==session.idDoctor){//الموعد صار و في اله جلسة
        flag=true;
      }
    })
  }
if(flag){
  //this.props.navigation.navigate("Info",{id:this.state.id,idDoctor:id,type:"patient",date:date,time:time,clinic:clinic,available:av})
  this.props.navigation.navigate("MyPanel");
}

if(!flag){ // الموعد ما صار تأجل او التغى
  this.setState({showToast:true});
  setTimeout(function(){
   this.setState({showToast:false});
       }.bind(this),7000);
}
  }
  filterResult(){
    this.setState({
      filterEnable:true
    })
    fire.database().ref("users").child(this.state.id).child("appointment").orderByChild("dateSelected").equalTo(this.state.todayDate).on('value',(snap)=>{
      if(snap.val()){
        let app=Object.values(snap.val());
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
  }

  getAllAppointment(){
    this.setState({filterEnable:false})
    fire.database().ref("users").child(this.state.id).child("appointment").on('value',(snap)=>{
      if(snap.val()){
        let app=Object.values(snap.val());
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

  }
  
  render() {
    return (
      <Block flex style={styles.profile}>
        <Block flex>

       
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ width, marginTop: '25%' }}
            >
                  
                  <View style={{flexDirection:'row',marginTop:50,marginLeft:70}}>
                      <Button
                      small
                      onPress={this.filterResult}
                      style={{backgroundColor:'#004D40',marginLeft:20}}
                      
                      textStyle={{
                        color: "#fff",
                        fontWeight: "500",
                        fontSize: 16
                      }}
                      >
                              <Text>today</Text>
                      </Button>

                      <Button
                      small
                      onPress={this.getAllAppointment}
                      style={{marginLeft:20,backgroundColor:'#3E2723'}}
                      
                      textStyle={{
                        color: "#fff",
                        fontWeight: "500",
                        fontSize: 16
                      }}
                      >
                              <Text>all</Text>
                      </Button>
                      </View>
                  
                  {!this.state.nodata && <View style={styles.container}>
                  <Toast visible={this.state.showToast} message="Cancelled or delayed or not made yet "/>
                  <Toast visible={this.state.showToast2} message="Cancelled or delayed ! "/>

        <Table borderStyle={{borderColor: 'transparent'}}>
          <Row data={this.state.head} style={styles.head} textStyle={styles.text}/>
          { this.state.appointment.map((data, index) => {
            if(this.state.filterEnable){
              return(
              <TableWrapper key={index} style={styles.row}>
                    <Cell data={data.dateSelected} textStyle={styles.text}/>
                    <Cell data={data.timeSelected} textStyle={styles.text}/>
                    <Cell data={data.clinicName} textStyle={styles.text}/>
                    <Cell data={<Button 
                    onPress={()=>this.show(data.idDoctor,data.dateSelected,data.timeSelected,data.clinicName,data.available)}
                    style={{backgroundColor:"#333"}} small>
                    <Text style={{color:"#fff"}}>Info</Text></Button>
                    } textStyle={styles.text}/>
             </TableWrapper>
                ) 
            }

            if(!this.state.filterEnable){
              return(
              <TableWrapper key={index} style={styles.row}>
                    <Cell data={data.dateSelected} textStyle={styles.text}/>
                    <Cell data={data.timeSelected} textStyle={styles.text}/>
                    <Cell data={data.clinicName} textStyle={styles.text}/>
                    <Cell data={<Button 
                    onPress={()=>this.show(data.idDoctor,data.dateSelected,data.timeSelected,data.clinicName,data.available)}
                    style={{backgroundColor:"#333"}} small>
                    <Text style={{color:"#fff"}}>Info</Text></Button>
                    } textStyle={styles.text}/>
             </TableWrapper>
                ) 
            }
                      
            })
          }
        </Table>
      </View> } 

      </ScrollView>
        </Block>
        
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#333' },
  text: { margin: 6 },
  row: { flexDirection: 'row', backgroundColor: '#eee' },
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

export default PatientAppointment;
