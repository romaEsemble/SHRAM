// import React  from 'react';
// import
//   {  SafeAreaView, View,Text }  from 'react-native';
// // import Selection from './components/Selection';
// // import Login from './components/Login';
// import Cogratulations from './components/Congratulations';





// const App = () => {

//   return(
//    <View>  
//      <Text>

//    {/* <Login /> */}
//      {/* <Selection /> */}
//       <Cogratulations />

//      </Text>
//    </View>
   
   
//   );
// };

import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CongratulationScreen from './components/Congratulations';

import HomeScreen from './components/Landingpage';
import Selection2Screen from './components/Selection2';
import LoginScreen from './components/Login';
import SelectionScreen from './components/Selection';
import LandingpageScreen from './components/Landingpage'



const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home' screenOptions={{headerShown: false,}}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Landingpage' }}
        />
        <Stack.Screen style={{alignContent: 'center',}} name="Selection2" component={Selection2Screen}/>
        <Stack.Screen style={{alignContent: 'center',}} name="Login" component={LoginScreen} />
        <Stack.Screen style={{alignContent: 'center',}} name="Congratulations" component={CongratulationScreen} />
        <Stack.Screen style={{alignContent: 'center',}} name="Selection" component={SelectionScreen} />
        <Stack.Screen style={{alignContent: 'center',}} name="Landingpage" component={LandingpageScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
 

export default MyStack ;
// import React, {useState} from 'react';
// import { Text, View, TextInput, Button, Alert, StyleSheet, ImageBackground, TouchableOpacity, errorText, errors } from "react-native";
// import { useForm, Controller } from "react-hook-form";
// import CheckBox from '@react-native-community/checkbox';

// const Login = ({navigation}) => {
//   const [isSelected, setSelection] = useState(false);
//   const { control, handleSubmit, formState: { errors } } = useForm({
//     defaultValues: {
//       Name: '',
//       Phone: '',
//     }
//   });
//   const onSubmit = data => console.log(data);

//   return (
//     <View style={styles.container}>
//       <ImageBackground
//         source={require('./src/image/login.png')}
//         style={styles.back}></ImageBackground>

//       <Text style={styles.txt}>Signup</Text>
//       <Text style={styles.name}>Name</Text>
     
//       <Controller
//         defaultValue=""
//         style={styles.input1}
//         control={control}

//         rules={{
//            required: true,
//            message: 'enter name is required'
//          }}
        
//         render={({ field: { onChange, value } }) => (
//           <TextInput style={styles.input1}
//             onChangeText={onChange}
//             value={value}
//             placeholder='Name'
//             errors={errors.Name}
//             errorText={errors.Name?.message}
//             maxLength={100}
           
//           />
//         )}
//         name="Name"
        
//         />
//       {errors.Name && <Text style={styles.error1}>name is required.</Text>}

      
//       <Text style={styles.name}>Phone</Text>
//       <Controller
//       defaultValue=""
//         control={control}
//         rules={{
        
//           required: true,
//           message: 'enter Phone num is required'
          
         
//         }}
//         render={({ field: { onChange, value } }) => (
//           <TextInput
//             style={styles.input1}
//             onChangeText={onChange}
//             value={value}
//             placeholder="Phone"
//             errors={errors.Phone}
//             errorText={errors.Phone?.message}
//             keyboardType={'numeric'}
//             maxLength={10}
//           />
//         )}
//         name="Phone"
//       />
//        {errors.Phone && <Text style={styles.error2}>phone is required.</Text>}

//        <View style={styles.checkboxContainer}>
//         <CheckBox
//           value={isSelected}
//           onValueChange={setSelection}
//           style={styles.checkbox}
//         />
//         <Text style={styles.label}>I am above 18 year old</Text>
//       </View>

//       <TouchableOpacity onPress={handleSubmit(onSubmit)}>
//         <Text style={styles.userbtn}>Send OTP</Text>
//       </TouchableOpacity>
//       {/* <Button title="Send OTP" onPress={handleSubmit(onSubmit)}/> */}

//       <View style={styles.btncont}>
//         <Text style={styles.linktxt}>Already have an account?</Text>
//         <Text
//           style={{color: 'blue'}}
//           onPress={() => Linking.openURL('http://google.com')}>
//           Login
//         </Text>
//       </View>
      
//     </View>
    
//   );
// }


// const styles=StyleSheet.create({
//   container: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   back: {
//     width: 390,
//     height: 800,
//     marginTop: -10,
//     marginBottom: -300,
//     marginLeft: 0,
//     marginRight: 0,
//   },
//   txt: {
//     textAlign: 'center',
//     fontSize: 40,
//     color: 'black',
//     marginTop: -280,
//     marginBottom: 15,
//   },
//   input1: {
//     width: '70%',
//     backgroundColor: '#f5f5f5',
//     padding: 10,
//     marginBottom: 5,
//     borderRadius: 20,
//     shadowColor: 0.5,
//   },
//   name: {
//     color: 'black',
//     fontSize: 20,
//     textAlign: 'left',
//     marginRight: 200,
//   },
//   checkbox: {
//     alignSelf: 'center',
//   },
//   label: {
//     margin: 8,
//     color: 'black',
//   },

//   checkboxContainer: {
//     flexDirection: 'row',
//     marginBottom: 10,
//     marginRight: 90,
//   },

//   userbtn: {
//     backgroundColor: '#FF9900',
//     padding: 10,
//     borderRadius: 20,
//     fontSize: 20,
//     width: 250,
//     textAlign: 'center',
//   },
//   btncont: {
//     flexDirection: 'row',
//     marginBottom: 10,
//     padding: 10,
//   },
//   linktxt: {
//     color: 'black',
//   },

//   error1:{
//     marginRight: 150,
//     color: "red"
   
//   },
//   error2:{
//     marginRight: 150,
//     color: "red"
   
   
//   }
// })


// export default Login;
