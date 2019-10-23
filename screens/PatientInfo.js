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

class PatientInfo extends React.Component {

  constructor(props){
    super(props);
    this.authListener=this.authListener.bind(this);
    this.addMedicineName=this.addMedicineName.bind(this);
    this.handleChange=this.handleChange.bind(this);
    this.handleMedicalExaminationsChange=this.handleMedicalExaminationsChange.bind(this);
    this.addMedicalExaminations=this.addMedicalExaminations.bind(this);
    this.submit=this.submit.bind(this);
        this.state={
      username:"",
      idDoctor:"",
      idPatient:'',
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
      patientData:[]
      
      
    }
  }

  componentDidMount(){
    this.authListener();
    //this.getLocation();
  }

  
  
  authListener(){
  
    const { navigation } = this.props;  
    var idD=navigation.getParam('idDoctor');
    var idP=navigation.getParam('idPatient');
    var date=navigation.getParam('date');
    var time=navigation.getParam('time');

     this.setState({
         idDoctor:idD,
         idPatient:idP,
         date:date,
         time:time
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
          if(!this.state.session ){alert("fill ");return;}
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
           
              //fire.database().ref("medicalExaminations").orderByChild("exam").equalTo(value.toLowerCase()).on('value',(snap)=>{
                
                //if(!snap.val()){
                  fire.database().ref("medicalExaminations").push().set({ 'exam':this.state.medicalExaminationName.trim()})
                //}
             // })
              
            
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
            'medicalExaminations':this.state.medicalExaminationName 
            
            
          }
          )
          fire.database().ref("users").child(this.state.idPatient).child("session").push().set(
            {
              'idDoctor':this.state.idDoctor,
              'sessionNumber':this.state.session,
            'process':pro,
            'money':this.state.money,
            'medicine':m ,////////////
            'medicalExaminations':this.state.medicalExaminationName 
              
            }
            )
          }
        }


        renderPatients(){
               fire.database().ref("users").child(this.state.idDoctor).child("patients").on('value',(snapshot)=>{
                let data = Object.values(snapshot.val());
                this.setState({patientData:data})

               })
        }


  render() {
    return (
      <Block flex style={styles.profile}>
        <Block flex>
         
        <Header
                  leftComponent={{ text: 'MY TITLE', style: { color: '#000' } }}
                  centerComponent={{ text: 'MY TITLE', style: { color: '#000' } }}
                  
           />
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ width, marginTop: '25%' }}
            >
              

                  <Block middle>
                  <Text>{this.state.username}</Text>
                  <Text>{this.state.email}</Text>
                  </Block>
                  

                  <View style={{width:width*0.4,marginTop:20,flex:1}}>
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
                             </View>
                  <View style={{flexDirection:'column',marginTop:150,marginLeft:50}}>
                   
                       <Input  
                             borderless
                             placeholder="Enter session Number"   
                             style={{width:width*0.5}}  
                             onChangeText={value => this.setState({session:value})}
                             keyboardType = 'numeric'
                             
                              />

                              <View style={{flexDirection:'column',borderRadius: 10, borderWidth: 1, borderColor: '#009688',marginRight:10}}>
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
                              <View style={{flexDirection:'column'}}>
                             <View style={{flexDirection:'row',marginLeft:50}}>
                             <CheckBox
                                       value={this.state.checkedMoney}
                                       onValueChange={() => this.setState({ checkedMoney: !this.state.checkedMoney })}
                                 />
                                  <Text style={{marginTop: 5}}>Paid </Text>
                             </View>
                             { this.state.checkedMoney &&<Input
                                 style={{marginTop:10,width:width*0.5}}  
                         keyboardType = 'numeric'
                        placeholder="Amount paid"
                        onChangeText={(money)=>this.setState({money})}
                        value={this.state.money}
                      /> }
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


                    <Button style={{width:width*0.5}} 
                    onPress={this.submit}>
                    <Text>add</Text>
                    
                    </Button>
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