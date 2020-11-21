import React, { Component } from 'react';
import {
  View, StyleSheet, Platform, TouchableOpacity, Image, FlatList, Dimensions, RefreshControl, ScrollView,
} from 'react-native';
import { Container, Text } from 'native-base';
import Toast from 'react-native-simple-toast';
import STG from '../../service/storage';
import API from '../apis';
import { Header } from '../elements';
import WeatherHeader from '../elements/WeatherHead';
import Hour24 from './24h';
import _ from 'lodash';

const os = Platform.OS;

const numColumns = 7;
const size = (Dimensions.get('window').width / numColumns);

const COLOR = ['#4B8266', '#FAECDF']
const COLOR1 = ['#FAECDF', '#4B8266']
const CC = ['white', '#4B8266']
const CC1 = ['#4B8266', 'white']

export default class weather extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: false,
      crops: [],
      offset: 0,
      mode: 0,
    };
    this.didPressSubmit = _.debounce(this.didPressSubmit, 500, { leading: true, trailing: false });
    this.onRefresh = _.debounce(this.onRefresh, 500, { leading: true, trailing: false });
    this.onLoadMore = _.debounce(this.onLoadMore, 500, { leading: true, trailing: false });
  }

  componentDidMount() {
    // this.searchCrops();
  }

  async searchCrops() {
    const { offset } = this.state;
    try {
      const crops = await API.home.searchCrop({
        categoryId: 5,
        cropsId: 6,
        cropsPostId: null,
        limit: 12,
        offset,
      })
      this.setState({ isRefreshing: false });
      // console.log('==>', crops)
      if (crops.data.statusCode != 200) {
        Toast.show('Lỗi xảy ra, mời bạn thử lại')
        return
      }
    } catch (e) {
      console.log(e)
      this.setState({ isRefreshing: false });
    }
  }

  onRefresh() {
    this.setState({ isRefreshing: true, offset: 0 }, () => {
      this.searchCrops()
    });
  }

  onLoadMore() {
    this.searchCrops();
    // if (!this.state.loading) {
    //   this.page = this.page + 1; 
    //   this.fetchUser(this.page); 
    // }
  }

  render() {
    const { navigation } = this.props;
    const { crops, isRefreshing, mode } = this.state;
    return (
      <Container style={{ backgroundColor: 'white' }}>
        <Header navigation={navigation} title={'Thời tiết'} />
        {/* <ScrollView style={{ flexDirection: 'column', flex: 1 }}> */}

        <WeatherHeader />

        <View style={{ flexDirection: 'row', height: 50, justifyContent: 'center' }}>
          <View style={{ flex: 1, backgroundColor: COLOR[mode], justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => this.setState({ mode: 0 })}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', alignSelf: 'center', color: CC[mode] }}>{'24 giờ tới'}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, backgroundColor: COLOR1[mode], justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => this.setState({ mode: 1 })}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', alignSelf: 'center', color: CC1[mode] }}>{'7 ngày tới'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Hour24 />
        </View>

        {/* <View style={{ flexGrow: 1, alignItems: 'center', padding: 0 }}>
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
                    source={require('../../assets/images/dump.png')}
                  />
                </View>
              )}
              numColumns={numColumns}
              keyExtractor={(item, index) => index}
              contentContainerStyle={{
                flexDirection: 'row',
              }}
            />
          </View> */}

        {/* </ScrollView> */}
      </Container>
    );
  }

  async didPressSubmit() {
    const { crops } = this.state;
    const { navigation } = this.props;
    if (this.limit().length == 0) {
      Toast.show('Hãy chọn ít nhất 1 loại cây')
    } else {
      const cropList = crops.filter(e => e.check == true)
      const sub = await STG.getData('user')
      try {
        const result = await API.home.addCrop({
          subscriber: sub.subscribe,
          cropsList: cropList.map(c => { return c.cropsId }),
        })
        if (result.status != 200) {
          Toast.show('Lỗi xảy ra, mời bạn thử lại')
          return
        }
        navigation.pop();
      } catch (e) {
        console.log(e)
      }
    }
  }
}

const styles = StyleSheet.create({
  btn_sign_in: {
    marginTop: 30,
    width: 90,
    alignSelf: 'flex-end',
    borderRadius: 8,
    fontWeight: 'bold',
    backgroundColor: '#4B8266',
  },
  itemContainer: {
    width: size,
    height: size + 10,
  },
  item: {
    flex: 1,
    margin: 3,
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
