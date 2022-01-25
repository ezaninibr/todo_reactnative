import React,{Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';

export default class Lista extends Component{

    constructor(props){
        super(props);
        this.state = {
            lista: this.props.data
        };
    }

    render(){
        return(
            <Text>{this.state.lista.nome}</Text>
        );
    }
}