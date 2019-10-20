import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  View,
  ScrollView,
  Picker
} from "react-native";
import { Block, Checkbox, Text, theme } from "galio-framework";

import {  Input,Button as ComponentButton} from "../components";
import { Images, argonTheme } from "../constants";
import fire from "../constants/firebaseConfigrations";
import SearchBar from 'react-native-searchbar';
import DateTimePicker from "react-native-modal-datetime-picker";
import {Card,Button,Icon } from 'react-native-elements'; 

const { width, height } = Dimensions.get("screen");

class SearchAboutTime extends React.Component {
   

    constructor(props){
        super(props);
        this.showDatePicker=this.showDatePicker.bind(this);
        this.showTimePicker=this.showTimePicker.bind(this);
        this.hideDatePicker=this.hideDatePicker.bind(this);
        this.hideDateTimePicker=this.hideDateTimePicker.bind(this);
        this.handleDatePicked=this.handleDatePicked.bind(this);
        this.handleTimePicked=this.handleTimePicked.bind(this);
        this.search=this.search.bind(this);
        this.state={
            data:[],
            DrInfo:[],
            keys:[],
            idP:'',
            clinicName:[],
            daySelected:'',
            searchParameter:'specialization',
            nodata:true,
            dateTimeVisible:false,
            dateVisible:false,
            timeToSearch:'',
            dateToSearch:'',
            appointments:[],
            workingHour:[]
        }
    }
    componentDidMount(){
        const { navigation } = this.props;  
        var idP=navigation.getParam("idPatient");
    
            this.setState({
                idP:idP
            })
            this.retrieveData();
    }

    retrieveData(){
       
    
            fire.database().ref("users").on('value', (snapshot) => {
                    let data = snapshot.val();
                    var id=snapshot.key;//id = users
                    let items = Object.values(data);
                  //  this.setState({data:items,nodata:false});
                 }
            )
    }
    search = time =>{

        const hours = time.getHours();
    const minutes = time.getMinutes();
    var h=`${hours}`;
    var m=`${minutes}`;
    if(h.length==1){h=`0${h}`}
    if(m.length==1){m=`0${m}`}
    
    const timeSelected=h+":"+m;
    
      this.setState({
        timeToSearch:timeSelected
      })

        var array=[];
        fire.database().ref("users").on('value',(snap)=>{
            var data=snap.val();
            var keys=Object.keys(data);
           // alert(keys[0]);
            for(var i=0 ; i<keys.length;i++){
               fire.database().ref("users").child(keys[i]).child("type").on('value',(snapshot)=>{
                   var app=snapshot.val();//type of user
                   //alert(app);
                   if(app=="doctor"){
                       fire.database().ref("users").child(keys[i]).child("appointment").on('value',(result)=>{
                           if(result.val()){
                               let appointment = Object.values(result.val());
                               this.setState({appointments:appointment})

                               //map appointments state
                               this.state.appointments.map((element,index)=>{
                               // alert(this.state.dateToSearch + "\ntime:"+this.state.timeToSearch);
                                   if(element.timeSelected==this.state.timeToSearch && element.available && element.dateSelected==this.state.dateToSearch ){
                                      // alert(element.dateSelected+element.daySelected);
                                      

                                      fire.database().ref("users").child(keys[i]).child("workingHours").on('value',(workHours)=>{
                                          if(workHours.val()){
                                            let work = Object.values(workHours.val());
                                            this.setState({workingHour:work}) 
                                            this.state.workingHour.map((w,ind)=>{
                                                if(w.days==this.state.daySelected && w.enable && this.state.timeToSearch >= w.start && this.state.timeToSearch <= w.end ){
                                                    array.push({id:keys[i],clinic:w.selectedClinic});
                                                }
                                                
                                            })
                                          }
                                            
                                       })

                                   }
                                   if(element.timeSelected !=this.state.timeToSearch || element.dateSelected !=this.state.dateToSearch ){
                                      
                                       fire.database().ref("users").child(keys[i]).child("workingHours").on('value',(workHours)=>{
                                        if(workHours.val()){
                                          let work = Object.values(workHours.val());
                                          this.setState({workingHour:work}) 
                                          this.state.workingHour.map((w,ind)=>{

                                              if(w.days==this.state.daySelected && w.enable && this.state.timeToSearch >= w.start && this.state.timeToSearch <= w.end ){
                                                  array.push({id:keys[i],clinic:w.selectedClinic});
                                              }
                                              
                                          })
                                        }
                                          
                                     })
                                   }
                                   else{
                                       alert("no doctor available at this time");
                                       array=[];
                                       this.setState({
                                           data:array
                                       })
                                   }

                               })
                           }
                       })
                     
                   }//app==doctor
                   
               })
            }

        })//end the outer ref
   this.hideDateTimePicker();
   
   if(array.length>0){
    var result = array.reduce((unique, o) => {
        if(!unique.some(obj => obj.id === o.id && obj.clinic === o.clinic)) {
          unique.push(o);
        }
        return unique;
    },[]);

    this.setState({
        data:result,
        nodata:false
    })
   }
   
    }
  
    
      
    

    showTimePicker(){
        this.setState({dateTimeVisible:true})
    }

    handleTimePicked = time => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    var h=`${hours}`;
    var m=`${minutes}`;
    if(h.length==1){h=`0${h}`}
    if(m.length==1){m=`0${m}`}
    
    const timeSelected=h+":"+m;
    
      this.setState({
        timeToSearch:timeSelected
      })
    alert(this.state.timeToSearch);

    this.hideDateTimePicker();
    }

    hideDateTimePicker = () => {
        this.setState({ dateTimeVisible: false });
      };

      handleDatePicked =pickeddate=> {
        const day   = pickeddate.getDate();
        const dayName=pickeddate.getDay();
       const  month = pickeddate.getMonth()+1;
        const  year  = pickeddate.getFullYear();
          
        if(dayName==0){
            this.setState({
                daySelected:"sunday"
            })
       }

       
       if(dayName==1){
        this.setState({
            daySelected:"monday"
        })
   }
   
   if(dayName==2){
    this.setState({
        daySelected:"tuesday"
    })
}

if(dayName==3){
    this.setState({
        daySelected:"wednesday"
    })
}

if(dayName==4){
    this.setState({
        daySelected:"thursday"
    })
}

if(dayName==5){
    this.setState({
        daySelected:"friday"
    })
}

if(dayName==6){
    this.setState({
        daySelected:"saturday"
    })
}
           this.setState({
            dateToSearch:day + '-' + month + '-' + year
           })
            alert(this.state.dateToSearch);
           this.hideDatePicker();
        }

        hideDatePicker=()=>{
             this.setState({dateVisible:false})
        }

        showDatePicker = () => {
            this.setState({ dateVisible: true });
          };
    render(){
        
        return(
            


            <View> 
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ width, marginTop: '25%' }}
            >
                 
             
                  <View style={{flexDirection:'row'}}>
                  <ComponentButton
                    onPress={this.showDatePicker}//from button
                    style={{marginTop:10,width:width*0.6,marginLeft:70}}
                      color="transparent"
                      textStyle={{
                        color: "#333",
                        fontWeight: "500",
                        fontSize: 16
                      }}
                    >
                     <Text style={{color:argonTheme.COLORS.GRADIENT_START}}>
                     {this.state.dateToSearch || "select suitable day"}
                     </Text> 
                    </ComponentButton>
                  <DateTimePicker
                       isVisible={this.state.dateVisible}
                       onConfirm={this.handleDatePicked}
                       onCancel={this.hideDatePicker}
                       mode={'date'}
                       datePickerModeAndroid={'calendar'}
                             />
                       </View>
                    
                    
                    <ComponentButton
                    onPress={this.showTimePicker}//from button
                    style={{marginTop:10,width:width*0.6,marginLeft:70}}
                      color="transparent"
                      textStyle={{
                        color: "#333",
                        fontWeight: "500",
                        fontSize: 16
                      }}
                    >
                     <Text style={{color:argonTheme.COLORS.GRADIENT_START}}>
                     {this.state.timeToSearch || "select suitable time"}
                     </Text> 
                    </ComponentButton>
                               <DateTimePicker
                       isVisible={this.state.dateTimeVisible}
                       onConfirm={this.search}
                       onCancel={this.hideDateTimePicker}
                       mode='time'
                      //datePickerModeAndroid={'calendar'}
                       timePickerModeAndroid={'clock'}
                       is24Hour={false}
                             />
            
            
                     <View style={styles.itemsList}>
                         {!this.state.nodata && this.state.data.map((value,index)=>{
                             
                             var name,specialization,email;
                             fire.database().ref("users").child(value.id).child("name").on('value',(snap)=>{
                                  name=snap.val();
                                  
                             })
                             fire.database().ref("users").child(value.id).child("Specialization").on('value',(snapshot)=>{
                                specialization=snapshot.val();
                             })
                             fire.database().ref("users").child(value.id).child("email").on('value',(snapshot)=>{
                                email=snapshot.val();
                             })
                             return(

                                <View key={index} style={{marginTop:20}}>
                    <Card
                  title={name}
                  //image={require('../images/pic2.jpg')}
                  >
                  
               <Text style={{marginBottom: 10}}>
                       email:{email}
                 </Text>
                 
                 <Text style={{marginBottom: 10}}>
                 Specialization:{specialization}
                 </Text>
                  
                  
                     <Button
                      onPress={()=>
                                    {
                                        fire.database().ref("users").child(this.state.idP).child("appointment").push().set({
                                                   'idDoctor':value.id,
                                                   'daySelected':this.state.daySelected,
                                                   'dateSelected':this.state.dateToSearch,
                                                   'timeSelected':this.state.timeToSearch,
                                                   'clinicName':value.clinic,
                                                   'available':false
                                               });
                                               fire.database().ref("users").child(value.id).child("appointment").push().set({
                                                   'idPatient':this.state.idP,
                                                   'daySelected':this.state.daySelected,
                                                   'dateSelected':this.state.dateToSearch,
                                                   'timeSelected':this.state.timeToSearch,
                                                   'clinicName':value.clinic,
                                                   'available':false
                                               });
                                               alert("success !")
                                    }
                                    }
                           icon={<Icon name='code' color='#ffffff' />}
                           buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0,backgroundColor:"#444"}}
                           title='VIEW NOW' />
                        </Card>
                    </View>

                                    
                                  )
                            
                         })}
                     </View>
           
      </ScrollView>
      
      </View>
        )
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
    itemsList: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        marginTop:25
    },
    itemtext: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    }
});
export default SearchAboutTime;