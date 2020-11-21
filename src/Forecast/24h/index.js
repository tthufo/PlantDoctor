import React, { Component } from 'react';
import {
  View, StyleSheet, Platform, TouchableOpacity, Image, FlatList, Dimensions, RefreshControl, ScrollView,
} from 'react-native';
import { Container, Text } from 'native-base';
import Toast from 'react-native-simple-toast';
import GetLocation from 'react-native-get-location'
import STG from '../../../service/storage';
import API from '../../apis';
import _ from 'lodash';

const os = Platform.OS;

const numColumns = 7;
const size = (Dimensions.get('window').width / numColumns);

export default class weather extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: false,
      crops: [],
      offset: 0,
      mode: 0,
    };
    this.onRefresh = _.debounce(this.onRefresh, 500, { leading: true, trailing: false });
  }

  componentDidMount() {
    setTimeout(() => {
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
    }, 500)
  }

  async getWeather(location) {
    try {
      const weather = await API.home.getWeather({
        latitude: 21.027763,//location.latitude,
        longtitude: 105.834160,//location.longitude,
        type: 2,
      });
      // console.log('==>', weather)

    } catch (e) {
      console.log(e)
    }
  }

  onRefresh() {
    this.setState({ isRefreshing: true, offset: 0 }, () => {
      this.searchCrops()
    });
  }

  render() {
    const { navigation } = this.props;
    const { crops, isRefreshing, mode } = this.state;
    return (
      <View style={{ flexGrow: 1, alignItems: 'center', padding: 0 }}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={[1, 2, 3, 4, 5, 6, 7]}
          renderItem={({ item, index }) => (
            <View
              style={{ width: size, justifyContent: 'center', alignItems: 'center', paddingTop: 40 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{item}</Text>
              <Image
                style={{ height: 30, width: 30, marginTop: 20 }}
                source={require('../../../assets/images/dump.png')}
              />
            </View>
          )}
          numColumns={numColumns}
          keyExtractor={(item, index) => index}
          contentContainerStyle={{
            flexDirection: 'row',
          }}
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
