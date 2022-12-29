import React, {Component} from 'react';
import {View, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, Modal, Dimensions} from 'react-native';

import postApi from '../PostServices/postApi';

class Tasks extends Component{

constructor(props){
    super(props);
    this.state = {
        tasksOfThePost: [],
        specificPostModal:false,
        hideTask:false,
        details:false,
        loadingToDeleteTask:false,
    };
}

setTaskStatus(status){
  // for(var i = 1; i < statusArray.length; i++) {
  //   if(statusArray[i]==status){
  //     this.setPlaceOfStatus(i);
  //   }
  // }
  this.setState({details: !this.state.details});
}

askToDeleteThisTaskAndHideCard(id){

  Alert.alert(
    'DETELE TASK',
    'Are you sure you want to delete this task?',
    [
      // { text: 'OK', onPress: () => this.setState({newLoginModal:false}) },
      { text: 'OK', onPress: () => this.executeFunctionToDeleteCard(id) },
      { text: 'Cancel' },
    ],
    {cancelable: false},
    );

}

async executeFunctionToDeleteCard(id) {
  this.setState({ loadingToDeleteTask:true });
  try{

    //const getPost = 'http://192.168.1.11:8080/tasks/'+id.toString();
    //const getPost = 'https://ola-task.herokuapp.com/tasks/'+id.toString();
    const getPost = 'https://timing-control.herokuapp.com/tasks/'+id.toString();

    await postApi.delete(getPost);

  }catch(error) {
    Alert.alert(
      'Sorry,',
      'We could not coplete the request.\n\nIt will be fixed soon.\n\nError to delete task.',
      [{ text: 'OK'}],
      {cancelable: false},
    );
    console.log('ERROR: ' + error);
  }
  this.setState({ 
    loadingToDeleteTask:false,
    hideTask:true
   });
  
}

    render(){
        const { id, title, description, update_time, status, comments} = this.props.data;
        return(
          <View>
            {this.state.hideTask ? <View></View> : 

              <View style={styles.card}>

                { !this.state.details ? 
                <View style={{borderBottomWidth:0.5,borderColor:'#09A6FF', marginBottom:8, flexDirection:'row', 
                justifyContent:'space-between', alignItems:'center'}}>
                    <Text style={styles.titulo}>{title}</Text>
                    <Text style={{backgroundColor:'#FFF', color:'#09A6FF', fontWeight:'700', borderRadius:20, 
                                  fontSize:14, padding:10, marginRight:18, marginBottom:-10}} onPress={()=>this.setTaskStatus(status)}> 
                                  Details
                    </Text>
                </View>
              
              :
                <View>
                  <View style={{borderBottomWidth:0.5,borderColor:'#09A6FF', marginBottom:8, flexDirection:'row', 
                                justifyContent:'space-between', alignItems:'center'}}>
                      <Text style={styles.titulo}>{title}</Text>
                      {/* <Text style={{backgroundColor:'#FFF', color:'#09A6FF', fontWeight:'700', borderRadius:10, fontSize:12, padding:5, marginRight:18}}>{status}</Text> */}
                      {status=="DONE" ? 
                        <Text onPress={()=>this.setTaskStatus(status)} 
                              style={{backgroundColor:'#32CD32', color:'#FFF', fontWeight:'700', borderRadius:30, fontSize:15, padding:15, marginRight:20, marginBottom:-25}}>{status}</Text> :
                        <Text onPress={()=>this.setTaskStatus(status)}
                              style={{backgroundColor:'#FFF', color:'#09A6FF', fontWeight:'700', borderRadius:20, fontSize:14, padding:10, marginRight:18, marginBottom:-10}}>{status}</Text>
                      }
                  </View>

                    <View style={{flex:1}}>
                      <Text style={styles.texto}>Description: {description}</Text>

                    </View>
                    <Text style={styles.texto}>Last Update: {update_time}</Text>
                    <View style={{borderBottomWidth:0.5,borderColor:'#09A6FF', marginBottom:8, flexDirection:'row', 
                                justifyContent:'space-between', alignItems:'center'}}>
                      <Text style={{fontSize: 12, padding: 10}}>Comments: {comments}</Text>
                      
              {  status.toString()!="CREATED" ? 
                        // <View style={{alignSelf:'center', marginRight:27, width:55, height:55, backgroundColor:'#FFf', 
                        //             borderWidth:1, borderColor:'#eF2f28', borderRadius:30, paddingBottom:-10}}>
                        //   <View style={{alignItems: 'center', justifyContent: 'center', flex:1}}>
                        //     <ActivityIndicator color="#eF2f28" size={30}/>
                        //     <Text style={{color:'#eF2f28', fontSize:7}}>wait</Text>
                        //   </View>
                        // </View>
                      <View></View>
                    :
                    
                      <TouchableOpacity style={{backgroundColor:'#eF2f28', borderRadius:15, marginRight:18, marginTop:-0}} 
                        onPress={()=>this.askToDeleteThisTaskAndHideCard(id)}>
                            <Text style={{color:'#fff', fontWeight:'700', padding:5}}>Remove</Text>
                      </TouchableOpacity>
                      
                  }

                    
                  </View>
                </View>
              }

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