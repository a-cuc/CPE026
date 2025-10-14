import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View>
      <View style={styles.container}>
        <Text>Edit app/index.tsx to edit this screen.</Text>
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
