import React, { Component } from 'react';
import {
  View, StyleSheet, Platform, TouchableOpacity, Image, FlatList, Dimensions, RefreshControl, ScrollView,
} from 'react-native';
import { Container, Text } from 'native-base';
import IC from '../../elements/icon';
import GetLocation from 'react-native-get-location'
import API from '../../apis';
import _ from 'lodash';
import moment from 'moment';

const os = Platform.OS;

const numColumns = 7;
const size = (Dimensions.get('window').width / numColumns);

export default class weather extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: true,
      weather: [],
    };
    this.onRefresh = _.debounce(this.onRefresh, 500, { leading: true, trailing: false });
  }

  componentDidMount() {
    setTimeout(() => {
      this.getLocation();
    }, 1000)
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
    try {
      const weather = await API.home.getWeather({
        latitude: location.latitude,
        longtitude: location.longitude,
        type: 3,
      });
      console.log('==>', weather)
      this.setState({ isRefreshing: false });
      if (weather.data.statusCode != 200) {
        return
      }
      this.setState({ weather: weather.data && weather.data.data.resultGmos });
    } catch (e) {
      this.setState({ isRefreshing: false });
      console.log(e)
    }
  }

  onRefresh() {
    this.setState({ isRefreshing: true }, () => {
      this.getLocation()
    });
  }

  days(time) {
    const day = ['CN', 'T.2', 'T.3', 'T.4', 'T.5', 'T.6', 'T.7']
    const date = moment(time, 'hh:mm DD/MM/YYYY');
    const dow = date.day();
    return day[dow]
  }

  render() {
    const { isRefreshing, weather } = this.state;
    var d = new Date();
    var h = d.getHours();
    const ICON = h <= 19 && h >= 7 ? IC.DAY : IC.NIGHT
    return (
      <View style={{ flexGrow: 1, alignItems: 'center', padding: 0 }}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={weather}
          renderItem={({ item, index }) => (
            <View style={{ flexDirection: 'row' }}>
              <View
                style={{
                  width: size - 0.5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 340,
                }}>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{this.days(item.time)}</Text>
                <Image
                  style={{ height: 30, width: 30, marginTop: 20 }}
                  source={ICON[item.weather].icon || ''}
                />
                <View style={{ height: 200, width: 10, backgroundColor: '#4B8266', marginTop: 10, marginBottom: 10 }}>

                </View>

                <View style={{ width: size - 10, height: 0.5, backgroundColor: 'gray' }} />
                <Image
                  style={{ height: 20, width: 20 }}
                  source={require('../../../assets/images/ic_humidity_one.png')}
                />
                <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#4B8266' }}>{Math.round(item.probability_rain)}%</Text>

              </View>
              <View style={{ width: 0.5, height: 320, backgroundColor: 'gray' }} />
            </View>
          )}
          numColumns={numColumns}
          keyExtractor={(item, index) => index}
          contentContainerStyle={{
            flexDirection: 'row',
          }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => this.onRefresh()}
            />
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    margin: 3,
  },
  image: {
    marginTop: 26,
    height: 40,
    width: 40
  },
});
