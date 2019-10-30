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
import { Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger} from "react-native-popup-menu";
const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

class AppointmentTable extends React.Component {

  constructor(props){
    super(props);
    this.authListener=this.authListener.bind(this);
        this.state={
            tableHead: ['Head', 'Head2', 'Head3', 'Head4'],
            workingHour:[],
      appointment:[],
      slot:[],
      days:[],
      hours:[],
      username:"",
      email:'',
      id:"",
      nodata:false,
      noApp:false,
      noSlot:false,
      tableData: [
        ['1', '2', '3'],
        ['a', 'b', 'c'],
        ['1', '2', '3'],
        ['a', 'b', 'c']
      ]
    }
  }

  componentDidMount(){
    this.authListener();
  }

  
  authListener(){
  
    const { navigation } = this.props;  
    var id=navigation.getParam('id');
  
     this.setState({
         id:id
     })

     var array=[];
     var array2=[];
     fire.database().ref("users").child(id).child("workingHours").on('value',(workHours)=>{
        if(workHours.val()){
            let work = Object.values(workHours.val());
            this.setState({workingHour:work}) 
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
     this.setState({
       appointment:items,
       noApp:false
         })
 
    }
   else{
     this.setState({
       noApp:true
     })
   }
   
 })
 
 fire.database().ref("users").child(id).child("slots").on('value',(datasnapshot) =>{
    if(datasnapshot.val()){
     let items = Object.values(datasnapshot.val());
     this.setState({
        slot:items
          })
     items.map((w,ind)=>{
            array2.push(w.slot);
    })
    }
   else{
     this.setState({
       noSlot:true
     })
   }
   
 })
 for(var i=0;i<array2.length;i++){
    alert(array2[i]);
}

 if(array2.length>0){
     this.setState({
         hours:array2
     })
     
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

<View style={styles.container}>
        <Table borderStyle={{borderColor: 'transparent'}}>
          <Row data={this.state.days} style={styles.head} textStyle={styles.text}/>
          <Col data={this.state.hours} style={styles.head}  textStyle={styles.text} />
          {
            this.state.workingHour.map((rowData, index) => {
                    return(
              <TableWrapper key={index} style={styles.row}>
                    <Cell data={rowData.days} textStyle={styles.text}/>
                    <Cell data={rowData.start} textStyle={styles.text}/>
                    <Cell data={rowData.end} textStyle={styles.text}/>
                    <Cell data={rowData.selectedClinic} textStyle={styles.text}/>
             </TableWrapper>
                )

               
            })
          }

        </Table>
      </View>
      <Text>{this.state.hours}</Text>
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