import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {TextInput, Surface, Title, Button, Text} from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';

export default function EntryScreen({navigation}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  async function handleEntry() {
    let result;
    if (isLogin) {
      navigation.replace("Root");
      return;
      const response = await fetch('https://whist.eu.ngrok.io/auth/login', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({username, password})
      });
      result = await response.json();
    } else {
      const response = await fetch('https://whist.eu.ngrok.io/auth/register', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({username, password, email})
      });

      result = await response.json();
    }
    console.log("response:", result);

    if (result.token) {
      await SecureStore.setItemAsync('token', result.token);
    } else {
      console.log(result);
    }

  }

  return (
    <View style={styles.container}>
      <Surface style={styles.entrySurface}>
        <View style={styles.formContainer}>
          {!isLogin ? <TextInput
            label="Username"
            value={username}
            style={styles.input}
            mode="outlined"
            onChangeText={text => setUsername(text)}
          /> : null}
          <TextInput
            label="Email"
            value={email}
            style={styles.input}
            mode="outlined"
            onChangeText={text => setEmail(text)}
          />
          <TextInput
            label="Password"
            value={password}
            style={styles.input}
            mode="outlined"
            onChangeText={text => setPassword(text)}
          />
          <Button
            icon="login-variant"
            mode="outlined"
            style={styles.button}
            onPress={handleEntry}
          >
            {isLogin ?
              "Login" :
              "Register"
            }
          </Button>
          <Text
            style={styles.entrySwitch}
            onPress={() => {
              setIsLogin(!isLogin);
            }}
          >
          {isLogin ?
            "Don't have an account?" :
            "Already have an account?"
          }
          </Text>
        </View>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    justifyContent: 'center'
  },
  entrySurface: {
    flex: -1,
    flexDirection: 'column',
    width: '100%',
    padding: 20,
    borderRadius: 20,
    elevation: 3
  },
  title: {
    paddingVertical: 10,
    paddingLeft: 2,
    fontSize: 30,
    textAlign: 'left'
  },
  formContainer: {
    flex: -1,
    width: "100%",
    alignSelf: 'center'
  },
  input: {
    width: "100%",
    margin: 2,
  },
  button: {
    margin: 10
  },
  entrySwitch: {
    textAlign: 'center',
    textDecorationLine: 'underline',
  }
});
