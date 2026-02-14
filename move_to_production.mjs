
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, writeBatch, doc } from 'firebase/firestore';

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
        console.log("Moving cards to 'Production'...");

        // 1. Rename category 'production' to 'Production'
        // Need to find the category doc first
        const catRef = collection(db, 'categories');
        const catSnap = await getDocs(catRef);
        let productionCatId = null;

        const batch = writeBatch(db);

        catSnap.docs.forEach(d => {
            if (d.data().name.toLowerCase() === 'production') {
                productionCatId = d.id;
                // Update to Capitalized
                if (d.data().name !== 'Production') {
                    console.log(`Renaming category '${d.data().name}' to 'Production'`);
                    batch.update(d.ref, { name: 'Production' });
                }
            }
        });

        // 2. Move the seeded cards to 'Production'
        // We know their titles
        const titlesToMove = ["Health Factory: Sleep Video", "Motivational Shorts: Vertical Climb"];
        const cardsRef = collection(db, 'cards');

        // Fetch all cards and filter by title (easier than multiple queries)
        const cardSnap = await getDocs(cardsRef);

        cardSnap.docs.forEach(d => {
            if (titlesToMove.includes(d.data().title)) {
                console.log(`Moving '${d.data().title}' to 'Production'`);
                batch.update(d.ref, { category: 'Production' });
            }
        });

        await batch.commit();
        console.log("Done.");
        process.exit(0);

    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
}

fix();
