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
        this.filterResult=this.filterResult.bind(this);
        this.search=this.search.bind(this);

        this.makeEmpty=this.makeEmpty.bind(this);
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
            workingHour:[],
            Specialties:[],
            spSelected:'',
            filterEnable:false
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
                           //لما ما يكون ما في مواعيد عند الدكتور افحصي مواعيد الدوام ا
                           //ازا الوقت يلي اختاره و اليوم ضمن مواعيد الدوام ، بقدر يحجز عنده
                           // ما بعرض داتا الا لما احط فلتر لازم ازبط هاي الشغلة
                           if(result.val()){
                               let appointment = Object.values(result.val());
                               this.setState({appointments:appointment})

                               //map appointments state
                               this.state.appointments.map((element,index)=>{////////////////////////
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
                                      
                                       fire.database().ref("users").child(keys[i]).child("workingHours").on('value',(workHours)=>{//////
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
                           }//appointment end


                          ///no appointment yet 
                           if(!result.val()){
                           //get working hour
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
    
                        }//no appointment end
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

    var sp=[];
    this.state.data.map((value,index)=>{
        fire.database().ref("users").child(value.id).child("Specialization").on('value',(snap)=>{
            sp.push({sp:snap.val()});
        })
    })
    
    var result2 = sp.reduce((unique, o) => {
        if(!unique.some(obj => obj.sp === o.sp)) {
          unique.push(o);
        }
        return unique;
    },[]);
        this.setState({
            Specialties:result2
        })
   }
  
    }
  
    filterResult(){
             this.setState({
                 filterEnable:true
             })
            
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
    //alert(this.state.timeToSearch);

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
           // alert(this.state.dateToSearch);
           this.hideDatePicker();
        }

        hideDatePicker=()=>{
             this.setState({dateVisible:false})
        }

        showDatePicker = () => {
            this.setState({ dateVisible: true });
          };

          makeEmpty(){
            this.setState({
              data:[],
              dateToSearch:'',
              timeToSearch:'',
              nodata:true
            })
          }
    render(){
        
        return(
            


            <View style={{backgroundColor:"#eee"}}> 
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ width, marginTop: '25%' }}
            >
                 
             
                  <View style={{flexDirection:'row'}}>
                  <ComponentButton
                    onPress={this.showDatePicker}
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
                    onPress={this.showTimePicker}
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
                       onConfirm={(t)=>this.search(t)}
                       onCancel={this.hideDateTimePicker}
                       mode='time'
                      //datePickerModeAndroid={'calendar'}
                       timePickerModeAndroid={'clock'}
                       is24Hour={false}
                             />
                         
            

                         <View style={{flexDirection:'column'}}>
                <Picker 
                   
                    style={{height: 60, width: width*0.2,marginLeft:70,borderWidth:5}} 
                    selectedValue = {this.state.spSelected} 
                    onValueChange = {(value) => {this.setState({spSelected: value});
                    }}>
                    {this.state.Specialties.map((value,index)=>{
                      return(
                        <Picker.Item label = {value.sp} value = {value.sp} />
                      )
                    })}
                         
                    </Picker>
                    <View style={{flexDirection:'row'}}>
                      <ComponentButton
                      small
                      onPress={this.filterResult}
                      style={{marginTop:10,marginLeft:90,backgroundColor:'#004D40'}}
                      
                      textStyle={{
                        color: "#fff",
                        fontWeight: "500",
                        fontSize: 16
                      }}
                      >
                              <Text>filter</Text>
                      </ComponentButton>

                      <ComponentButton
                      small
                      onPress={()=>this.setState({filterEnable:false})}
                      style={{marginTop:10,marginLeft:20,backgroundColor:'#3E2723'}}
                      
                      textStyle={{
                        color: "#fff",
                        fontWeight: "500",
                        fontSize: 16
                      }}
                      >
                              <Text>all</Text>
                      </ComponentButton>
                      </View>
                    </View>

                     <View style={styles.itemsList}>
                         {!this.state.nodata && this.state.data.map((value,index)=>{
                             if(!this.state.data){return(<View><Text>No data </Text></View>)}
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

                             if(this.state.filterEnable && specialization==this.state.spSelected){
                                return(

                                       <View key={index} style={{marginTop:20}}>
                                         <Card
                                             title={name}
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
                                                    alert("success !");
                                                   // this.search(this.state.timeToSearch); 
                                                   this.makeEmpty();
                                                 }
                                                       }
                                      icon={<Icon name='code' color='#ffffff' />}
                                      buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0,backgroundColor:"#444"}}
                                      title='VIEW NOW' />
                                              </Card>
                                                    </View>

    
                                               )
                                      
                                                 }
                        if(!this.state.filterEnable){
                                return(

                                       <View key={index} style={{marginTop:20}}>
                                         <Card
                                             title={name}
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
                                                    alert("success !");
                                                    this.makeEmpty();
                                                    //this.search(this.state.timeToSearch);
                                                 }
                                                       }
                                      icon={<Icon name='code' color='#ffffff' />}
                                      buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0,backgroundColor:"#444"}}
                                      title='VIEW NOW' />
                                              </Card>
                                                    </View>

    
                                               )

                                                 }
                                                 
                            
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