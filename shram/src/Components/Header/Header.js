import Circle from '@circle/Circle';
import headerStyles from '@header/HeaderStyle';
import Left from '@icons/Back.svg';
import NotificationIcon from '@icons/bellNotificationIcon.svg';
import IconPhoneCall from '@icons/IconphoneCall.svg';
import ProfileCircle from '@icons/profileCircleIcon.svg';
import SharmText from '@icons/shramTextIcon.svg';
import KhojText from '@icons/Khoj.svg';
import {
  NAVIGATION_NOTIFICATION,
  NAVIGATION_HOME,
} from '@navigation/NavigationKeys';
import {useNavigation} from '@react-navigation/native';
import Text from '@textView/TextView';
import React from 'react';
import {
  Dimensions,
  Image,
  Linking,
  TouchableOpacity,
  View,
  Keyboard,
} from 'react-native';
import {Header as ToolBar} from '@rneui/themed';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import {GetPhotoBaseURL} from '@networking/Urls';
import {sendBtnClickToAnalytics} from '@utils/Util';

const {width} = Dimensions.get('screen');

function renderLeftComponent(props) {
  const {profileData} = useSelector((state) => state.ProfileReducer);
  const navigation = useNavigation();

  const {
    showBack,
    headerColor,
    leftIconPress,
    showLogo,
    showDrawer,
    chatClosed,
    chatClose,
  } = props;
  
  const openDrawer = () => {
    Keyboard.dismiss();
    navigation.openDrawer();
  };
  return (
    <View>
      {showBack && (
        <TouchableOpacity
          onPress={() => {
            console.log('Clciked button', chatClosed);
            if (chatClosed) {
              chatClose();
            }
            navigation.goBack();
          }}>
          <View
            style={{
              paddingLeft: 5,
              paddingRight: 15,
            }}>
            <Left width={22} height={22} fill={'#fff'} />
          </View>
        </TouchableOpacity>
      )}
      {showDrawer &&
        (profileData?.pic ? (
          <TouchableOpacity style={{marginBottom: 5}} onPress={navigation.openDrawer()}>
            <Circle
              type={'ProfileCircle'}
              circleColor={'#fff'}
              svg={
                <FastImage
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    marginTop: 5,
                    alignItems: 'center',
                  }}
                  source={
                    profileData?.pic
                      ? {
                          uri: `${GetPhotoBaseURL()}${profileData?.pic}`,
                          priority: FastImage.priority.normal,
                        }
                      : require('@icons/Image.png')
                  }
                />
              }
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{marginBottom: 5}}
            onPress={
              leftIconPress || showDrawer
                ? openDrawer
                : showBack
                ? () => navigation.goBack()
                : null
            }>
            <ProfileCircle width={40} height={40} />
          </TouchableOpacity>
        ))}
    </View>
  );
}

function renderCenterComponent(props) {
  const {title} = props;
  const navigation = useNavigation();
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {title ? (
        <Text style={{color: '#fff', fontSize: 18}}>{title}</Text>
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            navigation.navigate(NAVIGATION_HOME);
            sendBtnClickToAnalytics(`KHOJ Logo`);
          }}>
          <KhojText style={{marginTop: 10}} />
        </TouchableOpacity>
      )}
    </View>
  );
}

function renderRightComponent(props) {
  const navigation = useNavigation();
  const {
    rightIconPress,
    rightText,
    rightTextStyle,
    hideNotification,
    hideCall,
  } = props;
  return (
    <View style={headerStyles.horizontalDirection}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <TouchableOpacity style={{width: 'auto'}} onPress={rightIconPress}>
          {rightText && <Text style={rightTextStyle}>{rightText || ''}</Text>}
        </TouchableOpacity>
        {!hideCall ? (
          <TouchableOpacity
            style={{paddingHorizontal: 10, marginRight: 10}}
            onPress={() => {
              Linking.openURL(`tel:${1800222786}`);
              sendBtnClickToAnalytics(`Call 1800222786`);
            }}>
            <IconPhoneCall width={18} height={18} />
          </TouchableOpacity>
        ) : null}
        {!hideNotification ? (
          <TouchableOpacity
            style={{paddingHorizontal: 5}}
            onPress={() => navigation?.navigate(NAVIGATION_NOTIFICATION)}>
            <NotificationIcon width={18} height={18} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

function Header(props) {
  const {headerShadow, Custom} = props;
  if (Custom) {
    return (
      <ToolBar
        statusBarProps={{translucent: true, backgroundColor: '#4B79D8)'}}
        barStyle="light-content"
        containerStyle={[
          headerStyles.defaultHeaderColor,
          headerShadow ? headerStyles.showShadow : null,
        ]}>
        <View style={{flex: 1, width: width - 10, height: '0%'}}>{Custom}</View>
      </ToolBar>
    );
  }
  const {headerStyle} = props;
  return (
    <ToolBar
      statusBarProps={{translucent: true, backgroundColor: '#4B79D8'}}
      barStyle="light-content"
      leftComponent={() => renderLeftComponent(props)} // Error on this line (Checked by commenting all other code)
      centerComponent={() => renderCenterComponent(props)}
      rightComponent={() => renderRightComponent(props)}
      containerStyle={[
        headerStyles.defaultHeaderColor,
        headerStyles.showShadow,
        headerStyle,
      ]}
    />
  );
}

export default Header;
