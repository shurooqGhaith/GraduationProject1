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
  TouchableOpacity,
  FlatList,
  ToastAndroid,
  Modal
} from "react-native";
import { Block, Text, theme } from "galio-framework";

import { Button,Icon,Input } from "../components";
import { Images, argonTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import fire from "../constants/firebaseConfigrations";
import DateTimePicker from "react-native-modal-datetime-picker";
import { Divider,Header } from 'react-native-elements';
import Autocomplete from 'react-native-autocomplete-input';
import { slotCreator } from "react-native-slot-creator";

const { width, height } = Dimensions.get("screen");
const Toast = (props) => {
  if (props.visible) {
    ToastAndroid.showWithGravityAndOffset(
      props.message,
      ToastAndroid.LONG,
      ToastAndroid.TOP,
      25,
      50,
    );
    return null;
  }
  return null;
};
const thumbMeasure = (width - 48 - 32) / 3;

class PatientInfo extends React.Component {

  constructor(props){
    super(props);
    this.authListener=this.authListener.bind(this);
    this.addMedicineName=this.addMedicineName.bind(this);
    this.handleChange=this.handleChange.bind(this);
    this.handleMedicalExaminationsChange=this.handleMedicalExaminationsChange.bind(this);
    this.addMedicalExaminations=this.addMedicalExaminations.bind(this);
    this.submit=this.submit.bind(this);
    this.hide=this.hide.bind(this);
    this.hideDatePicker=this.hideDatePicker.bind(this);
    this.showDatePicker=this.showDatePicker.bind(this);

    this.handleDate=this.handleDate.bind(this);
    this.changeTime=this.changeTime.bind(this);
    this.handleNextSession=this.handleNextSession.bind(this);
    this.makeNextSessionAppointment=this.makeNextSessionAppointment.bind(this);
        this.state={
      username:"",
      idDoctor:"",
      idPatient:'',
      clinic:'',
      nodata:false,
      info:[],
      email:'',
      session:'',
      checkedTemporary:false,
      checkedPermanent:false,
      checkedRepairing:false,
      checkedWindmillDressing:false,
      medicinesName:[],
      medicine:'',
      medicineNameFromPicker:'',
      medicineNameFromDB:[],
      noMedicine:true,
      checkedMoney:false,
      money:'',
      appointments:[],
      appointmentsPatient:[],
      date:'',
      time:'',
      medicineFromDB:[],
      error:'',
      medicalExaminations:[],
      medicalExaminationName:'',
      patientData:[],
///change time
      dateVisible:false,
      dateTimeVisible:false,
      daySelected:'',
      dateToSearch:'',
      timeToSearch:'',
      appointmentChange:[],
      workingHour:[],
      app:[],
      change:false,
      availableSlots:[],
      flag:false,
      msg:'',

      //next session
      nextSession:false,
      sessionDate:'',
      sessionDay:'',
      sessionTime:'',
      nextEnable:false,
      sessionAvailable:[],
      isShow:false,

      showModal:false,
      showModal2:false,
      showForm:false,
      notes:''

    }
  }

  componentDidMount(){
    this.authListener();
    //this.getLocation();
  }

  handleNextSession =pickeddate=>{
    const day   = pickeddate.getDate();
    const dayName=pickeddate.getDay();
    const  month = pickeddate.getMonth()+1;
    const  year  = pickeddate.getFullYear();

    if(dayName==0){
      this.setState({
        sessionDay:"sunday"
      })
 }

 
 if(dayName==1){
  this.setState({
    sessionDay:"monday"
  })
}

if(dayName==2){
this.setState({
  sessionDay:"tuesday"
})
}

if(dayName==3){
this.setState({
  sessionDay:"wednesday"
})
}

if(dayName==4){
this.setState({
  sessionDay:"thursday"
})
}

if(dayName==5){
this.setState({
  sessionDay:"friday"
})
}

if(dayName==6){
this.setState({
  sessionDay:"saturday"
})
}
     this.setState({
      sessionDate:day + '-' + month + '-' + year
     })
     
     this.hide();

     var ar=[];
     fire.database().ref("users").child(this.state.idDoctor).child("workingHours").on('value',(work)=>{
       let workHour=Object.values(work.val());
       workHour.map(w=>{
         if(w.days == this.state.sessionDay && w.enable){
           this.setState({nextEnable:true});
           
          let requiredArray = slotCreator.createSlot(w.start,w.end,"30");//2 2.5 3 3.5
          ar=requiredArray;
          requiredArray.map(v=>{ar.push({time:v})})
          requiredArray.map((slot,index)=>{
           // var flag=false;
           
            fire.database().ref("users").child(this.state.idDoctor).child("appointment").on('value',(app)=>{
              let appointment=Object.values(app.val());
              appointment.map((ap)=>{
                if(ap.dateSelected == this.state.sessionDate && ap.timeSelected==slot && !ap.available){
                  ar = ar.filter(function( obj ) {
                    return obj.time !== slot;
                });
                }
              })//app map
            })//app fire

            //if(flag){ar.push({time:slot}) }
          })//slot arrays
         }
      
      //  } ف ما بيجي ع جملط الالس صارت تعطيني ع ايام الدوام انه ما في دوام مشان الستيت بتضل تتغير يعني  السبت دوام
         // بس لما يلف ع باقي الايام مثلا عند الاحد لا يساوي السبت يلي اخترته انا ف بعمل الستيت فولس ز بعطيني ما في دوام
       })//work map
       
      
     })//working hour database

     this.setState({
      sessionAvailable:ar,
      showModal2:true
    })


  }
  makeNextSessionAppointment(time){

    fire.database().ref("users").child(this.state.idDoctor).child("appointment").push().set({
      'idPatient':this.state.idPatient,
      'daySelected':this.state.sessionDay,
      'dateSelected':this.state.sessionDate,
      'timeSelected':time,
      'clinicName':this.state.clinic,
      'available':false
  }).then(()=>{
    fire.database().ref("users").child(this.state.idPatient).child("appointment").push().set({
      'idDoctor':this.state.idDoctor,
      'daySelected':this.state.sessionDay,
      'dateSelected':this.state.sessionDate,
      'timeSelected':time,
      'clinicName':this.state.clinic,
      'available':false
  });
  
  this.setState({isShow:true,msg:'Added successfully !'});
  setTimeout(function(){
   this.setState({isShow:false});
  }.bind(this),5000);

  }).catch((error)=>{
    this.setState({isShow:true,msg:error.message});
    setTimeout(function(){
     this.setState({isShow:false});
    }.bind(this),5000);
  });

   // alert("The time is changed to "+this.state.dateToSearch+"\n"+this.state.timeToSearch);
   // this.setState({availableSlots:[]});
  
   this.setState({showModal2:false});
  }

  handleDate =pickeddate=> {
  
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
     
     this.hideDatePicker();
//alert(this.state.daySelected);
     var ar=[];
     fire.database().ref("users").child(this.state.idDoctor).child("workingHours").on('value',(work)=>{
       let workHour=Object.values(work.val());
       workHour.map(w=>{
         if(w.days == this.state.daySelected && w.enable){
           this.setState({change:true});
           
          let requiredArray = slotCreator.createSlot(w.start,w.end,"30");//2 2.5 3 3.5
          ar=requiredArray;
          requiredArray.map(v=>{ar.push({time:v})})
          requiredArray.map((slot,index)=>{
            // var flag=false;
           
            fire.database().ref("users").child(this.state.idDoctor).child("appointment").on('value',(app)=>{
              let appointment=Object.values(app.val());
              appointment.map((ap)=>{
                if(ap.dateSelected == this.state.dateToSearch && ap.timeSelected==slot && !ap.available){
                  ar = ar.filter(function( obj ) {
                    return obj.time !== slot;
                });
                }
           
              })//app map
            })//app fire

            //if(flag){ar.push({time:slot}) }
          })//slot arrays
         }
        
       })//work map
       
     })//working hour database

     var result = ar.reduce((unique, o) => {
      if(!unique.some(obj => obj.time === o.time)) {
        unique.push(o);
      }
      return unique;
  },[]);
     this.setState({
      availableSlots:ar,
      showModal:true

    })
    
  }


  changeTime(time){

    fire.database().ref("users").child(this.state.idPatient).child("appointment").once('value',(snapshot)=>{
      if(snapshot.val()){
let appointments = Object.values(snapshot.val());
this.setState({app:appointments});
this.state.app.map((va,i)=>{
if(va.idDoctor == this.state.idDoctor && va.dateSelected ==this.state.date && va.timeSelected==this.state.time){

fire.database().ref("users").child(this.state.idPatient).child("appointment").child(Object.keys(snapshot.val())[i]).child("timeSelected").set(time);
fire.database().ref("users").child(this.state.idPatient).child("appointment").child(Object.keys(snapshot.val())[i]).child("dateSelected").set(this.state.dateToSearch);
fire.database().ref("users").child(this.state.idPatient).child("appointment").child(Object.keys(snapshot.val())[i]).child("daySelected").set(this.state.daySelected)
.then(()=>{
  fire.database().ref("users").child(this.state.idDoctor).child("appointment").once('value',(s)=>{
    let appointments = Object.values(s.val());
    this.setState({app:appointments});
    this.state.app.map((v,ind)=>{
      if(v.idPatient == this.state.idPatient && v.dateSelected ==this.state.date && v.timeSelected==this.state.time){//وصلت الموعد يلي بدي اغيره
        fire.database().ref("users").child(this.state.idDoctor).child("appointment").child(Object.keys(s.val())[ind]).child("timeSelected").set(time);
        fire.database().ref("users").child(this.state.idDoctor).child("appointment").child(Object.keys(s.val())[ind]).child("dateSelected").set(this.state.dateToSearch);
        fire.database().ref("users").child(this.state.idDoctor).child("appointment").child(Object.keys(s.val())[ind]).child("daySelected").set(this.state.daySelected);

      }
    })//app doctor map
   
  })//app doctor

})

}
})//map app p
      }

    })//app patient

    alert("The time is changed to "+this.state.dateToSearch+"\n"+this.state.timeToSearch);
    this.setState({showModal:false});

  }
 


   


    hideDatePicker=()=>{
      this.setState({dateVisible:false})
 }

    showDatePicker = () => {
        this.setState({ dateVisible: true });
      };
  

     



      hide(){
        this.setState({nextSession:false})
      }
  authListener(){
  
    const { navigation } = this.props;  
    var idD=navigation.getParam('idDoctor');
    var idP=navigation.getParam('idPatient');
    var date=navigation.getParam('date');
    var time=navigation.getParam('time');
    var c=navigation.getParam('clinic');
     this.setState({
         idDoctor:idD,
         idPatient:idP,
         date:date,
         time:time,
         clinic:c
     })
     
   fire.database().ref("users").child(idP).child("name").on('value',(datasnapshot)=>{
    this.setState({
      username:datasnapshot.val()
    })
 })
    
 fire.database().ref("users").child(idP).child("email").on('value',(datasnapshot)=>{
    this.setState({
      email:datasnapshot.val()
    })
 })
    
 fire.database().ref("medicines").on('value', (snapshot) => {
  let data = snapshot.val();
  let items = Object.values(data);
  this.setState({medicineFromDB:items});
  
})

  }


  addMedicineName(){
    this.setState({
        medicinesName:[...this.state.medicinesName,""]
    })
  }
  addMedicalExaminations(){
    this.setState({
      medicalExaminations:[...this.state.medicalExaminations,""]
  })
  }

  handleChange(e,index){
    this.state.medicinesName[index]=e;
    this.setState({medicinesName:this.state.medicinesName})
        }

        handleMedicalExaminationsChange(e,index){
          this.state.medicalExaminations[index]=e;
          this.setState({medicalExaminations:this.state.medicalExaminations})
        }
  
        submit(){


         var name;
          fire.database().ref("users").child(this.state.idPatient).child("name").on('value',(snap)=>{
           name=snap.val();
           
          })
          if(!this.state.session ){alert("ensure you have entered the session number !  ");return;}
          else{
            var m="";
            var m1="";
         // if(this.state.medicinesName){
            // var array=this.state.medicinesName;
            // if(this.state.medicine){array.push(this.state.medicine)}
            // array.forEach((value,index)=>{
            //   if(value !== ""){
            //     fire.database().ref("medicines").orderByChild("medicine").equalTo(value.toLowerCase()).on('value',(snap)=>{
            //       //alert("1");
            //       m+=value.trim()+"\n";
            //       if(!snap.val()){
            //         fire.database().ref("medicines").push().set({ 'medicine':value.toLowerCase().trim()})
            //       }
            //     })
            //   }
            // }) //array map
         // } // medicines if 
          if(!this.state.medicinesName){
            m+="no medicine";
          }
          //if(this.state.medicalExaminations){
            // var array2=this.state.medicalExaminations;
            // if(this.state.medicalExaminationName){array2.push(this.state.medicalExaminationName)}
            // array2.forEach((value,index)=>{
            //   if(value !== ""){
            //     fire.database().ref("medicalExaminations").orderByChild("exam").equalTo(value.toLowerCase()).on('value',(snap)=>{
            //       //alert("1");
            //       console.log(value+"\n");
            //       m1+=value.trim()+"\n";
            //       if(!snap.val()){
            //         fire.database().ref("medicalExaminations").push().set({ 'exam':value.toLowerCase().trim()})
            //       }
            //     })
            //   }
            // })
          //  console.log(m1);//empty
        //  } //medical exam if
          if(this.state.medicalExaminationName){
           
              fire.database().ref("medicalExaminations").orderByChild("exam").equalTo(this.state.medicalExaminationName.trim().toLowerCase()).on('value',(snap)=>{
                if(!snap.val()){
                  fire.database().ref("medicalExaminations").push().set({ 'exam':this.state.medicalExaminationName.trim().toLowerCase()})
                }
              })
          }

          if(this.state.medicine){
           
            fire.database().ref("medicines").orderByChild("medicine").equalTo(this.state.medicine.trim().toLowerCase()).on('value',(snap)=>{
              if(!snap.val()){
                fire.database().ref("medicines").push().set({ 'medicine':this.state.medicine.trim().toLowerCase()})
              }
            })
        }
         
         
          
           
          fire.database().ref("users").child(this.state.idPatient).child("appointment").once('value',(result)=>{

            if(result.val()){
                let appointment = Object.values(result.val());
                this.setState({appointmentsPatient:appointment})

                //map appointments state
                this.state.appointmentsPatient.map((element,index)=>{
                    if(element.timeSelected==this.state.time  && element.dateSelected==this.state.date && element.idDoctor==this.state.idDoctor  ){                         
                      //alert(Object.keys(result.val())[index]);  
                      fire.database().ref("users").child(this.state.idPatient).child("appointment").child(Object.keys(result.val())[index]).child("available").set(true)
                      .then(()=>{
                        fire.database().ref("users").child(this.state.idDoctor).child("appointment").once('value',(snap)=>{
                          if(snap.val()){
                              let appointmentD = Object.values(snap.val());
                              this.setState({appointments:appointmentD})
                              this.state.appointments.map((value,ind)=>{
                                  if(value.timeSelected==this.state.time  && value.dateSelected==this.state.date && value.idPatient==this.state.idPatient  ){                         
                                    fire.database().ref("users").child(this.state.idDoctor).child("appointment").child(Object.keys(snap.val())[ind]).child("available").set(true);
              
                                  }
              
                              })
                          }
                          
                      })
                      })

                    }

                })
            }
            
        });
                    
  
          var process=[];
          var pro="";
          if(this.state.checkedPermanent){process.push("permanent dental filling");pro+="permanent dental filling\n"}
          if(this.state.checkedTemporary){process.push("temporary dental filling");pro+="temporary dental filling\n"}
          if(this.state.checkedRepairing){process.push("repairing");pro+="repairing\n"}
          if(this.state.checkedWindmillDressing){process.push("windmill dressing");pro+="windmill dressing\n"}
          if(!this.state.checkedPermanent && !this.state.checkedTemporary && !this.state.checkedRepairing && !this.state.checkedWindmillDressing){
                process.push("nothing done");
                pro+="nothing done yet !";
          }

          if(!this.state.money){this.setState({money:0})}
        
          fire.database().ref("users").child(this.state.idDoctor).child("patients").push().set(
          {
            'idPatient':this.state.idPatient,
            'sessionNumber':this.state.session,
            'process':pro,
            'money':this.state.money,
            'medicine':this.state.medicine ,//////////// m
            'medicalExaminations':this.state.medicalExaminationName ,//m1 بس بتضل فاضية
            'time':this.state.time,
            'date':this.state.date,
            'clinic':this.state.clinic,
            'notes':this.state.notes
            
          }
          )
          fire.database().ref("users").child(this.state.idPatient).child("session").push().set(
            {
            'idDoctor':this.state.idDoctor,
            'sessionNumber':this.state.session,
            'process':pro,
            'money':this.state.money,
            'medicine':this.state.medicine ,////////////m
            'medicalExaminations':this.state.medicalExaminationName ,//m1
            'time':this.state.time,
            'date':this.state.date,
            'clinic':this.state.clinic,
            'notes':this.state.notes

            }
            )
            alert("added successfully!")
          }
        }
//end submit

        


  render() {
    return (
      <Block flex style={styles.profile}>
        <Block flex>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ width, marginTop: '25%' }}
            >
                  <Block style={{marginLeft:5}}>
                  <View style={{flexDirection:'column',marginTop:40}}>
                  <View style={{flexDirection:'row'}}>
                  <Text style={{color:"#263238"}}>name:</Text>
                  <Text style={{color:"#263238"}}>{this.state.username}</Text>
                  
                  </View>
                  <View style={{flexDirection:'row'}}>
                    <Text style={{color:"#263238"}}>email:</Text>
                    <Text style={{color:"#263238"}}>{this.state.email}</Text>
                  </View>
                  </View>
                  </Block>
                  <Divider style={{backgroundColor:'#000000',width:width*0.9}}/>

                  <View style={{flexDirection:'row'}}>
              <Button
                      onPress={this.showDatePicker}
                      style={{backgroundColor:'#455A64',marginLeft:30,marginTop:60,width:width*0.4}}
                      textStyle={{
                        color: "#fff",
                        fontWeight: "500",
                        fontSize: 16
                      }}
                      >
                              <Text>{this.state.dateToSearch || "change time"} </Text>
                      </Button>

                      <Button
                      onPress={()=>this.setState({showForm:true})}
                      style={{backgroundColor:'#37474F',marginLeft:20,marginTop:60,width:width*0.4}}
                      textStyle={{
                        color: "#fff",
                        fontWeight: "500",
                        fontSize: 16
                      }}
                      >
                              <Text>Enter Info </Text>
                      </Button>


                      <Divider style={{backgroundColor:'#000000',width:width*0.9}}/>

                      <DateTimePicker
                       isVisible={this.state.dateVisible}
                       onConfirm={this.handleDate}
                       onCancel={this.hideDatePicker}
                       mode={'date'}
                       datePickerModeAndroid={'spinner'}
                             />


                  </View>

                  <View style={{marginTop:100,flexDirection:'column',alignItems:'center'}}>
                  <Toast visible={this.state.flag} message={this.state.msg}/> 
                  <Modal transparent={true} visible={this.state.showModal}>
                  <View style={{backgroundColor:'#ffffff80',flexDirection:'column',marginTop:200,alignItems:'center',justifyContent:'center',height:height*0.3}}>
                  <View style={{backgroundColor: '#ffffff80',alignItems:'center' ,padding: 20,width:width*0.6,height:height*0.3}}>
                  <Text>Available times </Text>
                  <ScrollView showsVerticalScrollIndicator={true}>
                      
                  {this.state.change && this.state.availableSlots.map((slot,index)=>{
                      if(slot.time){
                           return(
                                   <View>
                                     <Button style={{backgroundColor:'#eee',marginTop:5}} small onPress={()=>this.changeTime(slot.time)}>
                                     <Text style={{color:'#00897b'}}>{slot.time}</Text>
                                      </Button>
                                      </View>
                              )
                            }
                })}
                <Button small style={{marginTop:5}} onPress={()=>this.setState({showModal:false})}><Text>cancel</Text></Button>
                  </ScrollView>
                      </View>
                 </View>
                  </Modal>
</View>


                  {/* <View style={{width:width*0.4,marginTop:20,flex:1}}>
                             <Autocomplete
                                    data={this.state.medicineNameFromDB}
                                    listStyle={{zIndex: 1, position: 'absolute'}}
                                    defaultValue={this.state.medicine}
                                     onChangeText={text => this.setState({ medicine: text })}
                                 renderItem={({ item, i }) => (
                                         <TouchableOpacity onPress={() => this.setState({ medicine: item })}>
                                                         <Text>{item.medicine}</Text>
                                            </TouchableOpacity>
                                            )}
                                                    />
                             </View> */}
                 {this.state.showForm && <View style={{flexDirection:'column',marginTop:20}}>
                   <View style={{flexDirection:'row'}}>
                       <TextInput  
                             value={this.state.session}
                             placeholder="session Number"   
                             style={{width:width*0.4,marginLeft:30,borderRadius: 5,borderWidth: 0.5,borderColor: '#000',backgroundColor:'#fff',paddingLeft:5 }}  
                             onChangeText={value => this.setState({session:value})}
                             keyboardType = 'numeric'
                             
                              />

                        <TextInput
                                 style={{marginLeft:10,width:width*0.4,borderRadius: 5,borderWidth: 0.5,borderColor: '#000',backgroundColor:'#fff',paddingLeft:5}}  
                                  keyboardType = 'numeric'
                                 placeholder="Money paid"
                                 onChangeText={(money)=>this.setState({money})}
                                 value={this.state.money}
                               /> 
                               </View>
                              <View style={{flexDirection:'column',marginLeft:40}}>
                              <View style={{flexDirection:'row' }}>
                              <CheckBox
                                       value={this.state.checkedTemporary}
                                       onValueChange={() => this.setState({ checkedTemporary: !this.state.checkedTemporary })}
                                 />
                                  <Text style={{marginTop: 5}}> Temporary dental filling</Text>
                                  </View>
                                  <View style={{flexDirection:'row'}}>
                                  <CheckBox
                                       value={this.state.checkedPermanent}
                                       onValueChange={() => this.setState({ checkedPermanent: !this.state.checkedPermanent })}
                                 />
                                  <Text style={{marginTop: 5}}> Permanent dental filling</Text>
                                  </View>
                              
                              <View style={{flexDirection:'row'}}>
                              <View style={{flexDirection:'row'}}>
                              <CheckBox
                                       value={this.state.checkedRepairing}
                                       onValueChange={() => this.setState({ checkedRepairing: !this.state.checkedRepairing })}
                                 />
                                  <Text style={{marginTop: 5}}> Repairing</Text>
                                  </View>
                                  <View style={{flexDirection:'row'}}>
                                  <CheckBox
                                       value={this.state.checkedWindmillDressing}
                                       onValueChange={() => this.setState({ checkedWindmillDressing: !this.state.checkedWindmillDressing })}
                                 />
                                  <Text style={{marginTop: 5}}> Windmill Dressing</Text>
                                  </View>
                              </View>
                              </View>
                              
                             <View style={{flexDirection:'row'}}>

                                  <TextInput
                                       style={{width:width*0.4,marginLeft:30,borderRadius: 5,borderWidth: 0.5,borderColor: '#000',backgroundColor:'#fff',paddingLeft:5 }}  
                                       placeholder="medical examinations"
                                       onChangeText={value => this.setState({medicalExaminationName:value})}
                                       value={this.state.medicalExaminationName}
                                    /> 

                                   <TextInput
                                       style={{width:width*0.4,marginLeft:15,borderRadius: 5,borderWidth: 0.5,borderColor: '#000',backgroundColor:'#fff',paddingLeft:5 }}  
                                       placeholder="medicine name"
                                       onChangeText={value => this.setState({medicine:value})}
                                       value={this.state.medicine}
                                    /> 
                             </View>
                            
                             
                              {this.state.medicinesName.map((name,index)=>{
                      return(
                          <View key={index} style={{marginLeft:70,width:width*0.5}}>
                          <TextInput
                        
                        style={{borderRadius: 5,borderWidth: 0.5,borderColor: '#000',backgroundColor:'#fff',marginTop:10,paddingLeft:5}}
                        placeholder="medicine name"
                        onChangeText={(Mname)=>this.handleChange(Mname,index)}
                        value={name}
                      />
                          </View>
                      )
                    })}

                    <Button
                      style={{ backgroundColor: argonTheme.COLORS.GRADIENT_START,marginTop:10, width: width * 0.5,borderRadius:10,marginLeft:50}}
                      onPress={this.addMedicineName}
                    >
                     other medicine 
                    </Button>

                    {this.state.medicalExaminations.map((name,index)=>{
                      return(
                          <View key={index} style={{marginLeft:70,width:width*0.5}}>
                          <TextInput
                        
                        style={{borderRadius: 5,borderWidth: 0.5,borderColor: '#000',backgroundColor:'#fff',marginTop:10,paddingLeft:5}}
                        placeholder="medical exam"
                        onChangeText={(Mname)=>this.handleMedicalExaminationsChange(Mname,index)}
                        value={name}
                      />
                          </View>
                      )
                    })}

                    <Button
                      style={{ backgroundColor: argonTheme.COLORS.GRADIENT_START,marginTop:10, width: width * 0.5,borderRadius:10,marginLeft:50}}
                      onPress={this.addMedicalExaminations}
                    >
                     other check up
                    </Button>


                   
                          
<View style={{marginTop:30}} >
    <TextInput
      style={styles.textArea}
      underlineColorAndroid="transparent"
      placeholder="Notes"
      placeholderTextColor="grey"
      numberOfLines={10}
      multiline={true}
      onChangeText={(text) => this.setState({notes:text})}
                                value={this.state.notes}
    />
  </View>
                             
                                  

                     <View style={{flexDirection:'row',marginLeft:50,marginTop:20}}>
                    <Button  
                    style={{width:width*0.3,backgroundColor:'#263238',color:'#fff'}} 
                    onPress={this.submit}>
                    <Text>add</Text>
                    
                    </Button>

                    <Button  
                    style={{width:width*0.3,backgroundColor:"#263238",marginLeft:15,color:'#fff'}} 
                    onPress={()=>this.setState({nextSession:true})}
                    >
                    <Text>{this.state.sessionDate || "next session"}</Text>
                    
                    </Button>
                    </View>
                    <DateTimePicker
                       isVisible={this.state.nextSession}
                       onConfirm={this.handleNextSession}
                       onCancel={this.hide}
                       mode={'date'}
                       datePickerModeAndroid={'spinner'}
                             />

<View style={{marginTop:100,flexDirection:'column',alignItems:'center'}}>
<Toast visible={this.state.isShow} message={this.state.msg}/> 
                  <Modal transparent={true} visible={this.state.showModal2}>
                  <View style={{backgroundColor:'#ffffff80',flexDirection:'column',marginTop:200,alignItems:'center',justifyContent:'center',height:height*0.3}}>
                  <View style={{backgroundColor: '#ffffff80',alignItems:'center' ,padding: 20,width:width*0.6,height:height*0.3}}>
                  <Text>Available times </Text>
                  <ScrollView showsVerticalScrollIndicator={true}>
                      
                  {this.state.nextEnable && this.state.sessionAvailable.map((slot,index)=>{
                       if(slot.time){
                               return(
                                   <View>
                             <Button style={{backgroundColor:'#eee',marginTop:5}} small onPress={()=>this.makeNextSessionAppointment(slot.time)}>
                                  <Text style={{color:'#00897b'}}>{slot.time}</Text>
                                 </Button>
                                            </View>
                                                       )
                                            }
   
          
                })}

                <Button small style={{marginTop:5}} onPress={()=>this.setState({showModal2:false})}><Text>cancel</Text></Button>
                  </ScrollView>
                      </View>
                 </View>
                  </Modal>
</View>

                    </View>
                 }
               
            </ScrollView>
          
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  
  
  textAreaContainer: {
    borderColor: "#fff",
    borderWidth: 1,
    padding: 5,
    marginTop:20,
    width:width*0.8,
   marginLeft:30
  },
  textArea: {
    height: 150,
    //justifyContent: "flex-start",
    width:width*0.8,
    backgroundColor:"#fff",
    marginLeft:50
  },
  
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

export default PatientInfo;