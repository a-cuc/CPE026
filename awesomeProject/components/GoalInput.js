import { View, TextInput, StyleSheet, Pressable, Text } from "react-native";
import { useState } from "react";

function GoalInput(props) {
    const [enteredGoalText, setEnteredGoalText] = useState('');
    function goalInputHandler(enteredText) {
        setEnteredGoalText(enteredText);
    };
    function addGoalHandler() {
        props.onAddGoal(enteredGoalText);
        setEnteredGoalText('');
    }
    return(
        <View style= {styles.inputContainer}>
            <TextInput placeholder="Your course goal!" 
            style={styles.textInput}
            onChangeText={goalInputHandler}
            value={enteredGoalText}
            />
        <Pressable onPress={addGoalHandler} style={styles.pressableButton}>
            <Text style={styles.pressableText}>Add Goal</Text>
        </Pressable>
      </View>
    );
}

const styles = StyleSheet.create({
inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#c5adadff',
    paddingBottom: 24
},
textInput: {
    borderWidth: 2,
    borderColor: '#b3bbceff',
    width: '70%',
    marginRight: 8,
    padding: 13,
},
pressableButton: {
    backgroundColor:'#5e0acc',
    borderRadius: 8,
    padding: 6
},
pressableText: {
    color:'white'
}
})

export default GoalInput;