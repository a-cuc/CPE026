import { Text, View, StyleSheet } from "react-native";
import Status from "./components/Status";
import React from "react";
import MessageList from "./components/MessageList";
import { createImageMessage, createLocationMessage, createTextMessage } from "./utils/MessageUtils";

const state = {
  messages: [
    createImageMessage('https://unsplash.it/300/300'),
    createTextMessage('World      '),
    createTextMessage('Hello      '),
    createLocationMessage({ latitude: 37.78825, longitude: -122.4324 }),
  ],
};

export default function Index() {
  return (
    <View style={styles.container}>
      <Status />
      <MessageList messages={state.messages} />
      <View style={styles.content}>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container : {
    flex : 1,
    backgroundColor : 'white'
  },
  content : {
    flex : 1,
    backgroundColor : 'white'
  },
  inputMethodEditor : {
    flex : 1,
    backgroundColor : 'white'
  },
  toolbar : {
    borderTopWidth : 1,
    borderTopColor : 'rgba(0,0,0,0.04)'
  }
})
