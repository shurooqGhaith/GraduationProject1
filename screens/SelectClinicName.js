import React from 'react';
import { ImageBackground, Image, StyleSheet, StatusBar, Dimensions, Platform,Picker,View } from 'react-native';
import { Block, Text, theme } from 'galio-framework';
import { Button } from "../components";

const { height, width } = Dimensions.get('screen');
import { Images, argonTheme } from '../constants';
import { HeaderHeight } from "../constants/utils";
import fire from "../constants/firebaseConfigrations";

export default class Pro extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      clinicNames:[],
      clinicName:'',
      id:''
    }
  }

  componentDidMount(){
    const { navigation } = this.props;  
    var id=navigation.getParam('id');
  
     this.setState({
         id:id
     })

        fire.database().ref("users").child(id).child("clinicName").on('value',(datasnapshot) =>{
            let nameClinic = Object.values(datasnapshot.val());
            this.setState({clinicNames:nameClinic});
         })
  }
  render() {
    const { navigation } = this.props;

    return (
      <Block flex style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Block flex>
          <ImageBackground
            source={Images.Pro}
            style={{ flex: 1, height: height, width, zIndex: 1 }}
          />
          <Block space="between" style={styles.padded}>
            <Block>
            <View style={{flexDirection:'column'}}>
                <Picker 
                    style={{height: 60, width: width*0.5}} 
                    selectedValue = {this.state.clinicName} 
                    onValueChange = {(value) => {this.setState({clinicName: value});
                    }}>
                    {this.state.clinicNames.map((value,index)=>{
                      return(
                        <Picker.Item label = {value.clinic} value = {value.clinic} />
                      )
                    })}
                         
                    </Picker>
                      
                      <Button small onPress={()=>{
                        if(this.state.clinicName){
                          navigation.navigate('Location',{clinic:this.state.clinicName,id:this.state.id})
                        }
                      }}><Text>Go</Text></Button>
                    </View>

             
              <Text size={16} color='rgba(255,255,255,0.6)' style={{ marginTop: 35 }}>
                Take advantage of all the features and screens made upon Galio Design System, coded on React Native for both.
              </Text>
              <Block row style={{ marginTop: theme.SIZES.BASE * 1.5, marginBottom: theme.SIZES.BASE * 4 }}>
                <Image
                  source={Images.iOSLogo}
                  style={{ height: 38, width: 82, marginRight: theme.SIZES.BASE * 1.5 }} />
                <Image
                  source={Images.androidLogo}
                  style={{ height: 38, width: 140 }} />
              </Block>
              <Button
                
                style={styles.button}
               >
                <Text bold color={theme.COLORS.WHITE}>COMING SOON</Text>
              </Button>
            </Block>
          </Block>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.BLACK,
    marginTop: Platform.OS === 'android' ? -HeaderHeight : 0,
  },
  padded: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    zIndex: 3,
    position: 'absolute',
    bottom: Platform.OS === 'android' ? theme.SIZES.BASE * 2 : theme.SIZES.BASE * 3,
  },
  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
    backgroundColor:argonTheme.COLORS.INFO
  },
  pro: {
    backgroundColor: argonTheme.COLORS.INFO,
    paddingHorizontal: 8,
    marginLeft: 3,
    borderRadius: 4,
    height: 22,
    marginTop: 15
  },
  gradient: {
    zIndex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 66,
  },
});
