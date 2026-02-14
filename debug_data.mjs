
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA4CNMjfdNniE8F1JQIlpzumaHQQ8f0eDM",
    authDomain: "mission-ctrl-hub-2026.firebaseapp.com",
    projectId: "mission-ctrl-hub-2026",
    storageBucket: "mission-ctrl-hub-2026.firebasestorage.app",
    messagingSenderId: "637540374452",
    appId: "1:637540374452:web:90dab57ddd16d82cb644e1",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function debug() {
    try {
        console.log("--- DEBUG START ---");

        console.log("\n1. FETCHING CATEGORIES:");
        const catSnap = await getDocs(collection(db, 'categories'));
        if (catSnap.empty) {
            console.log("No categories found in 'categories' collection.");
        } else {
            catSnap.docs.forEach(d => console.log(`[Category] ID: ${d.id}, Name: "${d.data().name}"`));
        }

        console.log("\n2. FETCHING CARDS:");
        const cardSnap = await getDocs(collection(db, 'cards'));
        if (cardSnap.empty) {
            console.log("No cards found in 'cards' collection.");
        } else {
            cardSnap.docs.forEach(d => console.log(`[Card] Title: "${d.data().title}", Category: "${d.data().category}"`));
        }

        console.log("\n--- DEBUG END ---");
        process.exit(0);
    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
}

debug();
