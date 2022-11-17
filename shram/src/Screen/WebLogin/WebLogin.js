import React from 'react';
import {Dimensions, SafeAreaView, ScrollView, StatusBar} from 'react-native';
import {WebView} from 'react-native-webview';
import {GetAdminBaseURL} from '@networking/Urls';

export default function WebLogin() {
  const deviceHeight = Dimensions.get('window').height;
  const deviceWidth = Dimensions.get('window').width;
  return (
    <SafeAreaView style={{flex: 1, marginTop: StatusBar.currentHeight}}>
      <ScrollView style={{flexGrow: 1}}>
        <WebView
          style={{
            flex: 1,
            width: deviceWidth,
            height: deviceHeight,
          }}
          // source={{uri: 'http://3.7.239.154/login'}}
          source={{uri: GetAdminBaseURL()}}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={false}
          scalesPageToFit={true}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
