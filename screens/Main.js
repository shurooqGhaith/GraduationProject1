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
            nodata:true,
            doctors:[]
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
      var type=navigation.getParam('type');//patient doctor
      this.setState({
            senderID:id,
            name:name,
            email:email,
            type:type
      })
       var array=[];
      if(type=="doctor"){
      //   fire.database().ref("users").child(id).child("patients").on('value',(snap)=>{
      //     if(snap.val()){
      //       let names = Object.values(snap.val());
          
      //       names.map((value)=>{
      //         array.push({idPatient:value.idPatient});
      //       })

      //       var result = array.reduce((unique, o) => {
      //         if(!unique.some(obj => obj.time === o.time)) {
      //           unique.push(o);
      //         }
      //         return unique;
      //     },[]);

      //     this.setState({users:result,nodata:false});
      //       }
      //  })

////*** */
          fire.database().ref("users").on('value',(snap)=>{
            if(snap.val()){
              var data=snap.val();
              let keys = Object.keys(data);
            
              for(var i=0;i<keys.length;i++){
                fire.database().ref("users").child(keys[i]).child("type").on('value',(snapshot)=>{
                  var app=snapshot.val();
                  if(app=="patient"){
                    fire.database().ref("users").child(keys[i]).child("name").on('value',(name)=>{
                      var n=name.val();
                      array.push({id:keys[i],name:n})
  
                    })
                  }
                })
              }
              this.setState({users:array,nodata:false});
            }
          })//*** *
            

      

      
      }
      var array2=[];
      if(type=="patient"){
        fire.database().ref("users").on('value',(snap)=>{
          if(snap.val()){
            var data=snap.val();
            let keys = Object.keys(data);
          
            for(var i=0;i<keys.length;i++){
              fire.database().ref("users").child(keys[i]).child("type").on('value',(snapshot)=>{
                var app=snapshot.val();
                if(app=="doctor"){
                  fire.database().ref("users").child(keys[i]).child("name").on('value',(name)=>{
                    var n=name.val();
                    array2.push({id:keys[i],name:n})

                  })
                }
              })
            }

          //   var result2 = array2.reduce((unique, o) => {
          //     if(!unique.some(obj => obj.time === o.time)) {
          //       unique.push(o);
          //     }
          //     return unique;
          // },[]);

            this.setState({doctors:array2});


          }
        })

      
      }

    }
  
    render(){
        return(
            <Block flex >
            
            <Block>
                {!this.state.nodata && this.state.type=="doctor" && this.state.users.map((item,index)=>{
                  var name;
                  return(
                    <View style={{marginTop:60}}>
                    <TouchableOpacity
                         style={styles.button}
                         onPress={()=>
                         { //fire.database().ref("users").child(item.idPatient).child("name").once('value',(snap)=>{
                          //name=snap.val();
                          this.props.navigation.navigate("Chat",{sender:this.state.senderID,name:this.state.name,email:this.state.email,receiver:item.id,nameR:item.name});

                                          // })
                           }
                          
                         }>
                        <Text> {item.name} </Text>
                      </TouchableOpacity>
                      <Divider style={{backgroundColor:'#000000',width:width*0.9}}/>
                      </View>
                  )
                })}

                {  this.state.type=="patient" && this.state.doctors.map((item,index)=>{
                  
                  return(
                    <View style={{marginTop:60}}>
                    <TouchableOpacity
                         style={styles.button}
                         onPress={()=>this.props.navigation.navigate("Chat",{sender:this.state.senderID,name:this.state.name,email:this.state.email,receiver:item.id,nameR:item.name})
                    }>
                        <Text>{item.name}</Text>
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