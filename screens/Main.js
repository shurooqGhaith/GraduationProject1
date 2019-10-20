import React from "react";
import {
  ImageBackground,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions
} from "react-native";
import { Block, Button, Text, theme } from "galio-framework";

const { height, width } = Dimensions.get("screen");

import argonTheme from "../constants/Theme";
import Images from "../constants/Images";
import {AsyncStorage} from 'react-native';
export default class Main extends React.Component{
  
    constructor(props){
        super(props);
        this.handleDr=this.handleDr.bind(this);
        this.handleP=this.handleP.bind(this);
        this._retrieveData=this._retrieveData.bind(this);
        this._storeData=this._storeData.bind(this);
        this.state={
            user:"user",
            d:""
        }
    }


    _storeData = async (data) => {
        try {
            if(this.state.user=="doctor"){
            await AsyncStorage.setItem('user', "doctor");
            }
            if(this.state.user=="patient"){
            await AsyncStorage.setItem('user', "patient");
            }
  
          } catch (error) {
            // Error saving data
            alert(error);
          }
      };
      _retrieveData = async () => {
        try {
          const value = await AsyncStorage.getItem('user');
          alert(value);
          if (value !== null) {
            // We have data!!
            console.log(value);
            this.setState({
                d:value
            })
          }
        } catch (error) {
          // Error retrieving data
        }
      };
    handleDr(){
      this.setState({
          user:"doctor"
      })
        this._storeData(this.state.user);
    }


    handleP(){
        this.setState({
            user:"patient"
        })
        this._storeData(this.state.user);

    }
    render(){
        return(
            <Block flex >
            <Block flex center>
            <ImageBackground
                source={Images.Pro}
                style={{ height, width, zIndex: 1}}
            />
            </Block>
            <Block>
                <Text>
                   state= {this.state.user} 
                   {this._retrieveData}
                   storage={this.state.d}
                </Text>
            </Block>
            <Block>
                <Button
                onPress={this.handleDr}
                 style={styles.button}>
                    <Text style={styles.textStyle}>Doctor</Text>
                </Button>
                <Button
                 onPress={this.handleP}
                 style={styles.button}>
                   <Text style={styles.textStyle}>Patient</Text> 
                </Button>
            </Block>
            </Block>

            

        )
    }
}

const styles =StyleSheet.create({
    button: {
        paddingTop:150,
        width: width - theme.SIZES.BASE * 4,
        height: theme.SIZES.BASE * 3,
        //shadowRadius: 0,
        //shadowOpacity: 0,
        backgroundColor:"#000000",
        opacity:0.5
      },
      textStyle:{
        color:"#ffffff"
      }
})