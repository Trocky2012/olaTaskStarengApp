import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ActivityIndicator, Modal, Dimensions} from 'react-native';

class Tasks extends Component{

constructor(props){
    super(props);
    this.state = {
        tasksOfThePost: [],
        details:false,
        specificPostModal:false
    };
    }

    setOpenCloseTask(){
      this.setState({details: !this.state.details});
    }

    render(){
        const { id, title, description, update_time, status} = this.props.data;
        return(
            <View style={styles.card}>
                {!this.state.details ? 
                <View style={{borderBottomWidth:0.5,borderColor:'#09A6FF', marginBottom:8, flexDirection:'row', 
                justifyContent:'space-between', alignItems:'center'}}>
                    <Text style={styles.titulo}>{title}</Text>
                    <Text style={{backgroundColor:'#FFF', color:'#09A6FF', fontWeight:'700', borderRadius:20, 
                                  fontSize:14, padding:10, marginRight:18, marginBottom:-10}} onPress={()=>this.setOpenCloseTask()}> 
                                  Details
                    </Text>
                </View>
              
              :
              <View>
                <View style={{borderBottomWidth:0.5,borderColor:'#09A6FF', marginBottom:8, flexDirection:'row', 
                justifyContent:'space-between', alignItems:'center'}}>
                    <Text style={styles.titulo}>{title}</Text>
                    {/* <Text style={{backgroundColor:'#FFF', color:'#09A6FF', fontWeight:'700', borderRadius:20, 
                                  fontSize:14, padding:10, marginRight:18, marginBottom:-10}}> 
                                  {status}
                    </Text> */}
                    {status=="DONE" ? 
                        <Text onPress={()=>this.setOpenCloseTask()}
                              style={{backgroundColor:'#32CD32', color:'#FFF', fontWeight:'700', borderRadius:30, fontSize:15, padding:15, marginRight:20, marginBottom:-25}}>{status}</Text> :
                        <Text onPress={()=>this.setOpenCloseTask()}
                              style={{backgroundColor:'#FFF', color:'#09A6FF', fontWeight:'700', borderRadius:20, fontSize:14, padding:10, marginRight:18, marginBottom:-10}}>{status}</Text>
                      }
                </View>

                <View style={{flex:1}}>
                  <Text style={{fontSize: 12, padding: 10, marginTop:10}}>Description: {description}</Text>
                </View>
                <Text style={styles.texto}>Last Update: {update_time}</Text>

                {/* <View style={{borderBottomWidth:0.5,borderColor:'#09A6FF', marginBottom:8, paddingBottom:10, flexDirection:'row', 
                              justifyContent:'space-between', alignItems:'center'}}>

                    <Text style={styles.texto}>Comments: {comments}</Text>
                </View> */}
              </View>
              }
            </View>
        )
    }

}

const styles = StyleSheet.create({
    card:{
      width:Dimensions.get("screen").width,
      shadowColor: '#000',
      backgroundColor: '#efefef',
      shadowOffset: {width:0, height: 1},
      shadowOpacity: 0.8,
      marginBottom: 12,
      shadowRadius: 6,
      borderRadius: 40,
      elevation: 4,
      padding:10
    },
    specificPostModal:{
      flex:1,
      width:Dimensions.get("screen").width,
      backgroundColor:'#efefef',
      justifyContent:'center',
      alignItems:'center'
    },
    titulo:{
      width: 240,
      fontSize: 17,
      marginLeft:5,
      padding: 5
    },
    texto:{
      fontSize: 12,
      padding: 10,
    },
    capa:{
      height: 250,
      zIndex: 2,
    },
    Areabotao:{
      alignItems: 'flex-end',
      marginTop: -40,
      zIndex: 9
    },
    botao:{
      width: 100,
      backgroundColor: '#09A6FF',
      opacity: 1,
      padding: 10,
      borderTopLeftRadius: 5,
      borderBottomLeftRadius: 5,
  
    },
    botaoVoltarALista:{
      width:200,
      borderWidth:1,
      borderColor:'#6495ED',
      marginTop:60,
      padding: 0,
      borderRadius:10,
      alignItems:'center',
      justifyContent:'center'
  
    },
    botaoTexto:{
      textAlign: 'center',
      color: '#FFF'
    }
  });

export default Tasks;