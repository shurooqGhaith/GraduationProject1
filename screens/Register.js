import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  View,
  CheckBox,
  ScrollView,
  TouchableOpacity ,
  ToastAndroid
} from "react-native";
import { Block, Checkbox, Text, theme } from "galio-framework";

import { Button, Icon, Input } from "../components";
import { Images, argonTheme } from "../constants";
import fire from "../constants/firebaseConfigrations";
import * as Facebook from 'expo-facebook';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Notifications } from 'expo';


const Toast = (props) => {
  if (props.visible) {
    ToastAndroid.showWithGravityAndOffset(
      props.message,
      ToastAndroid.LONG,
      ToastAndroid.TOP,
      25,
      50,
    );
    return null;
  }
  return null;
};
const { width, height } = Dimensions.get("screen");



class Register extends React.Component {
   

  constructor(props){
    super(props);
    this.handleSignup=this.handleSignup.bind(this);
    this.handleLoginWithFacebook=this.handleLoginWithFacebook.bind(this);
    this.authListener=this.authListener.bind(this);
    this.state={
      username:'',
      email:'',
      password:'',
      errorMessage:null,
      checked:false,
      isShow:false,
      uploaded:'',
      photo:'',
      checkedP:false

        }
  }
  
  componentDidMount(){ 
    this.getPermissionAsync();
    this.authListener();
  }



  async getDeviceNotificationToken(user_id){


    let token = await Notifications.getExpoPushTokenAsync();
   // console.log("hi there this is my device tokennnnnn")

   // console.log(token)
  //  alert("Done");
    //alert(token);

//        fire.database().ref("users").child(user_id).child("token").update(token);


  return token
}
  authListener(){
    fire.auth().onAuthStateChanged((user)=>{
      if(user){//this.props.navigation.navigate('Home')
      fire.auth().signOut();
    }
      else{this.setState({user:null})}
    }
  
    );
  
    }
  // handleLogin(){
  //   fire.auth()
  //   .signInWithEmailAndPassword(this.state.email.trim(), this.state.password)
  //   .then(() => this.props.navigation.navigate('Profile'))
  //   .catch(function(error) { alert(error.message)})
  // }


  async handleSignup(){
    var id;
    var token = await this.getDeviceNotificationToken()

   fire.auth().createUserWithEmailAndPassword(this.state.email.trim(),this.state.password)//trim remove white spaces
   .then(() =>{ 
    id=fire.auth().currentUser.uid;
    fire.database().ref("users").child(id).child("name").set(this.state.username.toLowerCase());
    fire.database().ref("users").child(id).child("email").set(this.state.email.trim());
    fire.database().ref("users").child(id).child("id").set(id);
    fire.database().ref("users").child(id).child("avatar").set(this.state.photo);
    if(this.state.checked){
      fire.database().ref("users").child(id).child("type").set("doctor");
      fire.database().ref("users").child(id).child("token").set(token);

      this.props.navigation.navigate('ClinicName');
    }
    else{
      fire.database().ref("users").child(id).child("type").set("patient");
      fire.database().ref("users").child(id).child("token").set(token);

      this.props.navigation.navigate('PatientProfile');
    }
    
   }
   )
   
   .catch((error)=> {
    this.setState({errorMessage:error.message,isShow:true});
    setTimeout(function(){
      this.setState({isShow:false});
 }.bind(this),8000);
   });

  }


 async handleLoginWithFacebook(){
   
  const { type, token } = await Facebook.logInWithReadPermissionsAsync('951872101816416', { permissions: ['public_profile'] })

  if (type === 'success') {

    const credential = fire.auth.FacebookAuthProvider.credential(token)
     //alert(type);
     //alert("1");
    fire.auth().signInWithCredential(credential).catch((error) => {
      alert(error)
    })
  }
  else {
   // alert(type);
  }
  }
  getPermissionAsync = async () => {
  
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
    }
  
}

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });
  
    //console.log(result);
     
    if (!result.cancelled) {
      this.setState({ photo: result.uri,uploaded:'Avatar is Uploaded ' });
    }
    
  };
  render() {
    return (
      <Block flex middle>
        <StatusBar hidden />
        <ImageBackground
          source={Images.RegisterBackground}
          style={{ width, height, zIndex: 1 }}
        >
          <Block flex middle>
            <Block style={styles.registerContainer}>
              <Block flex={0.25} middle style={styles.socialConnect}>
                <Text color="#8898AA" size={12}>
                  Sign up 
                </Text>
                
              </Block>
              <Block flex>
                
                <ScrollView 
                showsVerticalScrollIndicator={false}
                style={{ width:width*0.9, marginTop: '25%' }}
                >
                <Block flex center>
                  <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior="padding"
                    enabled
                  >
                    <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                      <Input
                        borderless
                        placeholder="Name"
                        onChangeText={username => this.setState({username})}
                        iconContent={
                          <Icon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name="hat-3"
                            family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                        }
                      />
                    </Block>
                    

                    <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                      <Input
                        borderless
                        placeholder="Email"
                        onChangeText= {email => this.setState({ email })}
                        value={this.state.email}
                        iconContent={
                          <Icon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name="ic_mail_24px"
                            family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                        }
                      />
                    </Block>
                    <Block width={width * 0.8}>
                      <Input
                        password
                        borderless
                        placeholder="Password"
                        value={this.state.password}
                        onChangeText={password => this.setState({ password })}
                        iconContent={
                          <Icon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name="padlock-unlocked"
                            family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                        }
                      />
                        
                    </Block>
                    <Block width={width * 0.8}>
                    <TouchableOpacity
                     style={{backgroundColor:'#004ff3',height:40,padding:5,borderRadius:10}}
                     onPress={this._pickImage}>
                       <Text color="#fff" style={{paddingLeft:width*0.2,paddingTop:5}}>{this.state.uploaded || "Upload profile picture"}</Text>
                     </TouchableOpacity>
                        
                    </Block>
                    
                    <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                    <View style={{ flexDirection: 'row' }}>
                     <CheckBox
                           value={this.state.checked}
                           onValueChange={() => this.setState({ checked: !this.state.checked })}
                            />
                     <Text style={{marginTop: 5}}> Doctor</Text>
                     <View style={{ flexDirection: 'row',marginLeft:40 }}>
                     <CheckBox
                           value={this.state.checkedP}
                           onValueChange={() => this.setState({ checkedP: !this.state.checkedP })}
                            />
                     <Text style={{marginTop: 5}}> Patient</Text>
                     </View>
                     <Toast visible={this.state.isShow} message={this.state.errorMessage}/>


                       </View>
                    </Block>

                    <Block middle>
                    
                    </Block>


                    {/* <Block middle>
                      <Button
                       onPress={()=>this.props.navigation.navigate("Login")}
                       color="success" 
                       style={styles.createButton}>
                        <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                          Login
                        </Text>
                      </Button>
                    </Block> */}
                    <Block middle>
                      
                      <Button
                        style={styles.createButton}
                        color="success"
                        onPress={this.handleSignup}
                      >
                      <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                        Sign up
                      </Text>  
                      </Button>
                    </Block>
                    
                  </KeyboardAvoidingView>
                </Block>
                </ScrollView>
              </Block>
            </Block>
          </Block>
        </ImageBackground>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  registerContainer: {
    width: width * 0.9,
    height: height * 0.78,
    backgroundColor: "#F4F5F7",
    borderRadius: 4,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: "hidden"
  },
  socialConnect: {
    backgroundColor: argonTheme.COLORS.WHITE,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#8898AA"
  },
  socialButtons: {
    width: 120,
    height: 40,
    backgroundColor: "#fff",
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1
  },
  socialTextButtons: {
    color: argonTheme.COLORS.PRIMARY,
    fontWeight: "800",
    fontSize: 14
  },
  inputIcons: {
    marginRight: 12
  },
  passwordCheck: {
    paddingLeft: 15,
    paddingTop: 13,
    paddingBottom: 30
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25,
    borderRadius:15
  }
});

export default Register;