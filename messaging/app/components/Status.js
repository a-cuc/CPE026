import { Constants } from 'expo';
import { NetInfo, Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import React from 'react';
export default class Status extends React.Component{
    state = {
    info: 'none',
};
render() {
    const {info} = this.state;
    const isConnected = info !== 'none';
    const backgroundColor = isConnected ? 'white' : 'red';
    const statusBar = (
        <StatusBar
            backgroundColor={backgroundColor}
            barStyle={isConnected ? 'dark-content' : 'light-content'}
            animated={false}
        />
    );
    if(Platform.OS == 'ios'){
        return <View style={[styles.status, {backgroundColor}]}></View>
    }
    return null; //Temporary!
}
}

const statusHeight = (Platform.OS == 'ios' ? Constants.statusBarHeight : 0)
const styles = StyleSheet.create({
    status: {
        zIndex: 1,
        height: statusHeight,
    }
})