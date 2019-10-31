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
  FlatList,
  Modal,
  TouchableHighlight,
  Alert
} from "react-native";
import { Block, Text, theme } from "galio-framework";
import { Table, TableWrapper, Row, Cell, Col,Rows } from 'react-native-table-component';
import { Button } from "../components";
import { Images, argonTheme } from "../constants";
import { HeaderHeight } from "../constants/utils";
import fire from "../constants/firebaseConfigrations";
import DateTimePicker from "react-native-modal-datetime-picker";
import MapView,{Marker} from "react-native-maps";
import { Divider,Icon } from 'react-native-elements';
import { slotCreator } from "react-native-slot-creator";
const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

class AppointmentTable extends React.Component {

  constructor(props){
    super(props);
    this.authListener=this.authListener.bind(this);
    this.createTable=this.createTable.bind(this);
        this.state={
            head:["","exist","clinic"],
      workingHour:[],
      appointment:[],
      slot:[],
      days:[],
      dates:[],
      hours:[],
      username:"",
      email:'',
      id:"",
      today:'',
      nodata:false,
      noApp:false,
      noSlot:false,
      
      no1:true,
      day1:[],
      day2:[],
      day3:[],
      day4:[],
      day5:[],
      day6:[],
      day7:[],
    }
  }

  componentDidMount(){
    this.createTable();
  }

  createTable(){

    const { navigation } = this.props;  
    var id=navigation.getParam('id');
  
    //today 31-10
    var d;
    var today=new Date();
    const day   = today.getDate();
    const dayName=today.getDay();
    const  month = today.getMonth()+1;
    const  year  = today.getFullYear();

    if(dayName==0){ d = "sunday" ; }
    if(dayName==1){ d = "monday" ; }
    if(dayName==2){ d = "tuesday" ; }
    if(dayName==3){ d = "wednesday" ; }
    if(dayName==4){ d = "thursday" ; }
    if(dayName==5){ d = "friday" ; }
    if(dayName==6){ d = "saturday" ; }

    var day1=day+'-'+month+'-'+year;//31-10-2019
    var ar1=[];
    alert(d);
    fire.database().ref("users").child(id).child("workingHours").on('value',(workHours)=>{
        if(workHours.val()){
            let work = Object.values(workHours.val());
            work.map((w,ind)=>{
                if(w.days==d && w.enable ){//في دوام بهاد اليوم
                    let requiredArray = slotCreator.createSlot(w.start,w.end,"30");//2 2.5 3 3.5
                    var flag=false;
                    requiredArray.map((slot)=>{
                           fire.database().ref("users").child(id).child("appointment").on('value',(app)=>{
                               if(app.val()){
                                let appointment=Object.values(app.val());
                               appointment.map((ap)=>{
                                   if(app.timeSelected == slot && app.dateSelected==day1 && app.available ){//ما في موعد
                                    ar1.push({time:slot,exist:"no",clinic:''})
                                   }
                                   if(app.timeSelected == slot && app.dateSelected==day1 && !app.available ){//في موعد
                                    ar1.push({time:slot,exist:"yes",clinic:app.clinicName})
                                   }
                                     else{
                                         flag=true;
                                     }
                               })
                            }
                           })//end app fire
                           if(flag){ar1.push({time:slot,exist:"no",clinic:''})}
                    })//end slot map
                    this.setState({
                        day1:ar1,
                        no1:false
                    })
                }
                
                // else{//ما في دوام
                //       this.setState({no1:true})  
                // }
                
            })
          }
       })


  }
  
  authListener(){
    const { navigation } = this.props;  
    var id=navigation.getParam('id');
  
     this.setState({
         id:id
     })

     var array2=[];

     var today = new Date();
     const day1   = today.getDate();
     const dayName=today.getDay();
     const  month1 = today.getMonth()+1;
     const  year1  = today.getFullYear();
this.setState({today:day1 + '-' + month1 + '-' + year1})

    for(var i=1;i<7;i++){
        var d;
        var t = new Date();
        var tomorrow = new Date();
        tomorrow.setDate(t.getDate()+i);
         const day   = tomorrow.getDate();
          const dayName=tomorrow.getDay();
         const  month = tomorrow.getMonth()+1;
         const  year  = tomorrow.getFullYear();
         if(dayName==0){ d = "sunday" ; }
         if(dayName==1){ d = "monday" ; }
         if(dayName==2){ d = "tuesday" ; }
         if(dayName==3){ d = "wednesday" ; }
         if(dayName==4){ d = "thursday" ; }
         if(dayName==5){ d = "friday" ; }
         if(dayName==6){ d = "saturday" ; }

          array2.push({date:day + '-' + month + '-' + year,day:d});
    
   
    }
    //alert(array2.length);//6
    array2.map((value,index)=>{
        //alert(value.date+"-"+value.day);
    })


    this.setState({dates:array2});

     var array=[];
     var arr=[];
     fire.database().ref("users").child(id).child("workingHours").on('value',(workHours)=>{
        if(workHours.val()){
            let work = Object.values(workHours.val());
            this.setState({workingHour:work}) ;
            array.push("");
            work.map((w,ind)=>{
                if( w.enable ){
                    array.push(w.days);
                }
                
            })
          }
       })

if(array.length>0){
this.setState({
    days:array
})
}


fire.database().ref("users").child(id).child("appointment").on('value',(datasnapshot) =>{
    if(datasnapshot.val()){
     let items = Object.values(datasnapshot.val());
    //  this.setState({
    //    appointment:items,
    //    noApp:false
    //      })
         items.map((value,index)=>{
             if(value.dateSelected == this.state.today && !value.available ){
                  arr.push({date:value.dateSelected,time:value.timeSelected,day:value.daySelected,exist:"yes"})
             }
             if(value.dateSelected == this.state.today && value.available){
                arr.push({date:value.dateSelected,time:value.timeSelected,day:value.daySelected,exist:"no"})
             }
             

         })
        
            this.setState({
                appointment:arr
            })
    }
   
 })
 
 fire.database().ref("users").child(id).child("slots").on('value',(datasnapshot) =>{
    if(datasnapshot.val()){
     let items = Object.values(datasnapshot.val());
     this.setState({
        slot:items
          })
    

    
    
    }

//    else{
//      this.setState({
//        noSlot:true
//      })
//    }
   
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
{this.state.no1 && <View><Text  bold size={20}>No appointment today</Text></View>}

{!this.state.no1 && <View style={styles.container}>
        <Table borderStyle={{borderColor: 'transparent'}}>
          <Row data={this.state.head} style={styles.head} textStyle={styles.text}/>
          {
             this.state.day1.map((data, index) => {
                  //  return this.state.appointment.map((app,appIndex)=>{
                        return(
              <TableWrapper key={index} style={styles.row}>
                    <Cell data={data.time} textStyle={styles.text}/>
                    <Cell data={data.exist} textStyle={styles.text}/>
                    <Cell data={data.clinic} textStyle={styles.text}/>
             </TableWrapper>
                )
                    
                    

               
            })
          }

        </Table>
      </View> }     
            </ScrollView>
        </Block>
        
      </Block>
    );
  }
}

const styles = StyleSheet.create({
    singleHead: { width: 80, height: 40, backgroundColor: '#c8e1ff' },
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#808B97' },
  text: { margin: 6 },
  row: { flexDirection: 'row', backgroundColor: '#FFF1C1' },
  btn: { width: 58, height: 18, backgroundColor: '#78B7BB',  borderRadius: 2 },
  btnText: { textAlign: 'center', color: '#fff' },
  
  
  profile: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    // marginBottom: -HeaderHeight * 2,
    flex: 1
  },
  
  
  divider: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#E9ECEF",
    marginTop:10
  },
  
});

export default AppointmentTable;