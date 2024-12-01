import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { signOut } from 'firebase/auth';
import { collection, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';

const EventListScreen = ({ navigation }) => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "events"), (snapshot) => {
            const eventList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setEvents(eventList);
        }, (error) => {
            console.error('Error fetching events:', error.message);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigation.replace('Event Org');
        } catch (error) {
            console.error('Logout failed:', error.message);
        }
    };

    return (
        <View style={styles.container}>
            {/* Event List */}
            <FlatList
                data={events}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.eventItem} 
                        onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
                    >
                        <Text style={styles.eventTitle}>{item.title}</Text>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.eventList}
            />

            {/* Button Container */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('AddEditEvent')}>
                    <Text style={styles.primaryButtonText}>Add Event</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('FavoriteEvents')}>
                    <Text style={styles.secondaryButtonText}>Favorite Events</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
        padding: 16,
    },
    eventList: {
        flexGrow: 1,
    },
    eventItem: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3, // For Android shadow
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    buttonContainer: {
        marginTop: 20,
    },
    primaryButton: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 12,
        width: '100%',
    },
    secondaryButton: {
        backgroundColor: '#28a745',
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 12,
        width: '100%',
    },
    logoutButton: {
        backgroundColor: '#dc3545',
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
        width: '100%',
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    secondaryButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default EventListScreen;
