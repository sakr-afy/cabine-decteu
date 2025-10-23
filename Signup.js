import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
  const navigation = useNavigation();
  const validateFields = () => {
    const nameRegex = /^[A-Za-z]{2,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{8}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=])[A-Za-z\d@#$%^&+=]{8,}$/;

    if (!firstName || !nameRegex.test(firstName)) {
      Alert.alert('Erreur', 'Le prénom doit contenir au moins 2 lettres (sans espaces ni caractères spéciaux).');
      return false;
    }

    if (!lastName || !nameRegex.test(lastName)) {
      Alert.alert('Erreur', 'Le nom doit contenir au moins 2 lettres (sans espaces ni caractères spéciaux).');
      return false;
    }

    if (!email || !emailRegex.test(email)) {
      Alert.alert('Erreur', 'Veuillez entrer une adresse email valide.');
      return false;
    }

    if (!phone || !phoneRegex.test(phone)) {
      Alert.alert('Erreur', 'Veuillez entrer un numéro de téléphone valide (8 chiffres).');
      return false;
    }

    if (!password || !passwordRegex.test(password)) {
      Alert.alert(
        'Erreur',
        'Le mot de passe doit contenir au moins 8 caractères, incluant une majuscule, une minuscule, un chiffre et un caractère spécial (@#$%^&+=).'
      );
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateFields()) {
      return;
    }

    try {
      console.log('Envoi de la requête d\'inscription:', { firstName, lastName, email, phone, password });
      const response = await axios.post('http://172.20.10.12:5000/signup', {
        firstName,
        lastName,
        email,
        phone,
        password,
      });

      console.log('Réponse du backend:', response.data);
      Alert.alert('Succès', response.data.message);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Erreur d\'inscription:', error.message, error.response?.data);
      Alert.alert('Erreur', error.response?.data?.error || 'Une erreur est survenue lors de l\'inscription.');
    }
  };

  // Fonction pour basculer la visibilité du mot de passe
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Fonction pour basculer la visibilité de la confirmation du mot de passe
  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <ImageBackground
      source={require('../../assets/logo.png')} // Remplacer par votre image
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.formContainer}>
        <Text style={styles.titre}>Créer un compte</Text>

        <View style={styles.inputContainer}>
          <Icon name="person" size={24} color="#65676B" style={styles.icon} />
          <Text style={styles.required}>*</Text>
          <TextInput
            style={styles.input}
            placeholder="Prénom"
            placeholderTextColor="#999"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="person" size={24} color="#65676B" style={styles.icon} />
          <Text style={styles.required}>*</Text>
          <TextInput
            style={styles.input}
            placeholder="Nom"
            placeholderTextColor="#999"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="email" size={24} color="#65676B" style={styles.icon} />
          <Text style={styles.required}>*</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="phone" size={24} color="#65676B" style={styles.icon} />
          <Text style={styles.required}>*</Text>
          <TextInput
            style={styles.input}
            placeholder="Téléphone"
            placeholderTextColor="#999"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock" size={24} color="#65676B" style={styles.icon} />
          <Text style={styles.required}>*</Text>
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword} // Bascule en fonction de showPassword
          />
          <TouchableOpacity onPress={toggleShowPassword} style={styles.eyeIcon}>
            <Icon
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={24}
              color="#65676B"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock" size={24} color="#65676B" style={styles.icon} />
          <Text style={styles.required}>*</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirmer le mot de passe"
            placeholderTextColor="#999"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword} // Bascule en fonction de showConfirmPassword
          />
          <TouchableOpacity onPress={toggleShowConfirmPassword} style={styles.eyeIcon}>
            <Icon
              name={showConfirmPassword ? 'visibility' : 'visibility-off'}
              size={24}
              color="#65676B"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
          <Text style={styles.signupButtonText}>S'inscrire</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.backButtonText}>Retour à la connexion</Text>
        </TouchableOpacity>

        <StatusBar style="light" />
      </View>
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
  formContainer: {
    width: '100%',
    alignItems: 'center',
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
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#1C2526',
    borderRadius: 12,
  },
  eyeIcon: {
    padding: 10,
    marginRight: 10,
  },
  signupButton: {
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
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0084FF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    color: '#0084FF',
    fontSize: 18,
    fontWeight: '600',
  },
  required: {
    color: '#FF0000',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});