
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

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

async function inspect() {
    try {
        console.log("Inspecting 'Health Factory: Sleep Video'...");

        const q = query(collection(db, 'cards'), where('title', '==', 'Health Factory: Sleep Video'));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.log("Card NOT found!");
        } else {
            snapshot.docs.forEach(d => {
                const data = d.data();
                console.log(`\nCard ID: ${d.id}`);
                console.log(`Category: ${data.category}`);
                console.log(`Scenes Count: ${data.scenes ? data.scenes.length : 'UNDEFINED'}`);
                if (data.scenes && data.scenes.length > 0) {
                    console.log("First Scene:", JSON.stringify(data.scenes[0], null, 2));
                }
            });
        }

        console.log("\nInspecting 'Motivational Shorts: Vertical Climb'...");
        const q2 = query(collection(db, 'cards'), where('title', '==', 'Motivational Shorts: Vertical Climb'));
        const snapshot2 = await getDocs(q2);
        if (snapshot2.empty) {
            console.log("Card NOT found!");
        } else {
            snapshot2.docs.forEach(d => {
                const data = d.data();
                console.log(`\nCard ID: ${d.id}`);
                console.log(`Category: ${data.category}`);
                console.log(`Scenes Count: ${data.scenes ? data.scenes.length : 'UNDEFINED'}`);
            });
        }


        process.exit(0);
    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
}

inspect();
