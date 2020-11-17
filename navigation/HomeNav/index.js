import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from "react-navigation";
import HomeScreen from '../../src/Hometab/Home';
import CropScreen from '../../src/Hometab/Crops';
import TrickyScreen from '../../src/Hometab/Tricky';
import WeatherScreen from '../../src/Hometab/Weather';

const HomeNavigator = createStackNavigator({
  Home: { screen: HomeScreen },
  // Crop: { screen: CropScreen },
}, {
  headerMode: 'none'
});

const Root = createStackNavigator({
  Main: { screen: HomeNavigator },
  Crop: { screen: CropScreen },
  Tricky: { screen: TrickyScreen },
  Weather: { screen: WeatherScreen },
}, {
  mode: 'modal',
  headerMode: 'none',
})

export default createAppContainer(Root);