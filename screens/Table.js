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
      no2:true,
      no3:true,
      no4:true,
      no5:true,
      no6:true,
      no7:true,
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
                                   if(ap.timeSelected == slot && ap.dateSelected==day1 && ap.available ){//ما في موعد
                                    ar1.push({time:slot,exist:"no",clinic:'--'})
                                   }
                                   if(ap.timeSelected == slot && ap.dateSelected==day1 && !ap.available ){//في موعد
                                    ar1.push({time:slot,exist:"yes",clinic:ap.clinicName})
                                   }
                                     else{
                                         flag=true;
                                     }
                               })
                            }
                           })//end app fire
                           if(flag){ar1.push({time:slot,exist:"no",clinic:'--'})}
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

       /////second day
       var d2;
       var t1 = new Date();
       var tomorrow = new Date();
       tomorrow.setDate(t1.getDate()+1);
       const day2   = tomorrow.getDate();
       const dayName2=tomorrow.getDay();
       const  month2 = tomorrow.getMonth()+1;
       const  year2  = tomorrow.getFullYear();
      if(dayName2==0){ d2 = "sunday" ; }
       if(dayName2==1){ d2 = "monday" ; }
       if(dayName2==2){ d2 = "tuesday" ; }
       if(dayName2==3){ d2 = "wednesday" ; }
       if(dayName2==4){ d2 = "thursday" ; }
       if(dayName2==5){ d2 = "friday" ; }
       if(dayName2==6){ d2 = "saturday" ; }
   
       var day_2=day2+'-'+month2+'-'+year2;//2-11-2019
       var ar2=[];
       alert(day_2);
       fire.database().ref("users").child(id).child("workingHours").on('value',(workHours)=>{
           if(workHours.val()){
               let work = Object.values(workHours.val());
               work.map((w,ind)=>{
                   if(w.days==d2 && w.enable ){//في دوام بهاد اليوم
                       let requiredArray = slotCreator.createSlot(w.start,w.end,"30");//2 2.5 3 3.5
                       var flag2=false;
                       requiredArray.map((slot)=>{
                              fire.database().ref("users").child(id).child("appointment").on('value',(app)=>{
                                  if(app.val()){
                                   let appointment=Object.values(app.val());
                                  appointment.map((ap)=>{
                                   

                                      if(slot == ap.timeSelected  && ap.dateSelected==day_2 && ap.available ){//ما في موعد
                                       ar2.push({time:slot,exist:"no",clinic:'--'})
                                      }
                                      if( slot == ap.timeSelected  && ap.dateSelected==day_2 && !ap.available ){//في موعد
                                        // alert(ap.dateSelected);
                                        ar2.push({time:slot,exist:"yes",clinic:ap.clinicName});
                                      }
                                        else{
                                            flag2=true;
                                           
                                        }
                                  })//app map
                               }
                              })//end app fire
                              if(flag2){ar2.push({time:slot,exist:"no",clinic:'--'})}
                       })//end slot map
                       this.setState({
                           day2:ar2,
                           no2:false
                       })
                   }
                   
                   // else{//ما في دوام
                   //       this.setState({no1:true})  
                   // }
                   
               })
             }
          })
   
             ////third day

             var d3;
             var t2 = new Date();
             var tomorrow1 = new Date();
             tomorrow1.setDate(t2.getDate()+2);
             const day3   = tomorrow1.getDate();
             const dayName3=tomorrow1.getDay();
             const  month3 = tomorrow1.getMonth()+1;
             const  year3  = tomorrow1.getFullYear();
            if(dayName3==0){ d3 = "sunday" ; }
             if(dayName3==1){ d3 = "monday" ; }
             if(dayName3==2){ d3 = "tuesday" ; }
             if(dayName3==3){ d3 = "wednesday" ; }
             if(dayName3==4){ d3 = "thursday" ; }
             if(dayName3==5){ d3 = "friday" ; }
             if(dayName3==6){ d3 = "saturday" ; }
         
             var day_3=day3+'-'+month3+'-'+year3;//2-11-2019
             var ar3=[];
             alert(day_3);
             fire.database().ref("users").child(id).child("workingHours").on('value',(workHours)=>{
                 if(workHours.val()){
                     let work = Object.values(workHours.val());
                     work.map((w,ind)=>{
                         if(w.days==d3 && w.enable ){//في دوام بهاد اليوم
                             let requiredArray = slotCreator.createSlot(w.start,w.end,"30");//2 2.5 3 3.5
                             var flag3=false;
                             requiredArray.map((slot)=>{
                                    fire.database().ref("users").child(id).child("appointment").on('value',(app)=>{
                                        if(app.val()){
                                         let appointment=Object.values(app.val());
                                        appointment.map((ap)=>{
                                         
      
                                            if(slot == ap.timeSelected  && ap.dateSelected==day_3 && ap.available ){//ما في موعد
                                             ar3.push({time:slot,exist:"no",clinic:'--'})
                                            }
                                            if( slot == ap.timeSelected  && ap.dateSelected==day_3 && !ap.available ){//في موعد
                                              // alert(ap.dateSelected);
                                              ar3.push({time:slot,exist:"yes",clinic:ap.clinicName});
                                            }
                                              else{
                                                  flag3=true;
                                                 
                                              }
                                        })//app map
                                     }
                                    })//end app fire
                                    if(flag3){ar3.push({time:slot,exist:"no",clinic:'--'})}
                             })//end slot map
                             this.setState({
                                 day3:ar3,
                                 no3:false
                             })
                         }
                         
                         
                         
                     })
                   }
                })
      
        //// fourth day
        var d4;
        var t3 = new Date();
        var tomorrow2 = new Date();
        tomorrow2.setDate(t3.getDate()+3);
        const day4   = tomorrow2.getDate();
        const dayName4=tomorrow2.getDay();
        const  month4 = tomorrow2.getMonth()+1;
        const  year4  = tomorrow2.getFullYear();
       if(dayName4==0){ d4 = "sunday" ; }
        if(dayName4==1){ d4 = "monday" ; }
        if(dayName4==2){ d4 = "tuesday" ; }
        if(dayName4==3){ d4 = "wednesday" ; }
        if(dayName4==4){ d4 = "thursday" ; }
        if(dayName4==5){ d4 = "friday" ; }
        if(dayName4==6){ d4 = "saturday" ; }
    
        var day_4=day4+'-'+month4+'-'+year4;//2-11-2019
        var ar4=[];
        alert(day_4);
        fire.database().ref("users").child(id).child("workingHours").on('value',(workHours)=>{
            if(workHours.val()){
                let work = Object.values(workHours.val());
                work.map((w,ind)=>{
                    if(w.days==d4 && w.enable ){//في دوام بهاد اليوم
                        let requiredArray = slotCreator.createSlot(w.start,w.end,"30");//2 2.5 3 3.5
                        var flag4=false;
                        requiredArray.map((slot)=>{
                               fire.database().ref("users").child(id).child("appointment").on('value',(app)=>{
                                   if(app.val()){
                                    let appointment=Object.values(app.val());
                                    appointment.map((ap)=>{
                                    
 
                                       if(slot == ap.timeSelected  && ap.dateSelected==day_4 && ap.available ){//ما في موعد
                                        ar4.push({time:slot,exist:"no",clinic:'--'})
                                       }
                                       if( slot == ap.timeSelected  && ap.dateSelected==day_4 && !ap.available ){//في موعد
                                         // alert(ap.dateSelected);
                                         ar4.push({time:slot,exist:"yes",clinic:ap.clinicName});
                                       }
                                         else{
                                             flag4=true;
                                            
                                         }
                                   })//app map
                                }
                               })//end app fire
                               if(flag4){ar4.push({time:slot,exist:"no",clinic:'--'})}
                        })//end slot map
                        this.setState({
                            day4:ar4,
                            no4:false
                        })
                    }
                    
                    
                    
                })
              }
           })
 

           /////fifth day
           var d5;
           var t4 = new Date();
           var tomorrow3 = new Date();
           tomorrow3.setDate(t4.getDate()+4);
           const day5   = tomorrow3.getDate();
           const dayName5=tomorrow3.getDay();
           const  month5 = tomorrow3.getMonth()+1;
           const  year5  = tomorrow3.getFullYear();
          if(dayName5==0){ d5 = "sunday" ; }
           if(dayName5==1){ d5 = "monday" ; }
           if(dayName5==2){ d5 = "tuesday" ; }
           if(dayName5==3){ d5 = "wednesday" ; }
           if(dayName5==4){ d5 = "thursday" ; }
           if(dayName5==5){ d5 = "friday" ; }
           if(dayName5==6){ d5 = "saturday" ; }
        
           var day_5=day5+'-'+month5+'-'+year5;//2-11-2019
           var ar5=[];
           alert(day_5);
           fire.database().ref("users").child(id).child("workingHours").on('value',(workHours)=>{
               if(workHours.val()){
                   let work = Object.values(workHours.val());
                   work.map((w,ind)=>{
                       if(w.days==d5 && w.enable ){//في دوام بهاد اليوم
                           let requiredArray = slotCreator.createSlot(w.start,w.end,"30");//2 2.5 3 3.5
                           var flag5=false;
                           requiredArray.map((slot)=>{
                                  fire.database().ref("users").child(id).child("appointment").on('value',(app)=>{
                                      if(app.val()){
                                       let appointment=Object.values(app.val());
                                       appointment.map((ap)=>{
                                       
    
                                          if(slot == ap.timeSelected  && ap.dateSelected==day_5 && ap.available ){//ما في موعد
                                           ar5.push({time:slot,exist:"no",clinic:'--'})
                                          }
                                          if( slot == ap.timeSelected  && ap.dateSelected==day_5 && !ap.available ){//في موعد
                                            // alert(ap.dateSelected);
                                            ar5.push({time:slot,exist:"yes",clinic:ap.clinicName});
                                          }
                                            else{
                                                flag5=true;
                                               
                                            }
                                      })//app map
                                   }
                                  })//end app fire
                                  if(flag5){ar5.push({time:slot,exist:"no",clinic:'--'})}
                           })//end slot map
                           this.setState({
                               day5:ar5,
                               no5:false
                           })
                       }
                       
                       
                       
                   })
                 }
              })

              ////sixth day

              var d6;
              var t5 = new Date();
              var tomorrow4 = new Date();
              tomorrow4.setDate(t5.getDate()+5);
              const day6   = tomorrow4.getDate();
              const dayName6=tomorrow4.getDay();
              const  month6 = tomorrow4.getMonth()+1;
              const  year6  = tomorrow4.getFullYear();
             if(dayName6==0){ d6 = "sunday" ; }
              if(dayName6==1){ d6 = "monday" ; }
              if(dayName6==2){ d6 = "tuesday" ; }
              if(dayName6==3){ d6 = "wednesday" ; }
              if(dayName6==4){ d6 = "thursday" ; }
              if(dayName6==5){ d6 = "friday" ; }
              if(dayName6==6){ d6 = "saturday" ; }
          
              var day_6=day6+'-'+month6+'-'+year6;//2-11-2019
              var ar6=[];
              alert(day_6);
              fire.database().ref("users").child(id).child("workingHours").on('value',(workHours)=>{
                  if(workHours.val()){
                      let work = Object.values(workHours.val());
                      work.map((w,ind)=>{
                          if(w.days==d6 && w.enable ){//في دوام بهاد اليوم
                              let requiredArray = slotCreator.createSlot(w.start,w.end,"30");//2 2.5 3 3.5
                              var flag6=false;
                              requiredArray.map((slot)=>{
                                     fire.database().ref("users").child(id).child("appointment").on('value',(app)=>{
                                         if(app.val()){
                                          let appointment=Object.values(app.val());
                                          appointment.map((ap)=>{
                                          
       
                                             if(slot == ap.timeSelected  && ap.dateSelected==day_6 && ap.available ){//ما في موعد
                                              ar6.push({time:slot,exist:"no",clinic:'--'})
                                             }
                                             if( slot == ap.timeSelected  && ap.dateSelected==day_6 && !ap.available ){//في موعد
                                               // alert(ap.dateSelected);
                                               ar6.push({time:slot,exist:"yes",clinic:ap.clinicName});
                                             }
                                               else{
                                                   flag6=true;
                                                  
                                               }
                                         })//app map
                                      }
                                     })//end app fire
                                     if(flag6){ar6.push({time:slot,exist:"no",clinic:'--'})}
                              })//end slot map
                              this.setState({
                                  day6:ar6,
                                  no6:false
                              })
                          }
                          
                          
                          
                      })
                    }
                 })
      
   //////seventh day
   var d7;
   var t6 = new Date();
   var tomorrow5 = new Date();
   tomorrow5.setDate(t6.getDate()+6);
   const day7   = tomorrow5.getDate();
   const dayName7=tomorrow5.getDay();
   const  month7 = tomorrow5.getMonth()+1;
   const  year7  = tomorrow5.getFullYear();
  if(dayName7==0){ d7 = "sunday" ; }
   if(dayName7==1){ d7 = "monday" ; }
   if(dayName7==2){ d7 = "tuesday" ; }
   if(dayName7==3){ d7 = "wednesday" ; }
   if(dayName7==4){ d7 = "thursday" ; }
   if(dayName7==5){ d7 = "friday" ; }
   if(dayName7==6){ d7 = "saturday" ; }

   var day_7=day7+'-'+month7+'-'+year7;//2-11-2019
   var ar7=[];
   alert(day_7);
   fire.database().ref("users").child(id).child("workingHours").on('value',(workHours)=>{
       if(workHours.val()){
           let work = Object.values(workHours.val());
           work.map((w,ind)=>{
               if(w.days==d7 && w.enable ){//في دوام بهاد اليوم
                   let requiredArray = slotCreator.createSlot(w.start,w.end,"30");//2 2.5 3 3.5
                   var flag7=false;
                   requiredArray.map((slot)=>{
                          fire.database().ref("users").child(id).child("appointment").on('value',(app)=>{
                              if(app.val()){
                               let appointment=Object.values(app.val());
                               appointment.map((ap)=>{
                               

                                  if(slot == ap.timeSelected  && ap.dateSelected==day_7 && ap.available ){//ما في موعد
                                   ar7.push({time:slot,exist:"no",clinic:'--'})
                                  }
                                  if( slot == ap.timeSelected  && ap.dateSelected==day_7 && !ap.available ){//في موعد
                                    // alert(ap.dateSelected);
                                    ar7.push({time:slot,exist:"yes",clinic:ap.clinicName});
                                  }
                                    else{
                                        flag7=true;
                                       
                                    }
                              })//app map
                           }
                          })//end app fire
                          if(flag7){ar7.push({time:slot,exist:"no",clinic:'--'})}
                   })//end slot map
                   this.setState({
                       day7:ar7,
                       no7:false
                   })
               }
               
               
               
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

      {this.state.no2 && <View style={{marginTop:100}}><Text  bold size={20}>No appointment today</Text></View>}

{!this.state.no2 && <View style={{flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff',marginTop:100}}>
        <Table borderStyle={{borderColor: 'transparent'}}>
          <Row data={this.state.head} style={styles.head} textStyle={styles.text}/>
          {
             this.state.day2.map((data, index) => {
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

            {this.state.no3 && <View style={{marginTop:100}}><Text  bold size={20}>No appointment today</Text></View>}

{!this.state.no3 && <View style={{flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff',marginTop:100}}>
        <Table borderStyle={{borderColor: 'transparent'}}>
          <Row data={this.state.head} style={styles.head} textStyle={styles.text}/>
          {
             this.state.day3.map((data, index) => {
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
     
      {this.state.no4 && <View style={{marginTop:100}}><Text  bold size={20}>No appointment today</Text></View>}

{!this.state.no4 && <View style={{flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff',marginTop:100}}>
        <Table borderStyle={{borderColor: 'transparent'}}>
          <Row data={this.state.head} style={styles.head} textStyle={styles.text}/>
          {
             this.state.day4.map((data, index) => {
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
      {this.state.no5 && <View style={{marginTop:100}}><Text  bold size={20}>No appointment today</Text></View>}

{!this.state.no5 && <View style={{flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff',marginTop:100}}>
        <Table borderStyle={{borderColor: 'transparent'}}>
          <Row data={this.state.head} style={styles.head} textStyle={styles.text}/>
          {
             this.state.day5.map((data, index) => {
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
      {this.state.no6 && <View style={{marginTop:100}}><Text  bold size={20}>No appointment today</Text></View>}

{!this.state.no6 && <View style={{flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff',marginTop:100}}>
        <Table borderStyle={{borderColor: 'transparent'}}>
          <Row data={this.state.head} style={styles.head} textStyle={styles.text}/>
          {
             this.state.day6.map((data, index) => {
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
      {this.state.no7 && <View style={{marginTop:100}}><Text  bold size={20}>No appointment today</Text></View>}

{!this.state.no7 && <View style={{flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff',marginTop:100}}>
        <Table borderStyle={{borderColor: 'transparent'}}>
          <Row data={this.state.head} style={styles.head} textStyle={styles.text}/>
          {
             this.state.day7.map((data, index) => {
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