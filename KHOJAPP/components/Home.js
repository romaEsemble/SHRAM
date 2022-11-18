import React  from 'react';
import
  { View, Text, Button }  from 'react-native';

  const Home = (props)=>
{


    return(
      <View>
      <Text style={{fontSize:60}}>
       {props.data}
      </Text>
        <Button title=" Click me " />

      </View>
      
    ) 

} 

export default Home;
