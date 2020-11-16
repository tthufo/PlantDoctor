import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from "react-navigation";
import CropScreen from '../../src/Hometab/Crops';

const CropNavigator = createStackNavigator({
  Crop: { screen: CropScreen },
}, {
  mode: 'modal',
  headerMode: 'none'
});

export default createAppContainer(CropNavigator);