import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  View,
  ScrollView,
  Picker,
  TouchableOpacity
} from "react-native";
import { Block, Checkbox, Text, theme } from "galio-framework";
import { Table, TableWrapper, Row, Cell, Col,Rows } from 'react-native-table-component';
import { Input, Button as ComponentButton } from "../components";
import { Images, argonTheme } from "../constants";
import fire from "../constants/firebaseConfigrations";
import {Divider } from 'react-native-elements'; 

const { width, height } = Dimensions.get("screen");

class InformationAboutDoctor extends React.Component {
   
    
    constructor(props){
        super(props);
       

        this.state={
            head:["day","Start","End"],
            id:'',
            idPatient:'',
            clinicName:[],
            email:'',
            name:'',
            phone:'',
            specialty:'',
            workingHours:[],
            avatar:'',
            nodata:''
            
            
        }
    }
    
    componentDidMount(){
        
            this.retrieveData();
    }

    retrieveData(){
        const { navigation } = this.props;  
        var id=navigation.getParam("id");
        var idP=navigation.getParam("idPatient");
            this.setState({
                id:id,
                idPatient:idP
            })
            fire.database().ref("users").child(id).child("Specialization").on('value',(datasnapshot)=>{
                if(datasnapshot.val()){
                this.setState({
                    specialty:datasnapshot.val()
                })
              }
             })
            
           
             fire.database().ref("users").child(id).child("name").on('value',(datasnapshot)=>{
              if(datasnapshot.val()){
                this.setState({
                name:datasnapshot.val()
              })
            }
           })
          
           fire.database().ref("users").child(id).child("email").on('value',(datasnapshot)=>{
            if(datasnapshot.val()){
            this.setState({
              email:datasnapshot.val()
            })
          }
          })
          fire.database().ref("users").child(id).child("avatar").on('value',(datasnapshot)=>{
            if(datasnapshot.val()){
            this.setState({
              avatar:datasnapshot.val(),
              avatarExist:true
            })
          }
         
          })
        
          fire.database().ref("users").child(id).child("phone").on('value',(datasnapshot)=>{
            if(datasnapshot.val()){
            this.setState({
              phone:datasnapshot.val(),
              phoneExist:true
            })
          }
          })
              
          
            fire.database().ref("users").child(id).child("clinicName").on('value',(datasnapshot) =>{
              if(datasnapshot.val()){
              let nameClinic = Object.values(datasnapshot.val());
              this.setState({clinicName:nameClinic})
              }
           })
          
           fire.database().ref("users").child(id).child("workingHours").on('value',(datasnapshot) =>{
            if(datasnapshot.val()){
             let items = Object.values(datasnapshot.val());
          
             this.setState({
               workingHours:items,
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

   
    
   
    
    render(){
        
        return(
            <Block flex style={{flex:1,backgroundColor:"#fff"}}>
   
            <ScrollView
              showsVerticalScrollIndicator={true}
              style={{ width, marginTop: '25%' }}
            >
                  <Block>
                   <View style={{flexDirection:'row'}}>
                          <View style={{flexDirection:'column',marginLeft:20}}>
                              <Text bold size={14} style={{color:'#004D40'}}>Name:</Text>
                              <Text style={{color:'#32325D'}}>{this.state.name}</Text>
                          </View>

                          <View style={{flexDirection:'column',marginLeft:60}}>
                              <Text bold size={14} style={{color:'#004D40'}}>Email:</Text>
                              <Text style={{color:'#32325D'}}>{this.state.email}</Text>
                          </View>
                       </View>
                       <View style={{flexDirection:'row',marginTop:10}}>
                          <View style={{flexDirection:'column',marginLeft:20}}>
                              <Text bold size={14} style={{color:'#004D40'}}>Phone Number:</Text>
                              <Text style={{color:'#32325D'}}>{this.state.phone ||"none determined"}</Text>
                          </View>

                          <View style={{flexDirection:'column',marginLeft:60}}>
                              <Text bold size={14} style={{color:'#004D40'}}>specialty:</Text>
                              <Text style={{color:'#32325D'}}>{this.state.specialty}</Text>
                          </View>
                       </View>
                       <View style={{flexDirection:'row',marginTop:10}}>
                          <View style={{flexDirection:'column',marginLeft:20}}>
                              <Text bold size={14} style={{color:'#004D40'}}>Clinic name:</Text>
                              <View  style={{flexDirection:'column' }}>
                           {this.state.clinicName.map((value,ind)=>{
                             return(
                            <Text key={ind} style={{marginLeft:2}} color="#32325D">{value.clinic}</Text>
                       )
                     })}
                    </View>
                          </View>
                       </View>
                                            
                    </Block>
                    <Divider style={{backgroundColor:'#004',marginTop:10,width:width*0.9,marginLeft:10}}/>
                    <View style={{flexDirection:'column',marginTop:30,marginLeft:5}}>
                    <Text color="#32325D" size={16} bold >workingHours:</Text>
                    {!this.state.nodata && <View style={{flex: 1, padding: 16, paddingTop: 30, backgroundColor:'#fff',marginTop:10}}>
        <Table borderStyle={{borderColor: 'transparent'}}>
          <Row data={this.state.head} style={styles.head} textStyle={{margin:6,color:'#fff'}}/>
          {
             this.state.workingHours.map((data, index) => {
                      if(data.enable){
                        return(
              <TableWrapper key={index} style={styles.row}>
                    <Cell data={data.days} textStyle={styles.text}/>
                    <Cell data={data.start} textStyle={styles.text}/>
                    <Cell data={data.end} textStyle={styles.text}/>
             </TableWrapper>
                )
                      }
                        
            })
          }
        </Table>
      </View> }     
                 </View>

                       <View style={{marginTop:20}}>
                       <ComponentButton 
                       style={{backgroundColor:'#eee',marginLeft:width*0.5,width:width*0.4,marginBottom:30,borderRadius:10}}
                       onPress={()=>this.props.navigation.navigate("Appointment",{id:this.state.id,idPatient:this.state.idPatient})}>
                         <Text color='#1B5E20' >Book Now</Text>

                       </ComponentButton>
                           
                       </View>        
      
      </ScrollView>
      </Block>
        )
    }
}

const styles = StyleSheet.create({
    head: { 
      height: 40, 
      backgroundColor: '#333'
    },
  text: { 
    margin: 6
   },
  row: {
     flexDirection: 'row', 
     backgroundColor: '#eee'
     },

});
export default InformationAboutDoctor;