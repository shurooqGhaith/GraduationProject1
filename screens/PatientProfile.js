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
import MapView,{Marker} from "react-native-maps";
import { Divider,Header } from 'react-native-elements';
import { Appbar } from 'react-native-paper';

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
      email:'',
      id:'',
      closedAt:'',
      appointment:[],
      nodata:false,
      session:[],
      noSession:false,
      time:'',
      date:'',
      enableNotification:true,
      isVerified:false
    };
  }

  componentDidMount(){
    this.authListener();
  }




  authListener(){
  
   var name,start,end,close;
  //  var user =fire.auth().currentUser;
   fire.auth().onAuthStateChanged((user)=>{
      if(user){
        if(user.emailVerified){
          this.setState({isVerified:true});
       }
       else{
        this.setState({isVerified:false});
         user.sendEmailVerification().then(()=>{
           console.log("sent");
          if(user.emailVerified){
          this.setState({isVerified:true});
       }
       
         }).catch(()=>console.log("error"))
       }
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
  
    fire.database().ref("users").child(id).child("email").on('value',datasnapshot =>{
      e=datasnapshot.val();//
     this.setState({
         email:datasnapshot.val()
     })
   })
  
   var today=new Date();
   const day   = today.getDate();
   const dayName=today.getDay();
   const  month = today.getMonth()+1;
   const  year  = today.getFullYear();
  
      this.setState({
          date:day+'-'+month+'-'+year
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
  
      }//if user

      else{
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
    leftComponent={{ icon: 'home', color: '#000' }}
    centerComponent={<Text style={{color:'#000'}}>{this.state.username}</Text>}
    rightComponent={<TouchableOpacity style={{backgroundColor:'#fff'}} small onPress={()=>fire.auth().signOut()}><Text style={{color:'#000'}}>Logout</Text></TouchableOpacity>}
  />
            </Block>
  
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ width, marginTop: '25%' }}
              >

              {!this.state.isVerified && <Block flex style={styles.profileCard}>

              <Block middle style={styles.avatarContainer}>
                    <Image
                      source={{ uri: Images.ProfilePicture }}
                      style={styles.avatar}
                    />
                   <Block>
                     
                   <Block middle style={styles.nameInfo}>
                   <View style={{flexDirection:'column'}}>
                      <Text bold size={10} color="#32325D" id="name">
                        Your email is not verified 
                      </Text>
                      <Text bold size={10} color="#32325D" id="name">
                        check your email inbox and verify your email 
                      </Text>
                      </View>
                    </Block>
                   </Block> 
                  </Block>

              </Block> }

                {this.state.isVerified && <Block flex style={styles.profileCard}>
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
                    <View  style={{flexDirection:'column'}}>
                    <Text bold style={{color:'#aaa'}}>Name:</Text>
                    <Text bold size={15} color="#32325D" > {this.state.username}</Text>
                    <Text bold style={{color:'#aaa'}} >Email:</Text>
                    <Text bold size={15} color="#32325D" > {this.state.email}</Text>

                    </View>
                      
                     
                    </Block>
                    <Block middle style={{marginTop: 30}}>
                     
                      
                     
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
                   
                    
                    <View style={{marginLeft:60}}>
                    <Button
                     onPress={() => this.props.navigation.navigate("MyPanel",{idPatient:this.state.id})}
                     color="transparent"
                        style={{width:width*0.5}}
                        textStyle={{
                          color: "#233DD2",
                          fontWeight: "500",
                          fontSize: 16
                        }} >
                          
                          <Text >
                             Appointments
                          </Text>
                    </Button>
                     </View>
                     <View style={{marginLeft:60,marginTop:10}}>
                    <Button
                     onPress={() => this.props.navigation.navigate("Search",{idPatient:this.state.id})}
                     color="transparent"
                        style={{width:width*0.5}}
                        textStyle={{
                          color: "#233DD2",
                          fontWeight: "500",
                          fontSize: 16
                        }} >
                          
                          <Text >
                            make an appointment
                          </Text>
                    </Button>
                     </View>
                     <View style={{marginLeft:60,marginTop:10}}>
                    <Button
                     onPress={() => this.props.navigation.navigate("ShowAllLocation",{id:this.state.id})}
                     color="transparent"
                        style={{width:width*0.5}}
                        textStyle={{
                          color: "#233DD2",
                          fontWeight: "500",
                          fontSize: 16
                        }} >
                          
                          <Text>
                           location
                          </Text>
                    </Button>
                    </View>
                    </Block>
                  </Block>
                </Block>
                }
              </ScrollView>
            </ImageBackground>
          </Block>
          
        </Block>
      );

      
    
    
  }
}

const styles = StyleSheet.create({
  bottom: {
    position: 'absolute',
    backgroundColor:'#333',
    width:width,
    height:30,
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
