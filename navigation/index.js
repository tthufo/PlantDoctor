// import { StackNavigator } from 'react-navigation';
// import RootScreen from '../src/Root';
// import LoginScreen from '../src/Login';

// export default StackNavigator({
//   Root: { screen: RootScreen },
//   Login: { screen: LoginScreen },
// }, {
//   headerMode: 'none'
// });

import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from "react-navigation";

import RootScreen from '../src/Root';
import LoginScreen from '../src/Login';

const AppNavigator = createStackNavigator({
  Root: { screen: RootScreen },
  Login: { screen: LoginScreen },
});

export default createAppContainer(AppNavigator);
