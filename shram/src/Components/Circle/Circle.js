import React from 'react';
import {View} from 'react-native';

export default function Circle(props) {
  const {type, circleColor, children, svg} = props;
  let getSize = () => {
    if (!type) {
      return {};
    }
    switch (type) {
      case 'large':
        return (
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: circleColor ? circleColor : null,
              alignItems: 'center',
            }}>
            {svg}
          </View>
        );

      case 'medium':
        return (
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 80,
              backgroundColor: circleColor ? circleColor : null,
              alignItems: 'center',
            }}>
            {svg}
          </View>
        );
      case 'tiny':
        return (
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 40,
              backgroundColor: circleColor ? circleColor : null,
              alignItems: 'center',
            }}>
            {svg}
          </View>
        );
      case 'small':
        return (
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: circleColor ? circleColor : null,
              alignItems: 'center',
            }}>
            {svg}
          </View>
        );
      case 'ProfileCircle':
        return (
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: circleColor ? circleColor : null,
              alignItems: 'center',
            }}>
            {svg}
          </View>
        );
    }
  };
  return <View>{getSize()}</View>;
}
