import { createStackNavigator,createAppContainer } from 'react-navigation';
import Home from "../screens/Home";
import Onboarding from "../screens/Onboarding";
import Pro from "../screens/Pro";
import Profile from "../screens/Profile";
import Register from "../screens/Register";
import Info from "../screens/Elements";
import Articles from "../screens/Articles";
import Main from "../screens/Main";
import Login from "../screens/Login";
import DoctorInfo from "../screens/DoctorInfo";
import PatientProfile from "../screens/PatientProfile";
import Book from "../screens/Book";
import ClinicName from "../screens/ClinicName";
import Appointment from "../screens/Appointment"; 
import SelectTime from "../screens/SelectTime";
import SearchAboutTime from "../screens/SearchAboutTime";
import DoctorAppointment from "../screens/DoctorAppointment";
import PatientInfo from "../screens/PatientInfo";
import Search from "../screens/Search";
import PatientAfterSession from "../screens/PatientAfterSession";
const AppNavigator = createStackNavigator(
    {

      Info:{
        screen: Info,
        navigationOptions: {
          
          header: null,
          
        }
      },
      PatientAfterSession:{
        screen: PatientAfterSession,
        navigationOptions: {
          header: null,
        }
      },
      Search:{ screen: Search,
        navigationOptions: {
          header: null,
        } },

      PatientInfo:{ screen: PatientInfo,
        navigationOptions: {
          header: null,
        } },
      DoctorAppointment:{ screen: DoctorAppointment,
        navigationOptions: {
          header: null,
        } },
      SearchAboutTime:{ screen: SearchAboutTime,
        navigationOptions: {
          header: null,
        } },
      SelectTime: { screen: SelectTime,
        navigationOptions: {
          header: null,
        } },
      Appointment: { screen: Appointment,
        navigationOptions: {
          header: null,
        } },
  Home: { screen: Home,
    navigationOptions: {
      header: null,
    } },
  Onboarding:{screen:Onboarding,
    navigationOptions: {
      header: null,
    }},
  Pro:{screen:Pro},
  Profile:{screen:Profile,
    navigationOptions: {
      header: null,
      
    }},
    PatientProfile:{screen:PatientProfile,
      navigationOptions: {
        header: null,
      }

    },
    Book:{screen:Book,navigationOptions: {
      header: null,
    }},
    ClinicName:{screen:ClinicName,navigationOptions: {
      header: null,
    }},
  Account:{screen:Register,navigationOptions: {
    header: null,
  }},
  DoctorInfo:{screen:DoctorInfo,
  navigationOptions:{
    header:null,
  }},
  Articles:{screen:Articles},
  Main:{screen:Main},
  Login:{screen:Login,
    navigationOptions:{
      header:null,
    }}
  
},
{
    initialRouteName:'Onboarding'
}

);

const AppContainer = createAppContainer(AppNavigator);
export default AppContainer;
