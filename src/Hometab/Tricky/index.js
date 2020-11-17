import React, { Component } from 'react';
import {
  View, StyleSheet, Platform, TouchableOpacity, Image, FlatList, Dimensions,
} from 'react-native';
import { Container, Button, Text } from 'native-base';
import Toast from 'react-native-simple-toast';
import STG from '../../../service/storage';
import API from '../../apis';
import HOST from '../../apis/host';
import axios from 'axios';
import { Header } from '../../elements';
import _ from 'lodash';

const os = Platform.OS;

const numColumns = 2;
const size = (Dimensions.get('window').width / numColumns) - 10;

export default class tricky extends Component {

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
      crops: [
        { name: 'Chọn cây giống', index: 0, image: require('../../../assets/images/sprout.png') },
        { name: 'Thổ nhưỡng', index: 1, image: require('../../../assets/images/italy.png') },
        { name: 'Gieo trồng', index: 2, image: require('../../../assets/images/page.png') },
        { name: 'Thời tiết', index: 3, image: require('../../../assets/images/weather_tips.png') },
        { name: 'Phân bón', index: 4, image: require('../../../assets/images/fertilizer.png') },
        { name: 'Tưới tiêu', index: 5, image: require('../../../assets/images/water.png') },
        { name: 'Dịch bệnh', index: 6, image: require('../../../assets/images/bug.png') },
        { name: 'Thu hoạch', index: 7, image: require('../../../assets/images/solid.png') },
      ],
    };
    this.didPressSubmit = _.debounce(this.didPressSubmit, 500, { leading: true, trailing: false });
  }

  componentDidMount() {
    // STG.getData('user').then(u => {
    //   this.getCrops(u.subscribe);
    // })
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
        crops: resign,
      })
    }).catch(e => {
      Toast.show('Lỗi xảy ra, mời bạn thử lại')
      console.log(e)
    })
  }

  handleChange = (index) => {
    var newData = [...this.state.crops];
    if (this.limit().length >= 8 && newData[index].check == false) {
      Toast.show('Bạn chỉ được chọn tối đa 8 loại cây trồng')
      return;
    }
    newData[index].check = !newData[index].check;
    this.setState({ crops: newData });
  };

  limit() {
    const { crops } = this.state;
    const limit = crops.filter(e => e.check == true)
    return limit
  }

  render() {
    const { navigation } = this.props;
    const { crops } = this.state;
    return (
      <Container style={{ backgroundColor: 'white' }}>
        <Header navigation={navigation} title={'Hãy lựa chọn'} />
        <View style={{ flex: 1, alignItems: 'center', marginTop: 20 }}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={crops}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => console.log('dfsf')}>
                <View
                  style={styles.itemContainer}>
                  <View style={{ position: 'absolute', top: 3, left: 5, right: 5, bottom: 5, borderRadius: 12, backgroundColor: '#4B8266' }} />
                  <Image
                    style={styles.item}
                    source={item.image}
                  />
                  <Text style={{ fontWeight: 'bold', alignSelf: 'center', marginBottom: 10, color: 'white' }}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )}
            numColumns={numColumns}
            keyExtractor={(item, index) => index}
          />
        </View>
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
    height: size * 0.5,
  },
  item: {
    alignSelf: 'center',
    margin: 10,
    width: 75,
    height: 50,
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
