import React from 'react';
import
  { View, Text,  StyleSheet, Image, ImageBackground, Button, TouchableOpacity}  from 'react-native';
  import Icon from 'react-native-vector-icons/FontAwesome';

const Selection2 = ({navigation}) => {

  return(
 <View style={styles.container}>
<ImageBackground source={require('../src/image/selection.png')} style={{width:405, height:800,}}>

<View style={styles.imgcont} >

<Image style={styles.img1} source={require('../src/image/Rectangle1.png')}/>
<TouchableOpacity  onPress={() => navigation.navigate('Selection')}>
      <Text style={styles.userbtn1}>Hindi</Text>
      </TouchableOpacity>

      <Icon style={styles.arrow}
    name="chevron-right"
    backgroundColor="black"
    // onPress={this.loginWithFacebook}
  ></Icon>
<Image style={styles.img2} source={require('../src/image/image33.png')}/>


<TouchableOpacity  onPress={() => navigation.navigate('Selection')}>
      <Text style={styles.userbtn2}>English</Text>
      </TouchableOpacity>
      <Icon style={styles.arrow2}
    name="chevron-right"
    backgroundColor="black"
    // onPress={this.loginWithFacebook}
  ></Icon>


</View>


</ImageBackground>



   <View>
    <Text style={{textAlign:'center', fontSize: 50}}>Hello this is roma here </Text>
 </View>



{/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'absolute', buttom: 400, top:300, left: 10, right: 10 }}>
<Button  onPress={() => navigation.navigate('Selection')} title='Next Screen' />
</View> */}

</View>
 
  );
};




const styles=StyleSheet.create({
    container:{
      display: "flex",
      alignItems: "center",
      textAlign: "center"

      
    } ,

    imgcont:{
        alignItems: "center",
        marginTop: 180
    },

    img1:{
      height: 180,
      width: 280,
      
    },

    img2:{
      height: 180,
      width: 280
    },

    button1:{
      color: '#2196F3',
      borderRadius: 10
    },
    userbtn1:{
      backgroundColor: '#FFC165',
      padding: 10,
      borderRadius: 20,
      fontSize: 25,
      width: 300,
      textAlign:'left',
      marginBottom: 10,
      marginTop: -55,
      opacity: 0.9,
      color: "black"

    },
    userbtn2:{
      backgroundColor: '#16D77A',
      padding: 10,
      borderRadius: 20,
      fontSize: 25,
      width: 300,
      textAlign:'left',
      marginTop: -55,
      opacity: 0.9,
      color: 'black'


    },

    arrow:{
        fontSize: 30,
        color: 'black',
        marginTop: -50,
        marginLeft: 245
    },
    arrow2:{
        fontSize: 30,
        color: 'black',
        marginTop: -42,
        marginLeft: 245,
        
    }
  

})
export default Selection2;


