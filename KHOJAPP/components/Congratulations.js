import React from 'react';
import
  { View, Text, StyleSheet, Image, Button, }  from 'react-native';


const Congratulations = ({navigation}) => {

  return(
    <View style={styles.container}>
      <Image 
      style={styles.img}
      source={require('../src/image/Congratulation.png')} />
      <View style={styles.container} >
       <Text style={styles.title}>
        Cogratulations
       </Text>
      </View>

      <View style={styles.container} >
       <Text style={styles.title2}>
        You are now part of our 
       </Text>
      </View>

      <View style={styles.container} >
      <Text style={styles.title3}><Text style={{color: '#FF9900'}}>KHOJ </Text>family</Text>
      </View>
   

      <View style={{flex: 1, justifyContent:'center', alignItems: 'center', position: 'absolute', buttom: 400, top:300, left: 10, right: 10}}>
      <Button onPress = {()=>navigation.navigate('Landingpage')} title='Go to Landing Page'/>
      </View>
     </View>
    
    
  )
}


const styles=StyleSheet.create({
    container:{
     
      padding:10,
    },
  
    title:{
      fontSize: 30,
      fontWeight: 'bold',
      textAlign: 'center',
      padding: 2,
      marginTop:-470,
      color: "black"
  
    },
  
    title2:{
      fontSize: 26,
      fontWeight:'bold',
      textAlign: 'center',
      padding: 2,
      marginTop: -436,
      color: "black"
  
  
    },
    title3:{
      fontSize: 26,
      fontWeight:'bold',
      textAlign: 'center',
      padding: 2,
      marginTop: -428,
      color: "black"
    
    }, 

    img:{
      width:410, height:820, marginTop: -10, marginBottom: 0, marginLeft:-10, marginRight:0
    }

});
export default Congratulations;