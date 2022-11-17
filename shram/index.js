
// import 'react-native-gesture-handler';
import rootReducer from '@redux/RootReducer';
import {ThemeContextProvider} from '@theme/ThemeHelper';
import React from 'react';
import {AppRegistry} from 'react-native';
import {Provider} from 'react-redux';
import {applyMiddleware,  legacy_createStore as createStore} from 'redux';
import thunk from 'redux-thunk';
import {name as appName} from './app.json';
import App from './src/App';

const store = createStore(rootReducer, applyMiddleware(thunk));

const MainApp = () => (
    <Provider store={store}>
      <ThemeContextProvider>
        <App />
      </ThemeContextProvider>
    </Provider>
);

AppRegistry.registerComponent(appName, () => MainApp);
