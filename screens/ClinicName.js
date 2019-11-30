import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  View,
  Picker,
  ScrollView,
  
} from "react-native";
import { Block, Checkbox, Text, theme } from "galio-framework";

import { Button, Input,Icon as ComponentIcon } from "../components";
import { Images, argonTheme } from "../constants";
import fire from "../constants/firebaseConfigrations";
import * as Facebook from 'expo-facebook';
import Icon from "react-native-vector-icons/MaterialIcons";

const { width, height } = Dimensions.get("screen");



class ClinicName extends React.Component {
   

  constructor(props){
    super(props);
    this.authListener=this.authListener.bind(this);
    this.setModalVisible=this.setModalVisible.bind(this);
    this.addClinicName=this.addClinicName.bind(this);
    this.handleChange=this.handleChange.bind(this);
    this.handleSubmit=this.handleSubmit.bind(this);
    this.state={
        modalVisible:false,
        username:'',
        id:'',
        clinicNames:[],
        Specialization:'',
        clinicNameFromPicker:'',
        clinicNameFromDB:[]
    }
  }
  
  componentDidMount(){ 
    this.authListener();
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
  authListener(){
    // fire.auth().onAuthStateChanged((user)=>{
    //   if(user){//this.props.navigation.navigate('Home')
    //   fire.auth().signOut();
    // }
    //   else{this.setState({user:null})}
    // }
  
    // );
    var user =fire.auth().currentUser;
    if(user != null){
        var id=user.uid;
        this.setState({
          id:id
        })
        fire.database().ref("users").child(id).child("name").on('value',datasnapshot =>{
        name=datasnapshot.val();//
        this.setState({username:datasnapshot.val()})
   
     })
    }
  
    fire.database().ref("clinics").on('value', (snapshot) => {
      let data = snapshot.val();
      
      let items = Object.values(data);
      
      this.setState({clinicNameFromDB:items});
      
   }
)

  //    var items = [];
  //    snapshot.forEach((child) => {
  //     var s=child.val().clinicName;
  //     s.forEach((it)=>{
  //       items.push(
  //         it
  //      );
  //     })  
  // });

  //**** */
    //   let nameClinic = Object.values(snapshot.val());
    //   this.setState({clinicNameFromDB:nameClinic});
    //   var a=[];
    //   this.state.clinicNameFromDB.map((item,index)=>{
    //         a.push(item.name);
    //   })
    //   // const s=new Set(a);
    //   // const array=[...s];
    //   this.setState({
    //     clinicNameFromDB:a
    //   })

    //  })
    }

    addClinicName(){
      this.setState({
          clinicNames:[...this.state.clinicNames,""]
      })
    }

    handleChange(e,index){
this.state.clinicNames[index]=e;
this.setState({clinicNames:this.state.clinicNames})
    }

    handleSubmit(){
      //رح اجيب اسماء العيادات و بس يختار اسم عيادة بعملها بوش 
//ع الاريه و بضيف ع الداتا بيز

        var arr =this.state.clinicNames;
        if(this.state.clinicNameFromPicker){
          arr.push(this.state.clinicNameFromPicker)
        }
        
        if(!arr.length || !this.state.Specialization){
          alert("make sure you entered all info !");
          return;
        }
        else{
        arr.forEach((v,ind)=>{
            fire.database().ref("users").child(this.state.id).child("clinicName").push().set({
              'clinic':v.toLowerCase().trim(),
              'latitude':0,
              'longitude':0
            })
           .then(()=>{
            fire.database().ref("users").child(this.state.id).child("Specialization").set(this.state.Specialization.toLowerCase().trim());   
            fire.database().ref("clinics").orderByChild("clinic").equalTo(v.toLowerCase()).on('value',(snap)=>{
              //alert("1");
              if(!snap.val()){
               
                fire.database().ref("clinics").push().set({'clinic':v.toLowerCase().trim()});
              }
              //ازا هاد الاسم موجود ما تضيفه
            })
            
            alert("added successfully!");
            this.props.navigation.navigate("Profile");
            //this.props.navigation.navigate("Pro",{id:this.state.id})
          })
            .catch((error)=>alert("error!"))

        })
        
      }
    }
 
  render() {
    return (
      <Block flex middle>
        <StatusBar hidden />
        <ImageBackground
          source={Images.RegisterBackground}
          style={{ width, height, zIndex: 1 }}
        >
          <Block flex middle>
            <Block style={styles.registerContainer}>
              
              <Block flex>
                
                <ScrollView 
                showsVerticalScrollIndicator={false}
                style={{ width:width*0.9, marginTop: '25%' }}
                >
                <Block flex center>
                  <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior="padding"
                    enabled
                  >
                    <Block width={width * 0.8} style={{ marginBottom: 15 }}>

                      <Text style={{color:'#000'}}>
                          Please enter your information here then continue
                      </Text>

                      <View style={{flexDirection:'column'}}>
                <Picker 
                    style={{height: 60, width: width*0.8}} 
                    selectedValue = {this.state.clinicNameFromPicker} 
                    onValueChange = {(value) => {this.setState({clinicNameFromPicker: value});
                    }}>
                    {this.state.clinicNameFromDB.map((value,index)=>{
                      return(
                        <Picker.Item label = {value.clinic} value = {value.clinic} />
                      )
                    })}
                         
                    </Picker>
                       </View>
                       <View style={{marginTop:10}}>
                       <Text style={{marginTop:5}}>Or add new clinic </Text>
                    {this.state.clinicNames.map((name,index)=>{
                      return(
                          <View key={index}>
                          <Input
                        
                        borderless
                        placeholder="Clinic name"
                        onChangeText={(Cname)=>this.handleChange(Cname,index)}
                        value={name}
                        iconContent={
                            <ComponentIcon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name={'shop'}
                            family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                          
                        }
                      />
                          </View>
                      )
                    })}
                    </View>
                    <Button
                      style={{ backgroundColor: argonTheme.COLORS.GRADIENT_START,marginTop:10, width: width * 0.5,borderRadius:10}}
                      onPress={this.addClinicName}
                    >
                     add clinic name
                    </Button>

                    
                    </Block>
                    

                    <Block middle>
                     
                    <Input
                        
                        borderless
                        placeholder="Specialization"
                        onChangeText={(Specialization)=>this.setState({Specialization})}
                        value={this.state.Specialization}
                        iconContent={
                            <Icon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name={'school'}
                           // family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                          
                        }
                      />

                    </Block>


                   
                    <Block middle>
                      
                      <Button
                        style={styles.createButton}
                        color="success"
                        onPress={this.handleSubmit}
                      >
                      <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                        Continue
                      </Text>  
                      </Button>
                    </Block>
                    
                  </KeyboardAvoidingView>
                </Block>
                </ScrollView>
              </Block>
            </Block>
          </Block>
        </ImageBackground>
      </Block>
    );
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
  socialConnect: {
    backgroundColor: argonTheme.COLORS.WHITE,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#8898AA"
  },
  socialButtons: {
    width: 120,
    height: 40,
    backgroundColor: "#fff",
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1
  },
  socialTextButtons: {
    color: argonTheme.COLORS.PRIMARY,
    fontWeight: "800",
    fontSize: 14
  },
  inputIcons: {
    marginRight: 12
  },
  passwordCheck: {
    paddingLeft: 15,
    paddingTop: 13,
    paddingBottom: 30
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25,
    borderRadius:15,
    marginBottom:20
  }
});

export default ClinicName;
