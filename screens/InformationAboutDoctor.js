import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  View,
  ScrollView,
  Picker,
  TouchableOpacity
} from "react-native";
import { Block, Checkbox, Text, theme } from "galio-framework";

import { Input, Button as ComponentButton } from "../components";
import { Images, argonTheme } from "../constants";
import fire from "../constants/firebaseConfigrations";
import {Divider } from 'react-native-elements'; 

const { width, height } = Dimensions.get("screen");

class InformationAboutDoctor extends React.Component {
   
    
    constructor(props){
        super(props);
       

        this.state={
            id:'',
            idPatient:'',
            clinicName:[],
            email:'',
            name:'',
            phone:'',
            specialty:'',
            workingHours:[],
            avatar:'',
            nodata:''
            
            
        }
    }
    
    componentDidMount(){
        
            this.retrieveData();
    }

    retrieveData(){
        const { navigation } = this.props;  
        var id=navigation.getParam("id");
        var idP=navigation.getParam("idPatient");
            this.setState({
                id:id,
                idPatient:idP
            })
            fire.database().ref("users").child(id).child("Specialization").on('value',(datasnapshot)=>{
                if(datasnapshot.val()){
                this.setState({
                    specialty:datasnapshot.val()
                })
              }
             })
            
           
             fire.database().ref("users").child(id).child("name").on('value',(datasnapshot)=>{
              if(datasnapshot.val()){
                this.setState({
                name:datasnapshot.val()
              })
            }
           })
          
           fire.database().ref("users").child(id).child("email").on('value',(datasnapshot)=>{
            if(datasnapshot.val()){
            this.setState({
              email:datasnapshot.val()
            })
          }
          })
          fire.database().ref("users").child(id).child("avatar").on('value',(datasnapshot)=>{
            if(datasnapshot.val()){
            this.setState({
              avatar:datasnapshot.val(),
              avatarExist:true
            })
          }
         
          })
        
          fire.database().ref("users").child(id).child("phone").on('value',(datasnapshot)=>{
            if(datasnapshot.val()){
            this.setState({
              phone:datasnapshot.val(),
              phoneExist:true
            })
          }
          })
              
          
            fire.database().ref("users").child(id).child("clinicName").on('value',(datasnapshot) =>{
              if(datasnapshot.val()){
              let nameClinic = Object.values(datasnapshot.val());
              this.setState({clinicName:nameClinic})
              }
           })
          
           fire.database().ref("users").child(id).child("workingHours").on('value',(datasnapshot) =>{
            if(datasnapshot.val()){
             let items = Object.values(datasnapshot.val());
          
             this.setState({
               workingHours:items,
               nodata:false
                 })
          
            }
           else{
             this.setState({
               nodata:true
             })
           }
           
          })
          

    }

   
    
   
    
    render(){
        
        return(
            <Block flex style={{flex:1,backgroundColor:"#eee"}}>
   
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ width, marginTop: '25%' }}
            >
            
                  <Block>
                  <View  style={{flexDirection:'column',marginTop:50}}>
                  <Text  style={{color:'#aaa'}} >Name:</Text>
                    <Text  size={15} color="#32325D" > {this.state.name}</Text>
                    <Divider style={{backgroundColor:'#E9ECEF',marginTop:10,width:width*0.6}}/>
                    <Text  style={{color:'#aaa'}} >Email:</Text>
                    <Text  size={15} color="#32325D" > {this.state.email}</Text>
                    <Divider style={{backgroundColor:'#E9ECEF',marginTop:10,width:width*0.6}}/>
                    {this.state.phoneExist && <View>
                      <Text  style={{color:'#aaa'}} > Phone Number:</Text>
                    <Text  size={15} color="#32325D" > {this.state.phone}</Text>
                    </View>}
                    <Divider style={{backgroundColor:'#E9ECEF',marginTop:10,width:width*0.6}}/>
                    <Text  style={{color:'#aaa'}} >Specialization:</Text>
                    <Text  size={15} color="#32325D" > {this.state.specialty}</Text>
                    <Divider style={{backgroundColor:'#E9ECEF',marginTop:10,width:width*0.6}}/>
                    <Text  style={{color:'#aaa'}} >clinic Name:</Text>
                    <View  style={{flexDirection:'row' }}>
                     {this.state.clinicName.map((value,ind)=>{
                       return(
                         <Text style={{marginLeft:2}} color="#32325D">{value.clinic}</Text>
                       )
                     })}
                    </View>
                     </View>
                    </Block>
                    
                    <View style={{flexDirection:'column',marginTop:10}}>
                    <Text color="#32325D">workingHours:</Text>
                      {!this.state.nodata && this.state.workingHours.map((item,index)=>{
                          
                          return(
                            <View key={index} style={{flexDirection:'column',marginTop:5}}>
                            <View style={{flexDirection:'row'}}>
                               <Text style={{fontWeight:'bold',fontSize:30,color:'#004'}}>{item.start}</Text>
                               <Text style={{fontWeight:'bold',fontSize:30,color:'#004'}}>-{item.end}</Text>
                               
                               </View>

                               <Text style={{color:"#AAAAAA"}}>{item.days}</Text> 
                               <Text style={{color:"#AAAAAA"}}>{item.selectedClinic}</Text> 

                                <Divider style={{backgroundColor:'#004'}}/>
                               
                            </View>
                          )
                      })}
                 </View>

                       <View style={{marginTop:20}}>
                           <TouchableOpacity style={{backgroundColor:'#eee'}}
                             onPress={()=>this.props.navigation.navigate("Appointment",{id:this.state.id,idPatient:this.state.idPatient})}>
                               <Text color='#1B5E20'>Book Now</Text>
                           </TouchableOpacity>
                       </View>        
      
      </ScrollView>
      </Block>
        )
    }
}

const styles = StyleSheet.create({

});
export default InformationAboutDoctor;