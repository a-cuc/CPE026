import { View, Text, StyleSheet } from "react-native";

function GoalTitle() {
  return (
    <View style={styles.goalTitle}>
      <Text style={styles.titleText}>My Goals</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  goalTitle: {
    padding: 12,
    backgroundColor: '#5e0acc',
    borderRadius: 6,
    marginBottom: 12,
  },
  titleText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default GoalTitle;