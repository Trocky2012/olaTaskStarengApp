import React, { Component } from 'react';
import { View, Text, StyleSheet,TouchableOpacity, FlatList, TextInput, Keyboard, ActivityIndicator, Modal, ScrollView, Alert, Dimensions, Linking } from 'react-native';
//import ReversedFlatList from 'react-native-reversed-flat-list';

import api from './src/services/api';
import Posts from './src/Pages/PostsPage/Posts';
import PostsByUser from './src/Pages/PostsPage/PostsByUser';
import PostsByAssigned from './src/Pages/PostsPage/PostsByAssigned';
import {Picker} from '@react-native-picker/picker';

var taskTitle=[];
var taskDescription=[];
var user=[];
var StrStatus='none';
var StrType='none';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {

      posts: [],
      postsByUser: [],
      loading: false,
      loadMyPosts: false,
      entryModal:true,
      newLoginModal:false,
      myPostsModal:false,
      subTasksModal:false,
      MyOwnPosted:false,
      assignedPostsModal:false,
      showAllSubTasks:false,
      showOptionsForMyTask:false,
      seed:1,
      email:'',
      password:'',
      postTitle:'',
      postDescription:'',
      postAssignedUser:'',
      postType:'',
      taskTitleWriting:'',
      taskDescriptionWriting:'',
      newLoginFirstName:'',
      newLoginLastName:'',
      newLoginEmail:'',
      newLoginPassword:'',
      newLoginPassword2:'',
      newLoginPhone:'',
      createdPostID:'',
      userID:'',
      userName:''
    };
    this.setEmail = this.setEmail.bind(this);
    this.setPassword = this.setPassword.bind(this);

    this.setPostTitle = this.setPostTitle.bind(this);
    this.setPostDescription = this.setPostDescription.bind(this);
    this.setPostAssignedUser = this.setPostAssignedUser.bind(this);
    this.setPostType = this.setPostType.bind(this);

    this.setTaskTitleWriting = this.setTaskTitleWriting.bind(this);
    this.setTaskDescriptionWriting = this.setTaskDescriptionWriting.bind(this);

    this.setNewLoginFirstName = this.setNewLoginFirstName.bind(this);
    this.setNewLoginLastName = this.setNewLoginLastName.bind(this);
    this.setNewLoginEmail = this.setNewLoginEmail.bind(this);
    this.setNewLoginPassword = this.setNewLoginPassword.bind(this);
    this.setNewLoginPassword2 = this.setNewLoginPassword2.bind(this);
    this.setNewLoginPhone = this.setNewLoginPhone.bind(this);

    this.setCreatedPostID = this.setCreatedPostID.bind(this);
    this.setUserID = this.setUserID.bind(this);
    
  }



  setEmail(text){    this.setState({email: text});  }
  setPassword(text){    this.setState({password: text});  }
  setPostTitle(text){    this.setState({postTitle: text});  }
  setPostDescription(text){    this.setState({postDescription: text});  }
  setPostAssignedUser(text){    this.setState({postAssignedUser: text});  }
  setPostType(text){    this.setState({postType: text});  }
  setShowAllSubTasks(visibility){    this.setState({showAllSubTasks: visibility});  }
  setTaskTitleWriting(text){    this.setState({taskTitleWriting: text});  }
  setTaskDescriptionWriting(text){    this.setState({taskDescriptionWriting: text});  }
  setNewLoginFirstName(text){    this.setState({newLoginFirstName: text});  }
  setNewLoginLastName(text){    this.setState({newLoginLastName: text});  }
  setNewLoginEmail(text){    this.setState({newLoginEmail: text});  }
  setNewLoginPassword(text){    this.setState({newLoginPassword: text});  }
  setNewLoginPassword2(text){    this.setState({newLoginPassword2: text});  }
  setNewLoginPhone(text){   this.setState({newLoginPhone: text}); }
  setCreatedPostID(text){   this.setState({createdPostID: text}); }
  setUserID(text){   this.setState({userID: text}); }
  setUserName(text){   this.setState({userName: text}); }


  // async componentDidMount(){
  //   // const response = await api.get('posts/get-by-status?status=OPEN');
  //   const response = await api.get('posts');
  //   this.setState({
  //     posts: response.data,
  //     loading: false
  //   });
  // }
  
  //Entry - Email and Password
  async fcnEntryModalCheckAndClose(){
    if(this.state.email.length > 5 && this.state.email.includes("@") && this.state.email.includes(".com")){
      if(this.state.password.length > 6 && this.state.password!='none.ks$ata*0lo3h4seq@wt@uiH2GfdX9asdzbv$7rhgd'){
        try{
          this.setState({loadMyPosts: true});
           const TextForRerquest = 'users/find-by-email?email='+((this.state.email).toString())+
                      '&pssd=kw*s.x$37tth@$u0K8lE9'+((this.state.password).toString()+'0K2.lp$fzE6qj*tk5lp@$');
          // const TextForRerquest = 'users/find-by-email?email=thiago@email.com&pssd=1234567';
          user.push(await (await api.get(TextForRerquest)).data);

          if(user[0].name.length > 0){
            this.setUserID(user[0].id);
            this.setUserName(user[0].name);
            // this.setUserName(user[0].firstName+' '+user[0].lastName);
  
            // const path = 'posts/opened-post-but-remove-user-id/'+(this.state.userID).toString();
            const path = 'posts/get-by-status?status=OPEN';
            const response = await api.get(path);
            this.setState({
              posts: response.data,
              loading: false
            });
    
    
            StrStatus='none';
            StrType='none';
            this.setState(
              {
                postStatus: '', 
                postType: '',
                loadMyPosts: false,
                entryModal:false
              }
            );
          }else{
            alert('Please, check your your email and password')
          }

  
        }catch(error) {
          this.setState({loadMyPosts: false});
          user=[];
          alert('Please, check your credentials and your device status connection')

          console.log('ERROR: ' + error);
        }
      }else{
        alert('Please, check your password')
      }
    }else{
      alert('Please, check your e-mail')
    }
  }

  async fcnMyOwnPosted(visibility){
    
    if(!visibility){
      // this.setState({loadMyPosts: true});
      // const path = 'posts/opened-post-but-remove-user-id/'+(user[0].id).toString();
      // const response = await api.get(path);
      // this.setState({
      //   posts: response.data,
      //   loading: false
      // });
      this.setState({postStatus: ''});
      this.setState({postType: ''});
      StrStatus='none';
      StrType='none'; 
      // this.setState({loadMyPosts: false});
    }

    this.setState({MyOwnPosted:visibility})
    this.setState({assignedPostsModal:false})
  }
  
  async fcnAssignedPosts(visibility){

    if(!visibility){
    //   this.setState({loadMyPosts: true});
    //   const path = 'posts/opened-post-but-remove-user-id/'+(user[0].id).toString();
    //   const response = await api.get(path);
    //   this.setState({
    //     posts: response.data,
    //     loading: false
    //   });
      this.setState({postStatus: ''});
      this.setState({postType: ''});
      StrStatus='none';
      StrType='none'; 
      // this.setState({loadMyPosts: false});
    }
    this.setState({assignedPostsModal:visibility})
    this.setState({MyOwnPosted:false})
  }

  fcnEntryModal(visibility){
    //If its loging out:
    if(visibility){
      this.setEmail('');
      this.setPassword('');
      user=[];
    }

      this.setState({entryModal:visibility})
  }

  async fcnNewLoginModalCheckAndClose(){

      const firstName = this.state.newLoginFirstName;
      const lastName = this.state.newLoginLastName;
      const email = this.state.newLoginEmail;
      const password = this.state.newLoginPassword;
      const password2 = this.state.newLoginPassword2;

      
        if(firstName.length > 1 && lastName.length > 1){
          if(email.length > 5 && email.includes("@") && email.includes(".com")) {
            if(password.length > 7 && password2.length  > 7 && password === password2 && 
                (!password.includes('kw*s.x$37tth@$u0K8lE9')||!password.includes('0K2.lp$fzE6qj*tk5lp@$'))){
                  this.setState({loadMyPosts: true});
                  const TextForRerquest = 'users/find-by-email?email='+email+
                                          '&pssd=none.ks$ata*0lo3h4seq@wt@uiH2GfdX9asdzbv$7rhgd';
                  try{
                    const responseOfCheckEmail = await api.get(TextForRerquest);
                    if(responseOfCheckEmail.data.email==email){
                      this.setState({loadMyPosts: false});
                        alert('\n" '+responseOfCheckEmail.data.email+' "\n\nThere is an account with this e-mail. Please, try another one\n\n'
                        +'If you forgot your password, contact us:\n\nwww.starengtech.com');
                    }else{
                      this.setState({loadMyPosts: false});
                      Alert.alert(
                        'CREATE NEW LOGIN',
                        'Are you sure you want to create this new login?',
                        [
                          // { text: 'OK', onPress: () => this.setState({newLoginModal:false}) },
                          { text: 'OK', onPress: () => this.CreateNewLogin() },
                          { text: 'Cancel', onPress: () => this.setState({newLoginModal:true}), style:'cancel' },
                        ],
                        {cancelable: false},
                        );
                    }
                  }catch(error) {
                    this.setState({loadMyPosts: false});
                    Alert.alert(
                      'Sorry,',
                      'It could not complete the request.\n\nPrease, try again soon.\n\nError to check -RegisteredNewUserEmail\n\n',
                      [{ text: 'OK'}],
                      {cancelable: false},
                    );
                    console.log('ERROR: ' + error);
                  }
                  
            }else {
              // this.setState({newLoginPassword: ''});
              // this.setState({newLoginPassword2: ''});
              alert('Write your password again, please.\n\nTip: It must contain at least 8 characters.');
            }
          }else{
            alert('Please, check your email.');
          }
        }else {
          alert('You must fill up your first and last name');
        }

      
    

  }
  async CreateNewLogin(){
    try{
      this.setState({loadMyPosts: true});
      const newUserData = 
        {
          "firstName": this.state.newLoginFirstName,
          "lastName": this.state.newLoginLastName,
          "email": this.state.newLoginEmail,
          "phone": this.state.newLoginPhone,
          "password": this.state.newLoginPassword
        };
        await api.post('users',newUserData);
        this.setState({newLoginModal:false});
        this.setState({loadMyPosts: false});
        Alert.alert(
          'Congrats,',
          '\nNew login created.\n\nYou can access the OLA TASK now.\n\nwww.starengtech.com',
          [{ text: 'OK'}],
          {cancelable: false},
        );
    }catch(error) {
      Alert.alert(
        'Sorry,',
        'It could not complete the request.\n\nPrease, try again soon.\n\nError to create -newUser',
        [{ text: 'OK'}],
        {cancelable: false},
      );
      console.log('ERROR: ' + error);
    }
  }
  fcnNewLoginModal(visibility){
      this.setState({newLoginModal:visibility})
  }

  fcnMyPostModal(visibility){
    try{
      this.setState({
        postType: 'DELIVERY', 
        myPostsModal:visibility
      });

    }catch(error) {
      console.log('ERROR: ' + error);
    }
  }



  async fcnGetFilteredPostsByAssignedUser(variable, typeChanging){
    
    if(typeChanging){
      switch (variable) {
        case 0: StrType = 'DELIVERY';
          break;
        case 1: StrType = 'INSTALLATION';
          break;
        case 2: StrType = 'MANUAL_SERVICES';
          break;
        case 3: StrType = 'OTHER';
          break;
        case 4: StrType = 'REMOVAL';
          break;
        default:StrType = 'none';
      }

      this.setState({postType: variable});
      this.setState({loadMyPosts: true});
  }else{
    switch (variable) {
      case 0: StrStatus = 'BLOCKED';
        break;
      case 1: StrStatus = 'CREATED';
        break;
      case 2: StrStatus = 'OPEN';
        break;
      case 3: StrStatus = 'ASSIGNED';
        break;
      case 4: StrStatus = 'CLOSED';
        break;
      case 5: StrStatus = 'CANCELLED';
        break;
      case 6: StrStatus = 'DONE';
        break;
      default:StrStatus = 'none';
    }
    this.setState({postStatus: variable});
    this.setState({loadMyPosts: true});
  }

      try{
          const path = 'posts/get-by-type-status-and-user-assigned?type='+StrType+'&status='+StrStatus+'&user_id='+this.state.userID;
          const response = await api.get(path);
          this.setState({
            postsByUser: response.data,
            loadMyPosts: false
          });
        
      }catch(error) {
        this.setState({loadMyPosts: false});
        Alert.alert(
          'Sorry,',
          'It could not complete the request.\n\nPrease, try again soon.\n\nError to filter -statusAssigned',
          [{ text: 'OK'}],
          {cancelable: false},
        );
        console.log('ERROR: ' + error);
      }
        
  }


  
  async fcnGetPostByStatus(status, onlyUserId){

    switch (status) {
      case 0: StrStatus = 'BLOCKED';
        break;
      case 1: StrStatus = 'CREATED';
        break;
      case 2: StrStatus = 'OPEN';
        break;
      case 3: StrStatus = 'ASSIGNED';
        break;
      case 4: StrStatus = 'CLOSED';
        break;
      case 5: StrStatus = 'CANCELLED';
        break;
      case 6: StrStatus = 'DONE';
        break;
      default:StrStatus = 'none';
    }
    
    this.setState({postStatus: status});

    this.setState({loadMyPosts: true});
      try{
        if(onlyUserId){
          // IF it is in "MY LIST" get ONLY user_id
          const path = 'posts/get-by-type-status-and-user-id?type='+StrType+'&status='+StrStatus+'&user_id='+this.state.userID;
          const response = await api.get(path);
          this.setState({
            postsByUser: response.data,
            loadMyPosts: false
          });
        } else{
          // IF it is NOT in "MY LIST" get REMOVIND user_id
          const path = 'posts/get-by-type-status-but-remove-user-id?type='+StrType+'&status='+StrStatus+'&user_id='+this.state.userID;
          const response = await api.get(path);
          this.setState({
            posts: response.data,
            loadMyPosts: false
          });
        }
        
      }catch(error) {
        this.setState({loadMyPosts: false});
        Alert.alert(
          'Sorry,',
          'It could not complete the request.\n\nPrease, try again soon.\n\nError to filter -statusPost.',
          [{ text: 'OK'}],
          {cancelable: false},
        );
        console.log('ERROR: ' + error);
      }
        
  }
    


  async fcnGetPostByType(type, onlyUserId){

    switch (type) {
      case 0: StrType = 'DELIVERY';
        break;
      case 1: StrType = 'INSTALLATION';
        break;
      case 2: StrType = 'MANUAL_SERVICES';
        break;
      case 3: StrType = 'OTHER';
        break;
      case 4: StrType = 'REMOVAL';
        break;
      default:StrType = 'none';
    }

    this.setState({postType: type});

    this.setState({loadMyPosts: true});
    try{
      if(onlyUserId){
        // IF it is in "MY LIST" get ONLY user_id
        const path = 'posts/get-by-type-status-and-user-id?type='+StrType+'&status='+StrStatus+'&user_id='+this.state.userID;
        const response = await api.get(path);
        this.setState({
          postsByUser: response.data,
          loadMyPosts: false
        });
      } else{
        // IF it is NOT in "MY LIST" get REMOVIND user_id
        // const path = 'posts/get-by-type-status-but-remove-user-id?type='+StrType+'&status='+StrStatus+'&user_id='+this.state.userID;
        var path = '';
        if(StrType=='none'){
          path = 'posts/get-by-status?status=OPEN';
        }else{
          path = 'posts/get-by-type-and-status?type='+StrType+'&status=OPEN';
        }
        const response = await api.get(path);
        this.setState({
          posts: response.data,
          loadMyPosts: false
        });
      }
        
    } catch(error) {
      this.setState({loadMyPosts: false});
      Alert.alert(
        'Sorry,',
        'We could not complete the request.\n\nPrease, try again soon.\n\nError to filter -typePost',
        [{ text: 'OK'}],
        {cancelable: false},
      );
      console.log('ERROR: ' + error);
    }
    
  }



  async fcnMyOwnPostsModal(visibility){
    try{
      this.setState({loadMyPosts: true});
      
      this.setState({postStatus: ''});
      this.setState({postType: ''});
      StrStatus='none';
      StrType='none';

      const response = await api.get('posts/get-by-user-id/'+(user[0].id).toString());
      this.setState({
        postsByUser: response.data,
        loadMyPosts: false
      });
      
      this.fcnMyOwnPosted(visibility)
    }catch(error) {
      this.setState({loadMyPosts: false});
      Alert.alert(
        'Sorry,',
        'We could not complete the request.\n\nPrease, try again soon.\n\nError to access -userPost.',
        [{ text: 'OK'}],
        {cancelable: false},
      );
      console.log('ERROR: ' + error);
    }
  }


  async fcnAssignedPostsModal(visibility){
    this.setState({loadMyPosts: true});

    this.setState({postStatus: ''});
    this.setState({postType: ''});
    StrStatus='none';
    StrType='none';

    try{
      const response = await api.get('posts/get-by-assigned-user/'+(user[0].id).toString());
      this.setState({
        postsByUser: response.data,
        loadMyPosts: false
      });
      this.fcnAssignedPosts(visibility)
    }catch(error) {
      Alert.alert(
        'Sorry,',
        'We could not complete the request.\n\nPrease, try again soon.\n\nError to access -userAssignedPosts.',
        [{ text: 'OK'}],
        {cancelable: false},
        );
        console.log('ERROR: ' + error);
    }
    
    this.setState({loadMyPosts: false});
  }

  fcnAskToGoToStarengWebsite(){
    Alert.alert(
      'STARENG WEBSITE',
      'Are you sure you want to visit Stareng Technology website?',
      [
        // { text: 'OK', onPress: () => this.setState({subTasksModal:true}) },
        { text: 'OK', onPress: () => Linking.openURL('https://www.starengtech.com/') },
        { text: 'Cancel', style:'cancel' },
      ],
      {cancelable: false},
    );
  }

  async fcnCreatePostAndOpenSubTasksModal(visibility){

    if(this.state.postTitle.length > 5 || this.state.postDescription.length > 5) {

      const userEmailToAssign = this.state.postAssignedUser.toString();

      if(userEmailToAssign!=''){
        const TextForRerquest = 'users/find-by-email?email='+userEmailToAssign+
                                '&pssd=none.ks$ata*0lo3h4seq@wt@uiH2GfdX9asdzbv$7rhgd';
        try{
          const responseOfCheckEmail = await api.get(TextForRerquest);
          if(responseOfCheckEmail.data.email==userEmailToAssign){
            if(visibility==true){
              Alert.alert(
                'CREATE TASK',
                'Are you sure you want to create this new task?',
                [
                  // { text: 'OK', onPress: () => this.setState({subTasksModal:true}) },
                  { text: 'OK', onPress: () => this.createNewPost(responseOfCheckEmail.data.id) },
                  { text: 'Cancel', onPress: () => this.setState({subTasksModal:false}), style:'cancel' },
                ],
                {cancelable: false},
              );
            }else{
              this.setState({subTasksModal:visibility})
            }
          }else{
            alert('\n" '+userEmailToAssign+' "\n\nCould not assign to it.\n\nThere is no account with this e-mail.');
          }

        }catch(error) {
          this.setState({loadMyPosts: false});
          Alert.alert(
            'Sorry,',
            'We could not complete the request.\n\nPrease, try again soon.\n\nError to get -userToAssignTask',
            [{ text: 'OK'}],
            {cancelable: false},
          );
          console.log('ERROR: ' + error);
        }

      }else{
        if(visibility==true){
          Alert.alert(
            'CREATE TASK',
            'Are you sure you want to create this new task?',
            [
              // { text: 'OK', onPress: () => this.setState({subTasksModal:true}) },
              { text: 'OK', onPress: () => this.createNewPost(-1) },
              { text: 'Cancel', onPress: () => this.setState({subTasksModal:false}), style:'cancel' },
            ],
            {cancelable: false},
          );
        }else{
          this.setState({subTasksModal:visibility})
        }
      }
    }else{
      Alert.alert(
        'TITLE AND DESCRIPTION',
        'Please, insert a valid post title and description',
        [{ text: 'OK'}],
        {cancelable: false},
      );
    }
  }

  async createNewPost(userToAssignId){
    try{
      this.setState({loadMyPosts: true});
        const newUserData = 
        {
          "title": this.state.postTitle,
          "description": this.state.postDescription,
          "type": this.state.postType,
          "user": {"id": (user[0].id).toString()}
        };

        const apiResponse = await api.post('posts',newUserData);
        const data = await apiResponse.data;

        
        this.setState({ createdPostID: (data.id).toString() });

        if(userToAssignId!=-1){
          const path = 'posts/assign-user?post_id='+(data.id).toString()+'&assign_id='+userToAssignId.toString();
          await api.put(path);
        }

        
        // alert('Postid: '+data.id.toString());
      // this.setState({loadMyPosts: false});
      this.setState({subTasksModal:true})
    }catch(error) {
      this.setState({loadMyPosts: false});
      Alert.alert(
        'Sorry,',
        'We could not complete the request.\n\nPrease, try again soon.\n\nError to create -newTaskFirstPage',
        [{ text: 'OK'}],
        {cancelable: false},
      );
      console.log('ERROR: ' + error);
    }
  }

  fcnCreatetasksForPostAndCloseAllModals(visibility){
    try{

      if(this.state.taskTitleWriting!="" && this.state.taskDescriptionWriting!=""){
        this.saveTaskTitleAndDescription();
      }

      if(visibility==true){
        Alert.alert(
          'CREATE SUBTASKS AND SUBMIT',
          'Are you sure you want to create these subtasks and submit?',
          [
            // { text: 'OK', onPress: () => this.setState({subTasksModal:false})},
            { text: 'OK', onPress: () => this.createNewTasksForAPost() },
            { text: 'Cancel', onPress: () => this.setState({subTasksModal:true}), style:'cancel' },
          ],
          {cancelable: false},
        );
      }else{
        //Fechar a modal subtasks e modal Post
        this.setState({myPostsModal:false})
        this.setState({subTasksModal:false})

      }
    }catch(error) {
      Alert.alert(
        'Sorry,',
        'We could not complete the request.\n\nPrease, try again soon.\n\nError to create -newTaskLastPage',
        [{ text: 'OK'}],
        {cancelable: false},
      );
      console.log('ERROR: ' + error);
    }
  }

  async createNewTasksForAPost(){

    this.setState({
      loadMyPosts: true,
      myPostsModal:false, 
      subTasksModal:false
    });
    
    try{

        for(var i = 0; i < taskTitle.length; i++) {
          const newUserData = 
          {
            "title": taskTitle[i],
            "description": taskDescription[i],
            "post": {"id": this.state.createdPostID }
          };
          await api.post('tasks',newUserData);
        }
        if(this.state.postAssignedUser.toString()==''){
          await api.put('posts/'+this.state.createdPostID+'/next-status');
        }else{
          this.setPostAssignedUser('');
        }
        
        this.fcnAssignedPosts(false)
        this.fcnMyOwnPosted(false)
        taskTitle=[];
        taskDescription=[];
        this.fcnGetFilteredPostsByAssignedUser(2, false)
        this.setState({
          loadMyPosts: false, 
        });

        Alert.alert(
          'Yes, you got it!',
          '\nYour new task has just been created.\n\nCheck it out in "My created tasks".',
          [
            // { text: 'OK  '},
            { text: 'OK', onPress: () => this.fcnMyOwnPostsModal(true)}
         ],
          {cancelable: false},
        );
      
    }catch(error) {
      this.setState({loadMyPosts: false});
      Alert.alert(
        'Sorry,',
        'It could not complete the request.\n\nPrease, try again soon.\n\nError to create -newSubTasks',
        [{ text: 'OK'}],
        {cancelable: false},
      );
      console.log('ERROR: ' + error);
    }
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

  

  handleRefreshing = () => {
    this.setState(
      {
        seed: this.state.seed+1,
      },
      () => {
        this.fcnEntryModalCheckAndClose();
      }
    );
  }

  handleRefreshingForMyTasks = () => {
    this.setState(
      {
        seed: this.state.seed+1,
      },
      () => {
        this.fcnMyOwnPostsModal(true);
      }
    )
  }
 
  handleRefreshingForAssigned = () => {
    this.setState(
      {
        seed: this.state.seed+1,
      },
      () => {
        this.fcnAssignedPostsModal(true);
      }
    );
  }

  

  render() {

    if(this.state.loading){
      return(
        <View style={{alignItems: 'center', justifyContent: 'center', flex:1}}>
          <ActivityIndicator color="#09A6FF" size={40}/>
        </View>
      )
    }else{
      return(

      <View style={styles.container}>
  


{/* -------------------------------------------------------------------------------------------------------------------- */}



          {/* MODAL - MAIN LOGIN SCREEN */}
          <Modal animationType='fade' visible={this.state.entryModal}>
            <View style={styles.entryModal}>
              <Text style={{color:'#09BFFF', fontSize:30, margin:60, fontWeight:'700'}}>OLA TASK</Text>
              <Text style={{color:'#FFF', fontSize:16, margin:15}}>A Stareng Technology product</Text>
              <Text style={{color:'#FFF', fontSize:12, margin:20}}>Olá, use or create your login to access the Ola Task app.</Text>
              <TextInput 
                style={styles.inputsEntry}
                placeholder="e-mail"
                placeholderTextColor={"#888"}
                underlineColorAndroid="transparent"
                onChangeText={this.setEmail}
                keyboardType={'email-address'}
                returnKeyType={'next'}
                autoCapitalize={'none'}
                onSubmitEditing={() => { this.state.inputEntryPassword.focus() }}
              />
              <TextInput 
                style={styles.inputsEntry}
                placeholder="password"
                placeholderTextColor={"#888"}
                underlineColorAndroid="transparent"
                onChangeText={this.setPassword}
                secureTextEntry={true}
                returnKeyType={'done'}
                ref={(input) => {this.state.inputEntryPassword = input;}}
                onSubmitEditing={() => { this.fcnEntryModalCheckAndClose()}}
              />
              <TouchableOpacity style={styles.botaoEntry} onPress={()=>this.fcnEntryModalCheckAndClose()}>
                <Text style={styles.botaoTexto}>Enter</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{}} onPress={()=>this.fcnNewLoginModal(true)}>
               <Text style={{color:'#09BFFF', fontSize:12, margin:30} }>CREATE LOGIN</Text>  
              </TouchableOpacity>
              
              <TouchableOpacity style={{flex:1, alignContent:'flex-end', justifyContent:'flex-end', padding:30}}
                    onPress={() => this.fcnAskToGoToStarengWebsite()}>
                <Text style={{color:'#FFF', fontSize:12, margin:10}}>www.starengtech.com</Text>
              </TouchableOpacity>
            </View>
          </Modal>





{/* -------------------------------------------------------------------------------------------------------------------- */}





          {/*   MODAL - CREATE NEW LOGIN   */}


          <Modal animationType='fade' visible={this.state.newLoginModal}>
            <View style={styles.entryModal}>
              <Text style={{color:'#09BFFF', fontSize:26, marginTop:60, marginBottom:40, fontWeight:'700'}}>CREATE NEW LOGIN</Text>
              <Text style={{color:'#FFF', fontSize:12, margin:0}}>Olá.</Text>
              <Text style={{color:'#FFF', fontSize:12, margin:20}}>Please, fill it up to create your login.</Text>
              <TextInput 
                style={styles.inputsNewLogin}
                placeholder="first name"
                placeholderTextColor={"#666"}
                underlineColorAndroid="transparent"
                onChangeText={this.setNewLoginFirstName}
                keyboardType={'default'}
                onSubmitEditing={() => { this.state.inputNewLastName.focus() }}
              />
              <TextInput 
                style={styles.inputsNewLogin}
                placeholder="last name"
                placeholderTextColor={"#666"}
                underlineColorAndroid="transparent"
                onChangeText={this.setNewLoginLastName}
                ref={(input) => {this.state.inputNewLastName = input;}}
                onSubmitEditing={() => { this.state.inputNewEmail.focus() }}
              />
              <TextInput 
                style={styles.inputsNewLogin}
                placeholder="e-mail"
                placeholderTextColor={"#666"}
                underlineColorAndroid="transparent"
                onChangeText={this.setNewLoginEmail}
                keyboardType={'email-address'}
                autoCapitalize={'none'}
                ref={(input) => {this.state.inputNewEmail = input;}}
                onSubmitEditing={() => { this.state.inputNewPassword.focus() }}
              />
              <TextInput 
                style={styles.inputsNewLogin}
                placeholder="password"
                placeholderTextColor={"#666"}
                underlineColorAndroid="transparent"
                onChangeText={this.setNewLoginPassword}
                secureTextEntry={true}
                ref={(input) => {this.state.inputNewPassword = input;}}
                onSubmitEditing={() => { this.state.inputNewPassword2.focus() }}
              />
              <TextInput 
                style={styles.inputsNewLogin}
                placeholder="write your password again"
                placeholderTextColor={"#666"}
                underlineColorAndroid="transparent"
                secureTextEntry={true}
                onChangeText={this.setNewLoginPassword2}
                ref={(input) => {this.state.inputNewPassword2 = input;}}
                blurOnSubmit={true}
                onSubmitEditing={() => {Keyboard.dismiss(), this.fcnNewLoginModalCheckAndClose()}}
              />
              <TouchableOpacity style={styles.botaoEntry} onPress={()=>this.fcnNewLoginModalCheckAndClose()}>
                <Text style={styles.botaoTexto}>Create login</Text>
              </TouchableOpacity>

              <View style={{flex:1, alignContent:'flex-end', justifyContent:'flex-end', padding:30}}>
              <TouchableOpacity style={{width:150, borderWidth:1, borderColor:'#FF6347', marginBottom:20,  borderRadius:15, alignItems:'center',
                                      justifyContent:'center'}} onPress={()=>this.fcnNewLoginModal(false)}>
                    <Text style={{textAlign: 'center',fontSize:14, margin:1, padding:10,  color: '#FF6347'}}>Cancel</Text>
                  </TouchableOpacity>
                <Text style={{color:'#FFF', fontSize:12, margin:10, alignSelf:'center'}}>www.starengtech.com</Text>
              </View>
            </View>
          </Modal>





{/* -------------------------------------------------------------------------------------------------------------------- */}





          {/*  MODAL - CREATE NEW POSTS  */}


          <Modal animationType='fade' visible={this.state.myPostsModal}>
            <ScrollView style={styles.myPostsModal}>
              <View style={{justifyContent:'flex-start', alignItems:'center', marginBottom:15}}>
                <Text style={{color:'#000', fontSize:20, margin:40, fontWeight:'700', 
                      borderBottomWidth:0,borderBottomColor:'#09AFFF', padding:10}}>CREATE NEW TASK</Text>
                <Text style={{color:'#000', fontSize:12, margin:3}}>TITLE:</Text>
                <TextInput 
                  style={styles.inputsMyTasks}
                  placeholder="title"
                  underlineColorAndroid="transparent"
                  onChangeText={this.setPostTitle}
                  onSubmitEditing={() => { this.state.inputDecriptionInNewPost.focus() }}
                />
                <Text style={{color:'#000', fontSize:12, margin:3}}>DESCRIPTION:</Text>
                <TextInput 
                  style={styles.inputsMyTasksBigger}
                  placeholder="description"
                  underlineColorAndroid="transparent"
                  onChangeText={this.setPostDescription}
                  ref={(input) => {this.state.inputDecriptionInNewPost = input;}}
                  blurOnSubmit={true}
                  onSubmitEditing={() => { this.state.inputAssignToSomeone.focus() }}
                  multiline={true}
                />
                <Text style={{color:'#000', fontSize:12, margin:3}}>ASSIGN TO YOU OR SOMEONE ELSE?</Text>
                <Text style={{color:'#000', fontSize:12, margin:3}}>Write down an email (it can be yours) if you wish to create a private task.</Text>
                <TextInput 
                  style={styles.inputsMyTasks}
                  placeholder="email (optional)"
                  underlineColorAndroid="transparent"
                  onChangeText={this.setPostAssignedUser}
                  keyboardType={'email-address'}
                  autoCapitalize={'none'}
                  ref={(input) => {this.state.inputAssignToSomeone = input;}}
                  onSubmitEditing={()=>{Keyboard.dismiss()}}
                />
                <Text style={{color:'#000', fontSize:12, marginTop:3}}>TYPE:</Text>

              </View>
              <View
                    style={{
                        width: 280,
                        marginTop: -5,
                        borderColor: 'black',
                        borderBottomWidth:1,
                        borderRadius: 10,
                        alignSelf: 'center'
                    }}>
                  <Picker 
                    selectedValue={this.state.postType} 
                    onValueChange={(itemValue,itemIndex) => this.setState({postType: itemValue})}
                    style={{color:'#6495ED', padding:10}}
                    >
                      <Picker.Item key={0} value={0} label="DELIVERY"/>
                      <Picker.Item key={1} value={1} label="INSTALLATION"/>
                      <Picker.Item key={2} value={2} label="MANUAL SERVICES"/>
                      <Picker.Item key={3} value={3} label="OTHER"/>
                      <Picker.Item key={4} value={4} label="REMOVAL"/>
                  </Picker>

              </View>
              <View style={{flex:1, flexDirection:'row', justifyContent:'space-around', alignItems:'center', margin:5, marginTop:50, padding:10}}>
                {/* <TouchableOpacity style={styles.botaoMyPostSave} onPress={()=>this.fcnCreatePostAndOpenSubTasksModal(true)}>
                  <Text style={styles.botaoTextoMyPostSave}>Next</Text>
                </TouchableOpacity> */}
                  <TouchableOpacity style={styles.botaoMyPostBack} onPress={()=>this.fcnMyPostModal(false)}>
                    <Text style={styles.botaoTextoMyPostBack}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.botaoAssign} onPress={()=>this.fcnCreatePostAndOpenSubTasksModal(true)}>
                    <Text style={{color:'#FFF', fontSize: 14, padding:5}}>Next</Text>
                  </TouchableOpacity>
                {/* <View style={{flex:1, alignContent:'flex-end', justifyContent:'flex-end', padding:30}}> */}
                {/* </View> */}
              </View>
              
            </ScrollView>
          </Modal>



{/* -------------------------------------------------------------------------------------------------------------------- */}



          {/*   MODAL - SUBTASKS - CREATE SUBTASKS   */}

          <Modal animationType='slide' visible={this.state.subTasksModal}>
            <ScrollView style={styles.myPostsModal}>
              <View style={{justifyContent:'flex-start', alignItems:'center', marginBottom:15}}>
                <Text style={{color:'#000', fontSize:20, margin:35, fontWeight:'700', 
                      borderBottomWidth:0,borderBottomColor:'#09AFFF', padding:10}}>SUBTASKS</Text>

                <Text style={{color:'#000', fontSize:13, margin:6,marginBottom:8 }}>Would you like to create subtasks for this task?</Text>
                <Text style={{color:'#000', fontSize:13, margin:7,marginBottom:8 }}>" {this.state.postTitle} "</Text>
                {/* <Text style={{color:'#000', fontSize:12, margin:3}}>TASK:</Text> */}
                <TextInput 
                  style={styles.inputsMyTasks}
                  placeholder="subtask (optional)"
                  underlineColorAndroid="transparent"
                  onChangeText={this.setTaskTitleWriting}
                  value={this.state.taskTitleWriting}
                  onSubmitEditing={() => { this.state.inputDecriptionInNewSubTask.focus() }}
                />
                {/* <Text style={{color:'#000', fontSize:12, margin:3}}>DESCRIPTION:</Text> */}
                <TextInput 
                  style={styles.inputsMyTasksMiddle}
                  placeholder="description (optional)"
                  underlineColorAndroid="transparent"
                  onChangeText={this.setTaskDescriptionWriting}
                  value={this.state.taskDescriptionWriting}
                  ref={(input) => {this.state.inputDecriptionInNewSubTask = input;}}
                  returnKeyType="done"
                  blurOnSubmit={true}
                  onSubmitEditing={() => {Keyboard.dismiss(), this.saveTaskTitleAndDescription()}}
                  multiline={true}
                />
                <View style={{alignSelf:'flex-end', marginRight:15, marginBottom:-20}}>
                  <TouchableOpacity style={styles.botaoMyPostSaveTasks} onPress={()=>this.saveTaskTitleAndDescription()}>
                      <Text style={styles.botaoTextoMyPostSaveTasks}>Add</Text>
                  </TouchableOpacity>

                </View>

                <View style={{borderRadius:10}}>
                  {taskTitle.length > 0 ? 
                  <View>
                    <Text style={{alignSelf:'center', color:'#000', fontSize:12, margin:4,marginBottom:9 }}>SAVED TASKS:</Text>

                      <View style={{justifyContent:'space-around', width:Dimensions.get("screen").width,
                      backgroundColor:'#efefef', alignItems:'center', flexDirection:'row',borderRadius:10 }}>
                          <View style={{width:Dimensions.get("screen").width/2, alignItems:'flex-start', padding:10, borderRightWidth:1, borderRightColor:'#999'}}>
                            {taskTitle.map((item, key)=>(
                              <Text key={key} style={{color:'#222', height:50, fontSize:16, margin:3}}>{item+"\n"}</Text>))}
                          </View>
                          <View style={{width:Dimensions.get("screen").width/2, alignItems:'flex-start', padding:10}}>
                            {taskDescription.map((item, key)=>(
                              <Text key={key} style={{color:'#222',height:50, fontSize:13, margin:3}}>{item+"\n"}</Text>))}
                          </View>
                      </View>   
                  </View>

                  :  <View></View>
                }
                </View>


              </View>
              <View style={{flex:1,justifyContent:'flex-start', alignItems:'center'}}>
                <TouchableOpacity style={styles.botaoSubmit} onPress={()=>this.fcnCreatetasksForPostAndCloseAllModals(true)}>
                  <Text style={styles.botaoTextoMyPostSave}>Submit and open task</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.botaoMyPostBack} onPress={()=>this.fcnCreatetasksForPostAndCloseAllModals(false)}>
                  <Text style={styles.botaoTextoMyPostBack}>Add tasks later</Text>
                </TouchableOpacity> */}

              
              </View>
              
            </ScrollView>
          </Modal>





{/* -------------------------------------------------------------------------------------------------------------------- */}



          {/*   MODAL - MY LIST OF TASKS - MY TASKS   */}


          <Modal animationType='fade' visible={this.state.MyOwnPosted}>
            <View style={{marginTop:0,paddingTop:15,paddingBottom:15, alignSelf:'center', backgroundColor:'#2F4F4F'}}>
                <View style={{flexDirection:'row', alignItems:'center',justifyContent:'space-between', width:Dimensions.get("screen").width, 
                              borderBottomWidth:1, borderColor:'#20B2AA', marginBottom:0, paddingTop:14, padding:5, paddingBottom:5}}>
                  <TouchableOpacity onPress={()=>this.fcnMyOwnPosted(false)} style={{width:44, height:44, borderWidth:1, alignItems:'center',
                                  justifyContent:'center',borderColor:'#FF6347', borderRadius:22, marginLeft:10}} >
                    <Text style={{marginTop:0, fontSize:10, color:'#FF6347'}}>Back</Text>
                  </TouchableOpacity>
                  
                    <Text style={{color:'#fff', fontSize:18, margin:5, fontWeight:'700', 
                        borderBottomWidth:0,borderBottomColor:'#2F4F4F', padding:10, marginLeft:-10}}>MY CREATED TASKS</Text>

                        <TouchableOpacity onPress={()=>this.fcnMyPostModal(true)} style={{width:44, height:44, borderWidth:1, alignItems:'center',
                                  justifyContent:'center',borderColor:'#09AFFF', borderRadius:22, marginRight:10}} >
                    <Text style={{marginTop:0, fontSize:10, color:'#09AFFF'}}>New</Text>
                  </TouchableOpacity>
                  
                </View>
            </View>
            <View style={styles.smallTop}>
              <TouchableOpacity style={{padding:-10}} onPress={()=>this.fcnMyOwnPosted(false)}>
                <Text style={styles.textSmallTop}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{padding:-10}} onPress={()=>this.fcnAssignedPostsModal(true)}>
                <Text style={styles.textSmallTop}>Assigned</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{padding:2, backgroundColor:'#20B2AA',borderWidth:1, borderColor:'#fff', borderRadius:20, marginTop:-12}} >
                <Text style={{alignSelf:'center', color:'#FFF', fontWeight:'600', fontSize:14, padding:5, marginBottom:0, marginTop:0}}>Created</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{padding:-10}} onPress={()=>this.fcnMyPostModal(true)}>
                <Text style={styles.textSmallTop}>New Task</Text>
              </TouchableOpacity>

            </View>
            <View style={{flexDirection:'row', marginLeft:0, alignItems:'center',justifyContent:'space-around', width:Dimensions.get("screen").width}}>

              <View
                  style={{
                      width: Dimensions.get("screen").width/2,
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
                    onValueChange={(itemValue,itemIndex) =>  this.fcnGetPostByStatus(itemValue, true) }
                    style={{color:'#6495ED', paddingTop:5, marginTop:1}}
                    >
                      <Picker.Item value='' label='Status - no filter' />
                      <Picker.Item key={0} value={0} label="BLOCKED"/>
                      <Picker.Item key={1} value={1} label="CREATED"/>
                      <Picker.Item key={2} value={2} label="OPEN"/>
                      <Picker.Item key={3} value={3} label="ASSIGNED"/>
                      <Picker.Item key={6} value={6} label="DONE"/>
                      <Picker.Item key={4} value={4} label="CLOSED"/>
                      <Picker.Item key={5} value={5} label="CANCELLED"/>
                  </Picker>

                </View>

                <View
                  style={{
                      width: Dimensions.get("screen").width/2,
                      marginTop: 2,
                      marginBottom:5,
                      borderColor: 'black',
                      borderBottomWidth:1,
                      borderRadius: 10
                  }}>
                  <Picker 
                    selectedValue={this.state.postType} 
                    value={this.state.postType}
                    onValueChange={(itemValue,itemIndex) => this.fcnGetPostByType(itemValue,true)}
                    style={{color:'#6495ED', paddingTop:5, marginTop:1}}
                    >
                      <Picker.Item value='' label='Type - no filter' />
                      <Picker.Item key={0} value={0} label="DELIVERY"/>
                      <Picker.Item key={1} value={1} label="INSTALLATION"/>
                      <Picker.Item key={2} value={2} label="MANUAL SERVICES"/>
                      <Picker.Item key={3} value={3} label="OTHER"/>
                      <Picker.Item key={4} value={4} label="REMOVAL"/>
                  </Picker>

                </View>

          </View>
          {this.state.postsByUser.length == 0 && this.state.postType=='' && this.state.postStatus==''? 
              <View>
                <TouchableOpacity style={styles.botaoAssigned} onPress={()=>this.fcnMyPostModal(true)}>
                  <Text style={{color:'#2F4F4F', fontSize: 17, margin:3, padding:5}}>CREATE TASK</Text>
                </TouchableOpacity>
              </View>
          : 
          <View>
            {this.state.postsByUser.length == 0 ?
                <View style={styles.botaoEmpty}>
                  <Text style={{color:'#2F3F4F', fontSize: 17, margin:3, padding:8}}>EMPTY</Text>
                </View>
              :
                <FlatList
                data={this.state.postsByUser}
                keyExtractor={item => item.id.toString() }
                renderItem={ ({item}) => <PostsByUser data={item} /> }
                refreshing={this.state.loadMyPosts}
                onRefresh={this.handleRefreshingForMyTasks}
                contentContainerStyle={{ paddingBottom: 250 }}
                />
            }

          </View>
          }
          </Modal>





{/* -------------------------------------------------------------------------------------------------------------------- */}






          {/*   MODAL - ASSIGNED LIST OF POSTS - ASSIGNED   */}


          <Modal animationType='fade' visible={this.state.assignedPostsModal}>
          <View style={{marginTop:0,paddingTop:15,paddingBottom:15, alignSelf:'center', backgroundColor:'#2F4F4F'}}>
                <View style={{flexDirection:'row', alignItems:'center',justifyContent:'space-between', width:Dimensions.get("screen").width, 
                              borderBottomWidth:1, borderColor:'#20B2AA', marginBottom:0, paddingTop:14, padding:5, paddingBottom:5}}>
                  <TouchableOpacity onPress={()=>this.fcnAssignedPosts(false)} style={{width:44, height:44, borderWidth:1, alignItems:'center',
                                  justifyContent:'center',borderColor:'#FF6347', borderRadius:22, marginLeft:10}} >
                    <Text style={{marginTop:0, fontSize:10, color:'#FF6347'}}>Back</Text>
                  </TouchableOpacity>

                    <Text style={{color:'#fff', fontSize:18, margin:5, fontWeight:'700', 
                        borderBottomWidth:0,borderBottomColor:'#2F4F4F', padding:10, marginLeft:-10}}>MY ASSIGNED TASKS</Text>

                        <TouchableOpacity onPress={()=>this.fcnMyPostModal(true)} style={{width:44, height:44, borderWidth:1, alignItems:'center',
                                  justifyContent:'center',borderColor:'#09A6FF', borderRadius:22, marginRight:10}} >
                    <Text style={{marginTop:0, fontSize:10, color:'#09A6FF'}}>New</Text>
                  </TouchableOpacity>
                </View>
            </View>
            <View style={styles.smallTop}>

              <TouchableOpacity style={{padding:-10}} onPress={()=>this.fcnAssignedPosts(false)}>
                <Text style={styles.textSmallTop}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{padding:2, backgroundColor:'#20B2AA',borderWidth:1, borderColor:'#fff', borderRadius:20, marginTop:-12}} >
                <Text style={{alignSelf:'center', color:'#FFF', fontWeight:'600', fontSize:14, padding:5, marginBottom:0, marginTop:0}}>Assigned</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{padding:-10}} onPress={()=>this.fcnMyOwnPostsModal(true)}>
                <Text style={styles.textSmallTop}>Created</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{padding:-10}} onPress={()=>this.fcnMyPostModal(true)}>
                <Text style={styles.textSmallTop}>New Task</Text>
              </TouchableOpacity>

            </View>

            <View style={{flexDirection:'row', marginLeft:0, alignItems:'center',justifyContent:'space-around', width:Dimensions.get("screen").width}}>

                <View
                  style={{
                      width: Dimensions.get("screen").width/2,
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
                    onValueChange={(itemValue,itemIndex) =>  this.fcnGetFilteredPostsByAssignedUser(itemValue, false) }
                    style={{color:'#6f6fff', paddingTop:5, marginTop:1}}
                    >
                      <Picker.Item value='none' label='Status - no filter' />
                      <Picker.Item key={3} value={3} label="ASSIGNED"/>
                      <Picker.Item key={6} value={6} label="DONE"/>
                      <Picker.Item key={4} value={4} label="CLOSED"/>
                      <Picker.Item key={5} value={5} label="CANCELLED"/>
                  </Picker>

                </View>

                <View
                  style={{
                      width: Dimensions.get("screen").width/2,
                      marginTop: 2,
                      marginBottom:5,
                      borderColor: 'black',
                      borderBottomWidth:1,
                      borderRadius: 10
                  }}>
                  <Picker 
                    selectedValue={this.state.postType} 
                    value={this.state.postType}
                    onValueChange={(itemValue,itemIndex) => this.fcnGetFilteredPostsByAssignedUser(itemValue,true)}
                    style={{color:'#6f6fff', paddingTop:5, marginTop:1}}
                    >
                      <Picker.Item value='' label='Type - no filter' />
                      <Picker.Item key={0} value={0} label="DELIVERY"/>
                      <Picker.Item key={1} value={1} label="INSTALLATION"/>
                      <Picker.Item key={2} value={2} label="MANUAL SERVICES"/>
                      <Picker.Item key={3} value={3} label="OTHER"/>
                      <Picker.Item key={4} value={4} label="REMOVAL"/>
                  </Picker>

                </View>

              
          </View>

          {this.state.postsByUser.length > 0 ? 
              <FlatList
              data={this.state.postsByUser}
              keyExtractor={item => item.id.toString() }
              renderItem={ ({item}) => <PostsByAssigned data={item} /> }
              refreshing={this.state.loadMyPosts}
              onRefresh={this.handleRefreshingForAssigned}
              contentContainerStyle={{ paddingBottom: 200 }}
              />
          : 
              <View style={styles.botaoEmpty}>
                <Text style={{color:'#2F3F4F', fontSize: 17, margin:3, padding:8}}>EMPTY</Text>
              </View>
          }
          
              
          </Modal>





{/* -------------------------------------------------------------------------------------------------------------------- */}



          {/* VIEW - SMALL TOP MENU ON POSTS LIST SCREEN */}

          <View style={{marginTop:10, alignSelf:'center', backgroundColor:'#2F4F4F' }}>
            {/* <Text style={{color:'#000', fontSize:20, margin:5, fontWeight:'700', 
                      borderBottomWidth:0,borderBottomColor:'#09AFFF', padding:10}}>OLA TASK</Text> */}
            <View style={{flexDirection:'row', alignItems:'center',justifyContent:'space-between', width:Dimensions.get("screen").width, 
                          borderBottomWidth:1,borderColor:'#20B2AA', marginBottom:0, marginTop:14, padding:5, paddingBottom:5}}>
              <TouchableOpacity onPress={()=>
                  Alert.alert(
                    'Stareng Technology',
                    '\nVisit our website:\n\n'+'www.starengtech.com\n\nDeveloped by:\nThiago Trolle Cavalheiro',
                    [{ text: 'OK'}],
                    {cancelable: false},
                  ) 
            } style={{width:44, height:44, borderWidth:1, alignItems:'center',
                              justifyContent:'center',borderColor:'#fff', borderRadius:22, marginLeft:10}} >
                <Text style={{marginTop:0, fontSize:8, color:'#fff'}}>Stareng</Text>
              </TouchableOpacity>

                <Text style={{color:'#fff', fontSize:21, margin:0, fontWeight:'700',borderBottomColor:'#20B2AA', padding:10, marginLeft:-10}}>
                   OLA TASK
                </Text>

                <TouchableOpacity onPress={()=>this.fcnEntryModal(true)} style={{width:44, height:44, borderWidth:1, alignItems:'center',
                                justifyContent:'center',borderColor:'#fff', borderRadius:22, marginRight:10}} >
                    <Text style={{marginTop:0, fontSize:8, color:'#fff'}}>Logout</Text>
                </TouchableOpacity>
            </View>
                <Text style={{ alignSelf:'center',color:'#fff', fontSize:12, margin:0,borderBottomColor:'#20B2AA', padding:10, marginLeft:-10}}>
                    Welcome, {this.state.userName}.
                </Text>
          </View>
          <View style={styles.smallTop}>

            <TouchableOpacity style={{padding:2, backgroundColor:'#20B2AA',borderWidth:1, borderColor:'#fff', borderRadius:20, marginTop:-12}} >
              <Text style={{alignSelf:'center', color:'#FFF', fontWeight:'600', fontSize:14, padding:5, marginBottom:0, marginTop:0}}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{padding:-10}} onPress={()=>this.fcnAssignedPostsModal(true)}>
              <Text style={styles.textSmallTop}>Assigned</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{padding:-10}} onPress={()=>this.fcnMyOwnPostsModal(true)}>
              <Text style={styles.textSmallTop}>Created</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{padding:-10}} onPress={()=>this.fcnMyPostModal(true)}>
              <Text style={styles.textSmallTop}>New Task</Text>
            </TouchableOpacity>

          </View>

          {/* {this.showOptionsForMyTask ? 
            <View></View>
          : 
            <View style={{alignSelf:'center', width:'%50', backgroundColor:'#2F4F4F', padding:10,  paddingTop:22,  flexDirection:'row',  justifyContent:'space-around', borderBottomLeftRadius:58,
                           borderBottomRightRadius:58,  borderTopWidth:0.5,    borderTopColor:'#fff'}}>
              <TouchableOpacity style={{padding:-10}} onPress={()=>this.fcnAssignedPostsModal(true)}>
                <Text style={styles.textSmallTop}>Assigned</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{padding:-10}} onPress={()=>this.fcnMyOwnPostsModal(true)}>
                <Text style={styles.textSmallTop}>Created</Text>
              </TouchableOpacity>
            </View>
          } */}

          {/* <View style={{flexDirection:'row', marginLeft:0, alignItems:'center',justifyContent:'space-around', width:Dimensions.get("screen").width}}> */}

                {/* <View
                  style={{
                      width: Dimensions.get("screen").width/2,
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
                    onValueChange={(itemValue,itemIndex) =>  this.fcnGetPostByStatus(itemValue, false) }
                    style={{color:'#20B2AA', paddingTop:5, marginTop:1}}
                    >
                      <Picker.Item value='' label='Status - no filter' />
                      <Picker.Item key={2} value={2} label="OPEN"/>
                      <Picker.Item key={3} value={3} label="ASSIGNED"/>
                      <Picker.Item key={6} value={6} label="DONE"/>
                      <Picker.Item key={4} value={4} label="CLOSED"/>
                      <Picker.Item key={5} value={5} label="CANCELLED"/>
                  </Picker>

                </View> */}

                <View
                  style={{
                      width: Dimensions.get("screen").width/1.4,
                      alignSelf:'center',
                      marginTop: 2,
                      marginBottom:5,
                      borderColor: 'black',
                      borderBottomWidth:1,
                      borderRadius: 10
                  }}>
                  <Picker 
                    selectedValue={this.state.postType} 
                    value={this.state.postType}
                    onValueChange={(itemValue,itemIndex) => this.fcnGetPostByType(itemValue,false)}
                    style={{color:'#20B2AA', paddingTop:5, marginTop:1}}
                    >
                      <Picker.Item value='' label='Type - no filter' />
                      <Picker.Item key={0} value={0} label="DELIVERY"/>
                      <Picker.Item key={1} value={1} label="INSTALLATION"/>
                      <Picker.Item key={2} value={2} label="MANUAL SERVICES"/>
                      <Picker.Item key={3} value={3} label="OTHER"/>
                      <Picker.Item key={4} value={4} label="REMOVAL"/>
                  </Picker>

                </View>

              
          {/* </View> */}
                         

          {/* <ReversedFlatList */}
          <FlatList
          data={this.state.posts}
          keyExtractor={item => item.id.toString() }
          renderItem={ ({item}) => <Posts data={item} userId={this.state.userID}/> }
          refreshing={this.state.loadMyPosts}
          onRefresh={this.handleRefreshing}
          contentContainerStyle={{ paddingBottom: 200 }}
          />



          {/* -------------------------------------------------------------------------------------------------------------------- */}





          {/* LOADING ZONE - ALL LOADINGS */}

          <Modal animationType='fade' transparent={true} visible={this.state.loadMyPosts} style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
              <View style={{marginTop:200, alignSelf:'center', width:100, height:100, backgroundColor:'#FFf', borderWidth:1, borderColor:'#09A6FF', borderRadius:40}}>
                <View style={{alignItems: 'center', justifyContent: 'center', flex:1}}>
                  <ActivityIndicator color="#09A6FF" size={30}/>
                  <Text style={{color:'#09A6FF', fontSize:7}}>wait</Text>
                </View>
              </View>
          </Modal>





  
    </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    paddingTop:30
  },
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
  smallTop:{
    backgroundColor:'#2F4F4F',
    padding:5,
    paddingTop:18,
    paddingTop:5,
    flexDirection:'row',
    justifyContent:'space-around',
    borderBottomLeftRadius:58,
    borderBottomRightRadius:58,
    borderTopWidth:0.5,
    borderTopColor:'#fff'
  },
  smallTop2:{
    paddingTop:2,
    flexDirection:'row',
    justifyContent:'space-around',
    borderBottomWidth:1,
    borderBottomColor:'#09AFFF'
  },
  entryModal:{
    flex:1,
    backgroundColor:'#2f3f4F',
    justifyContent:'flex-start',
    alignItems:'center'
  },
  myPostsModal:{
    flex:1,
    backgroundColor:'#FFF',
    padding:10
  },
  inputsEntry:{
    width:350,
    height:50,
    color:'#FFF',
    borderWidth:1,
    borderColor:'#FFF',
    borderRadius:10,
    margin:10,
    fontSize:15,
    padding:10
  },
  inputsNewLogin:{
    width:350,
    height:40,
    color:'#FFF',
    borderWidth:1,
    borderColor:'#FFF',
    borderRadius:10,
    margin:5,
    fontSize:15,
    padding:10
  },
  inputsMyTasks:{
    width:350,
    height:50,
    borderWidth:1,
    borderColor:'#000',
    color:'#6495ED',
    borderRadius:10,
    margin:10,
    fontSize:15,
    padding:10
  },
  inputsMyTasksMiddle:{
    width:350,
    height:80,
    borderWidth:1,
    borderColor:'#000',
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
    color:'#6495ED',
    borderRadius:10,
    margin:10,
    fontSize:15,
    padding:10,
    alignContent:'flex-start',
    justifyContent:'flex-start'
  },
  textSmallTop:{
    color:'#FFF', 
    fontWeight:'600',
    fontSize:14,
    padding:5,
    paddingTop:15, 
    marginBottom:0,
    marginTop:-5
  },
  textSmallTop2:{
    color:'#09AFFF', 
    fontSize:15, 
    margin:5,
    marginBottom:15,
    padding:10,
    paddingTop:10,
    paddingBottom:5
  },
  textInput:{
    textAlign:'center',
    fontSize:25
  },
  botaoEntry:{
      width:350,
      height:60,
      borderWidth:1,
      borderColor:'#FFF',
      marginTop:40,
      marginBottom:10,
      padding: 10,
      borderRadius:10,
      alignItems:'center',
      justifyContent:'center'
  
    },
    botaoTexto:{
      textAlign: 'center',
      fontSize:18,
      color: '#FFF'
    },
    botaoMyPostBack:{
      width:150,
      borderWidth:1,
      borderColor:'#FF2f28',
      //marginTop:25,
      //marginBottom:10,
      //padding: 8,
      borderRadius:15,
      alignItems:'center',
      justifyContent:'center'
  
    },
    botaoTextoMyPostBack:{
      textAlign: 'center',
      fontSize:14,
      margin:1,
      padding:10,
      color: '#FF2f28'
    },
    botaoMyPostSave:{
      width:300,
      backgroundColor:'#09AFFF',
      marginTop:30,
      marginBottom:20,
      padding: 8,
      borderRadius:10,
      alignItems:'center',
      justifyContent:'center'
  
    },
    botaoTextoMyPostSave:{
      textAlign: 'center',
      fontSize:14,
      margin:2,
      color: '#FFF'
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
    botaoAssign:{
      width:150,
      borderWidth:2,
      borderColor:'#778899',
      marginTop:0,
      padding: 5,
      alignItems:'center',
      justifyContent:'center',
      shadowColor: '#000',
      backgroundColor: '#2F4F4F',
      shadowOffset: {width:0, height: 1},
      shadowOpacity: 1,
      shadowRadius: 7,
      borderRadius: 15,
      elevation: 6,
    },
    botaoSubmit:{
      width:280,
      borderWidth:2,
      borderColor:'#778899',
      padding: 8,
      marginTop: 30,
      marginBottom: 60,
      alignItems:'center',
      justifyContent:'center',
      shadowColor: '#000',
      backgroundColor: '#2F4F4F',
      shadowOffset: {width:0, height: 1},
      shadowOpacity: 1,
      shadowRadius: 7,
      borderRadius: 15,
      elevation: 6,
    },
    botaoAssigned:{
      alignSelf:'center',
      width:180,
      borderWidth:2,
      borderColor:'#778899',
      marginTop:60,
      padding: 0,
      borderRadius:30,
      alignItems:'center',
      justifyContent:'center',
      shadowColor: '#000',
      backgroundColor: '#FFF',
      shadowOffset: {width:0, height: 1},
      shadowOpacity: 1,
      shadowRadius: 7,
      borderRadius: 10,
      elevation: 6,
    }
    ,
    botaoEmpty:{
      alignSelf:'center',
      width:190,
      borderWidth:1,
      borderColor:'#778899',
      marginTop:60,
      padding: 0,
      borderRadius:40,
      alignItems:'center',
      justifyContent:'center',
      backgroundColor: '#FFF',
      borderRadius: 10
    }
});

export default App;