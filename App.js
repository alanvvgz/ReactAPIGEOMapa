import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

const App = () => {
  const [movieTitle, setMovieTitle] = useState('');
  const [movieData, setMovieData] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão de localização não concedida', 'Por favor, conceda permissão de localização para obter a localização.');
        return;
      }

      let locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData);
    })();
  }, []);

  const handleSearch = async () => {
    if (movieTitle.trim() === '') {
      Alert.alert('Aviso', 'Por favor, insira um título de filme válido.');
      return;
    }
    try {
      const apiKey = '1993e977'; // Substitua pelo seu próprio API Key
      const apiUrl = `https://www.omdbapi.com/?t=${movieTitle}&apikey=${apiKey}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.Response === 'True') {
        setMovieData(data);
      } else {
        Alert.alert('Erro', 'Filme não encontrado. Verifique o título e tente novamente.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Houve um problema na busca do filme. Tente novamente mais tarde.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Filmes e Localizações
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome do filme"
        value={movieTitle}
        onChangeText={(text) => setMovieTitle(text)}
      />
      <Button title="Buscar Filme" onPress={handleSearch} color="#6C7A89" />

      {movieData && (
        <View style={styles.movieDataContainer}>
          <Text style={styles.subtitle}>{movieData.Title}</Text>
          <Text>Ano: {movieData.Year}</Text>
          <Text>Gênero: {movieData.Genre}</Text>
          <Text>Diretor: {movieData.Director}</Text>
          <Text>Prêmios: {movieData.Awards}</Text>
        </View>
      )}

      {location && (
        <View style={styles.locationContainer}>
          <Text style={styles.subtitle}>Sua Localização</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.03,
              longitudeDelta: 0.03,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Você está aqui!"
            />
          </MapView>
          <View style={styles.coordinatesContainer}>
            <Text style={styles.coordinatesText}>Latitude: {location.coords.latitude}</Text>
            <Text style={styles.coordinatesText}>Longitude: {location.coords.longitude}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#D5DBDB',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: '#34495E',
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#ECF0F1',
    color: '#34495E',
  },
  locationContainer: {
    marginTop: 20,
    backgroundColor: '#BDC3C7', // Cinza
    borderRadius: 10,
    elevation: 3,
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  movieDataContainer: {
    marginVertical: 20,
    padding: 20,
    backgroundColor: '#ECF0F1',
    borderRadius: 10,
    elevation: 3,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2C3E50',
  },
  coordinatesContainer: {
    marginVertical: 10,
  },
  coordinatesText: {
    fontSize: 16,
    color: '#34495E',
  },
});

export default App;
