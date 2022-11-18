import React, { useState } from "react";
import {  Text, View, Image, StyleSheet, ImageBackground, TextInput, TouchableOpacity, Linking, Button} from 'react-native';
import CheckBox from '@react-native-community/checkbox';



const Signup = ({navigation}) =>{

    
    const [isSelected, setSelection] = useState(false);

    
    return(
        <View style={styles.container}>
        <ImageBackground source={require('../src/image/login.png')} style={styles.back}> 
        </ImageBackground>

        <Text style={styles.txt}>Signup</Text>
        <Text style={styles.name}>Name</Text>
        <TextInput style={styles.input1} placeholder="KHOJ APP"/>
        <Text style={styles.name}>Phone</Text>
        <TextInput style={styles.input1} placeholder="2345578"/>

     
       
    <Text style={styles.name}>OTP</Text>
    <TextInput style={styles.input1} placeholder=""/>
    <Text style={styles.otp}>OTP will expire within 30 second..</Text>
      <TouchableOpacity>
      <Text style={styles.userbtn}>Confirm</Text>
      </TouchableOpacity>
      <Text style={styles.resendotp}>Resend OTP</Text>

      <View style={styles.btncont}>
      <Text style={styles.linktxt}>Already have an account?</Text><Text style={{color: 'blue'}}
      onPress={() => Linking.openURL('http://google.com')}>
  Login
</Text>
      </View>
      
      {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'absolute', buttom: 400, top:300, left: 10, right: 10 }}>
<Button  onPress={() => navigation.navigate('Selection2')} title='Next Screen' />
</View> */}
     </View>

     
     
    


      
    );
};

const styles=StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
       
   },
        back:{
            width:390, height:800, marginTop:-10, marginBottom: -300, marginLeft:0, marginRight:0, 
    
       
      },
      txt:{
        textAlign: 'center',
        fontSize: 40,
        color: 'black',
        marginTop: -295,
        marginBottom: 15
      },
      input1:{
        width: '70%',
        backgroundColor: '#f5f5f5',
        padding: 10,
        marginBottom: 10,
        borderRadius: 20,
        shadowColor: 0.5,
        
      },
      name:{                             
        color:"black",
        fontSize: 20,
        textAlign: "left",
        marginRight: 200
      },
      checkbox: {
        alignSelf: "center",
      },
      label: {
        margin: 8,
        color: "black"
      },

      userbtn:{
        backgroundColor: '#FF9900',
        padding: 10,
        borderRadius: 20,
        fontSize: 20,
        width: 250,
        textAlign:'center'

      },
      btncont:{
        flexDirection: "row",
        marginBottom: 10,
        padding: 10
      },
      linktxt:{
        color: "black"
      },
      otp:{
        color: "black",
        marginTop: -30,
        textAlign: "center",
        padding: 20
        
        
      },
      resendotp:{
        color:"cyan",
        textAlign: "center",
        padding: 10
      }


})
export default Signup;
 