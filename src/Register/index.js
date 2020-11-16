import React, { Component } from 'react';
import { StyleSheet, Dimensions, Alert, Linking, KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { Container, Title, Button, Label, Text } from 'native-base';
// import getTheme from '../../../native-base-theme/components';
// import material from '../../../native-base-theme/variables/platform';
// import string from './string';
import Input from '../elements/Input/styled';
import validate, { alert_validation } from '../elements/Input/validators';
import validation_string from '../elements/Input/string';
import { Header } from '../elements';
import _ from 'lodash';
const { width, height } = Dimensions.get('window');

const validations = {
  company_name: {
    label: 'Company Name',
    // min: 1,
    // max: 50,
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
      },
      frames: false,
      isConnected: true
    };
    this.didUpdateData = this.didUpdateData.bind(this);
    this.password_confirmation = this.password_confirmation.bind(this);
    this.didPressSubmit = _.debounce(this.didPressSubmit, 2000, { leading: true, trailing: false });
  }

  componentWillMount() {
    // this.listenerNetwork = EventRegister.addEventListener(Constants.EVENT_STATUS_NETWORK, (isConnected) => {
    //   this.setState({ isConnected });
    // })
  }

  componentWillUnmount() {
    // EventRegister.removeEventListener(this.listenerNetwork);
  }

  render() {
    const { navigation } = this.props;
    console.log('fdsfd', this.props)
    const { show_validation, register_info } = this.state;
    // const { step1 } = string;
    return (
      // <StyleProvider style={getTheme(material)}>
      <Container>
        {/* <BackgroundImage footer_building /> */}
        <Header navigation={navigation} title={'Register'} />
        {/* <Content
            onKeyboardWillShow={(frames) => this.keyboardUpdate(frames)}
            onKeyboardWillHide={(frames) => this.keyboardUpdate(frames)}
            showsVerticalScrollIndicator={false}
          > */}
        {/* <View style={{ height: height + 300 }}> */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          style={{ flex: 1 }}
        >
          <ScrollView
            style={{}}
          >
            <Input
              testID="company_name_textfield" label={'jjbj'} parent={this} group="register_info" linkedkey="company_name" validation={validations.company_name} showValidation={show_validation}
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
              testID="name_textfield" label={'jknkjnj'} parent={this} group="register_info" linkedkey="name" validation={validations.name} showValidation={show_validation}
              value={register_info.name}
              typeSet
              onChangeText={(text) => {
                this.setState({
                  register_info: {
                    ...register_info,
                    name: text
                  }
                })
              }}
            />
            <Input
              testID="email_textfield" label={'kjjkkj'} keyboardType='email-address' parent={this} group="register_info" linkedkey="email" validation={validations.email} showValidation={show_validation}
              value={register_info.email}
              typeSet
              onChangeText={(text) => {
                this.setState({
                  register_info: {
                    ...register_info,
                    email: text
                  }
                })
              }}
            />
            <Input
              testID="phone_textfield" label={'phone'} keyboardType='numeric' parent={this} group="register_info" linkedkey="phone" validation={validations.phone} showValidation={show_validation}
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
            <Input label={'code'} parent={this} group="register_info" linkedkey="invitation_code"
              value={register_info.invitation_code}
              typeSet
              onChangeText={(text) => {
                this.setState({
                  register_info: {
                    ...register_info,
                    invitation_code: text.length > 0 ? text : null
                  }
                })
              }}
            />
            <Text style={styles.invitation_code}>{'inivt'}</Text>
            <Input
              testID="password_textfield" label={'pádf'} parent={this} group="register_info" linkedkey="password" secureTextEntry unhidden validation={validations.password} showValidation={show_validation}
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
              testID="confirm_password_textfield" label={'cònime'} parent={this} group="register_info" linkedkey="password_confirmation" secureTextEntry unhidden validation={() => this.password_confirmation()} showValidation={show_validation}
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
            <Label style={styles.bottom_text}>{'パスワードは4文字以上16文字以内で半角英数字を組み合わせたもの'}</Label>
            <Label style={styles.bottom_text1}>{'「アカウント登録」をすることで、'}</Label>
            <Label style={styles.bottom_text1}><Label style={{ color: '#5184C4', textDecorationLine: 'underline', lineHeight: 22 }} onPress={() => Linking.openURL('https://sumaten.co/#/term')}>利用規約</Label>と<Label style={{ color: '#5184C4', textDecorationLine: 'underline' }} onPress={() => Linking.openURL('https://sumaten.co/#/privacy')}>プライバシーポリシー</Label>に</Label>
            <Label style={styles.bottom_text1}>{'同意するものとします。'}</Label>
          </ScrollView>

        </KeyboardAvoidingView>

        <Button testID="next_button" full primary onPress={() => this.didPressSubmit()}>
          <Title style={{}}>{'sub'}</Title>
        </Button>
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
      Alert.alert('nôn', 'noo');
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
      // try {
      //   const response = await fetch(service.url('signup'), {
      //     method: 'POST',
      //     headers: {
      //       'Accept': 'application/json',
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({ ...service.oauth_params, ...this.state.register_info, phone_number: this.state.register_info.phone })
      //   });
      //   const responseJson = await response.json();
      //   if (responseJson.isSuccess === true) {
      //     this.props.navigation.navigate("RegisterStep2", { email: this.state.register_info.email });
      //   } else {
      //     Alert.alert('aler', showError(responseJson));
      //   }
      // }
      // catch (error) {
      //   console.log(error);
      // }
    }
  }

  didUpdateData(key, data) {
    this.setState({ ...this.state, [key]: data });
  }
}

const styles = StyleSheet.create({
  bottom_text: {
    marginTop: 24,
    marginLeft: 13,
    marginBottom: 20,
    marginRight: 13,
    textAlign: 'center',
    // fontFamily: 'SourceHanSansHW-Regular',
    lineHeight: 22
  },
  bottom_text1: {
    marginLeft: 13,
    marginRight: 13,
    textAlign: 'center',
    lineHeight: 22,
    // fontFamily: 'SourceHanSansHW-Regular'
  },
  invitation_code: {
    color: 'black',
    marginLeft: 13,
    marginRight: 13,
    marginTop: 5,
    // fontFamily: 'SourceHanSansHW-Regular'
  }
});

