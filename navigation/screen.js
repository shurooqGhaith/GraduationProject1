import { createStackNavigator,createAppContainer } from 'react-navigation';
import Home from "../screens/Home";
import Onboarding from "../screens/Onboarding";
import Profile from "../screens/Profile";
import Register from "../screens/Register";
import Info from "../screens/Elements";
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
import Chat from "../screens/Chat";
import Location from "../screens/Location";
import Pro from "../screens/SelectClinicName";
import ShowAllLocation from "../screens/ShowAllLocation";
import DoctorAgenda from "../screens/Table";
import PatientAppointment from "../screens/PatientAppointment";
import UpdateInfo from "../screens/UpdateInfo";
import EmailVerify from "../screens/VerifyEmail";
import MyPanel from "../screens/Panel";
import DetailsAboutPatients from "../screens/DetailsAboutPatient";
import AgendaScreen from "../screens/Agenda";
import InformationAboutDoctor from "../screens/InformationAboutDoctor";
import answer from '../screens/answer';

import Questions from '../screens/questions';
const AppNavigator = createStackNavigator(
    {
      InformationAboutDoctor:{screen:InformationAboutDoctor,
        navigationOptions:{
          title:'Back',
        }
      },
      Agenda:{screen:AgendaScreen,
        navigationOptions: {
          header: null,
        }
      },
      DetailsAboutPatients:{screen:DetailsAboutPatients,
        navigationOptions: {
          header: null,
        }
      },

      MyPanel:{screen:MyPanel,
        navigationOptions: {
          header: null,
        }
      },
       
      EmailVerify:{screen:EmailVerify,
        navigationOptions: {
          header: null,
        }
      },
      UpdateInfo:{screen:UpdateInfo,
        navigationOptions: {
          header: null,
        }
      },

      PatientAppointment:{screen:PatientAppointment,
        navigationOptions: {
          header: null,
        }
      },
      DoctorAgenda:{screen:DoctorAgenda,
        navigationOptions: {
          header: null,
        }
      },

      ShowAllLocation:{screen:ShowAllLocation,
        navigationOptions: {
          header: null,
        }
      },
      Location:{screen:Location,
        navigationOptions: {
          header: null,
        }
  
      },
      Chat:{
        screen: Chat
      },

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


        answer:{screen:answer,
          navigationOptions: {
            header: null,
          }
    
        },

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
    Pro:{screen:Pro,
      navigationOptions: {
        header: null,
        
      }},
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
  Main:{screen:Main,
    navigationOptions: {
      header: null,
      
    }},
  Login:{screen:Login,
    navigationOptions:{
      header:null,
    }},


    Questions:{screen:Questions,
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
