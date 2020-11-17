import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from "react-navigation";

import RootScreen from '../src/Root';
import LoginScreen from '../src/Login';
import RegisterScreen from '../src/Register';
import ForgotScreen from '../src/Forgot';

import TabbarScreen from '../src/Tabbar';

import TrickyScreen from '../src/Hometab/Tricky';
import CropScreen from '../src/Hometab/Crops';
import WeatherScreen from '../src/Hometab/Weather';
import ListNewsScreen from '../src/Hometab/ListNews';
import NewsScreen from '../src/Hometab/News';

const AppNavigator = createStackNavigator({
  Root: { screen: RootScreen },
  Login: { screen: LoginScreen },
  Register: { screen: RegisterScreen },
  Forgot: { screen: ForgotScreen },
  Tabbar: {
    screen: TabbarScreen, navigationOptions: {
      gesturesEnabled: false,
    }
  },
  Tricky: { screen: TrickyScreen },
  Crop: { screen: CropScreen },
  Weather: { screen: WeatherScreen },
  ListNews: { screen: ListNewsScreen },
  News: { screen: NewsScreen },
}, {
  headerMode: 'none',
});

export default createAppContainer(AppNavigator);
