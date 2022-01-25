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
      lista: [

      ]
    };
    this.gravarTarefa = this.gravarTarefa.bind(this);
  }

  async componentDidMount(){
    
    await AsyncStorage.getItem("lista").then((value)=>{
      let listaRecuperada = JSON.parse(value);
      this.setState({lista:listaRecuperada});
    });
  }

  async componentDidUpdate() {
    let listaGravar = JSON.stringify(this.state.lista)
    await AsyncStorage.setItem("lista", listaGravar);
  }

  gravarTarefa() {
    let lista = this.state.lista;
    let indice = lista.length;

    lista.push({
      id: indice + 1,
      nome: this.state.input
    });

    this.setState({ input: '' })
    Keyboard.dismiss();

  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Pra Fazer, Zeh!</Text>
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
            key={this.state.lista.id}
            data={this.state.lista}
            renderItem={({ item }) => <Lista data={item} />}
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
                  text: "Sim",
                  onPress: () => {
                    let elemento = this.props.data;
                    alert(this.props.data.indexOf(elemento));
                  },
                },
                {
                  text: "Não",
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
  title: {
    marginVertical: 20,
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    color: "#ff9900"
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    width: larguraTela,
    marginLeft: 20,
    marginRight: 20
  },
  textInput: {
    borderBottomColor: '#ff9900',
    borderBottomWidth: 1,
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
    marginVertical: 10,
    marginHorizontal: 15,
    borderBottomColor: "#ddd",
    paddingVertical: 10,
    borderBottomWidth: 1
  },
  tarefa: {
    fontSize: 20,
    color: '#999'
  }
});
