import React, { Component } from 'react'
import MapView from 'react-native-maps';
import fire from "../constants/firebaseConfigrations";
const { width, height } = Dimensions.get("screen");
import { StyleSheet, Text, View,  Alert, Dimensions,Picker } from 'react-native';
import { Button } from "../components";

const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = 0.0421;

class ShowAllLocation extends Component {
 constructor(props) {
    super(props);
    this.onRegionChange=this.onRegionChange.bind(this);
    this.deg2Rad=this.deg2Rad.bind(this);
    this.pythagorasEquirectangular =this.pythagorasEquirectangular.bind(this);
    this.NearestCity=this.NearestCity.bind(this);
    this.state = {
        id:'',
        clinicNames:[],
        clinicName:'',
        clinics:[],
        nodata:true,
        latitude:'',
        longitude:'',
       region: {
         latitude: 32.22111,
         longitude: 35.25444,
		 latitudeDelta: LATITUDE_DELTA,
         longitudeDelta: LONGITUDE_DELTA
       }
       

       }
};

   
	componentDidMount() {
    const { navigation } = this.props;  
    var id=navigation.getParam('id');
    this.setState({
        id:id
    });
    fire.database().ref("users").child(id).child("latitude").on('value',(snap)=>{
      this.setState({latitude:snap.val()})
    })

    fire.database().ref("users").child(id).child("longitude").on('value',(snap)=>{
      this.setState({longitude:snap.val()})
    })

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

                                let names = Object.values(result.val());
                                this.setState({clinicNames:names})

                                this.state.clinicNames.map((value,index)=>{
                                  array.push({clinicName:value.clinic,latitude:value.latitude,longitude:value.longitude});
                                })
                            }
                        }) //clinic names fire
                    }//doctor if
                })

            }//keys for
           // alert(array.length);//8
           var minDif = 99999;
        var closest;
      
              for (var index = 0; index < array.length; ++index) {
          var dif = this.PythagorasEquirectangular(this.state.latitude, this.state.longitude,array[index][1], array[index][2]).bind(this);
          if (dif < minDif) {
            closest =index;
            minDif = dif;
          }
          alert(array[closest][0]);
        // close=;
        }
         })
         this.setState({
            clinics:array,
            nodata:false
        })

        

         if(array.length>0){
            // var result = array.reduce((unique, o) => {
            //     if(!unique.some(obj => obj.clinicName === o.clinicName )) {
            //       unique.push(o);
            //     }
            //     return unique;
            // },[]);
            this.setState({
                clinics:array,
                nodata:false
            })
        }
    
	
	
  }
  deg2Rad (deg) {
  return deg * Math.PI / 180;
}

pythagorasEquirectangular = (lat1, lon1, lat2, lon2) => {
  lat1 = Deg2Rad(lat1);
  lat2 = Deg2Rad(lat2);
  lon1 = Deg2Rad(lon1);
  lon2 = Deg2Rad(lon2);
  var R = 6371; // km
  var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
  var y = (lat2 - lat1);
  var d = Math.sqrt(x * x + y * y) * R;
  return d;
}

NearestCity(latitude, longitude) {
 
}
onRegionChange(region){
  this.setState({ region:region });
}	

render () {
	return (
		  <View style={styles.container} >



<MapView
           style={styles.mapStyle}
          initialRegion={this.state.region}
          showsUserLocation={true}
              >
  {!this.state.nodata && this.state.clinics.map((marker) => {
      return(
        <MapView.Marker
      coordinate={{
                      latitude: marker.latitude,
                      longitude: marker.longitude,
                      latitudeDelta: LATITUDE_DELTA,
                      longitudeDelta: LONGITUDE_DELTA,
                    }}
                    title={marker.clinicName}
    />
      )
    
  })}
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
  }
});

export default  ShowAllLocation;