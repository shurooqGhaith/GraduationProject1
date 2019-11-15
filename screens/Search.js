
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

import {  Input,Button as ComponentButton } from "../components";
import { Images, argonTheme } from "../constants";
import fire from "../constants/firebaseConfigrations";
import {Card,Icon,Header,Divider,Button } from 'react-native-elements'; 

const { width, height } = Dimensions.get("screen");

class Search extends React.Component {
   

    constructor(props){
        super(props);
        this.SearchFilterFunction=this.SearchFilterFunction.bind(this);
        this.state={
            data:[],
            DrInfo:[],
            keys:[],
            idP:'',
            clinicName:[],
            search: '',
            searchParameter:'specialization',
            nodata:false,
            dateTimeVisible:false,
            timeToSearch:'',
            appointments:[]
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
                    this.setState({data:items,nodata:false});
                 }
            )
    }

    


    
    SearchFilterFunction () {
        if(this.state.search==""){
            alert("enter value to search about");
            this.retrieveData();
        }
        else{
            
            if(this.state.searchParameter=="specialization"){
                fire.database().ref("users").orderByChild('Specialization').equalTo(this.state.search.toLowerCase()).on('value',(snapshot)=>{
                    
                    if(snapshot.val()){
                        let items = Object.values(snapshot.val());
                        this.setState({
                            data:items,
                            nodata:false
                        })
                    }
                    else{
                        this.setState({
                            nodata:true
                        })
                        alert("no data available");
                        this.retrieveData();
                    }
                    
                 })
                 
            }
            if(this.state.searchParameter=="doctorName"){
                fire.database().ref("users").orderByChild('name').equalTo(this.state.search.toLowerCase()).on('value',(snapshot)=>{
                    if(snapshot.val()){
                        let items = Object.values(snapshot.val());
                        this.setState({
                            data:items,
                            nodata:false
                        })
                    }
                    else{
                        this.setState({
                            nodata:true
                        })
                        alert("no data available");
                        this.retrieveData();
                    }
                 })

            }
            
    }
    }

   
    
    
    render(){
        
        return(
            <Block flex style={{flex:1,backgroundColor:"#eee"}}>


             
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ width, marginTop: '25%' }}
            >


                              <View style={{flexDirection:'column'}}>
                                   <Text style={{marginLeft:120}}>Search based on:</Text>
                                   <View style={{marginTop:15,flexDirection:'row'}}>
                              <ComponentButton small style={{backgroundColor:'#607D8B',marginLeft:50}}
                              onPress={()=>this.props.navigation.navigate("SearchAboutTime",{idPatient:this.state.idP})}
                              >
                                  <Text>time</Text>
                              </ComponentButton>

                              <ComponentButton small style={{backgroundColor:"#546E7A",marginLeft:20}}
                              onPress={()=>this.props.navigation.navigate("Book",{idPatient:this.state.idP,parameter:"specialization"})}
                              >
                                  <Text>specialty</Text>
                              </ComponentButton>

                              <ComponentButton small style={{backgroundColor:'#455A64',marginLeft:20}}
                              onPress={()=>this.props.navigation.navigate("Book",{idPatient:this.state.idP,parameter:"name"})}
                              >
                                  <Text>name</Text>
                              </ComponentButton>
                           </View>
                              </View>
                              
                           
                               
            <View style={styles.itemsList}>
        {!this.state.nodata && this.state.data.map((item, index) => {
            if(item.type=="doctor"){
                return(
                    <View key={index} style={{marginTop:20}}>
                    <Card
                  title={item.name}
                  //image={require('../images/pic2.jpg')}
                  >
               <Text style={{marginBottom: 10}}>
                       email:{item.email}
                 </Text>
                 
                 <Text style={{marginBottom: 10}}>
                 Specialization:{item.Specialization}
                 </Text>
                     <Button
                          onPress={()=>this.props.navigation.navigate("Appointment",{id:item.id,idPatient:this.state.idP})}
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
      </Block>
        )
    }
}

const styles = StyleSheet.create({
   
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
export default Search;