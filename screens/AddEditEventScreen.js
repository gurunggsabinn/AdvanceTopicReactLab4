import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import { addEvent, updateEvent } from '../firebaseServices';
import { MaterialIcons } from '@expo/vector-icons';

function AddEditEventScreen({ route, navigation }) {
  const event = route.params?.event; // Get the event passed from navigation
  const [title, setTitle] = useState(event?.title || ''); // Set initial title
  const [description, setDescription] = useState(event?.description || ''); // Set initial description

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Error', 'Please fill in all fields.'); // Alert if fields are empty
      return;
    }

    try {
      if (event) {
        // If editing an existing event
        await updateEvent(event.id, { title, description }); // Use correct ID here
      } else {
        // If adding a new event
        await addEvent({ title, description });
      }
      navigation.goBack(); // Go back to the previous screen after saving
    } catch (error) {
      Alert.alert('Error', error.message); // Alert on error
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.header}>{event ? 'Edit Event' : 'Add Event'}</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle} // Update title state
        />
        
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description"
          value={description}
          onChangeText={setDescription} // Update description state
          multiline // Allow multiple lines for description
        />
        
        {/* Save Button */}
        <TouchableWithoutFeedback onPress={handleSave}>
          <View style={styles.saveButton}>
            <MaterialIcons name="save" size={24} color="#fff" />
            <Text style={styles.saveButtonText}>Save</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 150,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#28a745',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
    fontWeight: '600',
  },
});

export default AddEditEventScreen;
