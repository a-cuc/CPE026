import { View, Text, StyleSheet, Pressable, Modal } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from "react";

function GoalNavigation() {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View>
      <Modal visible={modalVisible} animationType="slide">
        <Pressable onPress={() => setModalVisible(!modalVisible)}>
          <Text style={styles.modalText}>Welcome to the Application!</Text>
          <Text style={styles.closeText}>Close</Text>
        </Pressable>
      </Modal>
      <View style={styles.goalTitle}>
      <Pressable onPress={() => setModalVisible(true)}>
        <MaterialIcons name="person" size={28} color="#fff" style={styles.icon} />
      </Pressable>
      <Text style={styles.titleText}>My Goals</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  goalTitle: {
    padding: 12,
    backgroundColor: '#5e0acc',
    borderRadius: 6,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  titleText: {
    color: 'white',
    textAlign: 'left',
    fontSize: 20,
  },
  icon: {
    marginRight: 8,
  },
  closeText: {
    textAlign: 'center', 
    marginTop: 40, 
    fontSize: 16, 
    color: '#5e0acc'
  },
  modalText: {
    textAlign: 'center', 
    fontSize: 20,
    color: '#26b667ff'
  }
});

export default GoalNavigation;