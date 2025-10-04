import { View, Text, StyleSheet, Pressable, Modal } from "react-native";
import { useState } from "react";

function GoalItem(props) {
  const [isVisible, setIsVisible] = useState(false); 
  return ( 
    <View>
      <Modal visible={isVisible} animationType="slide"> 
        <Text style={styles.modalText}>Are you sure you want to delete this goal?</Text>
        <View style={styles.buttonRow}>
          <Pressable style={styles.deleteButton} onPress={() => props.onDelete(props.id)}> 
            <Text style={styles.buttonText}>Delete</Text>
          </Pressable>
          <Pressable style={styles.closeButton} onPress={() => setIsVisible(!isVisible)}>
            <Text style={styles.buttonText}>Close</Text>
          </Pressable>
        </View> 
      </Modal>

      <View style={styles.goalItems}>
        <Text style={styles.goalText}>{props.text}</Text>
        <Pressable onPress={() => setIsVisible(true)}>
          <Text>X</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  goalItems: {
    margin: 8,
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f5d0a9ff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  goalText: {
    fontSize: 16,
    color: '#1d1b1bff',
  },
  modalText: {
    textAlign: 'center',
    fontSize: 20,
    color: '#26b667ff'
  },
  closeButton: {
    backgroundColor:'#2a59dbff',
    borderRadius: 8,
    padding: 6
  },
  deleteButton: {
    backgroundColor:'#da3838ff',
    borderRadius: 8,
    padding: 6
  },
  buttonText: {
    color: 'white'
  },
  buttonRow:{
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20
  },

});

export default GoalItem;