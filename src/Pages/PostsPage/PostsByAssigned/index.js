import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ActivityIndicator, Modal, Dimensions, Keyboard, ScrollView, Alert, TextInput, KeyboardAvoidingView} from 'react-native';

import {Picker} from '@react-native-picker/picker';
import { format } from "date-fns";

import postApi from './PostServices/postApi';
import Tasks from './Tasks';

var taskTitle=[];
var taskDescription=[];
var userName='';

class PostsByAssigned extends Component{

  constructor(props){
    super(props);
    this.state = {
      specificPost: [],
      tasksOfThePost: [],
      specificPostModal:false,
      openEditModal:false,
      loadMyPosts: false,

      postTitle:'',
      postDescription:'',
      postType:'',
      postStatus:'',
      postDate:'',
      //taskTitle: [],
      taskTitleWriting:'',
      //taskDescription: [],
      taskDescriptionWriting:'',
      taskPosition:[],
      modalToFinishsubTask: false,
      assignUser:[]
    };

    this.setPostTitle = this.setPostTitle.bind(this);
    this.setPostDescription = this.setPostDescription.bind(this);
    this.setPostType = this.setPostType.bind(this);
    this.setPostStatus = this.setPostStatus.bind(this);
    this.setPostDate = this.setPostDate.bind(this);

    this.setTaskTitleWriting = this.setTaskTitleWriting.bind(this);
    this.setTaskDescriptionWriting = this.setTaskDescriptionWriting.bind(this);
    this.setTaskPosition = this.setTaskPosition.bind(this);
    

  }

  setPostTitle(text){    this.setState({postTitle: text});  }
  setPostDescription(text){    this.setState({postDescription: text});  }
  setPostType(text){    this.setState({setPostType: text});  }
  setPostStatus(text){    this.setState({postStatus: text});  }
  setPostDate(text){    this.setState({postDate: text});  }
  setShowAllSubTasks(visibility){    this.setState({showAllSubTasks: visibility});  }
  setTaskTitleWriting(text){    this.setState({taskTitleWriting: text});  }
  setTaskDescriptionWriting(text){    this.setState({taskDescriptionWriting: text});  }
  setTaskPosition(text){    this.setState({taskPosition: text});  }


  askToPUTPostToNextStatus(postId){

    Alert.alert(
      'DONE',
      '\nFinish this task?\n\nYou will not be able to change it later',
      [
        // { text: 'OK', onPress: () => this.setState({newLoginModal:false}) },
        { text: 'OK', onPress: () => this.executePostToNextStatus(postId) },
        { text: 'Cancel', style:'cancel' },
      ],
      {cancelable: false},
    ); 

  }

  async executePostToNextStatus(postId){
    this.setState({loadMyPosts: true});
    try{

      await postApi.put('posts/'+postId.toString()+'/next-status');
      
      this.setPostStatus('DONE')

      Alert.alert(
        'CONGRATS,',
        '\nWe have sent the information to the task owner.\n\nPlease, update your list to check its new status',
        [{ text: 'OK', onPress: ()=>this.setState({loadMyPosts: false,specificPostModal:false})}],
        {cancelable: false},
      );
      
      this.setState({loadMyPosts: false,specificPostModal:false})
      
    }catch(error) {
      this.setState({loadMyPosts: false});
      this.setState({specificPostModal:false})
      Alert.alert(
        'Sorry,',
        'We could not coplete the request.\n\nIt will be fixed soon.',
        [{ text: 'OK'}],
        {cancelable: false},
      );
      console.log('ERROR: ' + error);
    }
  }

  async fcnSpecificPost(postId,assignedUserId, visibility){

    this.setState({loadMyPosts: true});
    // if(visibility){
      try{
          const getPost = 'posts/'+postId.toString();
          const response = await postApi.get(getPost);
          this.setState({
            specificPost: response.data,
            loading: false
          });
          

          const getTasksOfPost = 'tasks/get-by-post-id/'+postId.toString();
          const responsetasks = await postApi.get(getTasksOfPost);
          this.setState({
            tasksOfThePost: responsetasks.data,
            loading: false
          });
          // userName = this.state.specificPost.user.name.toString();
          userName = this.state.specificPost.user_name.toString();

          //Bring Assigned User
          if(assignedUserId!=null){
            const responseAssignedUser = await postApi.get('users/'+assignedUserId.toString());
            this.setState({
              assignUser: responseAssignedUser.data,
            });
          }

          this.setState({specificPostModal:visibility})
          
      }catch(error) {
        this.setState({specificPostModal:false})
        Alert.alert(
          'Sorry,',
          'We could not coplete the request.\n\nPlease, check your device status connections.',
          [{ text: 'OK'}],
          {cancelable: false},
        );
        console.log('ERROR: ' + error);
      }
      // alert('user: '+ this.state.specificPost.user.firstName.toString())
    // }else{
    //   this.setState({specificPostModal:visibility})
    // }
    taskTitle=[];
    taskDescription=[];
    this.setState({loadMyPosts: false});
    
  }

  fcnCheckOptions(){
    Alert.alert(
      'OPTIONS:',
      'You would like to edit this task?',
      [
        { text: 'Edit  ', onPress: () => this.OpenEditModal()  },
        { text: '  Cancel', onPress: () => this.setState({openEditModal:false}), style:'cancel' },
      ],
      {cancelable: false},
    );

  }

   fcnEditModal(visibility){
     // Cleaning tasks_aux
    // for(var i = 0; i < taskTitle.length; i++) {
    //   taskTitle.pop();
    //   taskDescription.pop();
    // }
    taskTitle=[];
    taskDescription=[];
    this.setState({openEditModal:visibility})
  }

  async OpenEditModal(){
    // this.setState({openEditModal:true});
    try{

      for(var i = 0; i < this.state.tasksOfThePost.length; i++) {
        taskTitle.push(this.state.tasksOfThePost[i].title);
        taskDescription.push(this.state.tasksOfThePost[i].description);
      }


      this.setState({
        postTitle:this.state.specificPost.title,
        postDescription:this.state.specificPost.description,
        postType:this.state.specificPost.type,
        postStatus:this.state.specificPost.status,
        postDate:this.state.specificPost.date,
        taskTitleWriting:'',
        taskDescriptionWriting:'',

        openEditModal:true
      })
    }catch(error) {
      console.log('ERROR: ' + error);
    }

    //this.setState({openEditModal:true})
  }

  saveTaskTitleAndDescription(){
      
    try{
      if(this.state.taskTitleWriting!="" && this.state.taskDescriptionWriting!=""){
        // const finalNewText = (taskTitle.length+1).toString()+". "+ this.state.taskTitleWriting;
        const finalNewText = this.state.taskTitleWriting;
        taskTitle.push(finalNewText);
        taskDescription.push(this.state.taskDescriptionWriting);
        this.setTaskTitleWriting("");
        this.setTaskDescriptionWriting("");
      }else{
        Alert.alert(
          'Incorrect',
          'Prease, check if the task or its description is empty and try again.',
          [
            { text: 'OK', onPress: () => ({}) }
          ],
          {cancelable: false},
        );
      }
    }catch(error) {
      console.log('ERROR: ' + error);
    }
}

  setTaskTitle(text){
    try{
      if(text!=""){
        taskTitle.push(text);
      }
    }catch(error) {
      console.log('ERROR: ' + error);
    }
  }
  setTaskDescription(text){
    try{
      if(text!=""){
        taskDescription.push(text);
      }
    }catch(error) {
      console.log('ERROR: ' + error);
    }
  }

  fcnSavePostChanges(id, assignedUserId){
    try{
        Alert.alert(
          'SAVE CHANGES',
          'Are you sure you want to save the changes for this task?',
          [
            // { text: 'OK', onPress: () => this.setState({subTasksModal:true}) },
            { text: 'OK', onPress: () => this.SavePostChanges(id, assignedUserId) },
            { text: 'Cancel', onPress: () => this.fcnEditModal(false), style:'cancel' },
          ],
          {cancelable: false},
        );
      
    }catch(error) {
      console.log('ERROR: ' + error);
    }
  }

  async SavePostChanges(id, assignedUserId){
    
    try{
      this.setState({loadMyPosts: true});
        const newData = 
        {
          "title": this.state.postTitle,
          "description": this.state.postDescription,
          "type": this.state.postType,
          "status": this.state.postStatus
        };
        const updatePostPath = 'posts/'+(id.toString());
        await postApi.put(updatePostPath,newData);

        const numberOfTasksInit= this.state.tasksOfThePost.length;
        const numberOfTasksend= taskTitle.length;
        if(numberOfTasksInit < numberOfTasksend){
          for(var i = numberOfTasksInit; i < numberOfTasksend; i++) {
              const newTaskData = 
              {
                "title": taskTitle[i],
                "description": taskDescription[i],
                "post": {"id": id.toString()}
              };
              await postApi.post('tasks',newTaskData);
            
          }
        }

        //cleaning task_aux
        // for(var i = 0; i < taskTitle.length; i++) {
        //   taskTitle.pop();
        //   taskDescription.pop();
        // }
        taskTitle=[];
        taskDescription=[];

        //Check final pages (what will be opened or not)
        this.fcnSpecificPost(id,assignedUserId,true);

        this.setState({loadMyPosts: false});
        this.setState({openEditModal: false});
        this.setState({specificPostModal: false});
      // this.setState({subTasksModal:true})

    }catch(error) {
      this.setState({loadMyPosts: false});
      alert('Api connection error. Please, try again soon. Post '+(id.toString()))
      console.log('ERROR: ' + error);
    }
  }





   
  render(){

    const { id, title, description, type, date, status, assignedUserId } = this.props.data;
    if(this.state.loading){
      return(
        <View style={{alignItems: 'center', justifyContent: 'center', flex:1}}>
          <ActivityIndicator color="#09A6FF" size={40}/>
        </View>
      )
    }else{
      return(
        <ScrollView>






 {/* ------------------------------------------------------------------------------------------------------------------------------- */}







          {/* INSIDE ONE POST MODAL */}
            <Modal animationType='slide' visible={this.state.specificPostModal}>
              <View style={styles.specificPostModal}>
                {/* ONE POST - TITLE */}
                <View style={{flexDirection:'row', alignItems:'center',justifyContent:'space-between', width:Dimensions.get("screen").width, 
                              borderBottomWidth:1,borderColor:'#09A6FF', marginBottom:0, marginTop:15, padding:5}}>
                  <TouchableOpacity onPress={()=>this.fcnSpecificPost(id,assignedUserId,false)} 
                                  style={{width:38, height:38, borderWidth:1, alignItems:'center',
                                  justifyContent:'center',borderColor:'#fF2f28', borderRadius:19, marginLeft:5}} >
                    <Text style={{marginTop:0, fontSize:10, color:'#FF2f28'}}>Back</Text>
                  </TouchableOpacity>
                  <Text style={{alignSelf:'center',padding:10, fontSize:20, fontWeight:'600', width:Dimensions.get("screen").width/1.3}}>{this.state.specificPost.title}</Text>

                </View>
                <View style={{flexDirection:'row', justifyContent:'space-between', width:Dimensions.get("screen").width}}>
                    <View style={styles.AreaCreatedByUserIsideAPost}>
                      <View style={styles.botaoCreatedByUserIsideAPost} >
                        <Text style={styles.botaoTextoCreatedByUser}>Created by: {userName}</Text>
                      </View>
                    </View>
                    <View style={styles.AreaCreatedByUserIsideAPost}>
                      <View style={styles.botaoCreatedByUserIsideAPost2} >
                        <Text style={styles.botaoTextoCreatedByUser}>Assigned to: {this.state.assignUser.firstName}  {this.state.assignUser.lastName}</Text>
                      </View>
                    </View>
                </View>
                <View style={{flexDirection:'row', alignItems:'center',justifyContent:'space-around', width:Dimensions.get("screen").width, 
                              marginBottom:5, marginTop:1, padding:5}}>
                    <Text style={{fontSize:12, alignSelf:'center'}}>TYPE</Text>
                    <View>
                      <Text style={{fontSize:9, alignSelf:'center'}}> Last Update: </Text>
                      <Text style={{fontSize:11, alignSelf:'center'}}> {(this.state.specificPost.update_time)} </Text>
                    </View>
                    <Text style={{fontSize:12, alignSelf:'center'}}>STATUS</Text>

                </View>
                {/* ONE POST - TYPE AND AND LAST UPDATE */}
                <View style={{width:Dimensions.get("screen").width, alignItems:'center',justifyContent:'center', flexDirection:'row', 
                                justifyContent:'space-between', marginBottom:14, marginTop:5, paddingRight:20, paddingLeft:15, 
                                borderBottomWidth:1,borderColor:'#09A6FF', paddingBottom:20}}>
                  <Text style={{backgroundColor:'#6495ED', color:'#FFF', borderRadius:20, fontSize:12, padding:10}}>   {this.state.specificPost.type}   </Text>
                  <View>
                  {this.state.specificPost.status == 'DONE' ? 
                    <Text style={{backgroundColor:'#09A6FF', color:'#FFF', borderRadius:20, fontSize:13, padding:5}}>   {this.state.specificPost.status}   </Text>
                  :
                    status == 'CLOSED' ? 
                      <Text style={{backgroundColor:'#fF2f28', color:'#FFF', borderRadius:20, fontSize:13, padding:5}}>   {this.state.specificPost.status}   </Text>
                    :
                      <Text style={{backgroundColor:'#4f55ED', color:'#FFF', borderRadius:20, fontSize:13, padding:5}}>   {this.state.specificPost.status}   </Text>
                  }
                  
                  </View>
                </View>
                {/* ONE POST - DESCRIPTION */}
                <View style={{alignSelf:'center',width:Dimensions.get("screen").width, fontSize:12,  paddingBottom:8, backgroundColor:'#efefef', 
                             color:'#000', borderRadius:15, marginLeft:0}}>
                    <Text style={{alignSelf:'center',width:Dimensions.get("screen").width, fontSize:12,  padding:8, backgroundColor:'#efefef', color:'#000',
                    borderRadius:10,marginLeft:14}}>   DESCRIPTION   </Text>
                    <View style={{width:Dimensions.get("screen").width/1.04, alignSelf:'center', borderWidth:0.5, borderColor:'#C0C0C0', backgroundColor:'#FFF', borderRadius:15, marginBottom:12, padding:10}}>
                      <Text style={{fontSize:12, paddingBottom:6, marginLeft:2}}>- {this.state.specificPost.description}</Text>
                    </View>
                  {/* ONE POST - DATE */}
                    <Text style={{alignSelf:'center',width:Dimensions.get("screen").width, fontSize:12, padding:8, paddingTop:0, backgroundColor:'#efefef', color:'#000',
                  borderRadius:10,marginLeft:14}}>   DATE   </Text>
                    <View style={{width:Dimensions.get("screen").width/1.04, alignSelf:'center', borderWidth:0.5, borderColor:'#C0C0C0', backgroundColor:'#FFF', borderRadius:15, marginBottom:5, padding:10}}>
                      <Text style={{fontSize:12, paddingBottom:5, marginLeft:2}}>- {this.state.specificPost.date == null? "Negotiable" : format(new Date(this.state.specificPost.date), "MMMM do, yyyy - H:mma")}</Text>
                    </View>
                </View>
                {/* TASKS LIST OF ONE POST */}
                <Text style={{alignSelf:'center', fontSize:14, padding:8, backgroundColor:'#FFF', color:'#000', fontWeight:'700', borderTopLeftRadius:10, 
                borderTopRightRadius:10, marginLeft:0,marginBottom:1,marginTop:10, shadowRadius: 6, borderRadius: 5,  elevation: 4,shadowColor: '#000',  backgroundColor: '#FFF',
                shadowOffset: {width:0, height: 1}, shadowOpacity: 0.8, width:Dimensions.get("screen").width/1.2}}>   TASKS ( {this.state.tasksOfThePost.length} )   </Text>
                <FlatList
                  data={this.state.tasksOfThePost}
                  keyExtractor={item => item.id.toString() }
                  renderItem={ ({item}) => <Tasks data={item} /> }
                />

                {/* ONE POST - RETURN BUTTOM */}
                {this.state.specificPost.status=='DONE' || this.state.specificPost.status=='CLOSED' ? 
                  <View></View>
                :
                  <View style={{alignItems:'center',justifyContent:'center', width:Dimensions.get("screen").width, marginBottom:20, marginTop:0}}>
                    <TouchableOpacity style={styles.botaoVoltarALista} 
                    onPress={()=>this.askToPUTPostToNextStatus(id)}
                    // onPress={()=>this.setState({modalToFinishsubTask:true})}
                    >
                      <Text style={{color:'#32CD32', fontSize: 16, fontWeight:'700', margin:3, padding:3}}>DONE</Text>
                    </TouchableOpacity>
                  </View>
                }
                
              </View>
            </Modal>
          








{/* ------------------------------------------------------------------------------------------------------------------------------- */}









          {/*   EDIT POST MODAL   */}

          






{/* ------------------------------------------------------------------------------------------------------------------------------- */}









          {/* MAIN SCREEN OF MY TASKS - LIST OS POSTS*/}
          <View style={styles.card}>
          <View style={styles.AreaCreatedByUser}>
                <View style={styles.botaoCreatedByUser} >
                  <Text style={styles.botaoTextoCreatedByUser}>Assigned to me</Text>
                </View>
              </View>
          <View style={{borderBottomWidth:0.5,borderColor:'#09A6FF', marginBottom:10, flexDirection:'row', paddingRight:8,paddingLeft:2, 
                justifyContent:'space-between', alignItems:'center'}}>
            <Text style={styles.titulo}>{title}</Text>
              {status == 'DONE' ? 
                  <Text style={{backgroundColor:'#09A6FF', color:'#FFF', borderRadius:20, fontSize:13, padding:5}}>   {status}   </Text>
              :
                status == 'CLOSED' ? 
                 <Text style={{backgroundColor:'#fF2f28', color:'#FFF', borderRadius:20, fontSize:13, padding:5}}>   {status}   </Text>
                :
                
                  <Text style={{backgroundColor:'#4f55ED', color:'#FFF', borderRadius:20, fontSize:13, padding:5}}>   {status}   </Text>

              }
          </View>
          <View style={{marginBottom:12, marginTop:5, flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingRight:10, paddingBottom:5}}>
              <Text style={styles.texto}>{description}</Text>
              {type == 'MANUAL_SERVICES' ? 
                <Text style={{borderWidth:1,borderColor:'#6495ED', color:'#6495ED', borderRadius:20, fontSize:9, padding:4}}>{type}</Text>
              :
                <Text style={{borderWidth:1,borderColor:'#6495ED', color:'#6495ED', borderRadius:20, fontSize:12, padding:4}}>{type}</Text>
              }
          </View>
            <Text style={styles.texto}>Date: {date == null? "Open" : format(new Date(date), "MMMM do, yyyy - H:mma")}</Text>
            
            {/* <Image
            source={{ uri: foto }}
            style={styles.capa}
            /> */}

            {status=="CANCELLED" ? <View></View> :
                <View style={styles.Areabotao}>
                  <TouchableOpacity style={styles.botao} onPress={()=>this.fcnSpecificPost(id,assignedUserId,true)} >
                    <Text style={styles.botaoTexto}>INFO</Text>
                  </TouchableOpacity>
                </View>
            }

          </View>





 {/* ------------------------------------------------------------------------------------------------------------------------------- */}






        {/* <Modal animationType='slide' transparent={true} visible={this.state.modalToFinishsubTask} style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
            
            <TouchableOpacity  onPress={ () => this.setState({modalToFinishsubTask:false}) }
            transparent={true} style={{height:'65%', width:'100%'}}>
            </TouchableOpacity>

            <View style={{height:'35%', width:Dimensions.get("screen").width, backgroundColor:'#FFf', borderWidth:1, borderColor:'#09A6FF', borderTopLeftRadius:40, borderTopRightRadius:40}}>
              <View style={{flex:1, borderTopLeftRadius:40, borderTopRightRadius:40}}>
                <View style={{alignSelf:'flex-start', borderTopLeftRadius:30, borderTopRightRadius:30, flexDirection:'row', justifyContent:'space-between', alignItems:'center', width:Dimensions.get("screen").width, 
                              borderBottomWidth:1,backgroundColor:'#09A6FF', borderColor:'#09A6FF', padding:5}}>

                  <Text style={{padding:10, fontSize:18,color:'#fff', fontWeight:'600', width:Dimensions.get("screen").width/1.3}}>Finish this task?</Text>
                  <TouchableOpacity onPress={ () => this.setState({modalToFinishsubTask:false}) }
                                  style={{width:38, height:38, borderWidth:1, alignItems:'center',
                                  justifyContent:'center',borderColor:'#fff', borderRadius:19, marginRight:15}} >
                    <Text style={{marginTop:0,fontSize:15, fontWeight:'200', color:'#fff'}}> X </Text>
                  </TouchableOpacity>

                </View>

              </View>
            </View>
        </Modal> */}






 {/* ------------------------------------------------------------------------------------------------------------------------------- */}




        <Modal animationType='fade' transparent={true} visible={this.state.loadMyPosts} style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
            <View style={{marginTop:200, alignSelf:'center', width:100, height:100, backgroundColor:'#FFf', borderWidth:1, borderColor:'#09A6FF', borderRadius:40}}>
              <View style={{alignItems: 'center', justifyContent: 'center', flex:1}}>
                <ActivityIndicator color="#09A6FF" size={30}/>
                <Text style={{color:'#09A6FF', fontSize:7}}>wait</Text>
              </View>
            </View>
        </Modal>




 {/* ------------------------------------------------------------------------------------------------------------------------------- */}


        </ScrollView>

      )
    };
  }
}

const styles = StyleSheet.create({
  card:{
    shadowColor: '#000',
    backgroundColor: '#FFF',
    shadowOffset: {width:0, height: 1},
    shadowOpacity: 0.8,
    margin: 15,
    shadowRadius: 6,
    borderRadius: 5,
    elevation: 4,
  },
  inputOfEditPost:{
    backgroundColor:'#FFF',
    borderWidth:0.5,
    width:350,
    height:40,
    padding:5,
    color:'#6495ED',
    borderRadius:10
  },
  specificPostModal:{
    flex:1,
    backgroundColor:'#FFF',
    justifyContent:'flex-start',
    alignItems:'flex-start'
  },
  titulo:{
    width:240,
    fontSize: 18,
    padding: 10
  },
  texto:{
    fontSize: 12,
    padding: 10,
    width:Dimensions.get("screen").width/1.5
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
    backgroundColor: '#6f6fff',
    opacity: 1,
    padding: 10,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 5,

  },
  botaoVoltarALista:{
    width:150,
    borderWidth:3,
    borderColor:'#32CD32',
    marginTop:5,
    padding: 0,
    borderRadius:10,
    alignItems:'center',
    justifyContent:'center'

  },
  
  botaoTexto:{
    textAlign: 'center',
    color: '#FFF',
    fontSize:12
  },
  inputsMyTasks:{
    width:350,
    height:50,
    borderWidth:1,
    borderColor:'#000',
    backgroundColor:'#FFF',
    color:'#6495ED',
    borderRadius:10,
    margin:10,
    fontSize:15,
    padding:10
  },
  inputsMyTasksTitle:{
    width:Dimensions.get("screen").width/1.1,
    height:80,
    borderWidth:1,
    borderColor:'#000',
    backgroundColor:'#FFF',
    color:'#6495ED',
    borderRadius:10,
    marginTop:-5,
    fontSize:18,
    padding:10,
    alignContent:'flex-start',
    justifyContent:'flex-start'
  },
  inputsMyTasksMiddle:{
    width:350,
    height:80,
    borderWidth:1,
    borderColor:'#000',
    backgroundColor:'#FFF',
    color:'#6495ED',
    borderRadius:10,
    marginTop:-5,
    fontSize:15,
    padding:10,
    alignContent:'flex-start',
    justifyContent:'flex-start'
  },
  inputsMyTasksBigger:{
    width:350,
    height:110,
    borderWidth:1,
    borderColor:'#000',
    backgroundColor:'#FFF',
    color:'#6495ED',
    borderRadius:10,
    margin:10,
    fontSize:15,
    padding:10,
    alignContent:'flex-start',
    justifyContent:'flex-start'
  },
  botaoMyPostSaveTasks:{
    width:200,
    backgroundColor:'#32CD32',
    marginTop:20,
    marginBottom:10,
    padding: 8,
    borderRadius:8,
    alignItems:'center',
    justifyContent:'center'
  },
  botaoTextoMyPostSaveTasks:{
    textAlign: 'center',
    fontSize:13,
    margin:2,
    color: '#FFF'
  },
  AreaCreatedByUser:{
    alignItems: 'flex-start',
    marginBottom: -2,
    zIndex: -9
  },
  botaoCreatedByUser:{
    width: Dimensions.get("screen").width/2.2,
    backgroundColor: '#6f6fff',
    opacity: 1,
    padding: 5,
    borderRadius: 5,
    borderBottomRightRadius: 30,
    justifyContent:'flex-start'
  },
  botaoTextoCreatedByUser:{
    textAlign: 'left',
    color: '#FFF',
    fontSize:11
  },
  AreaCreatedByUserIsideAPost:{
    alignItems: 'flex-start',
    marginBottom: 10,
    //zIndex:9
  },
  botaoCreatedByUserIsideAPost:{
    width: Dimensions.get("screen").width/2,
    backgroundColor: '#2F4F4F',
    opacity: 1,
    padding: 5,
    paddingBottom:10,
    paddingTop:10,
    paddingLeft:12,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 30,
    borderTopRightRadius: 0,
    justifyContent:'flex-start'
  },
  botaoCreatedByUserIsideAPost2:{
    width: Dimensions.get("screen").width/2,
    backgroundColor: '#4f55ED',
    opacity: 1,
    padding: 5,
    paddingBottom:10,
    paddingTop:10,
    paddingLeft:20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 5,
    borderTopRightRadius: 0,
    justifyContent:'flex-start'
  },

  lastButtomCancelArea:{
    alignItems:'center',
    justifyContent:'center', 
    width:Dimensions.get("screen").width, 
    borderTopColor:'#FF2f28', 
    borderTopWidth:1,
    // backgroundColor:'#FFA07A',
    shadowColor: '#000',
    backgroundColor: '#FFF',
    shadowOffset: {width:0, height: 1},
    shadowOpacity: 0.8,
    elevation:2
  },
  botaoSubmitEdit:{
    width:350,
    borderWidth:1,
    borderColor:'#09A6FF',
    padding: 5,
    borderRadius:10,
    alignItems:'center',
    justifyContent:'center',
    margin:20
  },
  botaoSubmitEditSmallblue:{
    width:50,
    height:50,
    borderWidth:1,
    borderColor:'#09A6FF',
    padding: 3,
    borderRadius:25,
    marginRight:10,
    alignItems:'center',
    justifyContent:'center'
  },
  botaoSubmitEditSmallred:{
    width:50,
    height:50,
    borderWidth:1,
    borderColor:'#f34',
    padding: 3,
    borderRadius:25,
    marginRight:10,
    alignItems:'center',
    justifyContent:'center'
  },
  botaoCancelaEdit:{
    width:200,
    borderWidth:1,
    borderColor:'#FF2f28',
    padding: 0,
    borderRadius:10,
    alignItems:'center',
    justifyContent:'center'
  }
});

export default PostsByAssigned;