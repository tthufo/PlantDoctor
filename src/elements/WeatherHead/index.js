import React, { Component } from 'react';
import {
  View, StyleSheet, Platform, TouchableOpacity, Image, ActivityIndicator,
} from 'react-native';
import { Text } from 'native-base';
import GetLocation from 'react-native-get-location'
import API from '../../apis';
import _ from 'lodash';
import IC from '../../elements/icon';
import Address from '../Address';
;
const os = Platform.OS;

const ROW = ({ title, value }) => {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      <Text style={{ fontSize: 15, alignSelf: 'center', marginTop: 5, flexWrap: 'wrap' }}>{title}: </Text>
      <Text style={{ fontSize: 15, fontWeight: 'bold', alignSelf: 'center', marginTop: 5, flexWrap: 'wrap' }}>{value}</Text>
    </View>
  );
};

const UNIT = [
  { title: 'Nhiệt độ cảm nhận', unit: '°C' },
  { title: 'Khả năng mưa', unit: '%' },
  { title: 'Chỉ số UV', unit: '' },
  { title: 'Chất lượng không khí', unit: '' },
  { title: 'Gió', unit: ' Km', windy: true },
  { title: 'Độ ẩm', unit: '%' },
]

const WIND = ['Bắc',
  'Bắc Đông Bắc',
  'Đông Bắc',
  'Đông Đông Bắc',
  'Đông',
  'Đông Đông Nam',
  'Đông Nam',
  'Nam Đông Nam',
  'Nam',
  'Nam Tây Nam',
  'Tây Nam',
  'Tây Tây Nam',
  'Tây',
  'Tây Tây Bắc',
  'Tây Bắc',
  'Bắc Tây Bắc']

export default class weatherHead extends Component {

  constructor(props) {
    super(props);
    this.state = {
      weather: {},
      loading: true,
    };
  }

  componentDidMount() {
    this.getLocation();
  }

  getLocation() {
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
  }

  async getWeather(location) {
    this.setState({ loading: true });
    try {
      const weather = await API.home.getWeather({
        latitude: 21.027763,//location.latitude,
        longtitude: 105.834160,//location.longitude,
        type: 1,
      });
      if (weather.data.statusCode != 200) {
        return
      }
      this.setState({ loading: false });
      this.setState({ weather: weather.data.data });
    } catch (e) {
      this.setState({ loading: false });
      console.log(e)
    }
  }

  getDetail() {
    const { weather } = this.state;
    const result = weather.resultGmos && weather.resultGmos[0];
    const detail = [
      result && Math.round(result.temperatureFeel).toString() || '',
      result && Math.round(result.probability_rain).toString() || '',
      result && 'Thấp' || '',
      result && 'Bình thường' || '',
      result && Math.round(result.wind_speed).toString() || '',
      result && Math.round(result.relative_humidity).toString() || '',
    ]
    return detail
  }

  render() {
    const { weather, loading } = this.state;
    var d = new Date();
    var h = d.getHours();
    const ICON = h <= 19 && h >= 7 ? IC.DAY : IC.NIGHT
    const resultGmos = weather.resultGmos && weather.resultGmos[0]
    return (
      <View style={{ flexDirection: 'row', padding: 5 }}>
        <View style={{ flex: 1, padding: 5 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
            <Image
              style={{ width: 30, height: 30 }}
              source={require('../../../assets/images/location.png')}
            />
            <Address style={{ alignSelf: 'center', color: '#4B8266' }} />
          </View>
          <View>
            {loading ? <ActivityIndicator style={{ height: 60, width: 60 }} size="large" color="#4B8266" />
              :
              <TouchableOpacity onPress={() => {
                this.getLocation();
              }}>
                <Image
                  style={{ width: 60, height: 60, marginTop: 5, marginBottom: 5 }}
                  source={resultGmos && ICON[resultGmos.weather].icon || ''}
                />
              </TouchableOpacity>}
          </View>
          <Text style={{ color: '#4B8266', fontWeight: 'bold', flexWrap: 'wrap' }}>{resultGmos && ICON[resultGmos.weather].name}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <Text style={{ fontSize: 45, color: '#4B8266' }}>{resultGmos && Math.round(resultGmos.air_temperature) || ''}°</Text>
            <Text style={{ fontSize: 11, color: '#4B8266', alignSelf: 'flex-end', marginBottom: 10 }}>{resultGmos && Math.round(resultGmos.air_temperature_max) || ''}° | {resultGmos && Math.round(resultGmos.air_temperature_min) || ''}°</Text>
          </View>
        </View>

        <View style={{ flex: 1, padding: 5 }}>
          {UNIT.map((e, index) => {
            return (
              <ROW title={e.title} value={this.getDetail()[index] + e.unit + (e.windy && resultGmos && resultGmos.wind_direction ? ` | ${WIND[resultGmos.wind_direction]}` : '')} />
            )
          })}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

});
