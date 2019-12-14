import React, { Component } from 'react'
import MapView from 'react-native-maps';
import fire from "../constants/firebaseConfigrations";
const { width, height } = Dimensions.get("screen");
import { StyleSheet, Text, View,  Alert, Dimensions,Picker,ToastAndroid } from 'react-native';
import { Button } from "../components";
const LATITUDE = 0;
const LONGITUDE = 0;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = 0.0421;
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

class Location extends Component {
 constructor(props) {
    super(props);
    this.callGps=this.callGps.bind(this);
    this.onRegionChange=this.onRegionChange.bind(this);
    this.authListener=this.authListener.bind(this);
    this.state = {
        id:'',
        clinicNames:[],
        clinicName:'',
        clinics:[],
        nodata:true,
        count:0,
       region: {
         latitude: LATITUDE,
         longitude: LONGITUDE,
		     latitudeDelta: LATITUDE_DELTA,
         longitudeDelta: LONGITUDE_DELTA
       },
       region1: {
        latitude: 32.22111,
        longitude: 35.25444,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },

       initialRegion: {
        latitude: 31.22111,
        longitude: 35.25444,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
       to:{
         latitude: 32.2276745735839,
         longitude: 35.215799398720264
       },
       from:{
         latitude: 32.22111,
         longitude: 35.25444
       },
	   x:{
         latitude: 32.227,
         longitude: 35.2157

       }
};

   }	
   componentDidMount(){
     this.authListener();
   }

	authListener() {

     const { navigation } = this.props;  
    var id=navigation.getParam('id');
     var c=navigation.getParam('clinic');
     this.setState({
         id:id,
         clinicName:c
     })
      var ar=[];
     
     fire.database().ref("users").child(id).child("clinicName").on('value',(datasnapshot) =>{
      if(datasnapshot.val()){
          let nameClinic = Object.values(datasnapshot.val());
          nameClinic.map((value,index)=>{
              if(value.clinic == c && value.latitude!=0 && value.longitude!=0){
               //  ar.push({latitude:value.latitude,longitude:value.longitude,latitudeDelta:0.0922,longitudeDelta:0.0421});
              
               this.setState({initialRegion:{
                latitude: value.latitude,
                longitude: value.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
               }});
              }
          })
         
   
          
      }
      
   });


    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.10922,
            longitudeDelta: 0.100421
          }
        });
      },
    (error) => console.log(error.message),
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
    this.watchID = navigator.geolocation.watchPosition(
      position => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.100922,
            longitudeDelta: 0.100421
          }
        });
      },
      (error) => console.log("error"),
     {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
	
	
  }
  
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

callGps(){
			// write your firebase code here 

        console.log("callGPS");
        fire.database().ref("users").child(this.state.id).child("clinicName").on('value',(datasnapshot) =>{
          if(datasnapshot.val()){
              let nameClinic = Object.values(datasnapshot.val());
              console.log(nameClinic.length);
              nameClinic.map((value,index)=>{
                console.log(value.clinic);
                  if(value.clinic == this.state.clinicName){
                      fire.database().ref("users").child(this.state.id).child("clinicName").orderByChild("clinic").equalTo(this.state.clinicName).once('value',(snap)=>{
                          if(snap.val()){
                             fire.database().ref("users").child(this.state.id).child("clinicName").child(Object.keys(snap.val())[index]).child("latitude").set(this.state.region.latitude);
                             fire.database().ref("users").child(this.state.id).child("clinicName").child(Object.keys(snap.val())[index]).child("longitude").set(this.state.region.longitude);
                          }
                    }).then(()=>console.log("success!")).catch((error)=>console.log("error!"));
                  }
              })
      
          }
          
       });
       



}
onRegionChange(region) {
  console.log(region);
  this.setState({
      region
  })

}	

render () {
	return (
		  <View style={styles.container}>
			<MapView
      provider="google"
      showsBuildings={true}
      initialRegion={this.state.initialRegion}
			style={styles.mapStyle}
      showsUserLocation={true}
       //region={ this.state.region }
      // onRegionChange={ region => this.setState({region}) }
      // onRegionChangeComplete={ region => this.setState({region}) }
            >
				
         
			  <MapView.Marker
				title={this.state.clinicName}
			  draggable = {true}
				coordinate={this.state.initialRegion}
				onDragEnd={(e) => {
         // this.setState({ region: e.nativeEvent.coordinate });
          fire.database().ref("users").child(this.state.id).child("clinicName").once('value',(datasnapshot) =>{
          if(datasnapshot.val()){
              let nameClinic = Object.values(datasnapshot.val());
              console.log(nameClinic.length);
              nameClinic.map((value,index)=>{
                console.log(value.clinic);
                  if(value.clinic == this.state.clinicName){
                      fire.database().ref("users").child(this.state.id).child("clinicName").orderByChild("clinic").equalTo(this.state.clinicName).once('value',(snap)=>{
                          if(snap.val()){
                             fire.database().ref("users").child(this.state.id).child("clinicName").child(Object.keys(snap.val())[index]).child("latitude").set(e.nativeEvent.coordinate.latitude);
                             fire.database().ref("users").child(this.state.id).child("clinicName").child(Object.keys(snap.val())[index]).child("longitude").set(e.nativeEvent.coordinate.longitude);
                          }
                    }).then(()=>alert("success!")).catch((error)=>alert("error!"));
                  }
              })
      
          }
          
       });

        }}
			  />
				<MapView.Circle

				 center={this.state.initialRegion}
				 radius={200}
				 fillColor='rgba(255, 0, 0, 0.2)'
				 strokeColor='rgba(0, 0, 0, 0.2)'
				 />

		    
			</MapView>
 
		  </View>
		)
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom:80,
  },
  
  mapStyle: {
   width: Dimensions.get('window').width,
   height: Dimensions.get('window').height,
  // bottom: 20,
   marginTop:60
  }
});

export default  Location;