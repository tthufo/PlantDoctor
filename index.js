/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);

String.prototype.arr = (array) => {
  if (arr == null || arr == undefined) return ''
  const arr = ((array.replace(/\["/g, "")).replace(/"\]/g, "")).split('","')
  return arr
}