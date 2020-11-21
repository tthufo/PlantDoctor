import React, { Component } from 'react';
import {
  View, StyleSheet, Platform, TouchableOpacity, Dimensions,
} from 'react-native';
import { Container, Text } from 'native-base';
import { Header } from '../elements';
import WeatherHeader from '../elements/WeatherHead';
import Hour24 from './24h';
import Day7 from './7d';
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
      mode: 0,
    };
  }

  render() {
    const { navigation } = this.props;
    const { mode } = this.state;
    return (
      <Container style={{ backgroundColor: 'white' }}>
        <Header navigation={navigation} title={'Thời tiết'} />

        <View style={{ flexDirection: 'column', flex: 1 }}>

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

          {/* <View style={{ flex: 1 }}>

            <ScrollView
              style={{ margin: 0 }}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              <Hour24 />
              <Day7 />
            </ScrollView>
          </View> */}
          <View style={{ flex: 1 }}>
            {mode == 1 ?
              <Hour24 />
              : <Day7 />}
          </View>
        </View>
      </Container>
    );
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
