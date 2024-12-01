import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getFavoriteEvents } from '../firebaseServices';  

const FavoriteEventsScreen = ({ navigation }) => {
   const [favoriteEvents, setFavoriteEvents] = useState([]);

   useEffect(() => {
       const fetchFavoriteEvents = async () => {
           try {
               const events = await getFavoriteEvents(); // Fetch favorite events from Firestore
               setFavoriteEvents(events); // Update state with favorite events
           } catch (error) {
               console.error('Error fetching favorite events:', error.message);
           }
       };

       fetchFavoriteEvents(); // Call the function to fetch favorite events on component mount
   }, []);

   return (
       <View style={styles.container}>
           <FlatList
               data={favoriteEvents}
               keyExtractor={(item) => item.id} // Use 'id' for keyExtractor
               renderItem={({ item }) => (
                   <TouchableOpacity 
                       style={styles.eventContainer} 
                       onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
                   >
                       <Text style={styles.eventTitle}>{item.title}</Text>
                   </TouchableOpacity>
               )}
           />
       </View>
   );
}

const styles = StyleSheet.create({
   container: {
       flex: 1,
       padding: 16,
       backgroundColor: '#f9f9f9',
   },
   eventContainer: {
       backgroundColor: '#ffffff',
       marginBottom: 10,
       padding: 16,
       borderRadius: 8,
       shadowColor: '#000',
       shadowOffset: { width: 0, height: 2 },
       shadowOpacity: 0.1,
       shadowRadius: 4,
       elevation: 2, // For Android shadow effect
   },
   eventTitle: {
       fontSize: 20,
       fontWeight: '500',
       color: '#333',
   },
});

export default FavoriteEventsScreen;
