import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  View,
  CheckBox,
  ScrollView,
  TouchableOpacity ,
  TextInput,
  ToastAndroid,
  Image
} from "react-native";
import { Block, Checkbox, Text, theme } from "galio-framework";
import { Divider } from 'react-native-elements';
import Icon from "react-native-vector-icons/MaterialIcons";
import firebase from 'firebase';
import { Button as ComponentButton, Input } from "../components";
import { Images, argonTheme } from "../constants";
import fire from "../constants/firebaseConfigrations";
import Panel from 'react-native-panel';
import { List } from 'react-native-paper';
// import { ImagePicker, Permissions } from 'expo';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
const { width, height } = Dimensions.get("screen");
const Toast = (props) => {
    if (props.visible) {
      ToastAndroid.showWithGravityAndOffset(
        props.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
      return null;
    }
    return null;
  };


class UpdateInfo extends React.Component {
   

  constructor(props){
    super(props);
    this.authListener=this.authListener.bind(this);
    this.edit=this.edit.bind(this);
    this.update=this.update.bind(this);
    this.reauthenticate=this.reauthenticate.bind(this);
    this.changePassword=this.changePassword.bind(this);
    this.changeEmail=this.changeEmail.bind(this);
    this.updateSpecialization=this.updateSpecialization.bind(this);
    this.updatePhone=this.updatePhone.bind(this);
    this.state={
        id:'',
        type:'',
      username:'',
      name:'',
      email:'',
      em:'',
      password:'',
      errorMessage:null,
      checked:false,
      nameEnable:false,
      emailEnable:false,
      passwordEnable:false,
      UploadEnable:false,
      phoneEnable:false,
      currentPassword:'',
      newPassword:'',
      Specialization:'',
      SpecializationEnable:false,
      sp:'',
      phone:'',
      phoneNum:'',
      isShow:false,
      isShowEmail:false,
      isShowPass:false,
      isShowSpecialization:false,
      
      message:'',
      photo:'',
      uploaded:false
    }
  }
  
  componentDidMount(){ 
    this.getPermissionAsync();
    this.authListener();
  }
  authListener(){
    
    const { navigation } = this.props;  
    var id=navigation.getParam('id');
    var type=navigation.getParam('type');
    this.setState({
        id:id,
        type:type
    })
   
        fire.database().ref("users").child(id).child("name").on('value',(name)=>{
            this.setState({username:name.val(),name:name.val()})
        })
        fire.database().ref("users").child(id).child("avatar").on('value',(datasnapshot)=>{
          if(datasnapshot.val()){this.setState({photo:datasnapshot.val() })
        }
        })
        fire.database().ref("users").child(id).child("email").on('value',(email)=>{
            this.setState({email:email.val(),em:email.val()})
        })
        fire.database().ref("users").child(id).child("phone").on('value',(phone)=>{
          if(phone.val()){
          this.setState({phone:phone.val(),phoneNum:phone.val()})
          }
      })
        if(type=='doctor'){
            fire.database().ref("users").child(id).child("Specialization").on('value',(sp)=>{
                this.setState({Specialization:sp.val(),sp:sp.val()})
            })
    }
   
  
    }
  

    reauthenticate = (currentPassword) => {
        var user = fire.auth().currentUser;
        var cred = firebase.auth.EmailAuthProvider.credential(
            user.email, currentPassword);
        return user.reauthenticateWithCredential(cred);
        
      }

    edit(){
        this.setState({
            nameEnable:true,
            emailEnable:true
        })
    }
    changePassword(){

        this.reauthenticate(this.state.currentPassword).then(() => {
            var user = fire.auth().currentUser;
            user.updatePassword(this.state.newPassword).then(() => {
             //alert("Password updated!");
             this.setState({isShow:true,name:this.state.username,message:'Password updated!'});
        setTimeout(function(){
            this.setState({isShow:false});
       }.bind(this),5000);
            }).catch((error) => {
                // console.log(error); 
                this.setState({message:error.message,isShow:true});
                setTimeout(function(){
                    this.setState({isShow:false});
               }.bind(this),5000);

                });
          }).catch((error) => {
             // alert(error);
           //  console.log(error); 
 
             this.setState({message:error.message,isShow:true});
             setTimeout(function(){
                this.setState({isShow:false});
           }.bind(this),5000);

            });
    }
    changeEmail = () => {
        //alert("change email method !");
        this.reauthenticate(this.state.currentPassword).then(() => {
          var user = fire.auth().currentUser;
          user.updateEmail(this.state.email).then(() => {
            fire.database().ref("users").child(this.state.id).child("email").set(this.state.email);
            //alert("Email updated!");
            this.setState({isShow:true,em:this.state.email,message:'Email updated!'});
        setTimeout(function(){
            this.setState({isShow:false});
       }.bind(this),5000);

          }).catch((error) => { 
             // console.log(error); 
             this.setState({message:error.message});
             setTimeout(function(){
                this.setState({isShow:false});
           }.bind(this),5000);

            });
        }).catch((error) => { 
            //console.log(error); 
            this.setState({message:error.message});
            setTimeout(function(){
                this.setState({isShow:false});
           }.bind(this),5000);

        });
      }

    update(){
       // alert("name:"+this.state.username+"\n"+"-email:"+this.state.email)
       

       fire.database().ref("users").child(this.state.id).child("name").set(this.state.username).then(()=>{
        this.setState({isShow:true,name:this.state.username,message:'Name is Updated successfully ! '});
        setTimeout(function(){
            this.setState({isShow:false});
       }.bind(this),5000);
        //alert("Updated successfully !")
       }).catch((error)=>{
                  // alert("an error happened !")
                 this.setState({message:error.message,isShow:true});
                 setTimeout(function(){
                       this.setState({isShow:false});
                      }.bind(this),5000);
       }
       )
    }
    updatePhone(){
      fire.database().ref("users").child(this.state.id).child("phone").set(this.state.phone).then(()=>{
        this.setState({isShow:true,phoneNum:this.state.phone,message:'Phone number is Updated successfully ! '});
        setTimeout(function(){
            this.setState({isShow:false});
       }.bind(this),5000);
        //alert("Updated successfully !")
       }).catch((error)=>{
                  // alert("an error happened !")
                 this.setState({message:error.message,isShow:true});
                 setTimeout(function(){
                       this.setState({isShow:false});
                      }.bind(this),5000);
       }
       )

    }
    updateSpecialization(){
        fire.database().ref("users").child(this.state.id).child("Specialization").set(this.state.Specialization).then(()=>{
            this.setState({isShow:true,sp:this.state.Specialization,message:'Specialization is Updated successfully ! '});
            setTimeout(function(){
                this.setState({isShow:false});
           }.bind(this),5000);
            //alert("Updated successfully !")
           }).catch((error)=>{
            // alert("an error happened !")
            this.setState({message:error.message,isShow:true});
            setTimeout(function(){
              this.setState({isShow:false});
            }.bind(this),5000);
                   }

           )
    
    }


getPermissionAsync = async () => {
  
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
    }
  
}

_pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1
  });

  //console.log(result);
   
  if (!result.cancelled) {
    this.setState({ photo: result.uri,uploaded:true });
  }
  fire.database().ref("users").child(this.state.id).child("avatar").set(this.state.photo).then(()=>{
    this.setState({isShow:true,message:'Avatar is Updated successfully ! '});
    setTimeout(function(){
        this.setState({isShow:false});
   }.bind(this),5000);
    //alert("Updated successfully !")
   }).catch((error)=>{
    // alert("an error happened !")
    this.setState({message:error.message,isShow:true});
    setTimeout(function(){
      this.setState({isShow:false});
    }.bind(this),5000);
           }

   )
};
  render() {
    return (
      <Block style={{backgroundColor:'#eee',flex:1}} flex middle>
        <StatusBar hidden />
        
         
            <Block >
             
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
                   <Text style={{alignContent:'center',marginLeft:80}}  size={20} bold>
                  Edit Your Information
                </Text>
                <Divider style={{backgroundColor:'#444',width:width}}/>

                    <Block  width={width } style={{ marginBottom: 15,marginTop:50}}>
                    <TouchableOpacity style={styles.row} onPress={()=>this.setState({nameEnable:!this.state.nameEnable})}>
                <Text color={this.state.nameEnable ? '#4A148C' : '#333'} size={14}>{"Change Name\n"}
                <Text style={{color:'#aaa'}} size={10}>{"Current:"+this.state.name}</Text>
                </Text>

                <Icon name={this.state.nameEnable ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} 
                color={this.state.nameEnable ? '#4A148C' : '#333'} />
            </TouchableOpacity>
                    <View style={{flexDirection:'column',alignItems:'center'}}>
                      {this.state.nameEnable && 
                      <View>
                      <TextInput
                       placeholder="New Name"
                        //value={this.state.username}
                        onChangeText={username => this.setState({username})}
                        style={styles.TextInputStyle}
                        //editable={this.state.nameEnable}
                       // underlineColorAndroid='transparent' 
                      />
                             <ComponentButton
                           small
                           style={{backgroundColor:'#333',marginLeft:10}}
                           onPress={this.update}
                      >
                      <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                        Save
                      </Text>  
                      </ComponentButton>  
                      </View>
                      }
                      </View>
                      
                    </Block>
                    <Divider style={{backgroundColor:'#444',width:width*0.9}}/>
                    <Block  width={width } style={{ marginBottom: 15,marginTop:50}}>
                    <TouchableOpacity style={styles.row} onPress={()=>this.setState({phoneEnable:!this.state.phoneEnable})}>
                <Text color={this.state.phoneEnable ? '#4A148C' : '#333'} size={14}>{"Change PhoneNumber\n"}
                <Text style={{color:'#aaa'}} size={10}>{"Current:"}
                <Text style={{color:'#aaa'}} size={10}>{this.state.phoneNum?this.state.phoneNum:'Not determined yet'}</Text></Text>
                </Text>

                <Icon name={this.state.phoneEnable ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} 
                color={this.state.phoneEnable ? '#4A148C' : '#333'} />
            </TouchableOpacity>
                    <View style={{flexDirection:'column',alignItems:'center'}}>
                      {this.state.phoneEnable && 
                      <View>
                      <TextInput
                       placeholder="New Number"
                       
                        //value={this.state.username}
                        onChangeText={phone => this.setState({phone})}
                        style={styles.TextInputStyle}
                        keyboardType='phone-pad'
                        clearButtonMode='while-editing'
                        //editable={this.state.nameEnable}
                       // underlineColorAndroid='transparent' 
                      />
                             <ComponentButton
                           small
                           style={{backgroundColor:'#333',marginLeft:10}}
                           onPress={this.updatePhone}
                      >
                      <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                        Save
                      </Text>  
                      </ComponentButton>  
                      </View>
                      }
                      </View>
                      
                    </Block>
                    <Divider style={{backgroundColor:'#444',width:width*0.9}}/>

                    <Block  width={width } style={{ marginBottom: 15,marginTop:30}}>
                    
                    <TouchableOpacity style={styles.row} onPress={()=>this.setState({emailEnable:!this.state.emailEnable})}>
                <Text color={this.state.emailEnable ? '#4A148C' : '#333'} size={14}>{"Change Email\n"}
                <Text style={{color:'#aaa'}} size={10}>{"Current:"+this.state.em}</Text>
                </Text>
                <Icon name={this.state.emailEnable ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} 
                color={this.state.emailEnable ? '#4A148C' : '#333'}  />
            </TouchableOpacity>
                    <View style={{flexDirection:'column',alignItems:'center'}}>
                      {this.state.emailEnable && 
                      <View>
                      
                      <TextInput
                        secureTextEntry={true}
                        autoCapitalize="none"
                        placeholder="Current Password"
                        value={this.state.currentPassword}
                        onChangeText={password => this.setState({currentPassword: password })}
                        style={styles.TextInputStyle}
                      />
                      <TextInput
                        placeholder="New Email"
                        onChangeText= {email => this.setState({ email })}
                       // value={this.state.email}
                        style={styles.TextInputStyle}
                        keyboardType='email-address'
                        autoCompleteType='email'
                        //  editable={this.state.emailEnable}
                       // underlineColorAndroid='transparent' 
                      />     
                             <ComponentButton
                           small
                           style={{backgroundColor:'#333',marginLeft:10}}
                           onPress={this.changeEmail}
                      >
                      <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                        Save
                      </Text>  
                      </ComponentButton>    
                      {/* <Toast visible={this.state.isShowEmail} message="Email is Updated successfully"/>       */}
    
                      </View>
                      
                     
                      }
                      </View>
                      
                    </Block>
                    
                    <Divider style={{backgroundColor:'#444',width:width*0.9}}/>

                    <Block width={width } style={{marginTop:30,marginBottom: 15}}>
                    <TouchableOpacity style={styles.row} onPress={()=>this.setState({passwordEnable:!this.state.passwordEnable})}>
                <Text color={this.state.passwordEnable ? '#4A148C' : '#333'} size={14}>Change password</Text>
                <Icon name={this.state.passwordEnable ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} 
                color={this.state.passwordEnable ? '#4A148C' : '#333'}  />
            </TouchableOpacity>
                    <View style={{flexDirection:'column',alignItems:'center'}}>

                       {this.state.passwordEnable && 
                        <View >

                        <TextInput
                        secureTextEntry={true}
                        autoCapitalize="none"
                        placeholder="Current Password"
                        value={this.state.currentPassword}
                        onChangeText={password => this.setState({currentPassword: password })}
                        style={styles.TextInputStyle}
                      />
                        
                    
                      <TextInput
                        secureTextEntry={true}
                        autoCapitalize="none"
                        placeholder="New Password"
                        value={this.state.newPassword}
                        onChangeText={password => this.setState({newPassword: password })}
                        style={styles.TextInputStyle}
                      />
                        <ComponentButton
                           small
                           style={{backgroundColor:'#333',marginLeft:10}}
                           onPress={this.changePassword}
                      >
                      <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                        Save
                      </Text>  
                      </ComponentButton>
                      {/* <Toast visible={this.state.isShowPass} message="Password is changed successfully"/>       */}

                      </View>

                       }
                      
                </View>
                    </Block>
                    <Divider style={{backgroundColor:'#444',width:width*0.9}}/>

                    {this.state.type=="doctor" &&
                    <Block width={width } style={{marginTop:30,marginBottom: 15}}>
                    <TouchableOpacity style={styles.row} onPress={()=>this.setState({SpecializationEnable:!this.state.SpecializationEnable})}>
                <Text color={this.state.SpecializationEnable ? '#4A148C' : '#333'} size={14}>{"Edit Specialization\n"}
                <Text style={{color:'#aaa'}} size={10}>{"Current:"+this.state.sp} </Text>
                    </Text>
                <Icon name={this.state.SpecializationEnable ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} 
                color={this.state.SpecializationEnable ? '#4A148C' : '#333'}  />
            </TouchableOpacity>
                    <View style={{flexDirection:'column',alignItems:'center'}}>

                       {this.state.SpecializationEnable && 
                        <View >
                        <TextInput
                        autoCapitalize="none"
                        placeholder="new Specialization"
                       // value={this.state.Specialization}
                        onChangeText={Specialization => this.setState({Specialization: Specialization })}
                        style={styles.TextInputStyle}
                      />
                        <ComponentButton
                           small
                           style={{backgroundColor:'#333',marginLeft:10}}
                           onPress={this.updateSpecialization}
                      >
                      <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                        Save
                      </Text>  
                      </ComponentButton>
                      {/* <Toast visible={this.state.isShowSpecialization} message="Specialization is changed successfully"/>       */}

                      </View>

                       }
                      
                </View>
                    </Block>
                    }
                    <Divider style={{backgroundColor:'#444',width:width*0.9}}/>
                    <Block width={width } style={{marginTop:30,marginBottom: 15}}>
                    <TouchableOpacity
                     onPress={()=>this.setState({UploadEnable:!this.state.UploadEnable})}
                  
                   style={styles.row}
                >
                <Text color={this.state.UploadEnable ? '#4A148C' : '#333'} size={14}>{"Change Profile Image\n"}
                    </Text>
                <Icon name={this.state.UploadEnable ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={30} 
                color={this.state.UploadEnable ? '#4A148C' : '#333'}  />
                </TouchableOpacity>
                <View style={{flexDirection:'column',alignItems:'center'}}>
                
                {this.state.UploadEnable && <View >
               {!this.state.photo &&<View><Text>No image</Text></View>} 
          {this.state.photo &&<View>
            <Image source={{ uri: this.state.photo }} style={{ width: width*0.555,height: height*0.2632,borderRadius: 82,borderWidth:0,marginLeft:10}} />
          </View>}
          <ComponentButton   small
                           style={{backgroundColor:'#333',marginTop:10,marginLeft:60}}
                           onPress={this._pickImage}>
                           <Text bold size={14} color={argonTheme.COLORS.WHITE}>Change</Text>
                           </ComponentButton>
                </View> }
               </View>
                
                </Block>

                    <Toast visible={this.state.isShow} message={this.state.message}/> 
                  </KeyboardAvoidingView>
                </Block>
                </ScrollView>
              </Block>
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
title:{
  fontSize: 14,
  fontWeight:'bold',
  color: "#333",
},
    firstHeader: {
        marginHorizontal: 10,
        backgroundColor: 'gray',
        alignItems: 'center',
        justifyContent: 'center',
        // borderRadius: 15,
        height: 50,
      },
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
    //overflow: "hidden"
  },
  firstHeaderContainer:{
      backgroundColor:'#ccc',
      overflow:"hidden",
      height:height*0.5
  },
  TextInputStyle: {  
    height: 40,  
    //  borderRadius: 5,  
    //  borderWidth: 0.5,  
    //  borderColor: '#fff',  
    marginBottom: 10 ,
    marginTop:10 ,
    alignContent:'center',
    paddingLeft:20,
    width:width*.8,
    marginLeft:10,
   // backgroundColor:'#fff',
    borderBottomWidth:2,
    borderBottomColor:'#000'
}  ,
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
  }
});

export default UpdateInfo;