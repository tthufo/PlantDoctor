import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from "react-navigation";

import RootScreen from '../src/Root';
import LoginScreen from '../src/Login';
import RegisterScreen from '../src/Register';

const AppNavigator = createStackNavigator({
  Root: { screen: RootScreen },
  Login: { screen: LoginScreen },
  Register: { screen: RegisterScreen },
}, {
  headerMode: 'none'
});

export default createAppContainer(AppNavigator);
