import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Platform, ActivityIndicator, Alert, TouchableOpacity, SafeAreaView } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { Container, Content, Button, Text } from 'native-base';
// import user_service from './user_service';
// import string from './string';
import InputStyled from '../elements/Input/styled';
import validate, { alert_validation, min, max, required, email } from '../elements/Input/validators';
// import { client } from '../../App';
import _ from 'lodash';
// import { showError } from '../utility';
// import Constants from '../Config/Constant';

import { BackgroundImage, Header } from '../elements';
const os = Platform.OS;

const { height } = Dimensions.get('window');
const validations = {
  email: {
    label: 'Email',
    validations: [
      required
    ]
  },
  password: {
    label: 'Password',
    validations: [
      min(4),
      max(16),
      required,
    ]
  }
}

export default class login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      login_info: {
        email: false,
        password: false
      },
      show_validation: false,
      modalVisible: false,
      token: null,
      loading: false,
      isConnected: true
    };
    // this.sendDeviceToken = this.sendDeviceToken.bind(this);
    this.forgetPassword = _.debounce(this.forgetPassword, 500, { leading: true, trailing: false });
    this.didPressRegister = _.debounce(this.didPressRegister, 500, { leading: true, trailing: false });
    this.didPressSubmit = _.debounce(this.didPressSubmit, 500, { leading: true, trailing: false });
  }

  validation() {
    const { login_info } = this.state;
    return login_info && login_info.username && login_info.username.length && login_info.password && login_info.password.length;
  }

  componentDidMount() {
    // NetInfo.isConnected.addEventListener('connectionChange', this.networkConnectionChange);
    // NetInfo.isConnected.fetch().done(
    //   (isConnected) => this.state.isConnected = isConnected
    // );
  }

  componentWillUnmount() {
    // NetInfo.isConnected.removeEventListener('connectionChange', this.networkConnectionChange);
  }

  networkConnectionChange = (isConnected) => {
    this.setState({ isConnected });
  }

  render() {
    const { show_validation, login_info } = this.state;
    return (
      <Container>
        <Content>
          <View style={{ justifyContent: 'space-between', height: height - 64 }}>
            <View>
              <InputStyled
                testID="TXT_EMAIL" label={'têt'}
                parent={this} group="login_info" linkedkey="email"
                typeSet
                validation={validations.email} showValidation={show_validation} keyboardType="email-address"
                value={login_info.email}
                onChangeText={(text) => {
                  this.setState({
                    login_info: {
                      ...login_info,
                      email: text
                    }
                  })
                }}
              />
              <InputStyled testID="TXT_PASSWORD" label={'pass'}
                parent={this} group="login_info" linkedkey="password" secureTextEntry
                value={login_info.password}
                typeSet
                onChangeText={(text) => {
                  this.setState({
                    login_info: {
                      ...login_info,
                      password: text
                    }
                  })
                }}

                unhidden validation={validations.password} showValidation={show_validation} />
              {
                !this.state.loading && (
                  <Button testID="BTN_SIGN_IN" block primary style={styles.btn_sign_in} onPress={() => this.didPressSubmit()}>
                    <Text style={styles.regularText}>{'sfdsfds'}</Text>
                  </Button>
                )
              }
              {
                this.state.loading && (
                  <ActivityIndicator size="large" color="#00A7DC" style={{ marginTop: 15 }} />
                )
              }
              <Button testID="forgot_password_button" block transparent primary style={styles.btn_forgot_password} onPress={() => this.forgetPassword()}>
                <Text style={styles.regularText}>{"sdfdsfds"}</Text>
              </Button>

            </View>
            <View style={{ width: '100%', alignItems: 'center' }}>
              <TouchableOpacity testID="register_button" style={styles.btn_register} onPress={() => this.didPressRegister()}>
                <Text style={[styles.regularText, { color: 'rgb(74,144,226)' }]}>{'resigter'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Content>
      </Container>
    );
  }

  didPressRegister() {
    this.props.navigation.navigate("RegisterStep1");
  }

  forgetPassword() {
    this.props.navigation.navigate("ForgetPasswordStep1");
  }

  async didPressSubmit() {
    if (!this.state.isConnected) {
      Alert.alert('sdfdsfd', 'sfasd');
      return;
    }
    const validation_results = validate(this.state.login_info, validations);
    this.setState({ ...this.state, show_validation: true });
    if (validation_results.length > 0) {
      alert_validation(validation_results);
    } else {
      // try {
      //   this.setState({ loading: true });
      //   const response = await fetch(service.url('signin'), {
      //     method: 'POST',
      //     headers: {
      //       'Accept': 'application/json',
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({ ...service.oauth_params, ...this.state.login_info })
      //   });
      //   const responseJson = await response.json();
      //   try {
      //     await client.resetStore();
      //   } catch (error) {
      //     console.log('Error login reset store:', error);
      //   }
      //   this.setState({ loading: false });
      //   if (responseJson.isSuccess || responseJson.accessToken) {
      //     if (!responseJson.lastAccessedAt) {
      //       this.setState({ token: responseJson.accessToken });
      //       user_service.setUser({ ...user_service.getUser(), access_token: responseJson.accessToken });
      //       await user_service.fetchInfo();
      //       await user_service.saveInfo();
      //       this.sendDeviceToken(responseJson.accessToken);
      //       this.props.navigation.navigate('FirstLogin');
      //     } else {
      //       user_service.setUser({ ...user_service.getUser(), access_token: responseJson.accessToken });
      //       await user_service.fetchInfo();
      //       await user_service.saveInfo();
      //       this.sendDeviceToken(responseJson.accessToken);
      //     }
      //   }else{
      //     Alert.alert(string.alert,showError(responseJson));
      //   }
      // }
      // catch (error) {
      //   console.log(error);
      //   this.setState({ loading: false });
      // }
    }

  }

  // sendDeviceToken(token) {
  //   if (user_service.getUser().device_token) {
  //     fetch(service.url('me/device-token'), {
  //       method: 'POST',
  //       headers: {
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json',
  //         'Authorization': 'Bearer ' + token
  //       },
  //       body: JSON.stringify({ token: user_service.getUser().device_token })
  //     })
  //       .then(res => {
  //         EventRegister.emit(Constants.resubscriptionOneSignal, '')
  //       });
  //   }
  // }
}

const styles = StyleSheet.create({
  btn_sign_in: {
    marginTop: 36,
    marginRight: 67,
    marginLeft: 67,
    borderRadius: 30
  },
  btn_forgot_password: {
    marginTop: 22,
    height: 44,
  },
  btn_register: {
    alignItems: 'center',
    borderRadius: 1,
    borderColor: 'rgb(74,144,226)',
    borderWidth: 1,
    borderRadius: 50,
    width: 231,
    height: 48,
    justifyContent: 'center',
  },
  image: {
    marginTop: 26,
    height: 40,
    width: 40
  },
  innerContainer: {
    alignItems: 'center',
    width: 363,
    height: os === 'ios' ? 200 : 270,
    borderRadius: 4,
    backgroundColor: "#ffffff",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#979797"
  },
  regularText: {
    // fontFamily: 'SourceHanSansHW-Regular',
    textAlign: 'center',
    lineHeight: 22,
  }
});
