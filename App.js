import React from 'react';
import { Image , BackHandler  } from 'react-native';
import { AppLoading } from 'expo';
import {  Asset } from 'expo-asset';

import { Block, GalioProvider } from 'galio-framework';
import Screens from './navigation/Screens';
import AppContainer from "./navigation/screen";
import { Images, articles, argonTheme } from './constants';
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
  }
  
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', function() {
      // this.onMainScreen and this.goBack are just examples, you need to use your own implementation here
      // Typically you would use the navigator here to go to the last state.
    
      
      return false;
    });
  
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
