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
import { slotCreator } from "react-native-slot-creator";

const { width, height } = Dimensions.get("screen");

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
    this.determineNextSession=this.determineNextSession.bind(this);
    this.hide=this.hide.bind(this);
    this.handleDatePicked=this.handleDatePicked.bind(this);
    this.hideDatePicker=this.hideDatePicker.bind(this);
    this.showDatePicker=this.showDatePicker.bind(this);

    this.handleDate=this.handleDate.bind(this);
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
      
      //next session
      nextSession:false,
      sessionDate:'',
      sessionDay:'',
      sessionTime:'',
      nextEnable:false
    }
  }

  componentDidMount(){
    this.authListener();
    //this.getLocation();
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

     var ar=[];
     fire.database().ref("users").child(this.state.idDoctor).child("workingHours").on('value',(work)=>{
       let workHour=Object.values(work.val());
       workHour.map(w=>{
         if(w.days == this.state.daySelected && w.enable){
          let requiredArray = slotCreator.createSlot(w.start,w.end,"30");//2 2.5 3 3.5

          requiredArray.map((slot,index)=>{
            fire.database().ref("users").child(this.state.idDoctor).child("appointment").on('value',(app)=>{
              let appointment=Object.values(app.val());
              appointment.map((ap)=>{
                if(ap.dateSelected == this.state.dateToSearch && ap.timeSelected==slot && ap.available){
                     ar.push({time:slot});
                }
                if(ap.dateSelected == this.state.dateToSearch && ap.timeSelected!=slot && !ap.available){
                  ar.push({time:slot});
             }

              })//app map
            })//app fire
          })//slot arrays
         }
         else{
           alert("noo")
         }
       })//work map
       

     })
     this.setState({
      availableSlots:ar
    })
    this.state.availableSlots.map((s)=>{
      alert(s.time+"\n");
    })
  }

  handleDatePicked =pickeddate=> {
    const day   = pickeddate.getDate();
    const dayName=pickeddate.getDay();
    const  month = pickeddate.getMonth()+1;
    const  year  = pickeddate.getFullYear();
      

    const hours = pickeddate.getHours();
const minutes = pickeddate.getMinutes();
var h=`${hours}`;
var m=`${minutes}`;
if(h.length==1){h=`0${h}`}
if(m.length==1){m=`0${m}`}

const timeSelected=h+":"+m;

  this.setState({
    timeToSearch:timeSelected
  })
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


       fire.database().ref("users").child(this.state.idDoctor).child("appointment").on('value',(snap)=>{
        if(snap.val()){
let appointments = Object.values(snap.val());
this.setState({appointmentChange:appointments});
this.state.appointmentChange.map((value,index)=>{
  //بدي الف ع المواعيد و اروح ع الموعد يلي بدي اياه و بعدين اشوف بقدر اغيره للموعد الجديد او لا 
  //بعدين بدي اشوف بزبط اعدله للموعد الجديد ولا لا
  if(value.timeSelected==this.state.timeToSearch && value.available && value.dateSelected==this.state.dateToSearch ){

    
    fire.database().ref("users").child(this.state.idDoctor).child("workingHours").on('value',(workHours)=>{
      if(workHours.val()){
        let work = Object.values(workHours.val());
        this.setState({workingHour:work}) 
        this.state.workingHour.map((w,ind)=>{
            if(w.days==this.state.daySelected && w.enable && this.state.timeToSearch >= w.start && this.state.timeToSearch <= w.end ){
              this.setState({
                change:true
              })
             
              // this.setState({
              //   date:this.state.dateToSearch,
              //   time:this.state.timeToSearch
              // })
            }//if working hour
            
        })//map work hour
      }
        
   })//work hour firebase

  }//فحص اول إف

  if(value.timeSelected !=this.state.timeToSearch || value.dateSelected !=this.state.dateToSearch ){
                                  
    
    fire.database().ref("users").child(this.state.idDoctor).child("workingHours").on('value',(workHours)=>{//////
     if(workHours.val()){
       let work = Object.values(workHours.val());
       this.setState({workingHour:work}) 
       this.state.workingHour.map((w,ind)=>{

           if(w.days==this.state.daySelected && w.enable && this.state.timeToSearch >= w.start && this.state.timeToSearch <= w.end ){
            this.setState({
              change:true
            })

            // this.setState({
            //   date:this.state.dateToSearch,
            //   time:this.state.timeToSearch
            // })
           }//نهاية الأف التانية
        
          
           
       })
     }
       
  })
}

else{
  this.setState({
    change:false
  })
  // alert("choose other time");
}


})
        }

      })

      if(this.state.change){

        fire.database().ref("users").child(this.state.idDoctor).child("appointment").on('value',(s)=>{
          let appointments = Object.values(s.val());
          this.setState({app:appointments});
          this.state.app.map((v,ind)=>{
            if(v.idPatient == this.state.idPatient && v.dateSelected ==this.state.date && v.timeSelected==this.state.time){//وصلت الموعد يلي بدي اغيره
              fire.database().ref("users").child(this.state.idDoctor).child("appointment").child(Object.keys(s.val())[ind]).child("timeSelected").set(this.state.timeToSearch);
              fire.database().ref("users").child(this.state.idDoctor).child("appointment").child(Object.keys(s.val())[ind]).child("dateSelected").set(this.state.dateToSearch);
              fire.database().ref("users").child(this.state.idDoctor).child("appointment").child(Object.keys(s.val())[ind]).child("daySelected").set(this.state.daySelected);

            }
          })//app doctor map
         
        })//app doctor

        fire.database().ref("users").child(this.state.idPatient).child("appointment").on('value',(snapshot)=>{
          if(snapshot.val()){
  let appointments = Object.values(snapshot.val());
  this.setState({app:appointments});
  this.state.app.map((va,i)=>{
  if(va.idDoctor == this.state.idDoctor && va.dateSelected ==this.state.date && va.timeSelected==this.state.time){
  
  fire.database().ref("users").child(this.state.idPatient).child("appointment").child(Object.keys(snapshot.val())[i]).child("timeSelected").set(this.state.timeToSearch);
  fire.database().ref("users").child(this.state.idPatient).child("appointment").child(Object.keys(snapshot.val())[i]).child("dateSelected").set(this.state.dateToSearch);
  fire.database().ref("users").child(this.state.idPatient).child("appointment").child(Object.keys(snapshot.val())[i]).child("daySelected").set(this.state.daySelected);
  
  }
  })//map app p
          }
  
        })//app patient

        alert("The time is changed to "+this.state.dateToSearch+"\n"+this.state.timeToSearch);
      }//end change if
  
      if(!this.state.change){
        alert("this time not available")
      }
      
    }//end handle


   


    hideDatePicker=()=>{
      this.setState({dateVisible:false})
 }

    showDatePicker = () => {
        this.setState({ dateVisible: true });
      };
  

      determineNextSession=date=>{
        const day   = date.getDate();
        const dayName=date.getDay();
        const  month = date.getMonth()+1;
        const  year  = date.getFullYear();
          
    
        const hours = date.getHours();
    const minutes = date.getMinutes();
    var h=`${hours}`;
    var m=`${minutes}`;
    if(h.length==1){h=`0${h}`}
    if(m.length==1){m=`0${m}`}
    
    const timeSelected=h+":"+m;
    
      this.setState({
        sessionTime:timeSelected
      })
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


           fire.database().ref("users").child(this.state.idDoctor).child("appointment").on('value',(snap)=>{
            if(snap.val()){
    let appointments = Object.values(snap.val());
    this.setState({appointmentChange:appointments});
    this.state.appointmentChange.map((value,index)=>{
      //بدي الف ع المواعيد و اروح ع الموعد يلي بدي اياه و بعدين اشوف بقدر اغيره للموعد الجديد او لا 
      //بعدين بدي اشوف بزبط اعدله للموعد الجديد ولا لا
      if(value.timeSelected==this.state.sessionTime && value.available && value.dateSelected==this.state.sessionDate ){
    
        
        fire.database().ref("users").child(this.state.idDoctor).child("workingHours").on('value',(workHours)=>{
          if(workHours.val()){
            let work = Object.values(workHours.val());
            this.setState({workingHour:work}) 
            this.state.workingHour.map((w,ind)=>{
                if(w.days==this.state.sessionDay && w.enable && this.state.sessionTime >= w.start && this.state.sessionTime <= w.end ){
                  this.setState({
                    nextEnable:true
                  })
                }//if working hour
                
            })//map work hour
          }
            
       })//work hour firebase
    
      }//فحص اول إف
    
      if(value.timeSelected !=this.state.sessionTime || value.dateSelected !=this.state.sessionDate ){
                                      
        
        fire.database().ref("users").child(this.state.idDoctor).child("workingHours").on('value',(workHours)=>{//////
         if(workHours.val()){
           let work = Object.values(workHours.val());
           this.setState({workingHour:work}) 
           this.state.workingHour.map((w,ind)=>{
    
               if(w.days==this.state.sessionDay && w.enable && this.state.sessionTime >= w.start && this.state.sessionTime <= w.end ){
                this.setState({
                  nextEnable:true
                })
    
               }//نهاية الأف التانية
               
           })
         }
           
      })
    }
    
    else{
      this.setState({
        nextEnable:false
      })
      // alert("choose other time");
    }
    
    
    })
            }
    
          })

          if(this.state.nextEnable){
            fire.database().ref("users").child(this.state.idDoctor).child("appointment").push().set({
              'idPatient':this.state.idPatient,
              'daySelected':this.state.sessionDay,
              'dateSelected':this.state.sessionDate,
              'timeSelected':this.state.sessionTime,
              'clinicName':this.state.clinic,
              'available':false
          });

          fire.database().ref("users").child(this.state.idPatient).child("appointment").push().set({
            'idDoctor':this.state.idDoctor,
            'daySelected':this.state.sessionDay,
              'dateSelected':this.state.sessionDate,
              'timeSelected':this.state.sessionTime,
            'clinicName':this.state.clinic,
            'available':false
        });

        alert("added successfully!")
          }

          if(!this.state.nextEnable){
            alert("not available");
          }


      }



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
          if(this.state.medicinesName){
            var array=this.state.medicinesName;
            array.forEach((value,index)=>{
              if(value !== ""){
                fire.database().ref("medicines").orderByChild("medicine").equalTo(value.toLowerCase()).on('value',(snap)=>{
                  //alert("1");
                  m+=value.trim()+"\n";
                  if(!snap.val()){
                    fire.database().ref("medicines").push().set({ 'medicine':value.toLowerCase().trim()})
                  }
                })
              }
            })
          }
          if(!this.state.medicinesName){
            m+="no medicine";
          }
          if(this.state.medicalExaminationName){
           
              fire.database().ref("medicalExaminations").orderByChild("exam").equalTo(this.state.medicalExaminationName.trim()).on('value',(snap)=>{
                if(!snap.val()){
                  fire.database().ref("medicalExaminations").push().set({ 'exam':this.state.medicalExaminationName.trim()})
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
            'medicine':m ,////////////
            'medicalExaminations':this.state.medicalExaminationName ,
            'time':this.state.time,
            'date':this.state.date,
            'clinic':this.state.clinic
            
          }
          )
          fire.database().ref("users").child(this.state.idPatient).child("session").push().set(
            {
            'idDoctor':this.state.idDoctor,
            'sessionNumber':this.state.session,
            'process':pro,
            'money':this.state.money,
            'medicine':m ,////////////
            'medicalExaminations':this.state.medicalExaminationName ,
            'time':this.state.time,
            'date':this.state.date,
            'clinic':this.state.clinic
              
            }
            )
            alert("added successfully!")
          }
        }


        


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
                  <Text style={{color:"#004D40"}}>name:</Text>
                  <Text style={{color:"#004D40"}}>{this.state.username}</Text>
                  
                  </View>
                  <View style={{flexDirection:'row'}}>
                    <Text style={{color:"#004D40"}}>email:</Text>
                    <Text style={{color:"#004D40"}}>{this.state.email}</Text>
                  </View>
                  </View>
                  </Block>
                  <Divider style={{backgroundColor:'#000000',width:width*0.9}}/>

                  <View style={{flexDirection:'row'}}>
              <Button
                      onPress={this.showDatePicker}
                      style={{backgroundColor:'#00897B',marginLeft:80,marginTop:80,width:width*0.5}}
                      textStyle={{
                        color: "#fff",
                        fontWeight: "500",
                        fontSize: 16
                      }}
                      >
                              <Text>{this.state.dateToSearch || "change time"} </Text>
                      </Button>

                      <View style={{marginTop:20,flexDirection:'column'}}>

                        {this.state.availableSlots.map((slot,index)=>{
                                 <View>
                             <Text>{slot.time}</Text>
                                </View>
                                       })}
                      </View>
                      <Divider style={{backgroundColor:'#000000',width:width*0.9}}/>

                      <DateTimePicker
                       isVisible={this.state.dateVisible}
                       onConfirm={this.handleDate}
                       onCancel={this.hideDatePicker}
                       mode={'date'}
                       datePickerModeAndroid={'spinner'}
                             />


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
                  <View style={{flexDirection:'column',marginTop:50,marginLeft:50}}>
                   
                       <Input  
                             borderless
                             placeholder="Enter session Number"   
                             style={{width:width*0.5,marginLeft:50}}  
                             onChangeText={value => this.setState({session:value})}
                             keyboardType = 'numeric'
                             
                              />

                              <View style={{flexDirection:'column',marginLeft:10}}>
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
                              <View style={{flexDirection:'row',marginLeft:50}}>
                             {/* <View style={{flexDirection:'row'}}>
                             <CheckBox
                                       value={this.state.checkedMoney}
                                       onValueChange={() => this.setState({ checkedMoney: !this.state.checkedMoney })}
                                 />
                                  <Text style={{marginTop: 5}}>Paid </Text>
                             </View> */}
                             <Input
                                 style={{marginTop:10,width:width*0.5}}  
                         keyboardType = 'numeric'
                        placeholder="Amount paid"
                        onChangeText={(money)=>this.setState({money})}
                        value={this.state.money}
                      /> 
                             </View>
                             
                              {this.state.medicinesName.map((name,index)=>{
                      return(
                          <View key={index} style={{marginLeft:50,width:width*0.5}}>
                          <Input
                        
                        borderless
                        placeholder="medicine name"
                        onChangeText={(Mname)=>this.handleChange(Mname,index)}
                        value={name}
                        iconContent={
                            <Icon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name="shop"
                            family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                          
                        }
                      />
                          </View>
                      )
                    })}

                    <Button
                      style={{ backgroundColor: argonTheme.COLORS.GRADIENT_START,marginTop:10, width: width * 0.5,borderRadius:10,marginLeft:50}}
                      onPress={this.addMedicineName}
                    >
                     add medicine name
                    </Button>


                   
                          <View style={{marginLeft:50,width:width*0.5}}>
                          <Input
                        
                        borderless
                        placeholder="medical examinations"
                        onChangeText={value => this.setState({medicalExaminationName:value})}
                        value={this.state.medicalExaminationName}
                        iconContent={
                            <Icon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name="shop"
                            family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                        }
                        />

                                  </View>

                     <View style={{flexDirection:'row',marginLeft:5}}>
                    <Button  
                    style={{width:width*0.3,backgroundColor:'#333'}} 
                    onPress={this.submit}>
                    <Text>add</Text>
                    
                    </Button>

                    <Button  
                    style={{width:width*0.3,backgroundColor:"#333",marginLeft:15}} 
                    onPress={()=>this.setState({nextSession:true})}
                    >
                    <Text>{this.state.sessionDate || "next session"}</Text>
                    
                    </Button>
                    </View>
                    <DateTimePicker
                       isVisible={this.state.nextSession}
                       onConfirm={this.determineNextSession}
                       onCancel={this.hide}
                       mode={'datetime'}
                       datePickerModeAndroid={'spinner'}
                             />
                    </View>

               
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

export default PatientInfo;