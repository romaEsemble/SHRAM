import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Swiper from 'react-native-swiper';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const Landingpage = ({navigation}) => {
  return (
    <View style={styles.container}>
    
      <StatusBar style="auto" />
      <View>
        <Swiper
          loop
          autoplay
          dot={
            <View
              style={{
                width: 10,
                height: 10,
                backgroundColor: 'white',
                borderRadius: 4,
                margin: 5,
              }}></View>
          }
          activeDot={
            <View
              style={{
                width: 12,
                height: 12,
                backgroundColor: 'white',
                borderRadius: 5,
                margin: 5,
              }}></View>
          }
          style={styles.sp}>
          <Image
            source={require('../src/image/landing1.png')}
            resizeMode="center"
            style={styles.image}
          />

          <Image
            source={require('../src/image/landing2.png')}
            resizeMode="center"
            style={styles.image}
          />

          <Image
            source={require('../src/image/landing3.png')}
            resizeMode="center"
            style={styles.image}
          />

          <Image
            source={require('../src/image/landing4.png')}
            resizeMode="center"
            style={styles.image}
          />
        </Swiper>
      </View>

      <View style={styles.card}>
        <View>
          <Image
            source={require('../src/image/Group.png')}
            style={styles.back}
          />
        </View>
        
        <TouchableOpacity style={styles.user} onPress = {()=>navigation.navigate('Selection2')}>
          <Text style={styles.userbtn}>Get Started</Text>
        </TouchableOpacity>


       <View>
       <Image
            source={require('../src/image/KHOJ1.png')}
            style={styles.khoj}
          />
       </View>
      </View>
      
      {/* <View style={{flex: 1, justifyContent:'center', alignItems: 'center', position: 'absolute', buttom: 400, top:300, left: 10, right: 10}}>
      <Button onPress = {()=>navigation.navigate('Selection2')} title='Next Screen'/>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
    marginBottom: 140,
  },

  back: {
    width: 440,
    height: 200,

    textAlign: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
    marginTop: -330
   
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 420,
    height: 820,
    resizeMode: 'cover',
  },

  userbtn: {
    backgroundColor: '#FF9900',
    padding: 10,
    borderRadius: 20,
    fontSize: 20,
    width: 250,
    textAlign: 'center',
    marginTop: -200,
    marginBottom: 100,
    fontWeight: "bold",
    color: "black"
    
  },
  card: {
    flex: 1,
    marginBottom: -400, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  // btns:{
  //  marginTop: -620,
  //   justifyContent: "center",
  //   alignItems: "center"
  // }
  user: {
    marginBottom:-120,
    marginTop: -100,
    justifyContent: "center",
    alignItems: "center"
  },
  khoj:{
  width:220,
  height: 220,
  marginTop:-660,
  marginBottom:10
  }
});

export default Landingpage;
