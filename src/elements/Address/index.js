import React, { Component } from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import { Text } from 'native-base';
import GetLocation from 'react-native-get-location'
import Geocoder from 'react-native-geocoding';
import _ from 'lodash';

export default class address extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillReceiveProps(prevProps, newProps) {
    if (prevProps != newProps) {

    }
  }

  componentDidMount() {
    setTimeout(() => {
      Geocoder.init("AIzaSyAOG928Pk6j90AZJTMf6nSvS3OVaRi_FF4");
      //   GetLocation.getCurrentPosition({
      //     enableHighAccuracy: true,
      //     timeout: 15000,
      //   })
      //     .then(location => {
      //       this.getWeather(location);
      //     })
      //     .catch(error => {
      //       const { code, message } = error;
      //       console.warn(code, message);
      //     }, 1000)
    })
  }

  getWeather(location) {
    Geocoder.from(21.027763, 105.834160)
      .then(json => {
        var addressComponent = json.results[0].address_components[0];
        console.log(addressComponent);
      })
      .catch(error => console.warn(error));
  }

  render() {
    return (
      <View>
        <Text style={this.props.style}>Location</Text>
      </View >
    );
  }
}

const styles = StyleSheet.create({

});
