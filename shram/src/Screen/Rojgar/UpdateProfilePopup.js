import Button from '@button/Button';
import PopupModal from '@popupModal/PopupModal';
import {TEXT_TYPE} from '@resources/Constants';
import Text from '@textView/TextView';
import React, {Component} from 'react';
import {View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import CircleFlower from '@icons/circleFlower.svg';
import UserPhoto from '@icons/update-profile-user.svg';
import {
  NAVIGATION_PROFILE_STACK,
  NAVIGATION_PROFILE,
} from '@navigation/NavigationKeys';

export default class UpdateProfilePopup extends Component {
  render() {
    const {item, onClose, navigation} = this.props;

    return (
      <PopupModal onBackdropPress={onClose}>
        <View>
          <View
            style={{
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <CircleFlower
              preserveAspectRatio="none"
              width={wp(28)}
              height={wp(28)}
            />
            <View
              style={{
                position: 'absolute',
                backgroundColor: '#ffc003',
                borderRadius: wp(13),
                width: wp(26),
                height: wp(26),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <UserPhoto width={wp(20)} height={wp(20)} />
            </View>
          </View>

          <View style={{alignItems: 'center', marginTop: hp(1)}}>
            <Text bold type={TEXT_TYPE.MEDIUM} style={{textAlign: 'center'}}>
              UPDATE PROFILE
            </Text>
          </View>

          <Text
            light
            type={TEXT_TYPE.SMALL}
            style={{marginTop: hp(2), textAlign: 'center', marginBottom: 10}}>
            Please Update your Profile To Apply for Job
          </Text>

          {item &&
            item.map((text) => {
              return (
                <Text
                  type={TEXT_TYPE.EXTRA_SMALL}
                  style={{textAlign: 'center'}}>
                  {text?.toUpperCase()}
                </Text>
              );
            })}

          <Button
            containerStyle={{
              marginTop: hp(4),
              marginBottom: hp(2),
            }}
            onPress={() => {
              onClose();
              setTimeout(() => {
                navigation?.navigate(NAVIGATION_PROFILE_STACK, {
                  screen: NAVIGATION_PROFILE,
                });
              }, 100);
            }}
            title={'UPDATE'}
          />
        </View>
      </PopupModal>
    );
  }
}
