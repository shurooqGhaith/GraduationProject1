import React from 'react';
import { Image , BackHandler  } from 'react-native';
// import  firebase from 'react-native-firebase';

import { AppLoading } from 'expo';
import {  Asset } from 'expo-asset';
import { Block, GalioProvider } from 'galio-framework';
import Screens from './navigation/Screens';
import AppContainer from "./navigation/screen";
import { Images, articles, argonTheme } from './constants';
import { Notifications } from 'expo';

import fire from "./constants/firebaseConfigrations";
// cache app images
const assetImages = [
  Images.Onboarding,
  Images.LogoOnboarding,
  //Images.Logo,
  Images.Pro,
  Images.dentalLogo,
  Images.iOSLogo,
  Images.androidLogo
];

// cache product images
articles.map(article => assetImages.push(article.image));


////////////
function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
    notification: {},
	key: -1,
	origin:""
   
  }
  
  
  componentDidMount() {
    // this.createNotificationChannel();
    // this.checkPermission();
    this._notificationSubscription = Notifications.addListener(this._handleNotification);

    BackHandler.addEventListener('hardwareBackPress', function() {
      // this.onMainScreen and this.goBack are just examples, you need to use your own implementation here
      // Typically you would use the navigator here to go to the last state.
      return false;
    });
    
  
  }

  _handleNotification = (notification) => {
    this.setState({notification: notification});
		  console.log("the notification is:");

		  console.log(notification);

		  key = notification.data.key;
		 origin =notification.origin;
		 this.setState({key: key, origin:origin});

			
		  
		 
  };
  

    componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  } 

  _handleAppStateChange = (nextAppState) => {
	  // this function is to return the app state to its initial value when user press the home button "and return"
	  // so that free the values that set from the notification if the user return to the application after pressing home
    if (this.state.appState &&
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
    }
	else if (nextAppState.match(/inactive|background/))
	{
			this.setState({key: -1, origin:""});

	}

    this.setState({appState: nextAppState});
  };

navigate_to(){
key = this.state.key
	if(key==12){
		Alert.alert('to page 12')	
      }
    else if(key==2){
    
      this.props.navigation.navigate("Login")
    }

}


  render() {
    
    if(!this.state.isLoadingComplete) {
      return (

        ///AppLoading '
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <GalioProvider theme={argonTheme}>
          <Block flex>
            <AppContainer />
          </Block>
        </GalioProvider>
      );
    }
  }
  

  
  _loadResourcesAsync = async () => {
    return Promise.all([
      ...cacheImages(assetImages),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

}
