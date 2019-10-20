import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Profile from "../screens/Profile";

import DoctorInfo from "../screens/DoctorInfo";

 const  TabNavigator = createBottomTabNavigator({
    Profile: {
    screen: Profile,
    navigationOptions: {
      title: "Profile"
    }
  },
  DoctorInfo: {
    screen: DoctorInfo,
    navigationOptions: {
      title: "DoctorInfo"
    }
  }
});
const DoctorNav =createAppContainer(TabNavigator);
export default DoctorNav;