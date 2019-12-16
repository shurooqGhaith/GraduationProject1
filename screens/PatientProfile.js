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
  TouchableOpacity

} from "react-native";
import { Block, Text, theme } from "galio-framework";

import { Button } from "../components";
import { Images, argonTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import fire from "../constants/firebaseConfigrations";
import DateTimePicker from "react-native-modal-datetime-picker";
import MapView, { Marker } from "react-native-maps";
import { Divider, Header, Icon } from 'react-native-elements';
import { Appbar } from 'react-native-paper';

const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

class PatientProfile extends React.Component {

  constructor(props) {
    super(props);
    this.authListener = this.authListener.bind(this);
    this.state = {
      user: null,
      username: "",
      from: '',
      to: '',
      email: '',
      phone: '',
      phoneExist: false,
      id: '',
      closedAt: '',
      appointment: [],
      nodata: false,
      session: [],
      noSession: false,
      time: '',
      date: '',
      enableNotification: true,
      isVerified: false,

      changeAppColor: false,
      changeMakeAppColor: false,
      changeLocationColor: false,
      changeAgendaColor: false,
      changeCommunityColor:false,
      avatar: '',
      avatarExist: false
      //Images.initialProfilePicture

    };
  }

  componentDidMount() {
    this.authListener();
  }


  authListener() {

    let name, start, end, close;
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        if (user.emailVerified) {
          this.setState({ isVerified: true });
        } else {
          this.setState({ isVerified: false });
          user.sendEmailVerification().then(() => {
            console.log("sent");
            if (user.emailVerified) {
              this.setState({ isVerified: true });
            }

          }).catch(() => console.log("error"))
        }

        const id = user.uid;

        const today = new Date();
        const day = today.getDate();
        const dayName = today.getDay();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const date = day + '-' + month + '-' + year;

        fire.database().ref("users").child(id).on('value', (dataSnapshot) => {
          let appointment = [], nodata = true, session = [], noSession = true, avatarExist = false, phoneExist = false;

          if (dataSnapshot.val().appointment) {
            appointment = Object.values(dataSnapshot.val().appointment);
            nodata = false;
          }

          if (dataSnapshot.val().session) {
            session = Object.values(dataSnapshot.val().session);
            noSession = false;
          }

          if (dataSnapshot.val().avatar) {
            avatarExist = true;
          }

          if (dataSnapshot.val().phone) {
            phoneExist = true;
          }

          this.setState({
            id: id,
            date: date,
            user: dataSnapshot,
            username: dataSnapshot.val().name,
            email: dataSnapshot.val().email,
            appointment: appointment,
            nodata: nodata,
            session: session,
            noSession: noSession,
            avatar: dataSnapshot.val().avatar,
            avatarExist: avatarExist,
            phone: dataSnapshot.val().phone,
            phoneExist: phoneExist
          });
        });

      }//if user

      else {
        this.props.navigation.navigate("Login");
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
  
  <Block style={{ marginBottom: theme.SIZES.BASE,marginTop:70 }}>
  <Header
  backgroundColor='#fff'
  leftComponent={{ icon: 'home', color: '#172B4D' }}
  centerComponent={<Text style={{color:'#172B4D'}}></Text>}
  rightComponent={<Button small style={{backgroundColor:'#172B4D'}} small onPress={()=>fire.auth().signOut()}><Text style={{color:'#fff'}}>Logout</Text></Button>}
/>
            </Block>
  
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ width, marginTop: '25%' }}
              >

              {/* {!this.state.isVerified && <Block flex style={styles.profileCard}>

              <Block middle style={styles.avatarContainer}>
                    <Image
                      source={{ uri: this.state.avatar }}
                      style={styles.avatar}
                    />
                   <Block>
                     
                   <Block middle style={styles.nameInfo}>
                   <View style={{flexDirection:'column',marginTop:100}}>
                      
                      <Text bold size={15} color="#32325D" id="name">
                        Check your email inbox and verify your email 
                      </Text>
                      </View>
                    </Block>
                   </Block> 
                  </Block>

              </Block> } */}

                {/* {this.state.isVerified &&  */}
                <Block flex style={styles.profileCard}>
                  <Block middle style={styles.avatarContainer}>
                  {this.state.avatarExist &&<View><Image
                    source={{ uri: this.state.avatar}}
                    style={styles.avatar}
                  /></View>}
                 
                 {!this.state.avatarExist &&<View><Image
                    source={Images.initialProfilePicture}
                    style={styles.avatar}
                  /></View>}
                   <Block>

                   
                     
                   </Block> 
                  </Block>
                  <Block style={styles.info}>
                  <Text bold size={20} color="#32325D" style={{marginLeft:45}}>
                        {this.state.username}
                      </Text>
                    <Block
                      middle
                      row
                      space="evenly"
                      style={{ marginTop: 20, paddingBottom: 24 }}
                    >
                      <Button
                        small
                        style={{ backgroundColor: argonTheme.COLORS.INFO }}
                       onPress={()=> this.props.navigation.navigate("UpdateInfo",{id:this.state.id,type:'patient'})}
                      >
                        Edit
                      </Button>
                      <Button
                       // onPress={()=>this.props.navigation.navigate("Chat",{sender:this.state.id,name:this.state.username,email:this.state.email,receiver:"8HN5vu95CDd7Ez56XQg0c9U5mr63"})}
                        onPress={()=>this.props.navigation.navigate("Main",{sender:this.state.id,name:this.state.username,email:this.state.email,type:"patient"})}
                        small
                        style={{ backgroundColor: argonTheme.COLORS.DEFAULT }}
                      >
  
                        MESSAGE 
                      </Button>
                    </Block>
                    
                  </Block>
  
                  <Block flex>
                    <Block middle style={styles.nameInfo}>
                   
                    <View  style={{flexDirection:'column',marginTop:5}}>
                    <Text  style={{color:'#aaa'}} >Email:</Text>
                    <Text  size={15} color="#32325D" > {this.state.email}</Text>
                    <Divider style={{backgroundColor:'#E9ECEF',marginTop:10,width:width*0.6}}/>
                    {this.state.phoneExist && <View>
                      <Text  style={{color:'#aaa'}} > Phone Number:</Text>
                    <Text  size={15} color="#32325D" > {this.state.phone}</Text>
                    </View>}
                    </View>
                      
                     
                    </Block>
                    <Block middle style={{marginTop: 30}}>
                     
                      
                     
                    </Block>
                    <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                      <Block style={styles.divider} />
                    </Block>
                    <Block >
                    <View style={{flexDirection:'row',flexWrap:'wrap'}} >
                    <View style={styles.iconButton1}>
                     <Icon type='material-community' name={ 'account-clock'} size={52}   color={this.state.changeAppColor?'#B71C1C':'#172B4D'}
                     onPress={() => {
                      this.setState({changeAppColor:!this.state.changeAppColor});
                 setTimeout(function(){
                        this.setState({changeAppColor:!this.state.changeAppColor});
                        this.props.navigation.navigate("MyPanel",{idPatient:this.state.id})
                         }.bind(this),1000);
                     }}
                       />
                <Text style={{paddingHorizontal:20,paddingVertical:10}}  color='#aaa'>Sessions Info.</Text>
                 </View>

                 <View style={styles.iconButton1}>
                <Icon type='material-community' name={ 'alarm-plus'} size={52}   color={this.state.changeMakeAppColor?'#B71C1C':'#172B4D'}
                     onPress={() =>{
                      this.setState({changeMakeAppColor:!this.state.changeMakeAppColor});
                 setTimeout(function(){
                        this.setState({changeMakeAppColor:!this.state.changeMakeAppColor});
                        this.props.navigation.navigate("Search",{idPatient:this.state.id})
                         }.bind(this),1000);
                     }}
                     
                />
                <Text style={{paddingHorizontal:5,paddingVertical:10}} color='#aaa'>Make appointment</Text>
                 </View>  
                        
                        <View style={styles.iconButton1}>
                <Icon type='material-community' name={ 'map-marker-multiple'} size={52}   color={this.state.changeLocationColor?'#B71C1C':'#172B4D'}
                     onPress={() => {
                      this.setState({changeLocationColor:!this.state.changeLocationColor});
                 setTimeout(function(){
                        this.setState({changeLocationColor:!this.state.changeLocationColor});
                        this.props.navigation.navigate("ShowAllLocation",{id:this.state.id})
                         }.bind(this),1000);
                     }}
                />
                <Text style={{paddingHorizontal:35,paddingVertical:10}} color='#aaa'>Location</Text>
                 </View>
                 <View style={styles.iconButton1}>
                 <Icon type='material-community' name={ 'calendar-multiselect'} size={52}  color={this.state.changeAgendaColor?'#B71C1C':'#172B4D'}

                     onPress={() =>{
                      this.setState({changeAgendaColor:!this.state.changeAgendaColor});
                 setTimeout(function(){
                        this.setState({changeAgendaColor:!this.state.changeAgendaColor});
                        this.props.navigation.navigate("Agenda",{idPatient:this.state.id})
                         }.bind(this),1000);
                     }}
                     
                />
                <Text style={{paddingHorizontal:35,paddingVertical:10}} color='#aaa'>Agenda</Text>
                 </View>


                 <View style={styles.iconButton1}>
                        <Icon type='material-community' name={'cloud-question'} size={52} color={this.state.changeCommunityColor ? '#B71C1C' : '#172B4D'}

                          onPress={() => {
                            this.setState({ changeCommunityColor: !this.state.changeCommunityColor });
                            setTimeout(function () {
                              this.setState({ changeCommunityColor: !this.state.changeCommunityColor });
                              this.props.navigation.navigate("Questions", { user: this.state.user })
                            }.bind(this), 1000);
                          }}

                        />
                        <Text style={{ paddingHorizontal: 20,paddingVertical:10 }} color='#aaa'>Community</Text>
                      </View>
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
                                        
                    </Block>
                  </Block>
                </Block>
                {/* } */}
              </ScrollView>
            </ImageBackground>
          </Block>
          
        </Block>
    );

  }
}

const styles = StyleSheet.create({
  iconButton1: {
    flexDirection: 'column',
    marginLeft: 10,
    marginTop: 5,
    // justifyContent:'space-between',
    height: height * 0.171,
    paddingTop: 25,
    borderColor: '#172B4D',
    borderWidth: 1,
    // paddingRight:18,
    borderRadius: 20,
    width: width * 0.361,
    //alignItems:'center',
    backgroundColor: "#fff",
  },
  bottom: {
    position: 'absolute',
    backgroundColor: '#333',
    width: width,
    height: 30,
    left: 0,
    right: 0,
    bottom: 0,
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

export default PatientProfile;