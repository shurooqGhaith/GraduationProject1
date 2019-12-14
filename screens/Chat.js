import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat'; // 0.3.0

import fire from "../constants/firebaseConfigrations";

type Props = {
  name?: string,
  email?: string,
  avatar?: string,
};

class Chat extends React.Component {

  constructor(props) {
    super(props);
  }
  static navigationOptions = ({ navigation }) => ({
    title: (navigation.state.params || {}).nameR || 'Chat!',
  });

  state = {
    messages: [],
    id:'',
    name:'',
    email:'',
    todayDate:'',
    idR:'',
    photo:null
  };

  get user() {
    return {
      name: this.state.name,
      email: this.state.email,
      avatar:this.state.photo,
      id: this.state.id,
      _id: this.state.id, // receiver ??
    };
  }

  send = messages => {
    var today = new Date();
    const day   = today.getDate();
    const  month = today.getMonth()+1;
    const  year  = today.getFullYear();
    var d=`${day}`;
    if(d.length==1){d=`0${d}`}
    var m=`${month}`;
    if(m.length==1){m=`0${m}`}

    this.setState({
      todayDate:year + '-' + m + '-' + d
    }) 
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = {
        idR:this.state.idR,
        text,
        user,
        createdAt:this.state.todayDate,
      };
      fire.database().ref("messages").push().set(message);
    }
  };

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.send}
        user={this.user}
        renderUsernameOnMessage={true}
      />
    );
  }

  componentDidMount() {
    const { navigation } = this.props;  
    var id=navigation.getParam('sender');
    var name=navigation.getParam('name');
    var email=navigation.getParam('email');
    var receiver=navigation.getParam('receiver'); //id
    var receiverName=navigation.getParam('nameR'); 
    
    fire.database().ref("users").child(id).child("avatar").on('value',(datasnapshot)=>{
      if(datasnapshot.val()){this.setState({photo:datasnapshot.val() })
    }
    })
    
    this.setState({
        id:id,
        name:name,
        email:email,
        idR:receiver
    })
      fire.database().ref("messages").limitToLast(20).on('child_added', snapshot => {
                if(snapshot.val()){
                    // const { timestamp: numberStamp, text, user } = snapshot.val();
                    const { idR,createdAt, text, user } = snapshot.val();

                    const { key: id } = snapshot;
                    const { key: _id } = snapshot; //needed for giftedchat
                    //const timestamp = new Date(numberStamp);

                    
                              const message = {
                                 id,
                                 _id,
                                 createdAt,
                                 text,
                                 user,
                                 idR,
                                 
                                };
                
                                //id sender=8H...  state.id
                                //id receiver =Rr  state.idR
                               // alert("idR="+idR+"\n"+"idS="+user.id);
                               //|| (idR==this.state.id && user.id==this.state.idR)
                                if(idR==this.state.idR && user.id==this.state.id ){
                                  this.setState(previousState => ({
                                    messages: GiftedChat.append(previousState.messages, message),
                                  }))
                                }
                                if(idR==this.state.id && user.id==this.state.idR ){
                                  this.setState(previousState => ({
                                    messages: GiftedChat.append(previousState.messages, message),
                                  }))
                                }
                                
                            }
     });

   
  }
  componentWillUnmount() {
     fire.database().ref('messages').off();
  }
}

export default Chat;
