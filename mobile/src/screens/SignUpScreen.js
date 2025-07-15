import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { supabase } from '../supabaseClient';

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSignUp = async () => {
    try {
      const { user, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'student',
            name,
            grade,
            field_of_study: fieldOfStudy,
            phone_number: phoneNumber,
          }
        }
      });
      if (error) throw error;
      Alert.alert('Success', 'Check your email for the login link!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View>
      <TextInput placeholder="Name" value={name} onChangeText={setName} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput placeholder="Grade" value={grade} onChangeText={setGrade} />
      <TextInput
        placeholder="Field of Study"
        value={fieldOfStudy}
        onChangeText={setFieldOfStudy}
      />
      <TextInput
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
};

export default SignUpScreen;
