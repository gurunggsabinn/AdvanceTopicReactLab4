// firebaseServices.js
import { auth, db } from './firebase';
import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    arrayUnion,
    arrayRemove,
    setDoc
} from 'firebase/firestore';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth';

// Authentication Services
export const signUp = (email, password) => createUserWithEmailAndPassword(auth, email, password);
export const signIn = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const logOut = () => signOut(auth);

// Utility to map Firestore documents
const mapDocs = (snapshot) => snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

// Event Services
export const addEvent = async (eventData) => {
    if (!auth.currentUser) throw new Error("User not authenticated");
    try {
        const eventRef = await addDoc(collection(db, "events"), {
            ...eventData,
            creatorId: auth.currentUser.uid,
            isFavorite: false
        });
        return eventRef;
    } catch (error) {
        throw new Error('Error adding event: ' + error.message);
    }
};

export const updateEvent = async (eventId, eventData) => {
    const eventRef = doc(db, "events", eventId);
    try {
        await updateDoc(eventRef, eventData);
    } catch (error) {
        throw new Error('Error updating event: ' + error.message);
    }
};

export const deleteEvent = async (eventId) => {
    const eventRef = doc(db, "events", eventId);
    try {
        await deleteDoc(eventRef);
    } catch (error) {
        throw new Error('Error deleting event: ' + error.message);
    }
};

export const getAllEvents = async () => {
    try {
        const eventSnap = await getDocs(collection(db, "events"));
        return mapDocs(eventSnap);
    } catch (error) {
        throw new Error('Error fetching events: ' + error.message);
    }
};

// Favorite Services
export const toggleFavorite = async (eventId, isFavorite) => {
    if (!auth.currentUser) throw new Error("User not authenticated");

    try {
        const userFavoritesRef = doc(db, "favorites", auth.currentUser.uid);
        const userFavoritesSnap = await getDoc(userFavoritesRef);

        if (!userFavoritesSnap.exists()) {
            await setDoc(userFavoritesRef, { favoriteEvents: [] });
        }

        if (isFavorite) {
            await updateDoc(userFavoritesRef, { favoriteEvents: arrayUnion(eventId) });
        } else {
            await updateDoc(userFavoritesRef, { favoriteEvents: arrayRemove(eventId) });
        }

        await updateDoc(doc(db, "events", eventId), { isFavorite });
    } catch (error) {
        throw new Error('Error toggling favorite: ' + error.message);
    }
};

export const getFavoriteEvents = async () => {
    if (!auth.currentUser) throw new Error("User not authenticated");

    try {
        const userFavoritesSnap = await getDoc(doc(db, "favorites", auth.currentUser.uid));
        if (userFavoritesSnap.exists()) {
            const favoriteIds = userFavoritesSnap.data().favoriteEvents || [];
            if (favoriteIds.length > 0) {
                const eventSnap = await getDocs(query(collection(db, "events"), where("__name__", "in", favoriteIds)));
                return mapDocs(eventSnap);
            }
        }
        return [];
    } catch (error) {
        throw new Error('Error fetching favorite events: ' + error.message);
    }
};