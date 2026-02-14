
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, writeBatch } from 'firebase/firestore';

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

async function fix() {
    try {
        console.log("Fixing categories...");

        // Find cards with category 'YouTube'
        const q = query(collection(db, 'cards'), where('category', '==', 'YouTube'));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.log("No cards found with category 'YouTube'.");
            process.exit(0);
        }

        console.log(`Found ${snapshot.size} cards to update.`);
        const batch = writeBatch(db);

        snapshot.docs.forEach((doc) => {
            console.log(`Updating ${doc.data().title}...`);
            batch.update(doc.ref, { category: 'YouTube Projects' });
        });

        await batch.commit();
        console.log("Successfully updated all cards to 'YouTube Projects'.");
        process.exit(0);

    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
}

fix();
