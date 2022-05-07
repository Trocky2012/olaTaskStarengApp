import React, {Component} from 'react';
import {View, Text, StyleSheet, Keyboard, Alert, TouchableOpacity, TextInput, Modal, Dimensions, ScrollView} from 'react-native';

import postApi from '../PostServices/postApi';

var statusArray =[
  "QUESTIONED",
  "CREATED",
  "AGREED",
  "IN_PROGRESS",
  "DONE"
  // "NOT_DONE",
  // "CANCELLED"
]
//var placeOfStatus = 1;

class Tasks extends Component{

constructor(props){
    super(props);
    this.state = {
        tasksOfThePost: [],
        specificPostModal:false,
        details:false,
        seed:1,
        placeOfStatus:1,
        modalToFinishsubTask:false,
        inputDecriptionToFinishTask:'',
        showCommentsFromApi:true
    };
    this.setPlaceOfStatus = this.setPlaceOfStatus.bind(this);
    this.setInputDecriptionToFinishTask = this.setInputDecriptionToFinishTask.bind(this);
}

setPlaceOfStatus(number){   this.setState({placeOfStatus: number}); }
setInputDecriptionToFinishTask(text){   this.setState({inputDecriptionToFinishTask: text}); }

setTaskStatus(status, comments){
  if(this.state.showCommentsFromApi){
    this.setInputDecriptionToFinishTask(comments)
    this.setState({showCommentsFromApi:false})
    
  }
    for(var i = 1; i < statusArray.length; i++) {
      if(statusArray[i]==status){
        this.setPlaceOfStatus(i);
      }
    }
    this.setState({details: !this.state.details});
    // alert(status);
}

askToGoToNextStatus(id,status){
  // if(statusArray[this.state.placeOfStatus+1] == 'DONE' || status == "IN_PROGRESS"){
  //   this.setState({modalToFinishsubTask: true});
  // }else{
    Alert.alert(
      'NEXT STATUS',
      '\nTake it to the next status?\n\n- '+statusArray[this.state.placeOfStatus+1],
      [
        // { text: 'OK', onPress: () => this.setState({newLoginModal:false}) },
        { text: 'OK', onPress: () => this.executeGoToNextStatus(id) },
        { text: 'Cancel' },
      ],
      {cancelable: false},
      );
  // }


}

async saveDescriptionAndGoToDone(id,title,description,comments,status,start_time,urlPhoto){
  try{
    this.setState({modalToFinishsubTask: false});
    if(comments!=''){
      const newData = 
          {
            "title": title.toString(),
            "description": description.toString(),
            "comments": comments.toString(),
            "status": status.toString(),
            "start_time": start_time.toString(),
            "urlPhoto": urlPhoto.toString()
          };
          // const path = 'http://192.168.0.111:8080/tasks/'+id.toString();
          const path = 'https://ola-task.herokuapp.com/tasks/'+id.toString();
          await postApi.put(path,newData);
          this.setState({details: false});
          this.setState({showCommentsFromApi:true})

          // const getPost = 'http://192.168.0.111:8080/tasks/'+id.toString()+'/next-status';
          const getPost = 'https://ola-task.herokuapp.com/tasks/'+id.toString()+'/next-status';
          // const getPost = 'http://192.168.0.23:8080/tasks/'+id.toString();
          await postApi.put(getPost);

          this.setPlaceOfStatus(4)

          

    }
  }catch(error) {
    Alert.alert(
      'Sorry,',
      'We could not coplete the request.\n\nError to uptade -subtaskAssigned.',
      [{ text: 'OK'}],
      {cancelable: false},
    );
    console.log('ERROR: ' + error);
  }

        
}

async executeGoToNextStatus(id) {
  
  try{

    // const getPost = 'http://192.168.0.111:8080/tasks/'+id.toString()+'/next-status';
    const getPost = 'https://ola-task.herokuapp.com/tasks/'+id.toString()+'/next-status';

    await postApi.put(getPost);

    //this.handleRefreshing();
    if(this.state.placeOfStatus < statusArray.length-1){
      this.setPlaceOfStatus(this.state.placeOfStatus+1)
    }

  }catch(error) {
    Alert.alert(
      'Sorry,',
      'We could not coplete the request.\n\nError to delete -subtaskAssigned.',
      [{ text: 'OK'}],
      {cancelable: false},
    );
    console.log('ERROR: ' + error);
  }

}

handleRefreshing = () => {
  this.setState(
    {
      seed: this.state.seed+1,
    },
    () => {
      if(this.state.placeOfStatus < statusArray.length-1){
        this.setPlaceOfStatus(this.state.placeOfStatus+1)
      }
      
    }
  );
}


    render(){
        const { id, title, description, start_time, status, update_time} = this.props.data;

        return(
            <View style={styles.card}>
              {!this.state.details ? 
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
                    {/* <Text style={{backgroundColor:'#FFF', color:'#09A6FF', fontWeight:'700', borderRadius:20, 
                                  fontSize:14, padding:10, marginRight:18, marginBottom:-10}}> 
                                  {statusArray[this.state.placeOfStatus]}
                                  status
                    </Text> */}
                  {this.state.showCommentsFromApi ? 

                    status=="DONE" ? 
                        <Text style={{backgroundColor:'#32CD32', color:'#FFF', fontWeight:'700', borderRadius:30, fontSize:15, padding:15, 
                        marginRight:20, marginBottom:-25}}>{status}</Text> :
                        <Text style={{backgroundColor:'#FFF', color:'#09A6FF', fontWeight:'700', borderRadius:20, fontSize:14, padding:10, 
                        marginRight:18, marginBottom:-10}}>{status}</Text>
                    
                    : 

                    this.state.placeOfStatus==4? 
                        <Text style={{backgroundColor:'#32CD32', color:'#FFF', fontWeight:'700', borderRadius:30, fontSize:15, padding:15, 
                        marginRight:20, marginBottom:-25}}>{statusArray[this.state.placeOfStatus]}</Text> :
                        <Text style={{backgroundColor:'#FFF', color:'#09A6FF', fontWeight:'700', borderRadius:20, fontSize:14, padding:10, 
                        marginRight:18, marginBottom:-10}}>{statusArray[this.state.placeOfStatus]}</Text>
                  }
                </View>
                <View style={{flex:1}}>
                  <Text style={{fontSize: 12, padding: 10}}>Description: {description}</Text>

                </View>

                <View style={{borderBottomWidth:0.5,borderColor:'#09A6FF', marginBottom:8, paddingBottom:10, flexDirection:'row', 
                              justifyContent:'space-between', alignItems:'center'}}>
                    <Text style={{fontSize: 12, padding: 10}}>Last Update: {update_time}</Text>
                      {/* {this.state.showCommentsFromApi ? 
                          <Text style={{fontSize: 12, padding: 10, width:'50%'}}>Comments: {this.state.inputDecriptionToFinishTask}</Text>
                      : 
                          <Text style={{fontSize: 12, padding: 10, width:'50%'}}>Comments: {comments}</Text>
                      } */}
                    <Text></Text>
                    {status == 'DONE' || this.state.placeOfStatus > 3 ? 
                      <View></View>
                    :
                      <View>
                        <Text style={{fontSize: 9, padding: 10, paddingRight:30}}>Click to update status:</Text>
                        <TouchableOpacity style={{backgroundColor:'#2F9F4F', borderRadius:15, marginRight:18, marginTop:-0}} 
                            onPress={()=>this.askToGoToNextStatus(id,status)}>
                                <Text style={{color:'#fff', fontWeight:'700', padding:7, fontSize:11}}> NEXT STATUS {' >'}</Text>
                        </TouchableOpacity>
                      </View>
                    }
                </View>
              </View>
              }





 {/* ------------------------------------------------------------------------------------------------------------------------------- */}







            {/* <Modal animationType='slide' transparent={true} visible={this.state.modalToFinishsubTask} style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
                
                <TouchableOpacity   
                transparent={true} style={{height:'62%', width:'100%'}}>
                </TouchableOpacity>

                <View style={{height:'38%', width:Dimensions.get("screen").width, backgroundColor:'#FFf', borderTopLeftRadius:40, borderTopRightRadius:40}}>
                  <ScrollView style={{flex:1, borderTopLeftRadius:40, borderTopRightRadius:40}}>
                    <View style={{alignSelf:'flex-start', borderTopLeftRadius:30, borderTopRightRadius:30, flexDirection:'row', justifyContent:'space-between', alignItems:'center', width:Dimensions.get("screen").width, 
                                  borderBottomWidth:1,backgroundColor:'#2F9F4F', borderColor:'#2F9F4F', padding:5}}>

                      <Text style={{padding:10, fontSize:17,color:'#fff', fontWeight:'600', width:Dimensions.get("screen").width/1.3}}>Has it been already done?</Text>
                      <TouchableOpacity onPress={ () => this.setState({modalToFinishsubTask:false}) }
                                      style={{width:38, height:38, borderWidth:1, alignItems:'center',
                                      justifyContent:'center',borderColor:'#fff', borderRadius:19, marginRight:15}} >
                        <Text style={{marginTop:0,fontSize:18, fontWeight:'100', color:'#fff'}}> X </Text>
                      </TouchableOpacity>
                    </View>

                      {this.state.placeOfStatus==4 ? 
                          <Text styles={{alignSelf:'center'}}>This subtask has been done!</Text>
                      :
                          <View style={{alignSelf:'center'}}>
                            <TextInput 
                              style={styles.inputsMyTasksBigger}
                              placeholder="comments (optional)..."
                              underlineColorAndroid="transparent"
                              onChangeText={this.setInputDecriptionToFinishTask}
                              blurOnSubmit={true}
                              onSubmitEditing={()=>{Keyboard.dismiss()}}
                              multiline={true}
                            />
                            <Text style={{alignSelf:'center', color:'#000', fontSize:12, margin:3, padding:5, paddingTop:18}}> MESSAGE </Text>
                            <TouchableOpacity style={styles.botaoVoltarALista} onPress={()=>this.saveDescriptionAndGoToDone(id, title, description, this.state.inputDecriptionToFinishTask, "DONE", start_time, "") } >
                              <Text style={{color:'#32CD32', fontSize: 16, fontWeight:'700', margin:3, padding:3}}>DONE</Text>
                            </TouchableOpacity>
                          </View>
                      }
                  </ScrollView>


                </View>
            </Modal> */}




 {/* ------------------------------------------------------------------------------------------------------------------------------- */}




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
      alignSelf:'center',
      width:200,
      borderWidth:1,
      borderColor:'#32CD32',
      marginTop:27,
      padding: 0,
      borderRadius:10,
      alignItems:'center',
      justifyContent:'center'
  
    },
    botaoTexto:{
      textAlign: 'center',
      color: '#FFF'
    },
    inputsMyTasksBigger:{
      width:350,
      height:80,
      borderWidth:1,
      borderColor:'#000',
      color:'#6495ED',
      borderRadius:10,
      margin:10,
      fontSize:15,
      padding:10,
      alignContent:'flex-start',
      justifyContent:'flex-start'
    },
  });

export default Tasks;