import React from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  Picker,
  View,
  CheckBox,
  Switch
} from "react-native";
import { Block, Text, theme } from "galio-framework";
import { Ionicons } from '@expo/vector-icons';
import { Button ,Input,Icon } from "../components";
import { Images, argonTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import fire from "../constants/firebaseConfigrations";
import DateTimePicker from "react-native-modal-datetime-picker";
import ToggleSwitch from 'toggle-switch-react-native';
import { Divider } from 'react-native-elements';
import moment from 'moment';
import { slotCreator } from "react-native-slot-creator";
const { width, height } = Dimensions.get("screen");
const thumbMeasure = (width - 48 - 32) / 3;

class DoctorInfo extends React.Component {

  constructor(props){
    super(props);
    this.authListener=this.authListener.bind(this);
    this.handleFromDatePicked=this.handleFromDatePicked.bind(this);
    this.handleToDatePicked=this.handleToDatePicked.bind(this);
    this.determineClosedDay=this.determineClosedDay.bind(this);
    this.add=this.add.bind(this);
    this.toggleSwitch=this.toggleSwitch.bind(this);
    this.state={
      user:[],
      info:[],
      username:"n",
      from:'',
      to:'',
      isDateTimePickerVisibleFrom:false,
      isDateTimePickerVisibleTo:false,
      id:'',
      closedAt:'',
      clinicName:'select clinic name',
      latitude:0,
      longitude:0,
      showmap:false,
      checkedSaturday:false,
      checkedSunday:false,
      checkedMonday:false,
      checkedTuesday:false,
      checkedWednesday:false,
      checkedThursday:false,
      checkedFriday:false,
      switch:false,
      activeSwitch: null,
      nodata:false,
      clinicNames:[]

    }
  }

  componentDidMount(){
    this.authListener();
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
     
   fire.database().ref("users").child(id).child("clinicName").on('value',(datasnapshot) =>{
    let nameClinic = Object.values(datasnapshot.val());
    this.setState({clinicNames:nameClinic});

 })


    fire.database().ref("users").child(id).child("workingHours").on('value',(datasnapshot) =>{
    //alert(datasnapshot.val());

    if(datasnapshot.val()){
      let items = Object.values(datasnapshot.val());
    this.setState({
        info:items,
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


  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisibleFrom: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisibleFrom: false });
  };

  showDateTimePickerTo = () => {
    this.setState({ isDateTimePickerVisibleTo: true });
  };

  hideDateTimePickerTo = () => {
    this.setState({ isDateTimePickerVisibleTo: false });
  };

  handleFromDatePicked = time => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    var h=`${hours}`;
    var m=`${minutes}`;
    if(h.length==1){h=`0${h}`}
    if(m.length==1){m=`0${m}`}

    const timeSelected=h+":"+m;
      this.setState({
          from:timeSelected
      })
    
       var id=this.state.id;
       //fire.database().ref("users").child(id).child("from").set(this.state.from);
      // alert("selected time :"+timeSelected);
    
    this.hideDateTimePicker();
  };
  handleToDatePicked=time=>{
    const hours = time.getHours();
    const minutes = time.getMinutes();
    var h=`${hours}`;
    var m=`${minutes}`;
    if(h.length==1){h=`0${h}`}
    if(m.length==1){m=`0${m}`}
    
    const timeSelected=h+":"+m;
      this.setState({
          to:timeSelected
      })
    
       var id=this.state.id;
      // fire.database().ref("users").child(id).child("to").set(this.state.to);
     // alert("selected time :"+timeSelected);
    
    this.hideDateTimePickerTo();
  }

  makeTwoDigits (time) {
  const timeString = `${time}`;
  if (timeString.length === 2) return time
  return `0${time}`
}

  determineClosedDay=(day)=>{
   var id=this.state.id;
   fire.database().ref("users").child(id).child("closedDay").set(day);
  

  }
  
  add(){
     var days="";
     var array=new Array(7);
     var enable=false;
     var id=this.state.id;
     let requiredArray1 = slotCreator.createSlot(this.state.from,this.state.to,"30");


     if(this.state.checkedSaturday){days=days+"-saturday";array.push("saturday");
     fire.database().ref("users").child(id).child("workingHours").push().set({
      'start':this.state.from,
      'end':this.state.to,
      'days':"saturday",////////////////////////////*************** */
      'enable':enable,
      'selectedClinic':this.state.clinicName
  });
     requiredArray1.map((item,index)=>{
       fire.database().ref("users").child(id).child("slots").push().set({
         'daySelected':"saturday",
         'slot':item,
         'available':true
       })
     })
    }
     if(this.state.checkedSunday) {days=days+"-sunday";array.push("sunday");
     fire.database().ref("users").child(id).child("workingHours").push().set({
      'start':this.state.from,
      'end':this.state.to,
      'days':"sunday",////////////////////////////*************** */
      'enable':enable,
      'selectedClinic':this.state.clinicName
  });
  requiredArray1.map((item,index)=>{
    fire.database().ref("users").child(id).child("slots").push().set({
      'daySelected':"sunday",
      'slot':item,
      'available':true
    })
  })
    }
     if(this.state.checkedMonday) {days=days+"-monday";array.push("monday");
     fire.database().ref("users").child(id).child("workingHours").push().set({
      'start':this.state.from,
      'end':this.state.to,
      'days':"monday",////////////////////////////*************** */
      'enable':enable,
      'selectedClinic':this.state.clinicName
  });

  requiredArray1.map((item,index)=>{
    fire.database().ref("users").child(id).child("slots").push().set({
      'daySelected':"monday",
      'slot':item,
      'available':true
    })
  })
    }
     if(this.state.checkedTuesday) {days=days+"-tuesday";array.push("tuesday");
     fire.database().ref("users").child(id).child("workingHours").push().set({
      'start':this.state.from,
      'end':this.state.to,
      'days':"tuesday",////////////////////////////*************** */
      'enable':enable,
      'selectedClinic':this.state.clinicName
  });
  requiredArray1.map((item,index)=>{
    fire.database().ref("users").child(id).child("slots").push().set({
      'daySelected':"tuesday",
      'slot':item,
      'available':true
    })
  })
    }
     if(this.state.checkedWednesday) {days=days+"-wednesday";array.push("wednesday");
     fire.database().ref("users").child(id).child("workingHours").push().set({
      'start':this.state.from,
      'end':this.state.to,
      'days':"wednesday",////////////////////////////*************** */
      'enable':enable,
      'selectedClinic':this.state.clinicName
  });
  requiredArray1.map((item,index)=>{
    fire.database().ref("users").child(id).child("slots").push().set({
      'daySelected':"wednesday",
      'slot':item,
      'available':true
    })
  })
    }
     if(this.state.checkedThursday) {days=days+"-thursday";array.push("thursday");
     fire.database().ref("users").child(id).child("workingHours").push().set({
      'start':this.state.from,
      'end':this.state.to,
      'days':"thursday",////////////////////////////*************** */
      'enable':enable,
      'selectedClinic':this.state.clinicName
  });
  requiredArray1.map((item,index)=>{
    fire.database().ref("users").child(id).child("slots").push().set({
      'daySelected':"thursday",
      'slot':item,
      'available':true
    })
  })
    }
     if(this.state.checkedFriday) {days=days+"-friday";array.push("friday");
     fire.database().ref("users").child(id).child("workingHours").push().set({
      'start':this.state.from,
      'end':this.state.to,
      'days':"friday",////////////////////////////*************** */
      'enable':enable,
      'selectedClinic':this.state.clinicName
  });
  requiredArray1.map((item,index)=>{
    fire.database().ref("users").child(id).child("slots").push().set({
      'daySelected':"friday",
      'slot':item,
      'available':true
    })
  })
    }

    // alert(days);
     
     //var count=0;
    //  fire.database().ref("users").child(id).child("workingHours").push().child("workingDays").set(days);
    //  fire.database().ref("users").child(id).child("workingHours").push().child("startTime").set(this.state.from);
    //  fire.database().ref("users").child(id).child("workingHours").push().child("endTime").set(this.state.to);

    
    //  fire.database().ref("users").child(id).child("workingHours").push().set({
    //      'start':this.state.from,
    //      'end':this.state.to,
    //      'days':days,////////////////////////////*************** */
    //      'enable':enable,
    //      'selectedClinic':this.state.clinicName
    //  });

     this.setState({
        checkedSaturday:false,
        checkedSunday:false,
        checkedMonday:false,
        checkedTuesday:false,
        checkedWednesday:false,
        checkedFriday:false

     })

  }
  
  toggleSwitch = (switchNumber) => {
    this.setState({
      activeSwitch: switchNumber === this.state.activeSwitch ? null : switchNumber
    })
  };

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
                  <Block
                    middle
                    row
                    space="evenly"
                    style={{ marginTop: 20, paddingBottom: 24 }}
                  >
                  <Text color="#004" bold>Information</Text>
                   
                  </Block>
                  </Block>
                  <Block middle>
                <View style={{flexDirection:'column'}}>
                <Picker 
                    style={{height: 60, width: width*0.8}} 
                    selectedValue = {this.state.clinicName} 
                    onValueChange = {(value) => {this.setState({clinicName: value});
                    }}>
                    {this.state.clinicNames.map((value,index)=>{
                      return(
                        <Picker.Item key={index} color="#004" label = {value.clinic} value = {value.clinic} />
                      )
                    })}
                         
                    </Picker>
                      
                    </View>
                    <Divider style={{backgroundColor:'#000000'}}/>

                  <Button
                    onPress={this.showDateTimePicker}//from button
                    style={{marginTop:10,width:width*0.6,marginLeft:10}}
                      color="transparent"
                      textStyle={{
                        color: "#00796B",
                        fontWeight: "500",
                        fontSize: 16
                      }}
                    >
                     <Text style={{color:'#004'}}>{this.state.from || "start time"}</Text> 
                    </Button>
                    

                    <DateTimePicker
                       isVisible={this.state.isDateTimePickerVisibleFrom}
                       onConfirm={this.handleFromDatePicked}
                       onCancel={this.hideDateTimePicker}
                       mode='time'
                       //datePickerModeAndroid={'calendar'}
                       timePickerModeAndroid={'clock'}
                       is24Hour={false}
                             />

                    <Button
                    style={{marginTop:10,width:width*0.6,marginLeft:10}}
                    onPress={this.showDateTimePickerTo}//to button
                      color="transparent"
                      textStyle={{
                        color: "#00796B",
                        fontWeight: "500",
                        fontSize: 16
                      }}
                    >
                     <Text style={{color:'#004'}}>{this.state.to || "end time"}</Text> 
                    </Button>
                    <DateTimePicker
                       isVisible={this.state.isDateTimePickerVisibleTo}
                       onConfirm={this.handleToDatePicked}
                       onCancel={this.hideDateTimePickerTo}
                       mode='time'
                       timePickerModeAndroid={'clock'}
                       is24Hour={false}
                             />
                     <View style={{flexDirection: 'column',marginTop:50}}>

                     
                    
                    <View style={{ flexDirection: 'row' ,color:'#004' }}>
                    <CheckBox
                           value={this.state.checkedSaturday}
                           onValueChange={() => this.setState({ checkedSaturday: !this.state.checkedSaturday })}
                            />
                     <Text style={{marginTop: 5}}> Saturday</Text>
                     </View>

                     <View style={{ flexDirection: 'row' }}>
                    <CheckBox
                           value={this.state.checkedSunday}
                           onValueChange={() => this.setState({ checkedSunday: !this.state.checkedSunday })}
                            />
                     <Text style={{marginTop: 5}}> Sunday</Text>
                     </View>

                     <View style={{ flexDirection: 'row' }}>
                    <CheckBox
                           value={this.state.checkedMonday}
                           onValueChange={() => this.setState({ checkedMonday: !this.state.checkedMonday })}
                            />
                     <Text style={{marginTop: 5}}> Monday</Text>
                     </View>

                     <View style={{ flexDirection: 'row' }}>
                    <CheckBox
                           value={this.state.checkedTuesday}
                           onValueChange={() => this.setState({ checkedTuesday: !this.state.checkedTuesday })}
                            />
                     <Text style={{marginTop: 5}}> Tuesday</Text>
                     </View>

                     <View style={{ flexDirection: 'row' }}>
                    <CheckBox
                           value={this.state.checkedWednesday}
                           onValueChange={() => this.setState({ checkedWednesday: !this.state.checkedWednesday })}
                            />
                     <Text style={{marginTop: 5}}> Wednesday</Text>
                     </View>

                     <View style={{ flexDirection: 'row' }}>
                    <CheckBox
                           value={this.state.checkedThursday}
                           onValueChange={() => this.setState({ checkedThursday: !this.state.checkedThursday })}
                            />
                     <Text style={{marginTop: 5}}> Thursday</Text>
                     </View>

                     <View style={{ flexDirection: 'row' }}>
                    <CheckBox
                           value={this.state.checkedFriday}
                           onValueChange={() => this.setState({ checkedFriday: !this.state.checkedFriday })}
                            />
                     <Text style={{marginTop: 5}}> Friday</Text>
                     </View>

                    </View>

                    <Button 
                    style={{marginTop:25,height: 50, width: 50,  borderRadius:100,backgroundColor:"#00796B"}}
                    onPress={this.add}>
                        <Text style={{color:"#fff"}}>Add</Text>
                        
                    </Button>
                  </Block>
                  <Divider style={{backgroundColor:'#000000',marginTop:10}}/>
                 <View style={{flexDirection:'column',marginTop:10}}>
                      {!this.state.nodata && this.state.info.map((item,index)=>{
                          
                          return(
                            <View key={index} style={{flexDirection:'column'}}>
                            <View style={{flexDirection:'row'}}>
                               <Text style={{fontWeight:'bold',fontSize:30,color:'#004'}}>{item.start}</Text>
                               <Text style={{fontWeight:'bold',fontSize:30,color:'#004'}}>-{item.end}</Text>
                               <Switch 
                                  // onValueChange={(value)=>this.setState({switch: value})}
                                  style={{marginRight:10}}
                                  onValueChange={(value)=>{
                                      fire.database().ref("users").child(this.state.id).child("workingHours").once('value',(snapshot)=>{
                                         // alert(Object.keys(snapshot.val())[0])
                                          fire.database().ref("users").child(this.state.id).child("workingHours").child(Object.keys(snapshot.val())[index]).child("enable").set(value)
                                      })
                                  }}
                                   value ={item.enable}
                               /> 
                               
                               </View>

                               <Text style={{color:"#AAAAAA"}}>{item.days}</Text> 
                               <Text style={{color:"#AAAAAA"}}>{item.selectedClinic}</Text> 

                                <Divider style={{backgroundColor:'#004'}}/>
                               
                            </View>
                          )
                      })}
                 </View>
                
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
  }
});

export default DoctorInfo;
