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
  TextInput
} from "react-native";
import { Block, Checkbox, Text, theme } from "galio-framework";
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from 'firebase';
import { Button as ComponentButton, Input } from "../components";
import { Images, argonTheme } from "../constants";
import fire from "../constants/firebaseConfigrations";
import Panel from 'react-native-panel';
 
const { width, height } = Dimensions.get("screen");



class UpdateInfo extends React.Component {
   

  constructor(props){
    super(props);
    this.authListener=this.authListener.bind(this);
    this.edit=this.edit.bind(this);
    this.update=this.update.bind(this);
    this.reauthenticate=this.reauthenticate.bind(this);
    this.changePassword=this.changePassword.bind(this);
    this.changeEmail=this.changeEmail.bind(this);
    this.state={
        id:'',
        type:'',
      username:'',
      email:'',
      password:'',
      errorMessage:null,
      checked:false,
      nameEnable:false,
      emailEnable:false,
      currentPassword:'',
      newPassword:''
    }
  }
  
  componentDidMount(){ 
    this.authListener();
  }
  authListener(){
    
    const { navigation } = this.props;  
    var id=navigation.getParam('id');
    var type=navigation.getParam('type');
    this.setState({
        id:id,
        type:type
    })
    if(type=='patient'){
        fire.database().ref("users").child(id).child("name").on('value',(name)=>{
            this.setState({username:name.val()})
        })
        fire.database().ref("users").child(id).child("email").on('value',(email)=>{
            this.setState({email:email.val()})
        })


    }
   
  
    }
  

    reauthenticate = (currentPassword) => {
        var user = fire.auth().currentUser;
        var cred = firebase.auth.EmailAuthProvider.credential(
            user.email, currentPassword);
        return user.reauthenticateWithCredential(cred);
        
      }

    edit(){
        this.setState({
            nameEnable:true,
            emailEnable:true
        })
    }
    changePassword(){

        this.reauthenticate(this.state.currentPassword).then(() => {
            var user = fire.auth().currentUser;
            user.updatePassword(this.state.newPassword).then(() => {
             alert("Password updated!");
            }).catch((error) => { alert(error); });
          }).catch((error) => {alert(error); });
    }
    changeEmail = () => {
        this.reauthenticate(this.state.currentPassword).then(() => {
          var user = fire.auth().currentUser;
          user.updateEmail(this.state.email).then(() => {
            alert("Email updated!");
          }).catch((error) => { alert(error); });
        }).catch((error) => { alert(error); });
      }

    update(){
       // alert("name:"+this.state.username+"\n"+"-email:"+this.state.email)
       

       fire.database().ref("users").child(this.state.id).child("name").set(this.state.username).then(()=>{
        // fire.database().ref("users").child(this.state.id).child("email").set(this.state.email);
        alert("Updated successfully !")
       }).catch((error)=>alert("an error happened !"))

    }
    

  render() {
    return (
      <Block flex middle>
        <StatusBar hidden />
        
          <Block flex middle>
            <Block >
              <Block flex={0.25} middle >
                <Text  size={12}>
                  Your Information
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
                    <Block width={width * 0.8} style={{ marginBottom: 15}}>
                    <View style={{flexDirection:'row'}}>
                      <TextInput
                        placeholder="Name"
                        value={this.state.username}
                        onChangeText={username => this.setState({username})}
                        style={styles.TextInputStyle}
                        //editable={this.state.nameEnable}
                       // underlineColorAndroid='transparent' 
                      />
                           <View style={{marginLeft:20}}>
                           <ComponentButton
                           small
                           style={{backgroundColor:'#333'}}
                           onPress={this.update}
                      >
                      <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                        Save
                      </Text>  
                      </ComponentButton>
                      </View>
                      </View>
                      
                    </Block>
                    

                    <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                    <View style={{flexDirection:'row'}}>

                      <TextInput
                       
                        placeholder="Email"
                        onChangeText= {email => this.setState({ email })}
                        value={this.state.email}
                        style={styles.TextInputStyle}
                        //  editable={this.state.emailEnable}
                       // underlineColorAndroid='transparent' 
                      />
                      <View style={{marginLeft:20}}>
                      <ComponentButton
                           small
                           style={{backgroundColor:'#333'}}
                           onPress={this.changeEmail}
                      >
                      <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                        Save
                      </Text>  
                      </ComponentButton>
                      </View>
                      </View>
                    </Block>

                    <Block width={width * 0.8}>
                    
                      <TextInput
                        secureTextEntry={true}
                        autoCapitalize="none"
                        placeholder="Current Password"
                        value={this.state.currentPassword}
                        onChangeText={password => this.setState({currentPassword: password })}
                        style={styles.TextInputStyle}
                      />
                        
                    
                      <TextInput
                        secureTextEntry={true}
                        autoCapitalize="none"
                        placeholder="New Password"
                        value={this.state.newPassword}
                        onChangeText={password => this.setState({newPassword: password })}
                        style={styles.TextInputStyle}
                      />
                        <ComponentButton
                           small
                           style={{backgroundColor:'#333'}}
                           onPress={this.changePassword}
                      >
                      <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                        Save
                      </Text>  
                      </ComponentButton>
                    </Block>
                    

                    
                    
                    
                  </KeyboardAvoidingView>
                </Block>
                </ScrollView>
              </Block>
            </Block>
          </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
    firstHeader: {
        marginHorizontal: 10,
        backgroundColor: 'gray',
        alignItems: 'center',
        justifyContent: 'center',
        // borderRadius: 15,
        height: 50,
      },
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
    //overflow: "hidden"
  },
  firstHeaderContainer:{
      backgroundColor:'#ccc',
      overflow:"hidden",
      height:height*0.5
  },
  TextInputStyle: {  
    textAlign: 'center',  
    height: 40,  
    // borderRadius: 10,  
    // borderWidth: 2,  
    // borderColor: '#009688',  
    marginBottom: 10  
}  ,
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
    borderRadius:15,
  }
});

export default UpdateInfo;