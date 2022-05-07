import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import { useNavigation } from '@react-navigation/native';

export default function Home(){

    const navigation = useNavigation();

    return(
        <View style={styles.container}>
            <Text>Login</Text>
            <TouchableOpacity style={styles.botao} onPress={()=> navigation.navigate('PostsPage')}>
              <Text style={styles.botaoTexto}>Entrar</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    botao:{
        width:300,
        backgroundColor: '#09A6FF',
        margin:15,
        padding: 10,
        borderRadius:10
    
      },
      botaoTexto:{
        textAlign: 'center',
        fontSize:18,
        color: '#FFF'
      }
})