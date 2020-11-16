import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from "react-navigation";
import LoginScreen from '../../src/Login';
import RegisterScreen from '../../src/Register';


const HomeNavigator = createStackNavigator({
  Login: { screen: LoginScreen },
  Register: { screen: RegisterScreen },
}, {
  headerMode: 'none'
});

export default createAppContainer(HomeNavigator);