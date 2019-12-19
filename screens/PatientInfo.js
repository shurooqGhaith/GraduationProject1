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
import Icon from "react-native-vector-icons/MaterialIcons";
import { Button,Input } from "../components";
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
    this.showInfoForm=this.showInfoForm.bind(this);
        this.state={
      username:"",
      patientName:'',
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
      checkedBridgeInstallation:false,
      checkedImplant:false,
      checkedExtraction:false,
      checkedNerve:false,
      checkedProsthodontics:false,
      checkedGumSurgery:false,
      checkedDentalSize:false,
      checkedTeethWhitening:false,
      checkedOrthodonticsInstallation:false,

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
      showForm:true,
      notes:'',
      showMedicine:false,
      showExam:false,
      showProcess:false

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

    var d=`${day}`;
    if(d.length==1){d=`0${d}`}
    var m=`${month}`;
    if(m.length==1){m=`0${m}`}

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
      sessionDate:year + '-' + m + '-' + d
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
    if(ar.length==0){this.setState({nextEnable:false})}
     this.setState({
      sessionAvailable:ar,
      showModal2:true,
      showForm:false
      
    })


  }
  makeNextSessionAppointment(time){

    fire.database().ref("users").child(this.state.idDoctor).child("appointment").push().set({
      'idPatient':this.state.idPatient,
      'daySelected':this.state.sessionDay,
      'dateSelected':this.state.sessionDate,
      'timeSelected':time,
      'clinicName':this.state.clinic,
      'patientName':this.state.patientName,
      'doctorName':this.state.username,
      'available':false
  }).then(()=>{
    fire.database().ref("users").child(this.state.idPatient).child("appointment").push().set({
      'idDoctor':this.state.idDoctor,
      'daySelected':this.state.sessionDay,
      'dateSelected':this.state.sessionDate,
      'timeSelected':time,
      'clinicName':this.state.clinic,
      'patientName':this.state.patientName,
      'doctorName':this.state.username,
      'available':false
  });
  /////////

  this.setState({isShow:true,msg:'Added successfully !'});
  setTimeout(function(){
   this.setState({isShow:false});
   this.props.navigation.navigate("DoctorAppointment",{id:this.state.idDoctor});
  }.bind(this),5000);


  }).catch((error)=>{
    this.setState({isShow:true,msg:error.message});
    setTimeout(function(){
     this.setState({isShow:false});
    }.bind(this),5000);
  });

   // alert("The time is changed to "+this.state.dateToSearch+"\n"+this.state.timeToSearch);
   // this.setState({availableSlots:[]});
  
   //this.setState({showModal2:false});
  }

  handleDate =pickeddate=> {
  
    const day   = pickeddate.getDate();
    const dayName=pickeddate.getDay();
    const  month = pickeddate.getMonth()+1;
    const  year  = pickeddate.getFullYear();
//
    var d=`${day}`;
    if(d.length==1){d=`0${d}`}
    var m=`${month}`;
    if(m.length==1){m=`0${m}`}

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
      dateToSearch:year + '-' + m + '-' + d
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
  console.log(ar.length);
  if(ar.length==0){this.setState({change:false})}
  console.log(this.state.change);
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
  this.props.navigation.navigate("DoctorAppointment",{id:this.state.idDoctor});

})//then end

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
      patientName:datasnapshot.val()
    })
 })
 fire.database().ref("users").child(idD).child("name").on('value',(datasnapshot)=>{
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
         if(this.state.medicinesName){
            var array=this.state.medicinesName;
            if(this.state.medicine){array.push(this.state.medicine)}
            array.forEach((value,index)=>{
              if(value !== ""){
                fire.database().ref("users").child(this.state.idDoctor).child("medicines").push().set({
                  idPatient:this.state.idPatient,
                  sessionNumber:this.state.session,
                  medicine:value
                })
                fire.database().ref("users").child(this.state.idPatient).child("medicines").push().set({
                  idDoctor:this.state.idDoctor,
                  sessionNumber:this.state.session,
                  medicine:value,
                  'time':this.state.time,
                  'date':this.state.date,
                })

                fire.database().ref("medicines").orderByChild("medicine").equalTo(value.toLowerCase()).on('value',(snap)=>{
                  //alert("1");
                  m+=value.trim()+"\n";
                  if(!snap.val()){
                    fire.database().ref("medicines").push().set({ 'medicine':value.toLowerCase().trim()})
                  }
                })
              }
            }) //array map
         } // medicines if 
          if(!this.state.medicinesName){
            m+="no medicine";
          }
          if(this.state.medicalExaminations){
            var array2=this.state.medicalExaminations;
            if(this.state.medicalExaminationName){array2.push(this.state.medicalExaminationName)}
            array2.forEach((value,index)=>{
              if(value !== ""){
                fire.database().ref("users").child(this.state.idDoctor).child("checkup").push().set({
                  idPatient:this.state.idPatient,
                  sessionNumber:this.state.session,
                  exam:value
                });
                fire.database().ref("users").child(this.state.idPatient).child("checkup").push().set({
                  idDoctor:this.state.idDoctor,
                  sessionNumber:this.state.session,
                  exam:value,
                  'time':this.state.time,
                 'date':this.state.date
                });
                fire.database().ref("medicalExaminations").orderByChild("exam").equalTo(value.toLowerCase()).on('value',(snap)=>{
                  //alert("1");
                  console.log(value+"\n");
                  m1+=value.trim()+"\n";
                  if(!snap.val()){
                    fire.database().ref("medicalExaminations").push().set({ 'exam':value.toLowerCase().trim()})
                  }
                })
              }
            })
           console.log(m1);//empty
         } //medical exam if
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
          if(this.state.checkedBridgeInstallation){process.push("Bridge installation");pro+="Bridge installation\n"}
          if(this.state.checkedImplant){process.push("Implant");pro+="Implant\n"}
          if(this.state.checkedExtraction){process.push("Extraction");pro+="Extraction\n"}
          if(this.state.checkedNerve){process.push("Remove the Nerve");pro+="Remove the Nerve\n"}
          if(this.state.checkedProsthodontics){process.push("Prosthodontics");pro+="Prosthodontics\n"}
          if(this.state.checkedGumSurgery){process.push("Gum Surgery");pro+="Gum Surgery\n"}
          if(this.state.checkedDentalSize){process.push("Take dental sizes");pro+="Take dental sizes\n"}
          if(this.state.checkedTeethWhitening){process.push("Teeth whitening");pro+="Teeth whitening\n"}
          if(this.state.checkedOrthodonticsInstallation){process.push("Orthodontics installation");pro+="Orthodontics installation\n"}

          if(!this.state.checkedPermanent && !this.state.checkedTemporary && !this.state.checkedRepairing && !this.state.checkedWindmillDressing){
                process.push("nothing done");
                pro+="nothing done yet !";
          }

          process.forEach((value,index)=>{
            fire.database().ref("users").child(this.state.idDoctor).child("processes").push().set({
              idPatient:this.state.idPatient,
              sessionNumber:this.state.session,
              process:value
            });
            fire.database().ref("users").child(this.state.idPatient).child("processes").push().set({
              idDoctor:this.state.idDoctor,
              sessionNumber:this.state.session,
              process:value,
              'time':this.state.time,
              'date':this.state.date
            });
          });
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
            alert("added successfully!");
            this.setState({showForm:false});
          }
        }
//end submit

        showInfoForm(){
          fire.database().ref("users").child(this.state.idPatient).child("appointment").once('value',(result)=>{
            if(result.val()){
                let appointment = Object.values(result.val());
                this.setState({appointmentsPatient:appointment})
                //map appointments state
                this.state.appointmentsPatient.map((element,index)=>{
                    if(element.timeSelected==this.state.time  && element.dateSelected==this.state.date && element.idDoctor==this.state.idDoctor  ){                         
                      if(element.available){
                        alert("You entered this info")
                      }
                      if(!element.available){
                        this.setState({
                          showForm:true
                        })
                      }
                    }
                })
            }
        });

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
                  <View style={{flexDirection:'row',marginTop:10}}>
                          <View style={{flexDirection:'column',marginLeft:20}}>
                              <Text bold size={14} style={{color:'#004D40'}}>Name</Text>
                              <Text style={{color:'#aaa'}}>{this.state.patientName}</Text>
                          </View>

                          <View style={{flexDirection:'column',marginLeft:60}}>
                              <Text bold size={14} style={{color:'#004D40'}}>Email</Text>
                              <Text style={{color:'#aaa'}}>{this.state.email}</Text>
                          </View>
                       </View>
                  </Block>
                  <Divider style={{backgroundColor:'#000000',width:width}}/>

                  {/* <View style={{flexDirection:'row'}}>
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
                      onPress={this.showInfoForm}
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

                  </View> */}

                  <View style={{marginTop:100,flexDirection:'row',alignItems:'center'}}>
                  <Toast visible={this.state.flag} message={this.state.msg}/> 
                  <Modal transparent={true} visible={this.state.showModal}>
                  <View style={{backgroundColor:'#ffffff80',flexDirection:'row',marginTop:250,alignItems:'center',justifyContent:'center',height:height*0.3}}>
                  <View style={{backgroundColor: '#ffffff80',alignItems:'center' ,padding: 50,width:width*0.8,height:height*0.3}}>
                  <Text style={{color:'#3E2723'}}>Available times </Text>
                  <ScrollView showsVerticalScrollIndicator={true}>
                  <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                      
                  {this.state.change && this.state.availableSlots.map((slot,index)=>{
                      if(slot.time){
                           return(
                                   <View style={{marginTop:5}} key={index} >
                                     <Button style={{backgroundColor:'#eee',marginLeft:10}} small onPress={()=>this.changeTime(slot.time)}>
                                     <Text style={{color:'#00897b'}}>{slot.time}</Text>
                                      </Button>
                                      </View>
                              )
                            }
                })}
                {!this.state.change && <View style={{marginTop:5}} >
                                     <Text style={{color:'#00897b'}}>Doctor is busy at this day</Text>
                                     <Button small style={{marginTop:5,marginLeft:35,backgroundColor:'#3E2723'}} onPress={()=>this.setState({showModal:false})}><Text>cancel</Text></Button>

                                      </View> }
                </View>
                {this.state.change && <View>
                  <Button small style={{marginTop:5,marginLeft:50,backgroundColor:'#3E2723'}} onPress={()=>this.setState({showModal:false})}><Text>cancel</Text></Button>

                </View>}
                  </ScrollView>
                      </View>
                 </View>
                  </Modal>
</View>


                  
                 {this.state.showForm && <View style={{flexDirection:'column'}}>
                   <View style={{flexDirection:'row'}}>
                       <TextInput  
                             value={this.state.session}
                             placeholder="session Number"   
                             style={{width:width*0.4,marginLeft:30,borderRadius: 5,borderWidth: 0.5,borderColor: '#fff',backgroundColor:'#fff',paddingLeft:5 }}  
                             onChangeText={value => this.setState({session:value})}
                             keyboardType = 'numeric'
                              />

                        <TextInput
                                 style={{marginLeft:10,width:width*0.4,borderRadius: 5,borderWidth: 1,borderColor: '#fff',backgroundColor:'#fff',paddingLeft:5}}  
                                  keyboardType = 'numeric'
                                 placeholder="Money paid"
                                 onChangeText={(money)=>this.setState({money})}
                                 value={this.state.money}
                               /> 
                               </View>
                               <View style={{width:width*0.9}}>
                               <TouchableOpacity style={styles.row} onPress={()=>this.setState({showProcess:!this.state.showProcess})}>
                <Text color={this.state.showProcess ? '#4A148C' : '#333'}>Add process</Text>
                <Icon name={this.state.showProcess ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} 
                color={this.state.showProcess ? '#4A148C' : '#333'} />
            </TouchableOpacity>
                   {this.state.showProcess && 
                              <View style={{flexDirection:'column',marginLeft:40}}>
                              <View style={{flexDirection:'row' }}>
                              <CheckBox
                                       value={this.state.checkedTemporary}
                                       onValueChange={() => this.setState({ checkedTemporary: !this.state.checkedTemporary })}
                                 />
                                  <Text style={{marginTop: 5}}> Temporary dental filling</Text>
                                  </View>
                                  <View style={{flexDirection:'row'}} >
                                  <CheckBox
                                       value={this.state.checkedPermanent}
                                       onValueChange={() => this.setState({ checkedPermanent: !this.state.checkedPermanent })}
                                 />
                                  <Text style={{marginTop: 5}}> Permanent dental filling</Text>
                                  </View>
                              <View style={{flexDirection:'row'}}>
                              <View style={{flexDirection:'row'}} >
                              <CheckBox
                                       value={this.state.checkedRepairing}
                                       onValueChange={() => this.setState({ checkedRepairing: !this.state.checkedRepairing })}
                                 />
                                  <Text style={{marginTop: 5}}> Repairing</Text>
                                  </View>
                                  <View style={{flexDirection:'row'}} >
                                  <CheckBox
                                       value={this.state.checkedWindmillDressing}
                                       onValueChange={() => this.setState({ checkedWindmillDressing: !this.state.checkedWindmillDressing })}
                                 />
                                  <Text style={{marginTop: 5}}> Windmill Dressing</Text>
                                  </View>
                                  </View>
                                 <View style={{flexDirection:'row'}}>
                                  <View style={{flexDirection:'row'}}>
                                  <CheckBox
                                       value={this.state.checkedBridgeInstallation}
                                       onValueChange={() => this.setState({ checkedBridgeInstallation: !this.state.checkedBridgeInstallation })}
                                 />
                                  <Text style={{marginTop: 5}}> Bridge installation</Text>
                                  </View>

                                  <View style={{flexDirection:'row'}} >
                                  <CheckBox
                                       value={this.state.checkedImplant}
                                       onValueChange={() => this.setState({ checkedImplant: !this.state.checkedImplant })}
                                 />
                                  <Text style={{marginTop: 5}}> Implant</Text>
                                  </View>
                                    </View>
                                    <View style={{flexDirection:'row'}}>
                                  <View style={{flexDirection:'row'}} >
                                  <CheckBox
                                       value={this.state.checkedExtraction}
                                       onValueChange={() => this.setState({ checkedExtraction: !this.state.checkedExtraction })}
                                 />
                                  <Text style={{marginTop: 5}}> Extraction</Text>
                                  </View>
                                  <View style={{flexDirection:'row'}}>
                                  <CheckBox
                                       value={this.state.checkedNerve}
                                       onValueChange={() => this.setState({ checkedNerve: !this.state.checkedNerve })}
                                 />
                                  <Text style={{marginTop: 5}}> Remove the nerve</Text>
                                  </View>
                                    </View>
                                    <View style={{flexDirection:'row'}}>
                                  <View style={{flexDirection:'row'}} >
                                  <CheckBox
                                       value={this.state.checkedProsthodontics}
                                       onValueChange={() => this.setState({ checkedProsthodontics: !this.state.checkedProsthodontics })}
                                 />
                                  <Text style={{marginTop: 5}}>Prosthodontics</Text>
                                  </View>

                                  <View style={{flexDirection:'row'}} >
                                  <CheckBox
                                       value={this.state.checkedGumSurgery}
                                       onValueChange={() => this.setState({ checkedGumSurgery: !this.state.checkedGumSurgery })}
                                 />
                                  <Text style={{marginTop: 5}}>Gum surgery</Text>
                                  </View>
                                  </View>
                                  <View style={{flexDirection:'row'}} >
                                  <CheckBox
                                       value={this.state.checkedDentalSize}
                                       onValueChange={() => this.setState({ checkedDentalSize: !this.state.checkedDentalSize })}
                                 />
                                  <Text style={{marginTop: 5}}>Take dental sizes</Text>
                                  </View>
                                  <View style={{flexDirection:'row'}} >
                                  <CheckBox
                                       value={this.state.checkedTeethWhitening}
                                       onValueChange={() => this.setState({ checkedTeethWhitening: !this.state.checkedTeethWhitening })}
                                 />
                                  <Text style={{marginTop: 5}}>Teeth whitening</Text>
                                  </View>
                                  <View style={{flexDirection:'row'}} >
                                  <CheckBox
                                       value={this.state.checkedOrthodonticsInstallation}
                                       onValueChange={() => this.setState({ checkedOrthodonticsInstallation: !this.state.checkedOrthodonticsInstallation })}
                                 />
                                  <Text style={{marginTop: 5}}>Orthodontics installation</Text>
                                  </View>
                              </View>
                                }
                                </View>
                                <Divider style={{backgroundColor:'#000000',marginTop:10,width:width*0.9}}/>

                   <View style={{width:width*0.9}}>
                   <TouchableOpacity style={styles.row} onPress={()=>this.setState({showMedicine:!this.state.showMedicine})}>
                <Text  color={this.state.showMedicine ? '#4A148C' : '#333'}>Add Medicine</Text>
                <Icon name={this.state.showMedicine ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} 
                 color={this.state.showMedicine ? '#4A148C' : '#333'} />
            </TouchableOpacity>

            <View>
              {this.state.showMedicine && <View>
                <Button
                      small
                      style={{ backgroundColor:'#004',marginTop:10,borderRadius:5,marginLeft:50}}
                      onPress={this.addMedicineName}
                    >
                     Add  
                    </Button>
                    {this.state.medicinesName.map((name,index)=>{
                      return(
                          <View key={index} style={{marginLeft:50,width:width*0.5}}>
                          <TextInput
                        
                        style={{borderRadius: 5,borderWidth: 0.5,borderColor: '#fff',backgroundColor:'#fff',marginTop:10,marginTop:10,paddingLeft:5}}
                        placeholder="medicine name"
                        onChangeText={(Mname)=>this.handleChange(Mname,index)}
                        value={name}
                      />
                          </View>
                      )
                    })}
              </View>}
            </View>
                   </View>
                   <Divider style={{backgroundColor:'#000000',marginTop:10,width:width*0.9}}/>

                    <View style={{width:width*0.9}} >
                    <TouchableOpacity style={styles.row} onPress={()=>this.setState({showExam:!this.state.showExam})}>
                <Text  color={this.state.showExam ? '#4A148C' : '#333'}>Add Medical checkup</Text>
                <Icon name={this.state.showExam ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} 
                color={this.state.showExam ? '#4A148C' : '#333'} />
            </TouchableOpacity>

             <View>
               {this.state.showExam && <View>
                <Button
                      small
                      style={{ backgroundColor: '#004',marginTop:10,borderRadius:5,marginLeft:50}}
                      onPress={this.addMedicalExaminations}
                    >
                     Add
                    </Button>

                    {this.state.medicalExaminations.map((name,index)=>{
                      return(
                          <View key={index} style={{marginLeft:50,width:width*0.5}}>
                          <TextInput
                        style={{borderRadius: 5,borderWidth: 0.5,borderColor: '#fff',backgroundColor:'#fff',marginTop:10,paddingLeft:5}}
                        placeholder="medical exam"
                        onChangeText={(Mname)=>this.handleMedicalExaminationsChange(Mname,index)}
                        value={name}
                      />
                          </View>
                      )
                    })}
               </View>}
             </View>
            </View>
                    
            <Divider style={{backgroundColor:'#000000',marginTop:10,width:width*0.9}}/>
   
                          
<View style={{marginTop:30}} >
    <TextInput
      style={{width:width*0.8,backgroundColor:"#fff",marginLeft:40}}
      underlineColorAndroid="transparent"
      placeholder="Notes"
      placeholderTextColor="grey"
      numberOfLines={4}
      multiline={true}
      onChangeText={(text) => this.setState({notes:text})}
       value={this.state.notes}
    />
  </View>
                             
                                  

                     <View style={{flexDirection:'row',marginLeft:60,marginTop:20}}>
                    <Button  
                    style={{width:width*0.3,backgroundColor:'#006'}} 
                    onPress={this.submit}>
                    <Text color='#fff'>add</Text>
                    
                    </Button>

                    <Button  
                    style={{width:width*0.3,backgroundColor:"#006",marginLeft:15}} 
                    onPress={()=>this.setState({nextSession:true})}
                    >
                    <Text color='#fff'>{this.state.sessionDate || "next session"}</Text>
                    
                    </Button>
                    </View>
                    <DateTimePicker
                       isVisible={this.state.nextSession}
                       onConfirm={this.handleNextSession}
                       onCancel={this.hide}
                       mode={'date'}
                       datePickerModeAndroid={'spinner'}
                             />


                    </View>
                 }
                 <View style={{marginTop:200,flexDirection:'row',alignItems:'center'}}>
<Toast visible={this.state.isShow} message={this.state.msg}/> 
                  <Modal transparent={true} visible={this.state.showModal2}>
                  <View style={{backgroundColor:'#ffffff80',flexDirection:'row',marginTop:250,alignItems:'center',justifyContent:'center',height:height*0.3}}>
                  <View style={{backgroundColor: '#ffffff80',alignItems:'center' ,padding: 50,width:width,height:height*0.8}}>
                  <Text style={{color:'#000'}}>Available times </Text>
                  <ScrollView showsVerticalScrollIndicator={true}>
                  <View style={{flexDirection:'row',flexWrap:'wrap'}}>

                  {this.state.nextEnable && this.state.sessionAvailable.map((slot,index)=>{
                       if(slot.time){
                               return(
                                   <View style={{marginTop:5}} key={index}>
                             <Button style={{backgroundColor:'#fff',marginLeft:10,width:width*0.3}}  onPress={()=>this.makeNextSessionAppointment(slot.time)}>
                                  <Text style={{color:'#004'}}>{slot.time}</Text>
                                 </Button>
                                            </View>
                                                       ) }
                })}

                {!this.state.nextEnable && <View style={{marginTop:150}} >
                                     <Text style={{color:'#000'}}>No available time at this day</Text>
                                     <Button small style={{marginTop:5,marginLeft:45,backgroundColor:'#3E2723'}} onPress={()=>this.setState({sessionDate:'',showModal2:false,showForm:true})}>
                                     <Text color='#fff'>cancel</Text></Button>

                                      </View> }

                     </View>
                     {this.state.nextEnable &&
                      <Button small style={{marginTop:5,marginLeft:90,backgroundColor:'#3E2723'}} onPress={()=>this.setState({sessionDate:'',showModal2:false,showForm:true})}>
                      <Text color='#fff'>cancel</Text></Button>

                     }
                  </ScrollView>
                      </View>
                 </View>
                  </Modal>
</View>

            </ScrollView>
          
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  
  row:{
    flexDirection: 'row',
    justifyContent:'space-between',
    height:56,
    paddingLeft:25,
    paddingRight:18,
    alignItems:'center',
    backgroundColor: "#eee",
},
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
    justifyContent: "flex-start",
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