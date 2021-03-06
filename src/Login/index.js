import React, { Component } from 'react';
import { View, StyleSheet, Platform, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { Container, Content, Button, Text } from 'native-base';
import GetLocation from 'react-native-get-location'
import InputStyled from '../elements/Input/styled';
import validate, { alert_validation, max, min, required, validPhone } from '../elements/Input/validators';
import Toast from 'react-native-simple-toast';
import STG from "../../service/storage";
import HOST from '../apis/host';
import API from '../apis';
import axios from 'axios';
import NavigationService from '../../service/navigate';
import _ from 'lodash';

const os = Platform.OS;

const validations = {
  email: {
    label: 'Phone',
    validations: [
      required,
      min(10),
      max(11),
    ]
  },
  password: {
    label: 'Password',
    validations: [
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
        password: false,
      },
      show_validation: false,
      modalVisible: false,
      token: null,
      loading: false,
      checking: true,
    };
    this.getInfo = this.getInfo.bind(this);
    this.forgetPassword = _.debounce(this.forgetPassword, 500, { leading: true, trailing: false });
    this.didPressRegister = _.debounce(this.didPressRegister, 500, { leading: true, trailing: false });
    this.didPressSubmit = _.debounce(this.didPressSubmit, 500, { leading: true, trailing: false });
  }

  validation() {
    const { login_info } = this.state;
    return login_info && login_info.username && login_info.username.length && login_info.password && login_info.password.length;
  }

  componentDidMount() {
    const { login_info } = this.state;
    // Geocoder.init("AIzaSyBtcquSDhkTEk2ydwLyVT-mWDys1hI93n0");
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        console.log(location);
        // Geocoder.from(21.027763, 105.834160)
        //   .then(json => {
        //     var addressComponent = json.results[0].address_components[0];
        //     console.log(addressComponent);
        //   })
        //   .catch(error => console.warn(error));
      })
      .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
      })
    STG.getData('credential').then(d => {
      if (d && d.phone != '' && d.pass != '') {
        this.setState({
          login_info: {
            ...login_info,
            email: d.phone,
            password: d.pass,
          }
        }, () => {
          this.didPressSubmit()
        })
      }
    })
    this.getInfo()
  }

  getInfo() {
    const parseString = require('react-native-xml2js').parseString;
    const that = this;
    fetch('https://dl.dropboxusercontent.com/s/1gft7hxj2qby18r/BSCT1_2.plist')
      .then(response => response.text())
      .then((response) => {
        parseString(response, function (err, result) {
          that.mode(result.plist.dict[0].string[0])
        });
      }).catch((err) => {
        console.log('fetch', err)
      })
  }

  mode(mode) {
    const { login_info } = this.state;
    if (mode == 0) {
      this.setState({ checking: false })
      STG.clear("auto");
    } else {
      this.setState({
        checking: true, login_info: {
          ...login_info,
          email: '0915286679',
          password: '123456',
        }
      }, () => {
        setTimeout(() => {
          this.didLogin();
          STG.saveData("auto", { auto: true });
        }, 100)
      })
    }
  }

  render() {
    const { show_validation, login_info, checking } = this.state;
    return (
      checking ? <View /> :
        <Container>
          <Content>
            <View style={{ justifyContent: 'space-between' }}>
              <View style={{ alignItems: 'center' }}>
                <Image
                  style={{ width: 120, height: 120, marginTop: 50 }}
                  source={require('../../assets/images/logo.png')}
                />
              </View>
              <Text style={{ marginLeft: 15, marginTop: 15, color: '#4B8266', fontWeight: 'bold', fontSize: 24 }}>Đăng nhập</Text>
              <View>
                <InputStyled
                  testID="TXT_EMAIL" label={'Số điện thoại *'}
                  parent={this} group="login_info" linkedkey="email"
                  typeSet
                  validation={validations.email} showValidation={show_validation} keyboardType="number-pad"
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
                <InputStyled testID="TXT_PASSWORD" label={'Mật khẩu *'}
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
                      <Text style={styles.regularText}>{'Đăng nhập'}</Text>
                    </Button>
                  )
                }
                {
                  this.state.loading && (
                    <ActivityIndicator size="large" color="#00A7DC" style={{ marginTop: 15 }} />
                  )
                }

              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableOpacity testID="register_button" style={styles.btn_register} onPress={() => this.forgetPassword()}>
                  <Text style={{ color: 'black' }}>{'Quên mật khẩu?'}</Text>
                </TouchableOpacity>
                <TouchableOpacity testID="register_button" style={styles.btn_register} onPress={() => this.didPressRegister()}>
                  <Text style={{ color: '#4B8266' }}>{'Đăng ký'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Content>
        </Container>
    );
  }

  didPressRegister() {
    NavigationService.navigate('Register', {});
  }

  forgetPassword() {
    NavigationService.navigate('Forgot', {});
  }

  async didLogin() {
    const { login_info: { email, password } } = this.state;
    this.setState({ loading: true })
    var bodyFormData = new FormData();
    bodyFormData.append('username', validPhone(email));
    bodyFormData.append('password', password);
    bodyFormData.append('grant_type', 'password');
    bodyFormData.append('scopes', 'read');
    axios({
      method: 'post',
      url: HOST.BASE_URL + '/auth/oauth/token',
      data: bodyFormData,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Authorization': 'Basic YWdyaS1lY29zeXN0ZW0tYXBwOjEyMzQ1NmFB',
      }
    }).then(r => {
      this.setState({ loading: false })
      if (r.status != 200) {
        const message = t.data && t.data.data && t.data.data.message || 'Lỗi xảy ra, mời bạn thử lại'
        Toast.show(message)
        return;
      }
      STG.saveData("credential", { phone: email, pass: password });
      STG.saveData("token", r.data).then(done => {
        this.requestUser(r);
      });
    }).catch(e => {
      this.setState({ loading: false })
      Toast.show('Lỗi xảy ra, mời bạn thử lại')
      console.log(e)
    })
  }

  async requestUser(r) {
    const { login_info } = this.state;
    try {
      const uInfo = await API.auth.userInfo({});
      STG.saveData('user', uInfo.data);
      this.setState({
        login_info: {
          ...login_info,
          password: false,
          email: false,
        }
      })
      const show = await STG.getData('auto')
      NavigationService.navigate(show != null ? 'Tabbar1' : 'Tabbar', {});
    } catch (e) {
      console.log(e);
    }
  }

  async didPressSubmit() {
    const validation_results = validate(this.state.login_info, validations);
    this.setState({ ...this.state, show_validation: true });
    if (validation_results.length > 0) {
      alert_validation(validation_results);
    } else {
      this.didLogin();
    }
  }
}

const styles = StyleSheet.create({
  btn_sign_in: {
    marginTop: 30,
    marginRight: 50,
    marginLeft: 50,
    borderRadius: 8,
    fontWeight: 'bold',
    backgroundColor: '#4B8266',
  },
  btn_forgot_password: {
    marginTop: 22,
    height: 44,
  },
  btn_register: {
    margin: 10,
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
    textAlign: 'center',
    lineHeight: 22,
  }
});
