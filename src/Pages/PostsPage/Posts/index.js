import React, {Component} from 'react';
import {View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ActivityIndicator, Modal, Dimensions, ScrollView, Alert} from 'react-native';

import postApi from './PostServices/postApi';
import Tasks from './Tasks';

import { format } from "date-fns";

class Posts extends Component{

  constructor(props){
    super(props);
    this.state = {
      specificPost: [],
      tasksOfThePost: [],
      specificPostModal:false,
      loadMyPosts: false,
      assignUser:[]
    };
  }

  // async componentDidMount(){
  //  const response = await postApi.get('users/'+id.toString());
  //   this.setState({
  //     assignUser: response.data,
  //   });
  // }

  async fcnSpecificPost(postId,assignedUserId, visibility){
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
    //Bring Assigned User
    if(assignedUserId!=null){
      const responseAssignedUser = await postApi.get('users/'+assignedUserId.toString());
      this.setState({
        assignUser: responseAssignedUser.data,
      });
    }

    this.setState({specificPostModal:visibility})
  }

  askToAssignUserToPost(postId, userId, visibility){

    Alert.alert(
      'ASSIGN:',
      'Are you sure you want to assign to this task?',
      [
        // { text: 'OK', onPress: () => this.setState({newLoginModal:false}) },
        { text: 'OK', onPress: () => this.assignUserToPost(postId, userId, visibility) },
        { text: 'Cancel', onPress: () => this.setState({specificPostModal:true}), style:'cancel' },
      ],
      {cancelable: false},
    ); 

  }

  async assignUserToPost(postId, userId,visibility){
    this.setState({loadMyPosts: true});
    //'posts/assign-user?post_id=3&assign_id=2'
    try{
      //A Execução abaixo já atualiza o post para ASIGNED
      const path = 'posts/assign-user?post_id='+postId.toString()+'&assign_id='+userId.toString();
      const response = await postApi.put(path);
      this.setState({
        specificPost: response.data,
        loading: false
      });
      
      // await postApi.put('posts/'+postId.toString()+'/next-status');

      const getTasksOfPost = 'tasks/get-by-post-id/'+postId.toString();
      const responsetasks = await postApi.get(getTasksOfPost);
      this.setState({
        tasksOfThePost: responsetasks.data,
        loading: false
      });
      // this.setState({loadMyPosts: false, specificPostModal:visibility});
      // this.setState({specificPostModal:visibility})

      Alert.alert(
        'ASSIGNED:',
        '\nGreat!!!\n\nHave a look at assigned tasks now',
        [
          // { text: 'OK', onPress: () => this.setState({newLoginModal:false}) },
          { text: 'OK', onPress: () => this.setState({loadMyPosts: false, specificPostModal:visibility}) }
        ],
        {cancelable: false},
      ); 
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

  render(){

    const { id, title, description, type, date, status, user_name, assignedUserId } = this.props.data;
    const userId  = this.props.userId;

    if(this.state.loading){
      return(
        <View style={{alignItems: 'center', justifyContent: 'center', flex:1}}>
          <ActivityIndicator color="#09A6FF" size={40}/>
        </View>
      )
    }else{
      return(
        <ScrollView>



          {/*            INSIDE A POST MODAL - SO USER CAN ASSIGN IT         */}




            <Modal animationType='slide' visible={this.state.specificPostModal}>
              <View style={styles.specificPostModal}>

                {/* <View style={{alignItems:'center',justifyContent:'center', width:Dimensions.get("screen").width, marginBottom:20, marginTop:-40}}>
                  <TouchableOpacity style={styles.botaoAssign} onPress={()=>this.fcnSpecificPost(id,false)}>
                    <Text style={{color:'#FFF', fontSize: 14, margin:3, padding:5}}>ASSIGN</Text>
                  </TouchableOpacity>
                </View> */}

                {/* ONE POST - TITLE */}
                <View style={{flexDirection:'row', alignItems:'center',justifyContent:'space-around', width:Dimensions.get("screen").width, 
                              borderBottomWidth:1,borderColor:'#09A6FF', marginBottom:0, marginTop:10, padding:15, paddingTop:10}}>
                  <TouchableOpacity onPress={()=>this.fcnSpecificPost(id,assignedUserId,false)} 
                                  style={{width:46, height:46, borderWidth:1.5, alignItems:'center',
                                  justifyContent:'center',borderColor:'#FF2f28', borderRadius:23, marginRight:10}} >
                    <Text style={{marginTop:0, fontSize:10, color:'#FF2f28'}}>Back</Text>
                  </TouchableOpacity>
                  {this.state.specificPost.status=="OPEN"?  
                    <TouchableOpacity style={styles.botaoAssign} onPress={()=>this.askToAssignUserToPost(id, userId,false)}>
                      <Text style={{color:'#FFF', fontSize: 16, margin:3, padding:5}}>ASSIGN</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={styles.botaoAssigned}>
                      <Text style={{color:'#4f55ED', fontSize: 18, margin:3, padding:5}}>ASSIGNED</Text>
                    </TouchableOpacity>
                  }

                </View>
    
                <View style={{flexDirection:'row', justifyContent:'space-between', width:Dimensions.get("screen").width}}>
                  <View style={styles.AreaCreatedByUserIsideAPost}>
                    <View style={styles.botaoCreatedByUserIsideAPost} >
                      <Text style={styles.botaoTextoCreatedByUser}>Created by: {user_name}</Text>
                    </View>
                  </View>
                  <View style={styles.AreaCreatedByUserIsideAPost}>
                    <View style={styles.botaoCreatedByUserIsideAPost2} >
                      <Text style={styles.botaoTextoCreatedByUser}>Assigned to: {this.state.assignUser.name}</Text>
                    </View>
                  </View>

                </View>
                  <Text style={{paddingLeft:15, paddingRight:15, paddingBottom:15, fontSize:18, fontWeight:'600', width:Dimensions.get("screen").width,
                                borderBottomWidth:1,borderColor:'#09A6FF'}}>
                    - {this.state.specificPost.title}</Text>

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
                                justifyContent:'space-between', marginBottom:5, marginTop:5, paddingRight:20, paddingLeft:20, 
                                borderBottomWidth:1,borderColor:'#09A6FF', paddingBottom:10}}>
                  <Text style={{backgroundColor:'#6495ED', color:'#FFF', borderRadius:20, fontSize:12, padding:10}}>   {this.state.specificPost.type}   </Text>
                  <View>
                  {this.state.specificPost.status=="OPEN" ? 
                    <Text style={{backgroundColor:'#32CD32', color:'#FFF', borderRadius:20, fontSize:13, padding:5}}>   {this.state.specificPost.status}   </Text> :
                    <Text style={{backgroundColor:'#6495ED', color:'#FFF', borderRadius:20, fontSize:13, padding:5}}>   {this.state.specificPost.status}   </Text>
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
                      <Text style={{fontSize:12, paddingBottom:5, marginLeft:2}}>{this.state.specificPost.date == null? "Negotiable" : format(new Date(this.state.specificPost.date), "MMMM do, yyyy - H:mma")}</Text>
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
                {/* <View style={{alignItems:'center',justifyContent:'center', width:Dimensions.get("screen").width, marginBottom:20, marginTop:-40}}>
                  <TouchableOpacity style={styles.botaoVoltarALista} onPress={()=>this.fcnSpecificPost(id,false)}>
                    <Text style={{color:'#6495ED', fontSize: 14, margin:3, padding:5}}>Back</Text>
                  </TouchableOpacity>
                </View> */}
                
              </View>
            </Modal>
          
          
          {/* MAIN SCREEN - LIST OS POSTS*/}
          <View style={styles.card}>
              <View style={styles.AreaCreatedByUser}>
                <View style={styles.botaoCreatedByUser} >
                  <Text style={styles.botaoTextoCreatedByUser}>Created by: {user_name}</Text>
                </View>
              </View>
          {/* <Text>- {userId} -</Text> */}
          <View style={{borderBottomWidth:0.5,borderColor:'#09A6FF', marginBottom:10, flexDirection:'row', paddingRight:8,paddingLeft:2, 
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
                      <Text style={{backgroundColor:'#6495ED', color:'#FFF', borderRadius:20, fontSize:13, padding:5}}>   {status}   </Text>
              }
            {/* {status=="OPEN" ? 
              <Text style={{fontSize: 12,padding: 5,backgroundColor:'#32CD32', color:'#FFF', borderRadius:15}}>{status}</Text> :
              <Text style={{fontSize: 12,padding: 5,backgroundColor:'#6495ED', color:'#FFF', borderRadius:15}}>{status}</Text>
            } */}
          </View>
          <View style={{marginBottom:12, marginTop:5, flexDirection:'row', justifyContent:'space-between', alignItems:'center', 
                        paddingRight:10, paddingBottom:5}}>
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
    backgroundColor: '#10A08a',
    opacity: 1,
    padding: 10,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 5,

  },

  AreaCreatedByUser:{
    alignItems: 'flex-start',
    marginBottom: -2,
    zIndex: -9
  },
  botaoCreatedByUser:{
    width: Dimensions.get("screen").width/1.5,
    backgroundColor: '#10A08a',
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
  
  botaoVoltarALista:{
    width:150,
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
    color: '#FFF',
    fontSize:12
  },
  botaoAssign:{
    width:180,
    borderWidth:2,
    borderColor:'#778899',
    // marginTop:60,
    padding: 0,
    borderRadius:30,
    alignItems:'center',
    justifyContent:'center',
    shadowColor: '#000',
    backgroundColor: '#2F4F4F',
    shadowOffset: {width:0, height: 1},
    shadowOpacity: 1,
    shadowRadius: 7,
    borderRadius: 10,
    elevation: 6,
  },
  botaoAssigned:{
    width:180,
    borderWidth:2,
    borderColor:'#4f55ED',
    // marginTop:60,
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
});

export default Posts;