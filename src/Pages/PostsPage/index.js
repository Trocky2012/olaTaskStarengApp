import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import api from './PostServices/api';
import Posts from './Posts';

export default function PostsPage (){

    const navigation = useNavigation();

    return(
      <View style={styles.container}>
          <Text>Posts</Text>
          <TouchableOpacity style={styles.botao} onPress={()=> navigation.goBack()}>
            <Text style={styles.botaoTexto}>Voltar</Text>
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
        backgroundColor: '#09A600',
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
