import React from "react";
import {
  ImageBackground,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions
} from "react-native";
import { Block, Button, Text, theme } from "galio-framework";
import fire from "../constants/firebaseConfigrations";
const { height, width } = Dimensions.get("screen");
import PatientProfile from "../screens/PatientProfile";

import argonTheme from "../constants/Theme";
import Images from "../constants/Images";

class Onboarding extends React.Component {
  
  state={
    authenticated:false
  }
  
  componentDidMount(){
    var id;
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({  authenticated: true });
         id=user.uid;
       //console.log(id);
        fire.database().ref("users").child(id).child("type").on('value',(snap)=>{
          if(snap.val()=="patient"){
            this.props.navigation.navigate('PatientProfile');
          }
          if(snap.val()=="doctor"){
            this.props.navigation.navigate("Profile");
          }
        })
      //  console.log(user);
        
      } else {
        this.setState({ authenticated: false });
      }
    });
  }

  render() {
    const { navigation } = this.props;

    // if (this.state.authenticated) {
    //   return <PatientProfile/>;
    // }
    
    return (
      <Block flex style={styles.container}>
        <StatusBar hidden />
        <Block flex center>
        <ImageBackground
            source={Images.Onboarding}
            style={{ height, width, zIndex: 1 }}
          />
        </Block>
        <Block center>
          {/* <Image source={Images.dentalLogo} style={styles.logo} /> */}
        </Block>
        <Block flex space="between" style={styles.padded}>
            <Block flex space="around" style={{ zIndex: 2 }}>
              <Block style={styles.title}>
                <Block>
                  <Text color="white" size={60}>
                    Dental
                  </Text>
                </Block>
                <Block>
                  <Text color="white" size={60}>
                    Clinic
                  </Text>
                </Block>
                <Block style={styles.subTitle}>
                  <Text color="white" size={16}>
                    Fully Dental Clinic System.
                  </Text>
                </Block>
              </Block>
              <Block center>
                <Button
                  style={styles.button}
                  color={argonTheme.COLORS.SECONDARY}
                  onPress={() => navigation.navigate("Login")}
                  textStyle={{ color: argonTheme.COLORS.BLACK }}
                >
                  Get Started
                </Button>
              </Block>
          </Block>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.BLACK
  },
  padded: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    position: "relative",
    bottom: theme.SIZES.BASE,
    zIndex: 2,
  },
  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0
  },
  logo: {
    width: 200,
    height: 60,
    zIndex: 2,
    position: 'relative',
    marginTop: '-50%'
  },
  title: {
    marginTop:'-5%'
  },
  subTitle: {
    marginTop: 20
  }
});

export default Onboarding;
