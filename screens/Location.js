import React, { Component } from 'react'
import MapView from 'react-native-maps';
import fire from "../constants/firebaseConfigrations";
const { width, height } = Dimensions.get("screen");
import { StyleSheet, Text, View,  Alert, Dimensions,Picker } from 'react-native';
import { Button } from "../components";

const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = 0.0421;

class Location extends Component {
 constructor(props) {
    super(props);
    this.callGps=this.callGps.bind(this);
    this.onRegionChange=this.onRegionChange.bind(this);
    this.state = {
        id:'',
        clinicNames:[],
        clinicName:'',
        clinics:[],
        nodata:true,
       region: {
         latitude: 32.22111,
         longitude: 35.25444,
		 latitudeDelta: 0.0922,
         longitudeDelta: 0.0421
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
	componentDidMount() {

     const { navigation } = this.props;  
    var id=navigation.getParam('id');
     var c=navigation.getParam('clinic');
     this.setState({
         id:id,
         clinicName:c
     })

        fire.database().ref("users").child(id).child("clinicName").on('value',(datasnapshot) =>{
            let nameClinic = Object.values(datasnapshot.val());
            this.setState({clinicNames:nameClinic});
         });
         var array=[];
         fire.database().ref("users").on('value',(snap)=>{
            var data=snap.val();
            var keys=Object.keys(data);
            for(var i=0 ; i<keys.length;i++){
                fire.database().ref("users").child(keys[i]).child("type").on('value',(snapshot)=>{
                    var app=snapshot.val();//type of user
                    if(app=="doctor"){
                        fire.database().ref("users").child(keys[i]).child("clinicName").on('value',(result)=>{
                            if(result.val()){
                                let appointment = Object.values(result.val());
                                this.setState({clinicNames:appointment})

                                this.state.clinicNames.map((value,index)=>{
                                  array.push({clinicName:value.clinic,latitude:value.latitude,longitude:value.longitude});
                                })
                            }
                        })
                    }
                })

            }
         })

         if(array.length>0){
            var result = array.reduce((unique, o) => {
                if(!unique.some(obj => obj.clinicName === o.clinicName )) {
                  unique.push(o);
                }
                return unique;
            },[]);
        
            this.setState({
                clinics:result,
                nodata:false
            })
        }
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
      }
    );
	
	
  }
  
callGps(){
			// write your firebase code here 

        //Alert.alert('Simple Button pressed')
        
        fire.database().ref("users").child(this.state.id).child("latitud").set(this.state.region.latitude);
        fire.database().ref("users").child(this.state.id).child("longitude").set(this.state.region.longitude);


        this.state.clinicNames.map((value,index)=>{
            if(value.clinic == this.state.clinicName){
                fire.database().ref("users").child(this.state.id).child("clinicName").orderByChild("clinic").equalTo(this.state.clinicName).on('value',(snap)=>{
                    if(snap.val()){
                       fire.database().ref("users").child(this.state.id).child("clinicName").child(Object.keys(snap.val())[index]).child("latitude").set(this.state.region.latitude);
                       fire.database().ref("users").child(this.state.id).child("clinicName").child(Object.keys(snap.val())[index]).child("longitude").set(this.state.region.longitude);

       
                    }
              })
            }
        })
       

       // Alert.alert('Done ^__^')
        //fire.database().ref("users").child(id).child("name").set(this.state.username.toLowerCase());


}
onRegionChange(region) {
  this.setState({
      region:region
  })
}	

render () {
	return (
		  <View style={styles.container}>



			<MapView
			region={this.state.region}
			style={styles.mapStyle}
            showsUserLocation
            onRegionChange={this.callGps}
            >
				
                {this.state.clinics.map((item,index)=>{
                    return(
                        <MapView.Marker
                    
                    key={index}
                    coordinate={{
                      latitude: item.latitude,
                      longitude: item.longitude,
                      latitudeDelta: LATITUDE_DELTA,
                      longitudeDelta: LONGITUDE_DELTA,
                    }}
                    title={item.clinicName}
                         />
                    )
                })}
				
			  <MapView.Marker
				title={"put me on your location"}
			    draggable = {true}
				coordinate={this.state.region}
				onDragEnd={(e) => this.setState({ region: e.nativeEvent.coordinate })}
			  />
				<MapView.Circle

				 center={this.state.region}
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