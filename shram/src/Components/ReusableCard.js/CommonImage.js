//import liraries
import React from 'react';
import {Image, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';

// create a component
const MyComponent = React.memo(({style, source, type}) => {
  // const imageUri =
  //   type == 1
  //     ? {
  //         uri: `https://s3.ap-south-1.amazonaws.com/pics.test.mm/${source}`,
  //         // headers: { Authorization: 'someAuthToken' },
  //         priority: FastImage.priority.normal,
  //       }
  //     : source;
  console.log('Image uri', type, source);
  return (
    <FastImage
      style={style}
      source={source}
      // resizeMode={FastImage.resizeMode.contain}
    />
  );
});
{
  /* <Image
      source={{
        cache: 'only-if-cached',
        uri: null,
        // cont_type === 1
        //   ? `https://s3.ap-south-1.amazonaws.com/pics.test.mm/${cont_link}`
        //   : cont_link,
      }}
      style={styles.container}
    /> */
}

// define your styles
const styles = StyleSheet.create({
  container: {
    width: '96%',
    height: 150,
    marginHorizontal: '2%',
    borderRadius: 10,
    marginTop: 10,
  },
});

//make this component available to the app
export default MyComponent;
