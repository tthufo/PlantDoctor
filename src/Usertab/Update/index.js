import React, { Component } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Image, Dimensions, NativeModules, Platform, ActivityIndicator,
} from 'react-native';
import { Container, Content, Text, Button } from 'native-base';
import Input from '../../elements/Input/styled';
import validation_string from '../../elements/Input/string';
import ImagePicker from 'react-native-image-picker';
import Toast from 'react-native-simple-toast';
import STG from '../../../service/storage';
import HOST from '../../apis/host';
import API from '../../apis';
import axios from 'axios';
import { Header } from '../../elements';
import NavigationService from '../../../service/navigate';
import _ from 'lodash';

const os = Platform.OS;

const imageSize = (Dimensions.get('window').width * 9 / 16);
const widthSize = (Dimensions.get('window').width);

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
    // min: 4,
    // max: 16,
  },
  phone: {
    label: 'Phone',
    min: 10,
    max: 11,
    required: true,
  }
};

export default class user extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      offset: 0,
      full: false,
      isRefreshing: false,
      userInfo: {},
      image: {},
      register_info: {
        name: false,
        password: false,
        password_new: false,
        password_confirmation: false,
      },
    };
    this.password_confirmation = this.password_confirmation.bind(this);
    this.didPressSubmit = _.debounce(this.didPressSubmit, 500, { leading: true, trailing: false });
  }

  getStatus() {
    const { approve, deny } = this.state;
    if (approve && deny) {
      return [2, 1]
    } else if (approve && !deny) {
      return [2]
    } else if (!approve && deny) {
      return [1]
    }
    return []
  }

  componentDidMount() {
  }

  componentWillMount() {
    const { register_info } = this.state;
    STG.getData('user').then(userInfo => {
      this.setState({ userInfo })
      this.setState({
        register_info: {
          ...register_info,
          name: userInfo.fullName,
        }
      })
    })
  }

  async didPressSubmit() {
    const { navigation } = this.props;
    const { register_info, image } = this.state;
    // const { question, answer, images, crops } = this.state;
    // if (Object.keys(crops).length == 0) {
    //   Toast.show('Bạn chưa chọn loại cây trồng')
    //   return
    // }
    // if (question.length == 0) {
    //   Toast.show('Bạn chưa điền câu hỏi')
    //   return
    // }
    // if (answer.length == 0) {
    //   Toast.show('Bạn chưa điền bệnh lý câu trồng')
    //   return
    // }
    // if (images.length == 0) {
    //   Toast.show('Bạn cần chọn ít nhất 1 ảnh')
    //   return
    // }
    if (Object.keys(image).length == 0) {
      navigation.pop()
      return
    }
    const token = await STG.getData('token')
    this.setState({ loading: true })
    var bodyFormData = new FormData();
    bodyFormData.append('fullName', register_info.name);
    bodyFormData.append('pushToken', 'abcd');
    bodyFormData.append('platform', 'ios');
    bodyFormData.append('avatar', {
      uri: image.uri,
      type: '*/*',
      name: image.fileName,
      data: image.data,
    });
    axios({
      method: 'POST',
      url: HOST.BASE_URL + '/authapp/update/user',
      data: bodyFormData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'bearer' + token.access_token,
      }
    }).then(r => {
      this.setState({ loading: false })
      if (r.status != 200) {
        Toast.show('Lỗi xảy ra, mời bạn thử lại')
        return;
      }
      Toast.show('Cập nhật thông tin thành công')
      this.requestUser()
    }).catch(e => {
      this.setState({ loading: false })
      Toast.show('Lỗi xảy ra, mời bạn thử lại')
      console.log(e)
    })
  }

  async requestUser() {
    const { navigation } = this.props;
    try {
      const uInfo = await API.auth.userInfo({});
      STG.saveData('user', uInfo.data);
      navigation.pop();
      if (this.getParam().updateList) {
        this.getParam().updateList()
      }
    } catch (e) {
      console.log(e);
    }
  }

  getParam() {
    const { navigation: { state: { params } } } = this.props;
    return params;
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
              this.setState({ image: response })
            }
          });
        } else {
          ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) return;
            if (response.uri) {
              this.setState({ image: response })
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
              this.setState({ image: response })
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
              this.setState({ image: response })
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

  password_confirmation() {
    if (this.state.register_info.password_new === this.state.register_info.password_confirmation) {
      return true;
    } else {
      return validation_string.default('Mật khẩu không trùng khớp');
    }
  }

  render() {
    const { navigation } = this.props;
    const { userInfo, loading, image, show_validation, register_info, } = this.state;
    return (
      <Container style={{ backgroundColor: 'white' }}>
        <Header navigation={navigation} title={'Tài khoản cá nhân'} />
        <Content>
          <View style={{ flexDirection: 'column', flex: 1 }}>

            <View style={{ margin: 10, padding: 5, }}>
              <View style={{ flexDirection: 'row' }}>
                <Image
                  style={{ width: 80, height: 80 }}
                  source={{ uri: Object.keys(image).length != 0 ? image.uri : userInfo && userInfo.avatar }}
                />
                <View style={{ paddingLeft: 10, flex: 1 }}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#4B8266', marginBottom: 10 }}>{userInfo && userInfo.subscribe}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={styles.btn_register} onPress={() => {
                      this.callForHelp(true)
                    }}>
                      <Image
                        style={{ width: 30, height: 30 }}
                        source={require('../../../assets/images/camera.png')}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn_register} onPress={() => {
                      this.callForHelp(false)
                    }}>
                      <Text style={{ color: '#4B8266', marginLeft: 10 }}>{'Chọn hình ảnh'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            <View>
              <Input
                label={'Tên tài khoản *'} parent={this} group="register_info" linkedkey="name" validation={validations.name} showValidation={show_validation}
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
                label={'Mật khẩu hiện tại *'} parent={this} group="register_info" linkedkey="password" secureTextEntry unhidden validation={validations.password} showValidation={show_validation}
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
                label={'Mật khẩu mới *'} parent={this} group="register_info" linkedkey="password_new" secureTextEntry unhidden validation={validations.password} showValidation={show_validation}
                value={register_info.password_new}
                typeSet
                onChangeText={(text) => {
                  this.setState({
                    register_info: {
                      ...register_info,
                      password_new: text.length > 0 ? text : false
                    }
                  })
                }}
              />
              <Input
                label={'Nhập lại mật khẩu *'} parent={this} group="register_info" linkedkey="password_confirmation" secureTextEntry unhidden validation={() => this.password_confirmation()} showValidation={show_validation}
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
            </View>
            {loading ?
              <ActivityIndicator size="large" color="#00A7DC" style={{ marginTop: 15 }} />
              :
              <Button block primary style={styles.btn_sign} onPress={() => {
                this.didPressSubmit();
              }}>
                <Text style={styles.regularText}>{'Cập nhật'}</Text>
              </Button>}
            <Button block primary style={styles.btn_sign} onPress={() => {
              STG.clearData();
              navigation.popToTop();
            }}>
              <Text style={styles.regularText}>{'Đăng xuất'}</Text>
            </Button>
          </View>
        </Content>
      </Container >
    );
  }
}

const styles = StyleSheet.create({
  btn_sign: {
    height: 50,
    width: 120,
    borderRadius: 8,
    fontWeight: 'bold',
    alignSelf: 'center',
    margin: 20,
    backgroundColor: '#4B8266',
  },
  item: {
    alignSelf: 'center',
    width: widthSize,
    height: imageSize,
  },
  image: {
    marginTop: 26,
    height: 40,
    width: 40
  },
  regularText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});