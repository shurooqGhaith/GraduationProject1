import React from "react";
import {
  ImageBackground,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
  FlatList,
  TouchableOpacity
} from "react-native";
import { Block, Button, Text, theme } from "galio-framework";
import { Divider } from 'react-native-elements';
import fire from "../constants/firebaseConfigrations";
import argonTheme from "../constants/Theme";
import Images from "../constants/Images";

const { height, width } = Dimensions.get("screen");

export default class Main extends React.Component{
  
    constructor(props){
        super(props);
        this.state={
            senderID:'',
            name:'',
            email:'',
            type:'',
            users:[],
            nodata:true
        }
    }

    componentDidMount(){
      const { navigation } = this.props;  
      var id=navigation.getParam('sender');
      var name=navigation.getParam('name');
      var email=navigation.getParam('email');
      var type=navigation.getParam('type');
      this.setState({
            senderID:id,
            name:name,
            email:email,
            type:type
      })
       var array=[];
      if(type=="doctor"){
        fire.database().ref("users").child(senderID).child("patients").on('value',(snap)=>{
          if(snap.val()){
            let names = Object.values(snap.val());
            this.setState({users:names});
            this.state.users.map((value,index)=>{
               fire.database().ref("users").child(value.idPatient).child("name").on('value',(data)=>{
                 var n=data.val();
                 array.push({id:value.idPatient,name:n});
               })
            })

          }
        })

        this.setState({
          users:array,
          nodata:false
        })
      }
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
                {!this.state.nodata && this.state.users.map((item,index)=>{
                  return(
                    <View style={{marginTop:10}}>
                    <TouchableOpacity
                         style={styles.button}
                         onPress={()=>this.props.navigation.navigate("Chat",{sender:this.state.senderID,name:this.state.name,email:this.state.email,receiver:item.id,nameR:item.name})}
                          >
                        <Text> {item.name} </Text>
                      </TouchableOpacity>
                      <Divider style={{backgroundColor:'#000000',width:width*0.1}}/>
                      </View>
                  )
                })}
            </Block>
            <Block>
                
            </Block>
            </Block>

            

        )
    }
}

const styles =StyleSheet.create({
   
      button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10
      },
     
      textStyle:{
        color:"#ffffff"
      }
})