import { Text, View, Button, StyleSheet, TextInput, FlatList } from "react-native";
import { useState } from 'react';
import GoalItem from "../components/GoalItem";
import GoalInput from "../components/GoalInput";
import GoalTitle from "../components/GoalTitle"; 

export default function Index() {
  const [enteredGoalText, setEnteredGoalText] = useState('');
  const [courseGoals, setCourseGoals] = useState<{ text: string; key: string }[]>([]);
  
  function addGoalHandler(enteredGoalText: string) {
    setCourseGoals((currentCourseGoals) => [
      ...currentCourseGoals,
      {text: enteredGoalText, key: Math.random().toString()}]);
    setEnteredGoalText('');
  };

  return (
    <View style={styles.appContainer}>
      <GoalInput 
        enteredGoalText={enteredGoalText} 
        onAddGoal={addGoalHandler}
      />
      <View style={styles.goalListContainer}>
        <GoalTitle/>
        <FlatList
          data={courseGoals}
          keyExtractor={(item) => item.key}
          renderItem={(itemData) => {
            return <GoalItem text={itemData.item.text} styles={styles} />;
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    paddingTop: 50,
    paddingHorizontal: 16,
    flex: 1,
    backgroundColor: '#e6ff8eff'
  },
  goalListContainer: {
    flex: 1,
  },

})