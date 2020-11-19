import React, { Component } from 'react';
import { View, StyleSheet, Platform, ActivityIndicator, NativeModules, Alert, TouchableOpacity, TextInput, Image, PermissionsAndroid } from 'react-native';
import { Container, Content, Button, Text } from 'native-base';
import validate, { alert_validation, max, required } from '../elements/Input/validators';
import { Header } from '../elements';
import ImagePicker from 'react-native-image-picker';
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
      max(10),
    ]
  },
  password: {
    label: 'Password',
    validations: [
      required,
    ]
  }
}

const FIELD = ({ obj, onChange, value }) => {
  return (
    <View>
      <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>{obj.title}</Text>
      <TextInput
        style={{ padding: 10, height: obj.height, borderColor: 'black', borderWidth: 1, borderRadius: 8 }}
        multiline
        autoCompleteType={'off'}
        autoCorrect={false}
        onChangeText={onChange}
        value={value}
        placeholder={obj.placeholder}
      />
    </View>
  );
};

export default class question extends Component {

  constructor(props) {
    super(props);
    this.state = {
      question: '',
      answer: '',
      loading: false,
      crops: {},
    };
  }

  componentDidMount() {

  }

  async requestAndroid(isCam) {
    try {
      const granted = await PermissionsAndroid.requestPermission(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      )
      if (granted) {
        const storage = await PermissionsAndroid.requestPermission(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        )

        if (!storage) {
          Alert.alert('Thông báo', 'Access android');
          return;
        }

        const camera = await PermissionsAndroid.checkPermission(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        )

        if (!camera) {
          Alert.alert('Thông báo', 'Access android');
        }

        const sdCard = await PermissionsAndroid.checkPermission(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        )

        if (!sdCard) {
          Alert.alert('Thông báo', 'Access SD');
        }

        if (!sdCard || !camera) {
          return;
        }

        const options = {
          quality: 1.0,
          maxWidth: 500,
          maxHeight: 500,
          storageOptions: {
            skipBackup: true
          }
        };
        if (isCam) {
          ImagePicker.launchCamera(options, (response) => {
            if (response.didCancel) return;
            if (response.uri) {
              // this.uploadImage(position, response);
            }
          });
        } else {
          ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) return;
            if (response.uri) {
              // this.uploadImage(position, response);
            }
          });
        }
      } else {
        Alert.alert('Thông báo', 'acccess please');
      }
    } catch (err) {
      console.warn(err)
    }
  }

  requestIos(isCam) {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };
    if (!isCam) {
      NativeModules.Permission.getPermissionPhotoLibrary((alert, index) => {
        if (index === 3 || index === 0) {
          ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) return;
            if (response.uri) {
              // this.uploadImage(position, response);
            }
          });
        } else {
          Alert.alert('Thông báo', 'access lib')
        }
      });
    } else {
      NativeModules.Permission.getPermissionCamera((alert, index) => {
        if (index === 3 || index === 0) {
          ImagePicker.launchCamera(options, (response) => {
            if (response.didCancel) return;
            if (response.uri) {
              // this.uploadImage(position, response);
            }
          });
        } else {
          Alert.alert('Thông báo', 'access cam')
        }
      });
    }
  }

  callForHelp(isCam) {
    if (os === 'ios') {
      this.requestIos(isCam)
    } else {
      this.requestAndroid(isCam)
    }
  }

  updateFilter(filter) {
    this.setState({ crops: filter });
  }

  render() {
    const { navigation } = this.props;
    const { crops, question, answer } = this.state;
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };
    return (
      <Container>
        <Header navigation={navigation} title={'Bác sỹ cây trồng'} />
        <Content>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {Object.keys(crops).length != 0 ?
              <View>
                <TouchableOpacity onPress={() => {
                  this.setState({ crops: {} })
                }}>
                  <View style={{
                    padding: 8, margin: 5,
                    backgroundColor: 'gray', borderRadius: 6,
                    justifyContent: 'center', alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                    <Text style={{ fontSize: 16 }}>{crops.cropsName || ''}</Text>
                    <Image
                      style={{ width: 25, height: 25, marginRight: -8 }}
                      source={require('../../assets/images/close.png')}
                    />
                  </View>
                </TouchableOpacity>
              </View> : <View />
            }
            <TouchableOpacity onPress={() => {
              NavigationService.navigate('Crop', { single: true, updateFilter: (condition) => this.updateFilter(condition) });
            }}>
              <Text style={{ fontSize: 15, margin: 10, color: '#4B8266' }}>{'Chọn cây trồng'}</Text>
            </TouchableOpacity>

          </View>
          <View style={{ padding: 10 }}>
            <FIELD onChange={(question) => this.setState({ question })} value={question} obj={{ title: 'Câu hỏi *', height: 100, placeholder: 'Bạn đang gặp vấn đề gì với cây trồng của mình ?' }} />
            <View style={{ height: 20 }} />
            <FIELD onChange={(answer) => this.setState({ answer })} value={answer} obj={{ title: 'Bệnh lý cây trồng *', height: 150, placeholder: 'Các biểu hiện của cây đang như thế nào ?' }} />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
            <TouchableOpacity style={styles.btn_register} onPress={() => {
              this.callForHelp(true)
            }}>
              <Image
                style={{ width: 30, height: 30 }}
                source={require('../../assets/images/camera.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn_register} onPress={() => {
              this.callForHelp(false)
            }}>
              <Text style={{ color: '#4B8266' }}>{'Chọn hình ảnh'}</Text>
            </TouchableOpacity>
          </View>

        </Content>
      </Container>
    );
  }

  async requestUser(r) {
    try {
      const uInfo = await API.auth.userInfo({});
      STG.saveData('user', uInfo.data);
      NavigationService.navigate('Tabbar', {});
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
