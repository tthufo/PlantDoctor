import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from "react-navigation";
import HomeScreen from '../../src/Hometab/Home';
import CropScreen from '../../src/Hometab/Crops';

const HomeNavigator = createStackNavigator({
  Home: { screen: HomeScreen },
  // Crop: { screen: CropScreen },
}, {
  headerMode: 'none'
});

const Root = createStackNavigator({
  Main: { screen: HomeNavigator },
  Crop: { screen: CropScreen }
}, {
  mode: 'modal', // Remember to set the root navigator to display modally.
  headerMode: 'none', // This ensures we don't get two top bars.
})

export default createAppContainer(Root);