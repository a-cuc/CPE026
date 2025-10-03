import { View, Text, StyleSheet } from "react-native";

function GoalItem(props) {
  return (
    <View style={styles.goalItems}>
      <Text style={styles.goalText}>{props.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    goalItems: {
    margin: 8,
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f5d0a9ff'
  },
    goalText: {
    fontSize: 16,
    color: '#1d1b1bff',
  }

});

export default GoalItem;