import React, { Component } from 'react';
import { View, StyleSheet, Platform, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Container, Content, Button, Text } from 'native-base';
import GetLocation from 'react-native-get-location'
import STG from '../../../service/storage';
import API from '../../apis';
import HOST from '../../apis/host';
import axios from 'axios';
import { Header } from '../../elements';
import NavigationService from '../../../service/navigate';
import _ from 'lodash';

const os = Platform.OS;

const CON = ({ image, title, value }) => {
  return (
    <View style={{ alignItems: 'center', margin: 10 }}>
      <Image
        style={{ width: 55, height: 55, margin: 10 }}
        source={image}
      />
      <Text style={{ fontSize: 50, color: 'white' }}>{value}</Text>
      <Text style={{ fontSize: 16, color: 'white', textAlign: 'center' }}>{title}</Text>
    </View>
  );
};

const BUT = ({ image, title, onPress }) => {
  return (
    <TouchableOpacity style={{ flex: 1, }} onPress={onPress}>
      <View style={{ flex: 1, backgroundColor: '#4B8266', flexDirection: 'row', alignItems: 'center', margin: 10, padding: 10, borderRadius: 8 }}>
        <Image
          style={{ width: 60, height: 60 }}
          source={image}
        />
        <Text style={{ marginLeft: 8, flex: 1, fontSize: 16, color: 'white', flexWrap: 'wrap' }}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default class home extends Component {

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
      isConnected: true,
      crops: [],
    };
    this.didPressSubmit = _.debounce(this.didPressSubmit, 500, { leading: true, trailing: false });
  }

  componentDidMount() {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        this.getWeather(location);
      })
      .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
      })
    STG.getData('user').then(u => {
      this.getCrops(u.subscribe);
    })
  }

  async getWeather(location) {
    try {
      const weather = await API.home.getWeather({
        latitude: 21.027763,//location.latitude,
        longtitude: 105.834160,//location.longitude,
        type: 1,
      });

    } catch (e) {
      console.log(e)
    }
  }

  async getCrops(subscriber) {
    var bodyFormData = new FormData();
    const userInfo = await STG.getData('token')
    bodyFormData.append('subscriber', subscriber);
    axios({
      method: 'post',
      url: HOST.BASE_URL + '/appcontent/cropsUser/list-crops-user',
      data: bodyFormData,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Authorization': 'bearer' + userInfo.access_token,
      }
    }).then(r => {
      if (r.status != 200) {
        Toast.show('Lỗi xảy ra, mời bạn thử lại')
        return;
      }
      const resign = r.data.data.map(e => {
        e.check = e.cropsUserId == null ? false : true;
        return e;
      });
      this.setState({
        crops: resign.filter(e => e.cropsUserId != null),
      })
    }).catch(e => {
      Toast.show('Lỗi xảy ra, mời bạn thử lại')
      console.log(e)
    })
  }

  reload() {
    STG.getData('user').then(u => {
      this.getCrops(u.subscribe);
    })
  }

  render() {
    const { crops } = this.state;
    return (
      <Container style={{ backgroundColor: 'white' }}>
        <Header height={20} />
        <Content>
          <View style={{ backgroundColor: '#4B8266', flex: 1, alignItems: 'center', padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ height: 40, width: 40 }} />
            <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white' }}>Hà nôi việt nam</Text>
            <TouchableOpacity onPress={() => console.log()}>
              <Image
                style={{ width: 40, height: 40 }}
                source={require('../../../assets/images/ic_dot_menu.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={{ backgroundColor: '#4B8266', flex: 1, padding: 10, flexDirection: 'row', justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => console.log()}>
              <Image
                style={{ width: 80, height: 80 }}
                source={require('../../../assets/images/dump.png')}
              />
            </TouchableOpacity>
            <Text style={{ fontSize: 70, color: 'white' }}>22</Text>
            <Text style={{ fontSize: 40, color: 'white' }}>°C</Text>
          </View>
          <View style={{ backgroundColor: '#4B8266', flex: 1, padding: 10, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 20, color: 'white' }}>Nhiệt độ cảm nhận 21°C</Text>
            <Text style={{ fontSize: 20, color: 'white' }}>Có mây và sương mù</Text>
          </View>
          <View style={{ backgroundColor: '#4B8266', marginTop: 0, alignContent: 'flex-start', flexDirection: 'row', justifyContent: 'center' }}>
            <CON image={require('../../../assets/images/iqa.png')} title={`Chất lượng\nkhông khí`} value='00' />
            <CON image={require('../../../assets/images/uv.png')} title="Chỉ số UV" value='00' />
            <CON image={require('../../../assets/images/rain_home.png')} title="Khả năng mưa" value='00' />
          </View>
          <View style={{ padding: 10, flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#4B8266' }}>
            <TouchableOpacity onPress={() => console.log()}>
              <Image
                style={{ width: 35, height: 35 }}
                source={require('../../../assets/images/arrow_left_white.png')}
              />
            </TouchableOpacity>
            <ScrollView
              style={{ margin: 10 }}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              pagingEnabled={true}>
              {crops.map(item => {
                return (
                  <Image
                    style={{ width: 70, height: 70, borderRadius: 35, marginRight: 10, marginLeft: 10 }}
                    source={{ uri: item.image }}
                  />
                )
              })}
            </ScrollView>
            <TouchableOpacity onPress={() => {
              NavigationService.navigate('Crop', { reload: () => this.reload() });
            }}>
              <Image
                style={{ width: 45, height: 45 }}
                source={require('../../../assets/images/edit_white.png')}
              />
            </TouchableOpacity>
          </View>

          <View style={{ backgroundColor: 'blue', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
            <BUT image={require('../../../assets/images/italy.png')} title={`Mẹo canh tác`} onPress={() => {
              NavigationService.navigate('Tricky', {});
            }} />
            <BUT image={require('../../../assets/images/weather_tips.png')} title={`Thời tiết và cây trồng`} onPress={() => {
              NavigationService.navigate('Weather', {});
            }} />
          </View>

          <View style={{ alignItems: 'center', flex: 1 }}>
            <Button testID="BTN_SIGN_IN" block primary style={styles.btn_sign_in} onPress={() => this.didLogin()}>
              <Text style={styles.regularText}>{'Đặt câu hỏi'}</Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
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
    width: 250,
    alignSelf: 'center',
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
    fontSize: 24,
  }
});
