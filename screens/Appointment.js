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

const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

export default class Appointment extends React.Component {

  constructor(props){
    super(props);
    this.authListener=this.authListener.bind(this);
    this.handleFromDatePicked=this.handleFromDatePicked.bind(this);
    this.continue=this.continue.bind(this);
    this.state={
      user:[],
      info:[],
      username:'',
      idDoctor:'',
      idPatient:'',
      Specialization:'',
      clinic:'',
      clinicName:[],
      workingHours:[],
      nodata:false,
      days:[],
      start:'',
      end:'',
      pickerSelection: 'Default value!',
      pickerDisplayed: false,
      isDateTimePickerVisibleFrom:false,
      daySelected:'',
      dateSelected:'',
      available:false

    }
  }

  componentDidMount(){
    this.authListener();
  }

  authListener(){
    const { navigation } = this.props;  
    var id=navigation.getParam("id");
    var idP=navigation.getParam("idPatient");
    this.setState({
        idDoctor:id,
        idPatient:idP
    })

    fire.database().ref("users").child(id).child("Specialization").on('value',(datasnapshot)=>{
      if(datasnapshot.val()){
        this.setState({
          Specialization:datasnapshot.val()
        })
      }
     })
  
     fire.database().ref("users").child(id).child("name").on('value',(datasnapshot)=>{
      this.setState({
        username:datasnapshot.val()
      })
   })
      
  
    fire.database().ref("users").child(id).child("clinicName").on('value',(datasnapshot) =>{
      if(datasnapshot.val()){
      let nameClinic = Object.values(datasnapshot.val());
      this.setState({clinicName:nameClinic})
      }
   })
  
   fire.database().ref("users").child(id).child("workingHours").on('value',(datasnapshot) =>{
     if(datasnapshot.val()){
      let items = Object.values(datasnapshot.val());
      
      this.setState({
        workingHours:items,
        nodata:false
          })
  
     }
    else{
      this.setState({
        nodata:true // لسه مش محدد اوقات عمله
      })
    }
    
  })

//    this.state.workingHours.map((value,index)=>{
//          this.setState
//    })
  
  }

  continue(){
    console.log(this.state.dateSelected);
    if(this.state.dateSelected==''){
      alert("Enter a date !");
    }
    if(this.state.available){
       this.props.navigation.navigate("SelectTime",{idDoctor:this.state.idDoctor,idPatient:this.state.idPatient,selectedDay:this.state.daySelected,selectedDate:this.state.dateSelected,clinic:this.state.clinic});

    }
    else {
        alert("No work at this day !");
    }
  }

  handleFromDatePicked =pickeddate=> {
   const day   = pickeddate.getDate();
   const dayName=pickeddate.getDay();
   const  month = pickeddate.getMonth()+1;
   const  year  = pickeddate.getFullYear();
    
    var d=`${day}`;
    if(d.length==1){d=`0${d}`}
    var m=`${month}`;
    if(m.length==1){m=`0${m}`}

      this.setState({
          dateSelected:year + '-' + m + '-' + d
      })
       
    
       if(dayName==0){
            this.setState({
                daySelected:"sunday"
            })
       }

       
       if(dayName==1){
        this.setState({
            daySelected:"monday"
        })
   }
   
   if(dayName==2){
    this.setState({
        daySelected:"tuesday"
    })
}

if(dayName==3){
    this.setState({
        daySelected:"wednesday"
    })
}

if(dayName==4){
    this.setState({
        daySelected:"thursday"
    })
}

if(dayName==5){
    this.setState({
        daySelected:"friday"
    })
}

if(dayName==6){
    this.setState({
        daySelected:"saturday"
    })
}

this.state.workingHours.map((value,index)=>{
    if(value.days==this.state.daySelected && value.enable){
       this.setState({
           available:true,
           clinic:value.selectedClinic
       }) 
    }
   
    // else {this.setState({
    //     available:false
    // })}
})
    this.hideDateTimePicker();
    
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisibleFrom: false });
  };

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisibleFrom: true });
  };

  

  add(){
    
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

               <Button
                    onPress={this.showDateTimePicker}//from button
                    style={{marginTop:10}}
                      color="transparent"
                      textStyle={{
                        color: "#333",
                        fontWeight: "500",
                        fontSize: 16
                      }}
                    >
                     <Text style={{color:argonTheme.COLORS.GRADIENT_START}}>select suitable day</Text> 
                    </Button>
                  <DateTimePicker
                       isVisible={this.state.isDateTimePickerVisibleFrom}
                       onConfirm={this.handleFromDatePicked}
                       onCancel={this.hideDateTimePicker}
                       mode={'date'}
                       datePickerModeAndroid={'calendar'}
                             />
                             
                  </Block>
                  </Block>
                  <Block middle>
                 
                
                    <Divider style={{backgroundColor:'#000000'}}/>
                    <View style={{flexDirection:'column'}}>
                         <Text bold size={16} color="#333">
                              selected date : {this.state.dateSelected}
                         </Text>

                         <Text bold size={16} color="#333">
                              selected day : {this.state.daySelected}
                         </Text>
                         </View>
                         <Divider style={{backgroundColor:'#000000',marginTop:10}}/>


                    <Button 
                    style={{marginTop:25,height: 50, width: 100,  borderRadius:10,backgroundColor:"#333"}}
                      onPress={this.continue}
                      >
                        <Text style={{color:"#fff"}}>Continue</Text>
                        
                    </Button>
                  </Block>
                
                {this.state.nodata && <View style={{marginTop:60}}><Text>Working days of this doctor undetermined yet !
                
                </Text></View>}
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

