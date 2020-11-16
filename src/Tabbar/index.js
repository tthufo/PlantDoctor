import React from 'react';
import { Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Hometab from '../Hometab';

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          options={{
            tabBarIcon: ({ focused }) => (
              <Image
                style={{ width: 35, height: 35, marginTop: 30 }}
                source={!focused ? require('../../assets/images/ic_tab_home_active.png') : require('../../assets/images/ic_tab_home.png')
                } />
            ),
            tabBarLabel: ''
          }}
          name="Home"
          component={Hometab} />
        <Tab.Screen
          options={{
            tabBarIcon: ({ focused }) => (
              <Image
                style={{ width: 35, height: 35, marginTop: 30 }}
                source={!focused ? require('../../assets/images/ic_tab_social_active.png') : require('../../assets/images/ic_tab_social.png')
                } />
            ),
            tabBarLabel: ''
          }}
          name="Home"
          component={Hometab}
          name="Social"
          component={Hometab} />
        <Tab.Screen
          options={{
            tabBarIcon: ({ focused }) => (
              <Image
                style={{ width: 35, height: 35, marginTop: 30 }}
                source={!focused ? require('../../assets/images/ic_tab_account_active.png') : require('../../assets/images/ic_tab_account.png')
                } />
            ),
            tabBarLabel: ''
          }}
          name="Home"
          component={Hometab}
          name="User"
          component={Hometab} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default MyTabs;