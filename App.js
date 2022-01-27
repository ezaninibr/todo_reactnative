import AsyncStorageLib from '@react-native-async-storage/async-storage';
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Keyboard,
  Alert
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const larguraTela = Dimensions.get("window").width;
const alturaTela = Dimensions.get("window").height;

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      input: '',
      contador: 0,
      lista: [

      ]
    };
    this.gravarTarefa = this.gravarTarefa.bind(this);
  }

  async componentDidMount() {
    await AsyncStorage.getItem("lista").then((value) => {
      let listaRecuperada = JSON.parse(value);
      this.setState({ lista: listaRecuperada });
    });
    await AsyncStorage.getItem("contador").then((value) => {
      this.setState({ contador: Number(value) })
    });
  }

  async componentDidUpdate() {
    let listaGravar = JSON.stringify(this.state.lista)
    await AsyncStorage.setItem("lista", listaGravar);
    await AsyncStorage.setItem("contador", String(this.state.contador));
    
  }

  gravarTarefa() {
    if (this.state.input !== '') {
      let lista = this.state.lista;
      let indice = this.state.contador;

      lista.push({
        id: indice,
        nome: this.state.input
      });

      indice++;

      this.setState({ contador: indice });

      this.setState({ input: '' })
      Keyboard.dismiss();
    } else {
      Alert.alert("Seu orelha...", "Preecha uma tarefa antes de adicionar!");
    }

  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerTitle}>
          <Text style={styles.title}>Pra Fazer, Zeh!</Text>
        </View>
        <View style={styles.header}>
          <TextInput
            value={this.state.input}
            onChangeText={(texto) => this.setState({ input: texto })}
            style={styles.textInput}
          />
          <TouchableOpacity
            onPress={this.gravarTarefa}
            style={styles.button}
          >
            <Text style={styles.buttonText}> + </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.list}>
          <FlatList
            keyExtractor={(item) => item.id}
            data={this.state.lista}
            renderItem={({ item }) => <Lista data={item} lista={this.state.lista} />}
            extraData={this.state}
          />
        </View>
      </SafeAreaView>
    );
  }
}

class Lista extends Component {
  render() {
    return (
      <View style={styles.listItem}>
        <TouchableOpacity
          onLongPress={() => {
            Alert.alert(
              "Status da tarefa",
              "A tarefa foi realizada?",
              [
                {
                  text: "Lógico!",
                  onPress: () => {
                    let listaAtualizada = this.props.lista;
                    let index = listaAtualizada.indexOf(this.props.data);
                    listaAtualizada.splice(index, 1);
                    this.setState({ lista: listaAtualizada })
                  },
                },
                {
                  text: "Não, perae...",
                  onPress: () => { },
                },
              ]
            );
          }}
        >
          <Text style={styles.tarefa}>{this.props.data.nome}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerTitle: {
    backgroundColor: '#ff9900'
  },
  title: {
    marginVertical: 20,
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    color: "#fff"
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    width: larguraTela,
    margin: 20
  },
  textInput: {
    borderColor: '#ff9900',
    borderWidth: 1,
    borderRadius: 10,
    width: larguraTela / 1.5
  },
  button: {
    backgroundColor: '#ff9900',
    borderRadius: 10,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  buttonText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: "#FFF"
  },
  list: {
    marginVertical: 10
  },
  listItem: {
    marginVertical: 2,
    marginHorizontal: 15,
    borderColor: "#ddd",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5
  },
  tarefa: {
    fontSize: 20,
    color: '#999'
  }
});
