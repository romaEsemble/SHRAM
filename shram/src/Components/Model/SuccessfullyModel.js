import React from 'react';
import {View} from 'react-native';
import CircleFlower from '@icons/circleFlower';
import Text from '@textView/TextView';
import TouchableOpacity from '@touchable/TouchableOpacity';
import AddIcon from '@icons/IconCheckCircle';
import localStyles from '@profile/ProfileStyles';

export default function SuccessfullyModel({onPress, heading, subHeading}) {
  const {centerCircle, circlePosition} = localStyles;
  return (
    <View>
      {/* <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <CircleFlower
          style={{position: 'absolute', zIndex: 9, top: 20}}
          width={170}
          height={170}></CircleFlower>
        <AddIcon />
      </View> */}
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: '#707070',
            fontSize: 22,
            margin: 10,
          }}>
          {heading}
        </Text>
        <Text
          style={{
            color: '#707070',
            fontSize: 16,
            margin: 10,
          }}>
          {subHeading}
        </Text>
        <TouchableOpacity
          onPress={() => onPress && onPress()}
          style={{
            margin: 5,
            borderWidth: 1,
            borderColor: '#FFC003',
            borderRadius: 5,
            padding: 10,
            backgroundColor: '#FFC003',
            width: 150,
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 20,
              color: '#777171',
            }}>
            Ok
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
