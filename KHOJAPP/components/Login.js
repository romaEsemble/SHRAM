
import React, {useState} from 'react';
import { Text, View, TextInput, Button, Alert, StyleSheet, ImageBackground, TouchableOpacity, ScrollView} from "react-native";
import { useForm, Controller } from "react-hook-form";
import CheckBox from '@react-native-community/checkbox';
import OTPTextInput from 'react-native-otp-textinput';

import Icon from 'react-native-vector-icons/FontAwesome';


const Login = ({navigation}) => {
  const [isSelected, setSelection] = useState(false);
  const [shouldShow, setShouldShow] = useState(false)
  const [name, setName] = useState("");

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      Name: '',
      Phone: '',
    }
  });
 
  

  const onSubmit = data => console.log(data);
 
  return (
    <ScrollView>
      <View style={styles.container}>
      <ImageBackground
        source={require('../src/image/login.png')}
        style={styles.back}></ImageBackground>

      <Text style={styles.txt}>Signup</Text>
      <Text style={styles.name}>Name</Text>
     
      <Controller
        defaultValue=""
        style={styles.input1}
        control={control}

        rules={{
           required: true,
           message: 'enter name is required'
         }}
        
        render={({ field: { onChange, value, Name, Text } }) => (
          <TextInput style={styles.input1}
            // onChangeText={onChange}
            value={Name}
            placeholder='Name'
            errors={errors.Name}
            errorText={errors.Name?.message}
            maxLength={100}
            onChangeText={(value) => setName(value)}
            onSubmitEditing={(value) => setName(value.nativeEvent.text)}
            defaultValue={Text}
           
            
           
          />
        )}
        name="Name"
        
        />
      {errors.Name && <Text style={styles.error1}>name is required.</Text>}

      
      <Text style={styles.name}>Phone</Text>
      <Controller
      defaultValue=""
        control={control}
        rules={{
        
          required: true,
          message: 'enter Phone num is required'
          
         
        }}
        render={({ field: { onChange, value, Phone } }) => (
          <TextInput
            style={styles.input1}
            onChangeText={onChange}
            value={Phone}
            placeholder="Phone"
            errors={errors.Phone}
            errorText={errors.Phone?.message}
            keyboardType={'numeric'}
            maxLength={10}
          />
        )}
        name="Phone"
      />
       {errors.Phone && <Text style={styles.error2}>phone is required.</Text>}

       <View style={styles.checkboxContainer}>
        <CheckBox
          value={isSelected}
          onValueChange={setSelection}
          style={styles.checkbox}
        />
        <Text style={styles.label}>I am above 18 year old</Text>
      </View>
      {
        shouldShow ? (
          <View style={styles.otp}>
        <OTPTextInput 
      
        textInputStyle={{borderColor:'black', borderWidth: 1, borderRadius: 6, borderBottomWidth: 1}} 
        offTintColor={'grey'}
        tintColor={'green'}
          />

<TouchableOpacity  onPress={handleSubmit(onSubmit)}>
        <Text style={styles.userbtn}>SUBMIT</Text>
       </TouchableOpacity>
      </View>
        ): (
        <TouchableOpacity  onPress={() => setShouldShow(!shouldShow)}>
        <Text style={styles.userbtn}>Send OTP</Text>
      </TouchableOpacity>
        )
      }
      
      
      {/* <Button title="Send OTP" onPress={handleSubmit(onSubmit)}/> */}
      

      <View style={styles.btncont}>
        <Text style={styles.linktxt}>Already have an account?</Text>
        <Text
          style={{color: 'blue'}}
          onPress={() => Linking.openURL('http://google.com')}>
          Login
        </Text>
      </View>

    </View>
    
    </ScrollView>
  );
}


const styles=StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  back: {
    width: 390,
    height: 800,
    marginTop: -10,
    marginBottom: -300,
    marginLeft: 0,
    marginRight: 0,
  },
  txt: {
    textAlign: 'center',
    fontSize: 40,
    color: 'black',
    marginTop: -280,
    marginBottom: 15,
  },
  input1: {
    width: '70%',
    backgroundColor: '#f5f5f5',
    padding: 10,
    marginBottom: 5,
    borderRadius: 20,
    shadowColor: 0.5,
  },
  name: {
    color: 'black',
    fontSize: 20,
    textAlign: 'left',
    marginRight: 200,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
    color: 'black',
  },

  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    marginRight: 90,
  },

  userbtn: {
    backgroundColor: '#FF9900',
    padding: 10,
    borderRadius: 20,
    fontSize: 20,
    width: 250,
    textAlign: 'center',
  },
  btncont: {
    flexDirection: 'row',
    marginBottom: 10,
    padding: 10,
  },
  linktxt: {
    color: 'black',
  },

  error1:{
    marginRight: 150,
    color: "red"
   
  },
  error2:{
    marginRight: 150,
    color: "red"
   
   
  },
  otp:{
    alignItems: "center",
    justifyContent: "center",
  
  },
  resendotp:{
    color:"black",
    textAlign: "center",
    padding: 10
  },
  userbtn:{
    backgroundColor: '#FF9900',
    padding: 10,
    borderRadius: 20,
    fontSize: 20,
    width: 250,
    textAlign:'center'

  },

})


export default Login
