import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from "react-navigation";

import RootScreen from '../src/Root';
import LoginScreen from '../src/Login';
import RegisterScreen from '../src/Register';
import ForgotScreen from '../src/Forgot';

import TabbarScreen from '../src/Tabbar';

const AppNavigator = createStackNavigator({
  Root: { screen: RootScreen },
  Login: { screen: LoginScreen },
  Register: { screen: RegisterScreen },
  Forgot: { screen: ForgotScreen },
  Tabbar: { screen: TabbarScreen },
}, {
  headerMode: 'none'
});

export default createAppContainer(AppNavigator);
