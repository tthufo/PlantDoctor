/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  BackHandler,
} from 'react-native';
// import { StyleProvider } from 'native-base';
// import getTheme from './native-base-theme/components';
// import material from './native-base-theme/variables/platform';
import NavigationScreen from './navigation';
import backService from './service/handle_back_service';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      status: false,
      percentage: 0,
    }

    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    if (TextInput.defaultProps == null) TextInput.defaultProps = {};
    TextInput.defaultProps.allowFontScaling = false;
  }

  componentDidMount() {
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onAndroidBackPress);
  }

  onAndroidBackPress = () => {
    backService.setActions('OnBack');
    return true;
  }

  render() {
    return (

      // <StyleProvider style={getTheme(material)}>
      <NavigationScreen />
      // </StyleProvider>
    );
  }
}

export default App;