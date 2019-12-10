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
  FlatList,
  Modal,
  TouchableHighlight,
  Alert
} from "react-native";
import { Block, Text, theme } from "galio-framework";

import { Button } from "../components";
import { Images, argonTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import fire from "../constants/firebaseConfigrations";
import DateTimePicker from "react-native-modal-datetime-picker";
import MapView,{Marker} from "react-native-maps";
import { Col, Row, Grid } from "react-native-easy-grid";
import { Divider,Icon } from 'react-native-elements';
import { Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger} from "react-native-popup-menu";
const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

class DoctorAppointment extends React.Component {

  constructor(props){
    super(props);
    this.authListener=this.authListener.bind(this);
    this.filterResult=this.filterResult.bind(this);
    this.getAllAppointment=this.getAllAppointment.bind(this);  
   

    this.state={
      username:"",
      id:"",
      nodata:false,
      patientInfo:[],
      filterEnable:false,
      todayDate:'',
      no:false,
      
      
    }
  }

  componentDidMount(){
    this.authListener();
    //this.getLocation();
    var today = new Date();
    const day   = today.getDate();
    const  month = today.getMonth()+1;
    const  year  = today.getFullYear();

    var d=`${day}`;
    if(d.length==1){d=`0${d}`}
    var m=`${month}`;
    if(m.length==1){m=`0${m}`}

    this.setState({
      todayDate:year + '-' + m + '-' + d
    }) 
  }


  
  authListener(){
  
    const { navigation } = this.props;  
    var id=navigation.getParam('id');
    
     this.setState({
         id:id
     })
     
   fire.database().ref("users").child(id).child("name").on('value',(datasnapshot)=>{
    this.setState({
      username:datasnapshot.val()
    })
 })
    

 fire.database().ref("users").child(id).child("appointment").on('value',(snap)=>{
    if(snap.val()){
      let app=Object.values(snap.val());
      this.setState({
          patientInfo:app,
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


  noData(){
    this.setState({
      no:true
    })
  }
  
  filterResult(){
    this.setState({
      filterEnable:true
    })
    var flag=false;
    fire.database().ref("users").child(this.state.id).child("appointment").orderByChild("dateSelected").equalTo(this.state.todayDate).on('value',(snap)=>{
      if(snap.val()){
        let app=Object.values(snap.val());
        app.map(value=>{
          if(!value.available){
             flag=true;
          }
        })
        if(flag){
          this.setState({
            patientInfo:app,
            nodata:false
        })
        }
        if(!flag){
          this.setState({
              nodata:true
          })
      }
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
            patientInfo:app,
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
                  <View ><Text bold size={16}>Appointment</Text></View>
                <View style={{flexDirection:'row',marginTop:50}}>
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

                      

                  <Block middle>

                  {this.state.nodata && <View style={{marginTop:150}}><Text bold size={20}>no appointment today</Text></View>}

                  <View style={{marginTop:130}}>
                  {!this.state.nodata && this.state.patientInfo.map((item,index)=>{
                    
                     if(!item.available){
                        var name;
                        var x=0;
                      fire.database().ref("users").child(item.idPatient).child("name").on('value',(snap)=>{
                        name=snap.val();
                      })
                      if(this.state.filterEnable){
                                
                        return(
                          <View key={index} style={{flexDirection:'column'}}>
                          <Button small style={{backgroundColor:'#fff'}}
                          onPress={()=>{
                            this.props.navigation.navigate("PatientInfo",{
                              idDoctor:this.state.id,
                              idPatient:item.idPatient,
                              date:item.dateSelected,
                              time:item.timeSelected,
                              clinic:item.clinicName

                              })
                          }}
                          ><Text style={{color:'#000'}}>edit</Text></Button>
                          <View style={{flexDirection:'row'}}>
                          <Text style={{color:'#000'}}>{item.daySelected}</Text>
                          <Text style={{color:'#000'}}>-{item.dateSelected}</Text>
                          <Text style={{color:'#000'}}>-{item.timeSelected}</Text>
                          </View>
                          

                          <Text style={{color:'#888'}}>{item.clinicName}</Text>
                          
                          <Divider style={{backgroundColor:'#000000',marginTop:10}}/>

                         </View>

                         )
                      }

                        if(!this.state.filterEnable){
                          return(
                          <View key={index} style={{flexDirection:'column'}}>
                          <Button small style={{backgroundColor:'#fff'}}
                          onPress={()=>{
                            this.props.navigation.navigate("PatientInfo",{
                              idDoctor:this.state.id,
                              idPatient:item.idPatient,
                              date:item.dateSelected,
                              time:item.timeSelected,
                              clinic:item.clinicName
                              })
                          }}
                          ><Text style={{color:'#000'}}>edit</Text></Button>
                          <View style={{flexDirection:'row'}}>
                          <Text style={{color:'#000'}}>{item.dateSelected}</Text>
                          <Text style={{color:'#000'}}>,{item.timeSelected}</Text>
                          </View>
                          

                          <Text style={{color:'#888'}}>{item.clinicName}</Text>
                      
                          <Divider style={{backgroundColor:'#000000',marginTop:10}}/>

                         </View>

                         )
                        }
                         
                        
                     }
                     
                   })
                   
                   }
                    </View>
                    
                        
                    
                       
                    
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
  headerText: {
    fontSize: 20,
    margin: 10,
    fontWeight: "bold"
  },
  menuContent: {
    color: "#000",
    fontWeight: "bold",
    padding: 2,
    fontSize: 20
  },
  text: {
     margin: 6 },

  itemsList: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
},
itemtext: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
},
  container: {
    flex: 1,
    paddingTop: 22,
    fontSize:20
   },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
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
    borderColor: "#E9ECEF",
    marginTop:10
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure
  }
});

export default DoctorAppointment;