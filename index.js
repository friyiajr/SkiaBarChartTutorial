/**
 * @format
 */

import {LogBox} from 'react-native';

LogBox.ignoreAllLogs();

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
