import React, {Component} from 'react';
import {TextInput, Platform, StyleSheet, Text, View} from 'react-native';
import io from 'socket.io-client';

type Props = {};
export default class App extends Component<Props> {
constructor(props){
  super(props);
  this.state={
    chatMessage:"",
    name:"",
    chatMessages:[]
  }
}

  componentDidMount(){
    // Set your local ip addres
    this.socket = io("http://192.168.1.66:3000")
    this.socket.on("chat message",msg =>{
      this.setState({chatMessages: [...this.state.chatMessages, JSON.parse(msg) ]})
      console.log(this.state.chatMessages)
    })
  }

  submitChatMessage(){
    const message = { name: this.state.name, message: this.state.chatMessage };
    this.socket.emit("chat message", JSON.stringify(message));
    this.setState({chatMessage: "" })
  }


  render() {
    const chatMessages = this.state.chatMessages.map((chatMessage,index) =><Text key={index}>{chatMessage.name}: {chatMessage.message}</Text>)
    return (
      <View style={styles.container}>
      <View style={{flexDirection:'row',alignItems:'center', justifyContent:'center', fontSize:10,}}>
        <Text style={{fontWeight: 'bold' , fontSize:20}}>Name</Text>
        <TextInput
        style={{flex:1, borderColor: 'gray', borderWidth: 1, margin: 10}}
        onChangeText={(name) => this.setState({name})}
        value={this.state.name}
      />
    </View>
        <TextInput 
        style={{borderWidth:2,height:40}}
        autoCorrect={false} 
        value={this.state.chatMessage}
        onSubmitEditing={() => this.submitChatMessage()}
        onChangeText={chatMessage => {
          this.setState({chatMessage});
        }} ></TextInput>
        {chatMessages}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
