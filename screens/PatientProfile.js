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
const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

class PatientProfile extends React.Component {

  constructor(props){
    super(props);
    this.authListener=this.authListener.bind(this);
    
        this.state={
      user:[],
      username:"",
      from:'',
      to:'',
      
      id:'',
      closedAt:'',
      latitude:0,
      longitude:0,
      showmap:false
    };
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
                    <Text size={16} color="#32325D" style={{ marginTop: 10 }}>
                     patient
                    </Text>
                  </Block>
                  <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                    <Block style={styles.divider} />
                  </Block>
                  <Block middle>
                  
                    
                  
                    
                    

                    
                    
                    
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
