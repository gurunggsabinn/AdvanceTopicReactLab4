import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { doc, onSnapshot } from 'firebase/firestore';
import { updateEvent, deleteEvent, toggleFavorite } from '../firebaseServices';  
import { db , auth } from '../firebase';
import { Ionicons } from '@expo/vector-icons'; // For icons

const EventDetailsScreen = ({ route, navigation }) => {
    const { eventId } = route.params;
    const [eventData, setEventData] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isCreator, setIsCreator] = useState(false);

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "events", eventId), (doc) => {
            if (doc.exists()) {
                const data = { id: doc.id, ...doc.data() };
                setEventData(data);
                setIsFavorite(data.isFavorite);
                setIsCreator(auth.currentUser && auth.currentUser.uid === data.creatorId);
            }
        }, (error) => {
            console.error('Error fetching event details:', error.message);
        });

        return () => unsubscribe();
    }, [eventId]);

    const handleEdit = () => {
        if (isCreator) {
            navigation.navigate('AddEditEvent', { event: eventData });
        } else {
            Alert.alert('Error', 'You can only edit events you created.');
        }
    };

    const handleDelete = async () => {
        if (isCreator) {
            try {
                await deleteEvent(eventId);
                navigation.goBack();
            } catch (error) {
                Alert.alert('Error', error.message);
            }
        } else {
            Alert.alert('Error', 'You can only delete events you created.');
        }
    };

    const handleToggleFavorite = async () => {
        const newFavoriteStatus = !isFavorite;
        try {
            await toggleFavorite(eventId, newFavoriteStatus);
            setIsFavorite(newFavoriteStatus);
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    if (!eventData) return null; // Render nothing until data is available

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Event Title */}
            <Text style={styles.title}>{eventData.title}</Text>

            {/* Event Description */}
            <Text style={styles.description}>{eventData.description}</Text>

            {/* Favorite Button */}
            <TouchableOpacity 
                style={[styles.favoriteButton, isFavorite ? styles.favoriteActive : styles.favoriteInactive]} 
                onPress={handleToggleFavorite}
            >
                <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={28} color="white" />
                <Text style={styles.favoriteButtonText}>{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</Text>
            </TouchableOpacity>

            {/* Edit and Delete Buttons */}
            <TouchableOpacity style={styles.button} onPress={handleEdit}>
                <Text style={styles.buttonText}>Edit Event</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
                <Text style={styles.buttonText}>Delete Event</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#ffffff',
        alignItems: 'center', // Centering all content
        justifyContent: 'flex-start', // Start from the top
    },
    title: {
        fontSize: 30,
        fontWeight: '700',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    description: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 22, // For better readability
    },
    favoriteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderRadius: 30,
        marginBottom: 20,
        marginTop: 200,
        justifyContent: 'center',
        width: '80%', // Takes 80% of the screen width
    },
    favoriteActive: {
        backgroundColor: '#FF4081', // Red when active
    },
    favoriteInactive: {
        backgroundColor: '#4CAF50', // Green when inactive
    },
    favoriteButtonText: {
        color: 'white',
        marginLeft: 10,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 8,
        width: '80%', // Consistent button width
        alignItems: 'center',
        marginBottom: 15, // Space between buttons
    },
    deleteButton: {
        backgroundColor: '#e53935', // Red for delete
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default EventDetailsScreen;
