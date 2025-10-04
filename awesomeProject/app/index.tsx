import { Text, View, StyleSheet, FlatList, Modal, Pressable } from "react-native";
import { useState } from 'react';
import GoalItem from "../components/GoalItem";
import GoalInput from "../components/GoalInput";
import GoalNavigation from "../components/GoalNavigation"; 

export default function Index() {
  const [enteredGoalText, setEnteredGoalText] = useState('');
  const [courseGoals, setCourseGoals] = useState<{ text: string; key: string }[]>([]);
  const [showLimitModal, setShowLimitModal] = useState(false);
  
  function addGoalHandler(enteredGoalText: string) {
    if (courseGoals.length >= 5) {
      setShowLimitModal(true);
      return;
    }
    setCourseGoals((currentCourseGoals) => [
      ...currentCourseGoals,
      {text: enteredGoalText, key: Math.random().toString()}]);
    setEnteredGoalText('');
  };
  function deleteGoalHandler(id: string) {
    setCourseGoals((currentCourseGoals) => {
      return currentCourseGoals.filter((goal) => goal.key !== id);
    });
  };
  return (
    <View style={styles.appContainer}>
      <Modal visible={showLimitModal} animationType="slide">
        <Text>Too much goals might be a burden!</Text>
        <Pressable style={styles.closeButton} onPress={() => setShowLimitModal(!showLimitModal)}>
          <Text style={styles.buttonText}>Close</Text>
        </Pressable>
      </Modal>
      <GoalInput 
        enteredGoalText={enteredGoalText} //can be removed
        onAddGoal={addGoalHandler}
      />
      <View style={styles.goalListContainer}>
        <GoalNavigation/>
        <FlatList
          data={courseGoals}
          keyExtractor={(item) => item.key}
          renderItem={(itemData) => {
            return <GoalItem
              text={itemData.item.text}
              id={itemData.item.key}
              onDelete={deleteGoalHandler}
              styles={styles} />;
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
  closeButton: {
    backgroundColor: '#ff6f61',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },

})