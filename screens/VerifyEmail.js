import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  View,
  Picker,
  ScrollView,
  
} from "react-native";
import { Block, Checkbox, Text, theme } from "galio-framework";

import { Button, Icon, Input } from "../components";
import { Images, argonTheme } from "../constants";
import fire from "../constants/firebaseConfigrations";
import * as Facebook from 'expo-facebook';

const { width, height } = Dimensions.get("screen");


const user=fire.auth().currentUser;
class EmailVerify extends React.Component {
   

  constructor(props){
    super(props);
    this.authListener=this.authListener.bind(this);
    this.send=this.send.bind(this);
    this.state={
        modalVisible:false,
        username:[],
        id:'',
       isVerified:false,

    }
  }
  
  componentDidMount(){ 
    this.authListener();
  }

  
  authListener(){
    
   // var user =fire.auth().currentUser;
    this.setState({username:user});
    if(user != null){
      if(user.emailVerified){
          alert("email verified");
          this.setState({isVerified:true})
      }
      else{
        alert("email not verified");
        this.setState({isVerified:false})

      }
    }
    }

   send(){

    user.sendEmailVerification().then(()=>{
        alert("verification sent");
      }).catch((error)=>{
          alert("error");
      })
   } 

   

    
 
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

                    
                          {this.state.emailVerified && <Text style={{color:'#000'}}>
                              email is verified
                          </Text>

                          }
                          

                     <Button onPress={this.send}><Text>Send</Text></Button>
                     
                    

                    
                    </Block>
                    

                    <Block middle>
                     
                   
                    </Block>


                   
                    <Block middle>
                      
                      
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

export default EmailVerify;
