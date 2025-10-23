import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const [emailOrCin, setEmailOrCin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    const trimmedEmailOrCin = emailOrCin.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmailOrCin || !trimmedPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    try {
      console.log('Envoi de la requête de connexion:', { emailOrCin: trimmedEmailOrCin, password: trimmedPassword });
      const response = await axios.post('http://172.20.10.12:5000/login', {
        emailOrCin: trimmedEmailOrCin,
        password: trimmedPassword,
      });
      console.log('Réponse du backend:', response.data);

      if (response.data.userType === 'doctor') {
        navigation.navigate('Doctor');
      } else if (response.data.userType === 'patient') {
        await AsyncStorage.setItem('patientEmail', response.data.email);
        navigation.navigate('Patient', {
          patientEmail: response.data.email,
          patientName: `${response.data.firstName} ${response.data.lastName}`,
        });
      } else if (response.data.userType === 'secretary') {
        await AsyncStorage.setItem('secretaryEmail', response.data.email);
        navigation.navigate('Sec', {
          secretaryEmail: response.data.email,
          secretaryName: `${response.data.firstName} ${response.data.lastName}`,
        });
      }
      Alert.alert('Succès', response.data.message);
    } catch (error) {
      console.error('Erreur de connexion:', error.message, error.response?.data);
      Alert.alert('Erreur', error.response?.data?.error || 'Une erreur est survenue lors de la connexion.');
    }
  };

  const handlePhonePress = () => {
    Alert.alert('Contact', 'Appelez-nous au : +216 98 545 870');
  };

  const handleHelpPress = () => {
    Alert.alert('Aide', 'Consultez notre centre d\'aide ou contactez le support.');
  };

  return (
    <ImageBackground
      source={require('../../assets/logo.png')} // Replace with your image
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      {/* Navigation Bar */}
      <View style={styles.navbar}>
        <Text style={styles.logoText}>Medical Cabinet</Text>
        <View style={styles.navIcons}>
          <TouchableOpacity style={styles.navButton} onPress={handlePhonePress}>
            <Icon name="phone" size={24} color="#0084FF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={handleHelpPress}>
            <Icon name="help" size={24} color="#0084FF" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.titre}>Connexion</Text>
        <View style={styles.inputContainer}>
          <Icon name="person" size={24} color="#65676B" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email ou CIN"
            placeholderTextColor="#999"
            value={emailOrCin}
            onChangeText={setEmailOrCin}
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="lock" size={24} color="#65676B" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.showPasswordContainer}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.showPasswordText}>{showPassword ? 'Masquer' : 'Afficher'}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Se connecter</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={styles.signupButtonText}>Créer un compte</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="light" />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E6EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    position: 'absolute',
    top: 0,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0084FF',
  },
  navIcons: {
    flexDirection: 'row',
  },
  navButton: {
    marginLeft: 15,
    padding: 5,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 80, // Adjusted to avoid overlap with navbar
  },
  titre: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1C2526',
    marginBottom: 40,
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E6EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    marginLeft: 15,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 56,
    paddingVertical: 15,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#1C2526',
  },
  showPasswordContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'center',
    zIndex: 1,
  },
  showPasswordText: {
    color: '#0084FF',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#0084FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  signupButton: {
    width: '100%',
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#0084FF',
    fontSize: 18,
    fontWeight: '600',
  },
});