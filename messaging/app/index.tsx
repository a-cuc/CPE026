import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableHighlight, Image, BackHandler } from "react-native";
import Status from "./components/Status";
import MessageList from "./components/MessageList";
import { createImageMessage, createLocationMessage, createTextMessage } from "./utils/MessageUtils";
import type { JSX } from "react";

const initialMessages = [
  createImageMessage('https://unsplash.it/300/300'),
  createTextMessage('World    '),
  createTextMessage('Hello    '),
  createLocationMessage({ latitude: 37.78825, longitude: -122.4324 }),
];

type MessagePressEvent = {
  id: string;
  type: string;
};

export default function Index(): JSX.Element {
  const [messages] = useState(initialMessages);
  const [fullscreenImageId, setFullscreenImageId] = useState<string | null>(null);

  const dismissFullscreenImage = (): void => {
    setFullscreenImageId(null);
  };

  const renderFullscreenImage = (): JSX.Element | null => {
    if (!fullscreenImageId) {
      return null;
    }
    const image = messages.find(message => message.id === fullscreenImageId);
    if (!image || image.type !== 'image') {
      return null;
    }
    return (
      <TouchableHighlight style={styles.fullscreenOverlay} onPress={dismissFullscreenImage}>
        <Image source={{ uri: (image as any).uri }} style={styles.fullscreenImage} />
      </TouchableHighlight>
    );
  };

  useEffect(() => {
    const onBackPress = () => {
      if (fullscreenImageId) {
        dismissFullscreenImage();
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => {
      subscription.remove();
    };
  }, [fullscreenImageId]);
  
  const handlePressMessage = ({ id, type }: MessagePressEvent): void => {
    switch (type) {
      case 'text':
        // Handle text message press
        break;
      case 'image':
        setFullscreenImageId(id);
        break;
      case 'location':
        // Handle location message press
        break;
    }
  };

  const renderMessageList = (): JSX.Element => {
    return (
      <View style={styles.content}>
        <MessageList
          messages={messages}
          onPressMessage={handlePressMessage}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Status />
      {renderMessageList()}
      {renderFullscreenImage()}
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
  },
  fullscreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
  },
})
