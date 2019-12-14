import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  ToastAndroid
} from "react-native";
import { Button,Block, Checkbox, Text, theme } from "galio-framework";
import { Notifications } from 'expo';


import {  Icon, Input } from "../components";
import { Images, argonTheme } from "../constants";
import fire from "../constants/firebaseConfigrations";
const { width, height } = Dimensions.get("screen");
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

class Login extends React.Component {


    constructor(props){
        super(props);
        this.handleLogin=this.handleLogin.bind(this);
        this.state={
            email:'',
            password:'',
            errorMessage:null,
            isShow:false,
            notification:{},
        }
    }


    componentDidMount() {
      this._notificationSubscription = Notifications.addListener(this._handleNotification);
      
      
    }
    async getDeviceNotificationToken(user_id){


      let token = await Notifications.getExpoPushTokenAsync();
      console.log("hi there this is my device tokennnnnn")
    
      //console.log(token)
      //alert("we took your token");
    
    return token
    }


    _handleNotification = (notification) => {

///هون حنحط فيها جملة navigation بس نصور

    
    };


    
     async handleLogin(){
      var name;
      fire.auth()
    .signInWithEmailAndPassword(this.state.email.trim(), this.state.password)
    .then(async () =>  //this.props.navigation.navigate('Profile')
      {
      var user=fire.auth().currentUser;
      var id= user.uid;
      fire.database().ref("users").child(id).child("type").on('value',function(datasnapshot){
        //alert(datasnapshot.val());
        name=datasnapshot.val();
   
      });
      this.setState({errorMessage:''});
      if(name ==="doctor"){
        
        
        let token = await this.getDeviceNotificationToken(user_id=id)
        fire.database().ref("users").child(user_id).child("token").set(token);
        
        this.props.navigation.navigate('Profile',{id:id})

    
    }
      if(name =="patient"){
        let token = await this.getDeviceNotificationToken(user_id=id)
        fire.database().ref("users").child(user_id).child("token").set(token);
        
        
        
        this.props.navigation.navigate('PatientProfile')

    
    }
    })
    .catch((error)=> { 
      this.setState({errorMessage:error.message,isShow:true});
      setTimeout(function(){
        this.setState({isShow:false});
   }.bind(this),5000);
      
    })
    }

  render() {
    const { navigation } = this.props;
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
                
                <Text color="#8898AA" size={12}>Login</Text>
              </Block>
              <Block flex>
                
                <Block flex center>
                  <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior="padding"
                    enabled
                  >
                    <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                      <Input
                        borderless
                        placeholder="Email"
                        onChangeText={email => this.setState({ email })}
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
                        onChangeText={password => this.setState({ password })}
                        value={this.state.password}
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
                    
                    <Block middle>
                      <Button color="success"
                      onPress={this.handleLogin}
                       style={styles.createButton}>
                        <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                          Login
                        </Text>
                      </Button>
                    </Block>
                    <Block middle>
                          <Text color="#aaa" style={{marginTop:20}} >OR</Text>
                          </Block>
                    <Block middle>
                      <Button
                       onPress={() => navigation.navigate("Account")}
                       color="primary" style={styles.createButton} >
                        <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                          Sign up
                        </Text>
                      </Button>
                    </Block>
                    
                    <Toast visible={this.state.isShow} message={this.state.errorMessage}/>
                  </KeyboardAvoidingView>
                </Block>
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
    ////******* */
    borderRadius:15
  }
});

export default Login;
