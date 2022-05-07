import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ActivityIndicator, Modal, Dimensions, Keyboard, ScrollView, Alert, TextInput, KeyboardAvoidingView} from 'react-native';

import {Picker} from '@react-native-picker/picker';
import { format } from "date-fns";

import postApi from './PostServices/postApi';
import Tasks from './Tasks';

const taskTitle=[];
const taskDescription=[];

class PostsByUser extends Component{

  constructor(props){
    super(props);
    this.state = {
      specificPost: [],
      tasksOfThePost: [],
      specificPostModal:false,
      openEditModal:false,
      loadMyPosts: false,
      closeTaskBool: false,

      postTitle:'',
      postDescription:'',
      postType:'',
      postStatus:'',
      postDate:'',
      taskTitle: [],
      taskTitleWriting:'',
      taskDescription: [],
      taskDescriptionWriting:'',
      taskPosition:[],
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


  async fcnSpecificPost(postId,assignedUserId, visibility){

    this.setState({loadMyPosts: true});
    if(visibility){
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
          this.setState({specificPostModal:visibility})

          //Bring Assigned User
          if(assignedUserId!=null){
            const responseAssignedUser = await postApi.get('users/'+assignedUserId.toString());
            this.setState({
              assignUser: responseAssignedUser.data,
            });
          }
          
      }catch(error) {
        this.setState({specificPostModal:false})
        Alert.alert(
          'Sorry,',
          'We could not coplete the request.\n\nIt will be fixed soon.',
          [{ text: 'OK'}],
          {cancelable: false},
        );
        console.log('ERROR: ' + error);
      }
      
    }else{
      this.setState({specificPostModal:visibility})
    }
    //cleaning task_aux
    for(var i = 0; i < taskTitle.length; i++) {
      taskTitle.pop();
      taskDescription.pop();
    }
    this.setState({loadMyPosts: false});
    
  }

  askToPUTPostToNextStatus(postId){

    Alert.alert(
      'CLOSE',
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
      
      // this.setState({loadMyPosts: false})
      Alert.alert(
        'CONGRATS,',
        '\nWe closed this task.\n\nPlease, update your list to check its new status.\n\nThanks for using OLA TASK!',
        [{ text: 'OK', onPress: ()=>this.setState({loadMyPosts: false})}],
        {cancelable: false},
      );
      
    }catch(error) {
      this.setState({loadMyPosts: false, closeTaskBool:true});
      // this.setState({specificPostModal:false})
      Alert.alert(
        'Sorry,',
        'We could not coplete the request.\n\nIt will be fixed soon.',
        [{ text: 'OK'}],
        {cancelable: false},
      );
      console.log('ERROR: ' + error);
    }
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
    for(var i = 0; i < taskTitle.length; i++) {
      taskTitle.pop();
      taskDescription.pop();
    }
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

  async SavePostChanges(id,assignedUserId){
    
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
        for(var i = 0; i < taskTitle.length; i++) {
          taskTitle.pop();
          taskDescription.pop();
        }

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
                              borderBottomWidth:1,borderColor:'#09A6FF', marginBottom:1, marginTop:15, padding:5}}>
                  <TouchableOpacity onPress={()=>this.fcnSpecificPost(id,assignedUserId,false)} 
                                  style={{width:38, height:38, borderWidth:1, alignItems:'center',
                                  justifyContent:'center',borderColor:'#FF2f28', borderRadius:19, marginLeft:5}} >
                    <Text style={{marginTop:0, fontSize:10, color:'#FF2f28'}}>Back</Text>
                  </TouchableOpacity>
                  <Text style={{alignSelf:'center',padding:10, fontSize:20, fontWeight:'600', width:Dimensions.get("screen").width/1.3}}>{this.state.specificPost.title}</Text>
                  {this.state.specificPost.status=="OPEN" || this.state.specificPost.status=="CREATED" ? 
                    <TouchableOpacity onPress={()=>this.fcnCheckOptions()} 
                                    style={{width:38, height:38, borderWidth:1, alignItems:'center',
                                    justifyContent:'center',borderColor:'#09A6FF', borderRadius:19, marginRight:15}} >
                      <Text style={{marginTop:6, fontSize:15, color:'#09A6FF'}}>°°°</Text>
                    </TouchableOpacity>
                  : 
                    <View></View>
                  } 

                </View>

                  <View style={{flexDirection:'row', justifyContent:'space-between', width:Dimensions.get("screen").width}}>
                    <View style={styles.AreaCreatedByUserIsideAPost}>
                      <View style={styles.botaoCreatedByUserIsideAPost} >
                        <Text style={styles.botaoTextoCreatedByUser}>Created by you</Text>
                      </View>
                    </View>
                    <View style={styles.AreaCreatedByUserIsideAPost}>
                      <View style={styles.botaoCreatedByUserIsideAPost2} >
                        <Text style={styles.botaoTextoCreatedByUser}>Assigned to: {this.state.assignUser.name}</Text>
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
                                justifyContent:'space-between', marginBottom:14, marginTop:5, paddingRight:20, paddingLeft:20, 
                                borderBottomWidth:1,borderColor:'#09A6FF', paddingBottom:20}}>
                      <Text style={{backgroundColor:'#6495ED', color:'#FFF', borderRadius:20, fontSize:12, padding:10}}>   {this.state.specificPost.type}   </Text>
                  <View>

                        {this.state.specificPost.status == 'DONE' ? 
                          <Text style={{backgroundColor:'#09A6FF', color:'#FFF', borderRadius:20, fontSize:13, padding:5}}>   {this.state.specificPost.status}   </Text>
                        :
                          this.state.specificPost.status == 'CLOSED' ? 
                            <Text style={{backgroundColor:'#fF2f28', color:'#FFF', borderRadius:20, fontSize:13, padding:5}}>   {this.state.specificPost.status}   </Text>
                          :
                            this.state.specificPost.status == 'OPEN' ? 
                              <Text style={{backgroundColor:'#32CD32', color:'#FFF', borderRadius:20, fontSize:13, padding:5}}>   {this.state.specificPost.status}   </Text>

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
                shadowOffset: {width:0, height: 1}, shadowOpacity: 0.8, width:Dimensions.get("screen").width/1.2}}>   TASKS :  </Text>
                {/* ( {this.state.tasksOfThePost.length} )   </Text> */}
                


                <FlatList
                  data={this.state.tasksOfThePost}
                  keyExtractor={item => item.id.toString() }
                  renderItem={ ({item}) => <Tasks data={item} /> }
                />


                {/* ONE POST - RETURN BUTTOM */}
                <View style={{alignItems:'center',justifyContent:'center', width:Dimensions.get("screen").width, marginBottom:20, marginTop:-40}}>
                  <TouchableOpacity style={styles.botaoVoltarALista} onPress={()=>this.fcnSpecificPost(id,assignedUserId,false)}>
                    <Text style={{color:'#FF6347', fontSize: 14, margin:3, padding:5}}>Back</Text>
                  </TouchableOpacity>
                </View>
                
              </View>
            </Modal>
          








{/* ------------------------------------------------------------------------------------------------------------------------------- */}









          {/* EDIT POST MODAL */}
          <Modal animationType='slide' visible={this.state.openEditModal}>

              <View style={styles.specificPostModal}>


                <View style={{flexDirection:'row', alignItems:'center',justifyContent:'space-around', width:Dimensions.get("screen").width, 
                              borderBottomWidth:1,borderColor:'#09A6FF', padding:10, marginTop:10}}>

                  <TouchableOpacity style={styles.botaoSubmitEditSmallred} onPress={()=>this.fcnEditModal(false)}>
                    <Text style={{color:'#f34', fontSize: 10}}>Cancel</Text>
                  </TouchableOpacity>
                  <Text style={{color:'#000', fontSize:20, fontWeight:'700', padding:10}}>EDIT TASK</Text>
                  <TouchableOpacity style={styles.botaoSubmitEditSmallblue} onPress={()=>this.fcnSavePostChanges(id, assignedUserId)}>
                      <Text style={{color:'#09A6FF', fontSize: 11}}>Save</Text>
                  </TouchableOpacity>
                </View>

              <ScrollView> 

                {/* ONE POST - TITLE */}
                <View style={{alignItems:'center',justifyContent:'space-between', backgroundColor:'#efefef',
                              borderBottomWidth:1,borderColor:'#09A6FF', marginTop:0, padding:10}}>
                    <Text style={{alignSelf:'center', marginLeft:-15, color:'#000', fontSize:12, marginTop:5}}>TITLE</Text>
                    <View style={{alignSelf:'center'}}>
                      <TextInput 
                        style={styles.inputsMyTasksTitle}
                        placeholder="TITLE"
                        placeholderTextColor={"#666"}
                        underlineColorAndroid="transparent"
                        value={this.state.postTitle}
                        onChangeText={this.setPostTitle}
                        keyboardType={'default'}
                        multiline={true}
                        // onSubmitEditing={() => { this.state.inputEditPostDate.focus() }}
                      />

                      {/* <View style={{flexDirection:'row', marginLeft:-10,  alignItems:'center',justifyContent:'space-around', width:Dimensions.get("screen").width}}>
                          <Text style={{color:'#000', fontSize:12, margin:2,marginTop:15 }}>TYPE</Text>
                          <Text style={{color:'#000', fontSize:12, margin:2,marginTop:15 }}>STATUS</Text>
                      </View>

                      <View style={{flexDirection:'row', marginLeft:-10, alignItems:'center',justifyContent:'space-around', width:Dimensions.get("screen").width}}>
                          <View
                            style={{
                                width: Dimensions.get("screen").width/2.1,
                                marginTop: 2,
                                marginBottom:5,
                                borderColor: 'black',
                                borderBottomWidth:1,
                                borderRadius: 10
                            }}>
                            <Picker 
                              selectedValue={this.state.postType} 
                              value={this.state.postType}
                              onValueChange={(itemValue,itemIndex) => this.setState({postType: itemValue})}
                              style={{color:'#6495ED', paddingTop:5, marginTop:1}}
                              >
                                <Picker.Item key={0} value={0} label="DELIVERY"/>
                                <Picker.Item key={1} value={1} label="INSTALLATION"/>
                                <Picker.Item key={2} value={2} label="MANUAL_SERVICES"/>
                                <Picker.Item key={3} value={3} label="OTHER"/>
                                <Picker.Item key={4} value={4} label="REMOVAL"/>
                            </Picker>

                          </View>

                          
                          </View>
                        */}
                        

                    </View>

                    

                </View>
              
               
              

                {/* ONE POST - DESCRIPTION */}

                <View style={{width:Dimensions.get("screen").width, alignSelf:'center', fontSize:12,  paddingBottom:5, backgroundColor:'#efefef', 
                             color:'#000', borderRadius:0, marginLeft:-10}}>

                        <View
                          style={{
                              width: Dimensions.get("screen").width/1.5,
                              alignSelf:'center',
                              marginTop: 2,
                              marginBottom:5,
                              borderColor: 'black',
                              borderBottomWidth:1,
                              borderRadius: 10
                          }}>
                          <Picker 
                            selectedValue={this.state.postStatus} 
                            value={this.state.postStatus}
                            onValueChange={(itemValue,itemIndex) => this.setState({postStatus: itemValue})}
                            style={{color:'#6495ED', paddingTop:5, marginTop:1}}
                            >
                              <Picker.Item key={1} value={1} label="CREATED"/>
                              <Picker.Item key={2} value={2} label="OPEN"/>
                              <Picker.Item key={6} value={6} label="CANCELLED"/>
                          </Picker>

                        </View>

                    <Text style={{alignSelf:'center', padding:8, backgroundColor:'#efefef', color:'#000', fontSize:12, marginTop:5, marginLeft:-15}}>   DESCRIPTION   </Text>

                    <View style={{width:Dimensions.get("screen").width, backgroundColor:'#efefef', marginBottom:0, padding:5}}>
                        <TextInput 
                          style={styles.inputsMyTasksBigger}
                          placeholder="description"
                          placeholderTextColor={"#666"}
                          underlineColorAndroid="transparent"
                          returnKeyType="done"
                          value={this.state.postDescription}
                          onChangeText={this.setPostDescription}
                          blurOnSubmit={true}
                          onSubmitEditing={()=>{Keyboard.dismiss()}}
                          multiline={true}
                          keyboardType={'default'}
                          // onSubmitEditing={() => { this.state.inputEditPostDate.focus() }}
                          />
                        {/* <Text style={{fontSize:12, paddingBottom:10}}>{this.state.postDescription}</Text> */}
                        {/* ONE POST - DATE */}
                        {/* <Text style={{alignSelf:'center', padding:8, backgroundColor:'#efefef', color:'#000', borderTopLeftRadius:20, 
                        borderTopRightRadius:20, fontSize:12, marginLeft:-15}}>   DATE   </Text>
                        <View style={{width:Dimensions.get("screen").width, backgroundColor:'#efefef', marginBottom:12, padding:10, alignItems:'center', justifyContent:'center'}}>
                        <TextInput 
                              style={styles.inputOfEditPost}
                              placeholder="not editable"
                              placeholderTextColor={"#666"}
                              underlineColorAndroid="transparent"
                              value={this.state.postDate}
                              onChangeText={this.setPostDate}
                              editable={false}
                              // ref={(input) => {this.state.inputEditPostDate = input;}}
                            />
                        </View> */}
                    </View>
                </View>
                          {/* <Text style={{fontSize:12, paddingBottom:10}}>{this.state.specificPost.date == null? "Open" : this.state.specificPost.date}</Text> */}

          
                {/* TASKS LIST OF ONE POST */}
                <KeyboardAvoidingView behavior='padding' style={{alignItems:'center', justifyContent:'center', padding:10, margin:5, marginLeft:-10}}>

                  <Text style={{backgroundColor:'#FFF', color:'#000', fontSize:12, margin:4,marginBottom:9 }}>INSER NEW SUBTASKS?</Text>

                  <TextInput 
                    style={styles.inputsMyTasks}
                    placeholder="new task"
                    underlineColorAndroid="transparent"
                    onChangeText={this.setTaskTitleWriting}
                    value={this.state.taskTitleWriting}
                    onSubmitEditing={() => { this.state.inputDecriptionInNewSubTask.focus() }}
                  />
                  {/* <Text style={{color:'#000', fontSize:12, margin:3}}>DESCRIPTION:</Text> */}
                  <TextInput 
                    style={styles.inputsMyTasksMiddle}
                    placeholder="description"
                    underlineColorAndroid="transparent"
                    returnKeyType="done"
                    onChangeText={this.setTaskDescriptionWriting}
                    value={this.state.taskDescriptionWriting}
                    ref={(input) => {this.state.inputDecriptionInNewSubTask = input;}}
                    blurOnSubmit={true}
                    onSubmitEditing={()=>{Keyboard.dismiss(),this.saveTaskTitleAndDescription()}}
                    multiline={true}
                  />
                  <View style={{alignSelf:'flex-end', marginRight:15, marginBottom:-20}}>
                  <TouchableOpacity style={styles.botaoMyPostSaveTasks} onPress={()=>this.saveTaskTitleAndDescription()}>
                      <Text style={styles.botaoTextoMyPostSaveTasks}>Add</Text>
                  </TouchableOpacity>

                </View>

                  <Text style={{color:'#000', fontSize:12, margin:8,marginBottom:9 }}>SAVED TASKS:</Text>

                {/* </KeyboardAvoidingView>


            
                
                <KeyboardAvoidingView style={{borderRadius:10}} behavior='position' ref={(input) => {this.state.showListOfSavedTasks = input;}}> */}
                  {taskTitle.length > 0 ? 
                  <View ref={(input) => {this.state.showListOfSavedTasks = input}} 
                        style={{justifyContent:'space-around', width:Dimensions.get("screen").width,
                                backgroundColor:'#FFF8DC', alignItems:'center', flexDirection:'row'}}>
                      <View style={{width:Dimensions.get("screen").width/2, alignItems:'flex-start', padding:10, borderRightWidth:1, borderRightColor:'#999'}}>
                        {taskTitle.map((item, key)=>(
                          <Text key={key} style={{color:'#222', height:50, fontSize:16, margin:3}}>{item+"\n"}</Text>))}
                      </View>
                      <View style={{width:Dimensions.get("screen").width/2, alignItems:'flex-start', padding:10}}>
                        {taskDescription.map((item, key)=>(
                          <Text key={key} style={{color:'#222',height:50, fontSize:13, margin:3}}>{item+"\n"}</Text>))}
                      </View>
                  </View>   :  <View></View>
                }
                </KeyboardAvoidingView>

                </ScrollView>
                
                
              </View>
            </Modal>









{/* ------------------------------------------------------------------------------------------------------------------------------- */}









          {/* MAIN SCREEN OF MY TASKS - LIST OS POSTS*/}
          <View style={styles.card}>
            <View style={styles.botaoCreatedByUser} >
              <Text style={styles.botaoTextoCreatedByUser}>You created this task</Text>
            </View>
             
          <View style={{borderBottomWidth:0.5,borderColor:'#09A6FF', marginBottom:10, flexDirection:'row', paddingRight:10,paddingLeft:2, 
                justifyContent:'space-between', alignItems:'center'}}>
            <Text style={styles.titulo}>{title}</Text>
              {status == 'OPEN' ? 
                <Text style={{backgroundColor:'#32CD32', color:'#FFF', borderRadius:20, fontSize:13, padding:5}}>   {status}   </Text>
                :
                  status == 'CLOSED' ? 
                  <Text style={{backgroundColor:'#fF2f28', color:'#FFF', borderRadius:20, fontSize:13, padding:5}}>   {status}   </Text>
                  :
                    status=='DONE' ?
                      <Text style={{backgroundColor:'#09A6FF', color:'#FFF', borderRadius:20, fontSize:13, padding:5}}>   {status}   </Text>
                    :
                        status == 'CANCELLED' ? 
                          <Text style={{backgroundColor:'#999', color:'#FFF', borderRadius:20, fontSize:11, padding:5}}>   {status}   </Text>
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
            {status=="DONE" ? 
            <View>
                <TouchableOpacity style={{marginBottom:2, marginTop:0,justifyContent:'center', 
                                        alignItems:'center', paddingRight:10, paddingBottom:5}}
                                  onPress={()=>this.askToPUTPostToNextStatus(id)}
                                        >
                  <View style={{justifyContent:'center', alignItems:'center'}}>
                    <Text style={{fontSize:14, padding:8, color:'#Fff', fontWeight:'700', borderTopLeftRadius:10, 
                        borderTopRightRadius:10, marginLeft:0,marginBottom:1,marginTop:10, shadowRadius: 6, borderRadius: 25,  elevation: 4,shadowColor: '#000',  backgroundColor: '#FF6347',
                      shadowOffset: {width:0, height: 1}, shadowOpacity: 0.8}}>   CLOSE THE TASK  </Text>
                  </View>

                </TouchableOpacity>
              </View>
            :
            <View>
                    {/* <View style={{marginBottom:2, marginTop:0,justifyContent:'center', backgroundColor:'#FF6347',
                                            alignItems:'center', paddingRight:10, paddingBottom:5}}>
                      <View style={{justifyContent:'center', alignItems:'center'}}>
                        <Text style={{fontSize:14, padding:8, color:'#fff', fontWeight:'700'}}>   CLOSED  </Text>
                      </View>
                    </View> */}
            </View>

            }

      </View>





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
    alignSelf:'center',
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
    backgroundColor: '#6495ED',
    opacity: 1,
    padding: 10,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 5,

  },
  botaoVoltarALista:{
    width:150,
    borderWidth:1,
    borderColor:'#FF6347',
    marginTop:60,
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
  // AreaCreatedByUser:{
  //   alignItems: 'flex-start',
  //   marginBottom: -2,
  //   zIndex: -9
  // },
  botaoCreatedByUser:{
    width: Dimensions.get("screen").width/2.2,
    backgroundColor: '#6495ED',
    opacity: 1,
    padding: 5,
    borderRadius: 5,
    borderBottomRightRadius: 30,
    justifyContent:'flex-start'
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
    alignSelf:'center',
    height:60,
    borderWidth:1,
    borderColor:'#888',
    backgroundColor:'#FFF',
    color:'#6495ED',
    borderRadius:10,
    marginTop:5,
    fontSize:18,
    padding:10,
    marginLeft:-5,
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
    height:100,
    alignSelf:'center',
    borderWidth:1,
    borderColor:'#888',
    backgroundColor:'#FFF',
    color:'#6495ED',
    borderRadius:10,
    fontSize:15,
    marginLeft:-10,
    padding:10,
    alignContent:'flex-start',
    justifyContent:'flex-start'
  },
  botaoMyPostSaveTasks:{
    //width:90,
    backgroundColor:'#2F4F4F',
    marginTop:-25,
    marginBottom:35,
    padding: 7,
    borderRadius:26,
    alignItems:'center',
    justifyContent:'center'

  },
  botaoTextoMyPostSaveTasks:{
    textAlign: 'center',
    fontSize:13,
    margin:1,
    color: '#FFF'
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
  botaoTextoCreatedByUser:{
    textAlign: 'left',
    color: '#FFF',
    fontSize:11
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

export default PostsByUser;