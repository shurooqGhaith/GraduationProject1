import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  Picker,
  TextInput,
  CheckBox,
  TouchableOpacity
} from "react-native";
import { Block, Text, theme } from "galio-framework";

import { Button,Icon,Input } from "../components";
import { Images, argonTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import fire from "../constants/firebaseConfigrations";
import DateTimePicker from "react-native-modal-datetime-picker";
import MapView,{Marker} from "react-native-maps";
import { Col, Row, Grid } from "react-native-easy-grid";
import { Divider,Header } from 'react-native-elements';
import Autocomplete from 'react-native-autocomplete-input';
const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

class PatientAfterSession extends React.Component {

  constructor(props){
    super(props);
    this.authListener=this.authListener.bind(this);
    this.SearchFilterFunction=this.SearchFilterFunction.bind(this);
    this.viewInfo=this.viewInfo.bind(this);
        this.state={
      username:"",
      email:'',
      idDoctor:"",
      idPatient:'',
      patientData:[],
      nodata:false,
      patientInfo:[],
      search:[],
      view:false,
      noInfo:false,
      process:[],
      medicines:[]
      
      
    }
  }

  componentDidMount(){
    this.authListener();
    //this.getLocation();
  }

  
  
  authListener(){
  
    const { navigation } = this.props;  
    var idD=navigation.getParam('id');
   
    

     this.setState({
         idDoctor:idD,
     })
     
   fire.database().ref("users").child(idD).child("name").on('value',(datasnapshot)=>{
    this.setState({
      username:datasnapshot.val()
    })
 })
    
 fire.database().ref("users").child(idD).child("email").on('value',(datasnapshot)=>{
    this.setState({
      email:datasnapshot.val()
    })
 })
 fire.database().ref("users").child(idD).child("appointment").on('value',(snapshot)=>{
     if(snapshot.val()){
        let data = Object.values(snapshot.val());
    this.setState({
        patientData:data,
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

  SearchFilterFunction () {
    if(this.state.search==""){
        alert("enter value to search about");
      //  this.retrieveData();
    }
    else{
        
        
            fire.database().ref("users").orderByChild('name').equalTo(this.state.search.toLowerCase()).on('value',(snapshot)=>{
                if(snapshot.val()){
                    let items = Object.values(snapshot.val());
                    // this.setState({
                    //     data:items,
                    //     nodata:false
                    // })
                }
                else{
                    this.setState({
                        nodata:true
                    })
                    alert("no data available");
                    this.retrieveData();
                }
             })

        }
        

}   

handle=input=>{
    
        
    
        
   
}

viewInfo(id){
    alert(id);
    this.setState({nodata:true,idPatient:id,view:true});
    fire.database().ref("users").child(this.state.idDoctor).child("patients").on('value',(snap)=>{
        if(snap.val()){
        let items=Object.values(snap.val());
        this.setState({
            patientInfo:items,
            noInfo:false
        })
    }
    else{
        this.setState({
           
            noInfo:true
        })
    }
    })	
}

  render() {
    return (
   
        <Block flex style={styles.profile}>
        <Block flex>
          

       
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ width, marginTop: '25%' }}
            >
              <Block flex style={styles.profileCard}>
                
                <Block style={styles.info}>
                  
                

              
                  
                  
                  <Block middle>
                     
                  <View style={{marginTop:200}}>
                  {!this.state.nodata && this.state.patientData.map((item,index)=>{
                      
                     
                     if(item.available){
                        var name;
                      fire.database().ref("users").child(item.idPatient).child("name").once('value',(snap)=>{
                        name=snap.val();
                      })
                         return(
                          <View key={index} style={{flexDirection:'column'}}>
                          <Button small style={{backgroundColor:'#fff'}}
                          onPress={()=>this.props.navigation.navigate("Info",{id:item.idPatient,idDoctor:this.state.idDoctor})}
                          ><Text style={{color:'#000'}}>{name}</Text></Button>
                          
                          <Divider style={{backgroundColor:'#000000',marginTop:10}}/>

                         </View>

                         )
                         
                      
                     
                     }
                   })}
                    </View>


                    
                    
                    
                    
                  </Block>
                  


                  
                  
                  
                </Block>
              </Block>
            </ScrollView>
         
        </Block>
        
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  
  

  
  profile: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    // marginBottom: -HeaderHeight * 2,
    flex: 1,
    backgroundColor:'#eee'
  },
  profileContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1
  },
  profileBackground: {
    width: width,
    height: height / 2
  },
  
  TextInputStyle: {  
    textAlign: 'center',  
    height: 40,  
    borderRadius: 10,  
    borderWidth: 2,  
    borderColor: '#009688',  
    marginBottom: 10  ,
    width:width*0.5,
    marginLeft:20
} ,

input: {
  borderRadius: 4,
  borderColor: argonTheme.COLORS.BORDER,
  height: 44,
  backgroundColor: '#FFFFFF',
  marginTop:10
},
  
});

export default PatientAfterSession;