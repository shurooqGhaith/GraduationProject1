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

import { Input, Button as ComponentButton } from "../components";
import { Images, argonTheme } from "../constants";
import fire from "../constants/firebaseConfigrations";
import {Divider } from 'react-native-elements'; 
import SearchBar from 'react-native-searchbar';
import DateTimePicker from "react-native-modal-datetime-picker";
import { List } from 'react-native-paper';
import Icon from "react-native-vector-icons/MaterialIcons";

const { width, height } = Dimensions.get("screen");

class Book extends React.Component {
   

    constructor(props){
        super(props);
        this.showInfo=this.showInfo.bind(this);
        this.SearchFilterFunction=this.SearchFilterFunction.bind(this);
        this.handle=this.handle.bind(this);
        this.sortData=this.sortData.bind(this);
        this._handlePress=this._handlePress.bind(this);

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
            appointments:[],

            ///location
            clinicNames:[],
            clinics:[],
            sort1:false,
            latitude:'',
            longitude:'',
            nearest:false,
            show:[],
            msg:''

        }
    }
    componentDidMount(){
        const { navigation } = this.props;  
        var idP=navigation.getParam("idPatient");
        var parameter=navigation.getParam("parameter");
            this.setState({
                idP:idP,
                searchParameter:parameter
            })

            navigator.geolocation.getCurrentPosition(
                position => {
                  this.setState({
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude,                    
                  });
                },
              (error) => console.log(error.message),
              { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
              );
            this.retrieveData();
    }

    retrieveData(){
       
    
            fire.database().ref("users").on('value', (snapshot) => {
                    let data = snapshot.val();
                  //  var id=snapshot.key;//id = users
                    let items = Object.values(data);
                    var ar=[];
                    for(var i=0;i<items.length;i++){
                               ar.push(false);
                    }
                    this.setState({data:items,nodata:false,show:ar});
                 }
            )
    }

    showInfo(){
        var k=[];
        fire.database().ref("users").on("value")
        .then(function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            // key will be "ada" the first time and "alan" the second time
            var key = childSnapshot.key;
            k.push(key);
            alert(key);
            // childData will be the actual contents of the child
            var childData = childSnapshot.val();
        });
      });
     k.map((v,index)=>{
         alert(v);
     })
    }


    sortData(){
        
        var array=[];

    this.state.data.map((value,index)=>{
        fire.database().ref("users").child(value.id).child("clinicName").on('value',(snap)=>{
            let clinics=Object.values(snap.val());
            clinics.map((item)=>{
                array.push({id:value.id,sp:value.Specialization,clinicName:item.clinic,latitude:item.latitude,longitude:item.longitude})
            })
        })
    })

        //    var result = array.reduce((unique, o) => {
        //        if(!unique.some(obj => obj.clinicName === o.clinicName )) {
        //          unique.push(o);
        //        }
        //        return unique;
        //    },[]);
          // alert(result.length);//طبع 3 بعد ما شال التكرار بيضل عندي 3 عيادات //when sp=general
        //  alert(array.length);
                  var minDif = 99999;
       var closest;
    
              array.map((location,index)=>{
                    var lat1 = this.state.latitude * Math.PI / 180;
                    var lat2 = location.latitude * Math.PI / 180;
                    var lon1 = this.state.longitude * Math.PI / 180;
                    var lon2 = location.longitude * Math.PI / 180;
                     var R = 6371; // km
                     var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
                     var y = (lat2 - lat1);
                     var d = Math.sqrt(x * x + y * y) * R;
                      if (d < minDif) {
                           closest =location.clinicName;
                            minDif = d;
                            }
              })

            //  alert(closest);//safa dental clinic
            var array2=[];
            array.map((item,ind)=>{
                var n,e;
                if(item.clinicName==closest){
                      fire.database().ref("users").child(item.id).child("name").on('value',(name)=>{
                          n=name.val();
                      })
                      fire.database().ref("users").child(item.id).child("email").on('value',(email)=>{
                        e=email.val();
                    })
                    array2.push({name:n,email:e,id:item.id,Specialization:item.sp,type:"doctor"})
                }
              })

            //  alert(array2.length);//1
                     var ar1=[];
            for(var i=0;i<array2.length;i++){
                ar1.push(false);
     }
              this.setState({
                  data:array2,
                  nodata:false,
                  show:ar1
              })


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
                        var ar3=[];
                        for(var i=0;i<items.length;i++){
                            ar3.push(false);
                                }
                        this.setState({
                            data:items,
                            nodata:false,
                            nearest:true,
                            show:ar3
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
            if(this.state.searchParameter=="name"){
                fire.database().ref("users").orderByChild('name').equalTo(this.state.search.toLowerCase()).on('value',(snapshot)=>{
                    if(snapshot.val()){
                        let items = Object.values(snapshot.val());
                        var ar4=[];
                        for(var i=0;i<items.length;i++){
                            ar4.push(false);
                                }
                        this.setState({
                            data:items,
                            nodata:false,
                            show:ar4
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

    handle(input){
        if(input==''){this.retrieveData()}
        if(this.state.searchParameter=="name"){
            fire.database().ref("users").orderByChild("name").startAt(input.toLowerCase()).endAt(input.toLowerCase()+"\uf8ff").on('value',(snap)=>{
                if(snap.val()){
                let items = Object.values(snap.val());
                var ar5=[];
                        for(var i=0;i<items.length;i++){
                            ar5.push(false);
                                }
                this.setState({
                    data:items,
                    nodata:false,
                    show:ar5
                })
            }
            else{
                this.setState({
                    msg:'No results found for \" '+input+'\"',
                    nodata:true
                })
                // alert("no data available");
                // this.retrieveData();
            }
            })
        }
        if(this.state.searchParameter=="specialization"){
            fire.database().ref("users").orderByChild("Specialization").startAt(input.toLowerCase()).endAt(input.toLowerCase()+"\uf8ff").on('value',(snap)=>{
               if(snap.val()){
                let items = Object.values(snap.val());
                var ar6=[];
                        for(var i=0;i<items.length;i++){
                            ar6.push(false);
                                }
                this.setState({
                    data:items,
                    nodata:false,
                    show:ar6
                })
            }
            else{
                this.setState({
                    msg:'No results found for \" '+input+'\"',
                    nodata:true
                })
              //  alert("no data available");
               // this.retrieveData();
            }
            })
        }
       
    }
    
    _handlePress(index) {
        this.setState({
          show: !this.state.show[index]
        })
    }
    
    render(){
        
        return(
            <Block flex style={{flex:1,backgroundColor:"#eee"}}>
   
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ width, marginTop: '25%' }}
            >
            
                  <Block>
             
                    </Block>
                    
                    {/* <View style={{marginTop:5}}>
                         <SearchBar
                        // style={{marginTop:5}}
                           handleChangeText={(text) => this.setState({search:text})}
                           hideBack={true}
                           //ref={(ref) => this.searchBar = ref}
                           placeholder={"search on "+" "+this.state.searchParameter}
                           showOnLoad
                           onSubmitEditing={()=>this.SearchFilterFunction()}
                           backgroundColor="#444"
                           handleSearch={(input)=>this.handle(input)}
                               />
                               </View> */}

                               <View >
            <Input
               style={{borderRadius:15,borderColor:'#eee',backgroundColor:'#444',width:width,color:'#fff',paddingLeft:5}}
               placeholder={"search on "+" "+ this.state.searchParameter}
               onChangeText={text=>this.handle(text)}
               iconContent={
                <Icon name={'search'} size={30} color={'#aaa'} />
               }
                 />

                 </View>
                           
                               
            <View style={styles.itemsList}>
            {this.state.nodata &&<View style={{marginTop:70,marginLeft:60}}><Text size={16} color={'#000'}>{this.state.msg}</Text></View>}
        {!this.state.nodata && this.state.data.map((item, index) => {
            if(item.type=="doctor"){
                return(
                    <View key={index} style={{marginTop:20}}>
                    <List.Accordion
                       title={item.name}
                       left={props => <List.Icon {...props} icon="doctor" />}
                       expanded={this.state.show[index]}
                       onPress={()=>this._handlePress(index)}
                           >
                            {/* <List.Item titleStyle={{color:'#263238'}} title="Email"
                               description={item.email}
                                onPress={()=>alert("first item")} /> */}
                             {/* <List.Item title="Specialization" titleStyle={{color:'#263238'}}
                             description={item.Specialization}  /> */}
                             <List.Item
                             titleStyle={{color:'#1B5E20'}}
                             title="Information"
                              onPress={()=>this.props.navigation.navigate("InformationAboutDoctor",{id:item.id,idPatient:this.state.idP})}
                             />
                    </List.Accordion>
                    <Divider style={{backgroundColor:'#000000',width:width*0.7,marginLeft:50}}/>
                    </View>
                )
            }
        })}

        {this.state.nearest && <ComponentButton
        
        style={{marginBottom:20,backgroundColor:"#333",marginLeft:width*0.3,width:width*0.5,marginTop:10}}
         onPress={this.sortData}><Text style={{color:'#fff'}}>Nearest clinic</Text></ComponentButton>     
}

      </View>
      </ScrollView>
      </Block>
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
        marginTop:50
    },
    itemtext: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    }
});
export default Book;