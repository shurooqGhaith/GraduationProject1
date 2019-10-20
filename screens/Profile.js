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

class Profile extends React.Component {

  constructor(props){
    super(props);
    this.authListener=this.authListener.bind(this);
        this.state={
          modalVisible: false,
      user:[],
      workingHours:[],
      username:"",
      clinicName:[],
      from:"",
      to:"",
      id:"",
      closedAt:"",
      latitude:0,
      longitude:0,
      showmap:false,
      nodata:false,
      Specialization:'',
      patientInfo:[]
      
    }
  }

  componentDidMount(){
    this.authListener();
    //this.getLocation();
  }

  getLocation(){
    navigator.geolocation.getCurrentPosition(position=> {
      this.setState({
        latitude:position.coords.latitude,
        longitude:position.coords.longitude
      })

      },
      error=>alert(error.message),
      {enableHighAccuracy:true,timeout:20000,maximumAge:2000}
      );
  }
  showMap(){
     this.setState({
       showmap:true
     })
  }
  authListener(){
  
    const { navigation } = this.props;  
    var id=navigation.getParam('id');
    var name,start,end,close;
  
     this.setState({
         id:id
     })
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
    

  fire.database().ref("users").child(id).child("clinicName").on('value',(datasnapshot) =>{
    let nameClinic = Object.values(datasnapshot.val());
    this.setState({clinicName:nameClinic})
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
      nodata:true
    })
  }
  
})
  }


  setModalVisible(visible) {
    this.setState({modalVisible: visible});
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
                      onPress={()=> this.props.navigation.navigate("DoctorInfo",{id:this.state.id})}
                    >
                      Edit
                    </Button>
                    <Button
                      small
                      style={{ backgroundColor: argonTheme.COLORS.DEFAULT }}
                    >

                      MESSAGE 
                    </Button>
                  </Block>
                  
                </Block>

                <Block flex>
                  <Block middle style={styles.nameInfo}>
                  <View style={{flexDirection:'column'}}>
                    <Text bold size={16} color="#000000" id="name">
                      {this.state.username}
                    </Text>

                    <Text bold size={16} color="#000000" id="Specialization">
                      {this.state.Specialization}
                    </Text>

                    </View>
                    <View  style={{ marginTop: 10,flexDirection:'column' }}>
                     {this.state.clinicName.map((value,ind)=>{
                       return(
                         <Text>{value.clinic}</Text>
                       )
                     })}
                    </View>


                  </Block>
                  <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                  <Button style={{width:width*0.5,backgroundColor:"#00897B"}}
                  onPress={()=> this.props.navigation.navigate("DoctorInfo",{id:this.state.id})}
                  >
                       Working hours
                  </Button>
                    <Block style={styles.divider} />
                  </Block>
                  <Block middle>
                    

                    
                  <View >
                  {!this.state.nodata && this.state.workingHours.map((item,index)=>{
                     //var d=item.days.split("-");
                     if(item.enable){
                       var i=0;
                      //var len=d.length;
                      
                         return(
                          <View key={index} style={{flexDirection:'column'}}>
                         
                          <Text style={{color:'#000'}}>{item.days}</Text>
                          <Text style={{color:'#888'}}>-{item.selectedClinic}</Text>
                          <View style={{flexDirection:'row'}}>

                          <Text style={{color:'#888'}}>{item.start}</Text>
                          <Text style={{color:'#888'}}>-{item.end}</Text>
                          </View>
                          <Divider style={{backgroundColor:'#000000',marginTop:10}}/>

                         </View>

                         )
                         
                      
                     
                     }
                   })}
                    </View>
                    
                    
                    
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
                      
                      onPress={()=>this.props.navigation.navigate("DoctorAppointment",{id:this.state.id})}//show patient name
                      color="transparent"
                      textStyle={{
                        color: "#233DD2",
                        fontWeight: "500",
                        fontSize: 16
                      }}
                    >
                       Patients
                    </Button>
                  <Button
                      
                      style={{marginTop:20}}
                      // create an Article
                      color="transparent"
                      textStyle={{
                        color: "#233DD2",
                        fontWeight: "500",
                        fontSize: 16
                      }}
                    >
                       create an Article
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

export default Profile;