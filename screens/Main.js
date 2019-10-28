import React from "react";
import {
  ImageBackground,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
  FlatList,
  TouchableOpacity,
  View
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
        this.authListener=this.authListener.bind(this);
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
      this.authListener();
    }



    authListener(){
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
        fire.database().ref("users").child(id).child("patients").on('value',(snap)=>{
          if(snap.val()){
            let names = Object.values(snap.val());
            this.setState({users:names,nodata:false});
            // this.state.users.map((value,index)=>{
            //   alert("users map");

            //    fire.database().ref("users").child(value.idPatient).child("name").on('value',(data)=>{

            //      var n=data.val();
            //      alert(data.val());

            //      array.push({id:value.idPatient,name:data.val()});
            //    })
            // })

          }
        })

      
      }

    }
  
    render(){
        return(
            <Block flex >
            
            <Block>
                {!this.state.nodata && this.state.users.map((item,index)=>{
                  var name;
                  return(
                    <View style={{marginTop:60}}>
                    <TouchableOpacity
                         style={styles.button}
                         onPress={()=>
                         { fire.database().ref("users").child(item.idPatient).child("name").once('value',(snap)=>{
                          name=snap.val();
                          this.props.navigation.navigate("Chat",{sender:this.state.senderID,name:this.state.name,email:this.state.email,receiver:item.idPatient,nameR:snap.val()});

                                           })
                           }
                          
                         }>
                        <Text> safa </Text>
                      </TouchableOpacity>
                      <Divider style={{backgroundColor:'#000000',width:width*0.9}}/>
                      </View>
                  )
                })}
            </Block>
           
            </Block>

            

        )
    }
}

const styles =StyleSheet.create({
   
      button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
        width:width*0.5,
        marginLeft:100
      },
     
      textStyle:{
        color:"#ffffff"
      }
})