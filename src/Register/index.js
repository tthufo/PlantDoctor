import React, { Component } from 'react';
import { StyleSheet, Dimensions, Alert, KeyboardAvoidingView, TouchableOpacity, ScrollView, View, Image } from 'react-native';
import { Container, Title, Button, Text } from 'native-base';
import Input from '../elements/Input/styled';
import validate, { alert_validation } from '../elements/Input/validators';
import validation_string from '../elements/Input/string';
import { Header } from '../elements';
import _ from 'lodash';
const { width, height } = Dimensions.get('window');

const validations = {
  company_name: {
    label: 'Company Name',
    required: true,
  },
  name: {
    label: 'Name',
    min: 2,
    max: 50,
    required: true,
  },
  email: {
    label: 'Email',
    required: true,
    email: true,
  },
  password: {
    label: "Password",
    required: true,
    min: 4,
    max: 16,
  },
  phone: {
    label: 'Phone',
    min: 10,
    max: 11,
    required: true,
  }
};

export default class register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      register_info: {
        company_name: false,
        name: false,
        email: false,
        phone: false,
        invitation_code: null,
        password: false,
        password_confirmation: false,
        check: false,
      },
      frames: false,
      isConnected: true
    };
    this.didUpdateData = this.didUpdateData.bind(this);
    this.password_confirmation = this.password_confirmation.bind(this);
    this.didPressSubmit = _.debounce(this.didPressSubmit, 2000, { leading: true, trailing: false });
  }

  componentWillMount() {

  }

  componentWillUnmount() {

  }

  render() {
    const { navigation } = this.props;
    const { show_validation, register_info, check } = this.state;
    return (
      <Container>
        <Header navigation={navigation} title={'Đăng ký'} />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          style={{ flex: 1 }}
        >
          <ScrollView
            style={{}}
          >
            <View style={{ alignItems: 'center' }}>
              <Image
                style={{ width: 120, height: 120, marginTop: 50 }}
                source={require('../../assets/images/logo.png')}
              />
            </View>
            <Text style={{ marginLeft: 15, marginTop: 15, color: '#4B8266', fontWeight: 'bold', fontSize: 24 }}>Đăng ký</Text>
            <Input
              testID="company_name_textfield" label={'Tên tài khoản *'} parent={this} group="register_info" linkedkey="company_name" validation={validations.company_name} showValidation={show_validation}
              value={register_info.company_name}
              typeSet
              onChangeText={(text) => {
                this.setState({
                  register_info: {
                    ...register_info,
                    company_name: text
                  }
                })
              }}
            />
            <Input
              testID="phone_textfield" label={'Số điện thoại *'} keyboardType='numeric' parent={this} group="register_info" linkedkey="phone" validation={validations.phone} showValidation={show_validation}
              value={register_info.phone}
              typeSet
              onChangeText={(text) => {
                this.setState({
                  register_info: {
                    ...register_info,
                    phone: text
                  }
                })
              }}
            />
            <Input
              testID="password_textfield" label={'Mật khẩu *'} parent={this} group="register_info" linkedkey="password" secureTextEntry unhidden validation={validations.password} showValidation={show_validation}
              value={register_info.password}
              typeSet
              onChangeText={(text) => {
                this.setState({
                  register_info: {
                    ...register_info,
                    password: text.length > 0 ? text : false
                  }
                })
              }}
            />
            <Input
              testID="confirm_password_textfield" label={'Nhập lại mật khẩu *'} parent={this} group="register_info" linkedkey="password_confirmation" secureTextEntry unhidden validation={() => this.password_confirmation()} showValidation={show_validation}
              value={register_info.password_confirmation}
              typeSet
              onChangeText={(text) => {
                this.setState({
                  register_info: {
                    ...register_info,
                    password_confirmation: text.length > 0 ? text : false
                  }
                })
              }}
            />
            <TouchableOpacity onPress={() => this.setState({ check: !check })}>
              <View style={{ flexDirection: 'row', margin: 20, alignItems: 'center' }}>
                <View>
                  <Image
                    style={{ width: 20, height: 20 }}
                    source={!check ? require('../../assets/images/ic_unchecked.png') : require('../../assets/images/ic_checked.png')}
                  />
                </View>
                <Text style={{ flex: 1, marginLeft: 15, flexWrap: 'wrap', fontSize: 14 }}>{'Đồng ý với các điều khoản của Bác sỹ cây trồng'}</Text>
              </View>
            </TouchableOpacity>
            <Button testID="BTN_SIGN_IN" block primary style={styles.btn_sign_in} onPress={() => this.didPressSubmit()}>
              <Text style={styles.regularText}>{'Đăng ký'}</Text>
            </Button>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableOpacity testID="register_button" style={styles.btn_register} onPress={() => this.props.navigation.pop()}>
                <Text style={{ color: 'black' }}>{'Bạn đã có tài khoản?'}</Text>
              </TouchableOpacity>
              <TouchableOpacity testID="register_button" style={styles.btn_register} onPress={() => this.props.navigation.pop()}>
                <Text style={{ color: '#4B8266' }}>{'Đăng nhập'}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Container>
    );
  }

  password_confirmation() {
    if (this.state.register_info.password === this.state.register_info.password_confirmation) {
      return true;
    } else {
      return validation_string.default('notmatch');
    }
  }

  keyboardUpdate(frames) {
    this.setState({ ...this.state, frames });
  }

  async didPressSubmit() {
    if (!this.state.isConnected) {
      return;
    }
    this.setState({ ...this.state, show_validation: true });
    const validation_results = validate(this.state.register_info, validations);
    if (this.state.register_info.password !== this.state.register_info.password_confirmation) {
      validation_results.push('notmatch');
    }
    if (validation_results.length > 0) {
      alert_validation(validation_results);
    } else {

    }
  }

  didUpdateData(key, data) {
    this.setState({ ...this.state, [key]: data });
  }
}

const styles = StyleSheet.create({
  btn_sign_in: {
    marginRight: 50,
    marginLeft: 50,
    borderRadius: 8,
    fontWeight: 'bold',
    backgroundColor: '#4B8266',
  },
  bottom_text: {
    marginTop: 24,
    marginLeft: 13,
    marginBottom: 20,
    marginRight: 13,
    textAlign: 'center',
    lineHeight: 22
  },
  btn_register: {
    margin: 10,
  },
  bottom_text1: {
    marginLeft: 13,
    marginRight: 13,
    textAlign: 'center',
    lineHeight: 22,
  },
  invitation_code: {
    color: 'black',
    marginLeft: 13,
    marginRight: 13,
    marginTop: 5,
  }
});

