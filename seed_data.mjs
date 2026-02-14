
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

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

const HEALTH_SCENES = [
    {
        "id": "scene_001",
        "script": "",
        "visualPrompt": "Person lying awake in bed, frustrated, tossing and turning. Comic book style, graphic novel art, bold lines, high contrast red black and white color palette, landscape 16:9 aspect ratio",
        "image": "",
        "video": "",
        "status": "draft"
    },
    {
        "id": "scene_002",
        "script": "",
        "visualPrompt": "Close-up of a restless person staring at the ceiling. Comic book style, graphic novel art, bold lines, high contrast red black and white color palette, landscape 16:9 aspect ratio",
        "image": "",
        "video": "",
        "status": "draft"
    },
    {
        "id": "scene_003",
        "script": "",
        "visualPrompt": "Fast-paced montage of a clock, bed, and books. Comic book style, graphic novel art, bold lines, high contrast red black and white color palette, landscape 16:9 aspect ratio",
        "image": "",
        "video": "",
        "status": "draft"
    },
    // ... Truncated for brevity (I'll define a function to generate them or assume I need all 42)
    // I will just put the first few to test or ALL if I can.
    // Actually, I'll copy the full lists from the previous step.
];

// ... I need the full list.
// I'll assume I can read the JSON files I created!
// I'll read ./app/admin/seed-health/data.json if I can.
// But that's in the app dir.
// I'll just hardcode 2-3 scenes for now? NO the user wants ALL.
// I'll use `fs` to read the JSON files.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seed() {
    try {
        console.log("Starting seed...");

        // Health Data
        const healthJsonPath = path.join(__dirname, 'app', 'admin', 'seed-health', 'data.json');
        let healthScenes = [];
        if (fs.existsSync(healthJsonPath)) {
            healthScenes = JSON.parse(fs.readFileSync(healthJsonPath, 'utf8'));
        } else {
            console.error("Health data not found at", healthJsonPath);
        }

        if (healthScenes.length > 0) {
            console.log(`Seeding Health Factory with ${healthScenes.length} scenes...`);
            await addDoc(collection(db, 'cards'), {
                title: "Health Factory: Sleep Video",
                description: "Automated video generation project about sleep hygiene and magnesium.",
                category: "YouTube",
                status: "in-progress",
                priority: "high",
                dueDate: null,
                tags: ["Health", "Automation", "Shorts"],
                checklist: [],
                links: [],
                scenes: healthScenes,
                order: 0,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            console.log("Health Factory seeded.");
        }

        // Motivation Data
        // I didn't create a data.json for motivation, I hardcoded it in page.tsx.
        // I'll hardcode it here too.
        const MOTIVATION_SCENES = [
            {
                "id": "scene_01",
                "script": "",
                "visualPrompt": "[CAMERA: Extreme Close-Up Macro] Focus on the climber's hand gripping a smooth, futuristic silver metal ledge. [DETAILS]: Worn black leather fingerless glove, skin texture visible, veins pumping. [ACTION]: The fingers slip slightly (5mm), creating a terrifying micro-moment of failure. [PHYSICS]: Chalk dust particles float in the air using fluid dynamics simulation. [LIGHTING]: Cold blue skylight hitting the silver metal. High tension, hyper-realistic, 8k.",
                "image": "",
                "video": "",
                "status": "draft"
            },
            {
                "id": "scene_02",
                "script": "",
                "visualPrompt": "[CAMERA: Ultra-Wide Drone Shot] Looking down from 2000ft. [SUBJECT]: A tiny human silhouette (male climber in black) free soloing a massive vertical glass skyscraper. [ENVIRONMENT]: The building reflects the clouds. The ground is barely visible through layers of volumetric fog. [AESTHETIC]: Dizzying perspective, vertigo-inducing scale, fractal cloud patterns below. Cinematic cool blue tones.",
                "image": "",
                "video": "",
                "status": "draft"
            },
            {
                "id": "scene_03",
                "script": "",
                "visualPrompt": "[CAMERA: Extreme Close-Up] Focus strictly on the climber's eyes. [DETAILS]: Intense dilated pupils, individual beads of sweat rolling down the forehead (subsurface scattering). [REFLECTION]: The horizon line and sunrise are perfectly reflected in the iris. [ATMOSPHERE]: Heavy breathing visible as subtle camera shake. Hyper-realistic, intense focus, 8k.",
                "image": "",
                "video": "",
                "status": "draft"
            },
            {
                "id": "scene_04",
                "script": "",
                "visualPrompt": "[CAMERA: First Person POV] Looking straight down at the climber's own feet. [DETAILS]: Grey technical climbing pants, rubber shoe texture gripping a glass seam. [DEPTH]: The city grid far below is a blurry geometric pattern (bokeh). [FEELING]: The \"Call of the Void\" - terrifying height, wind buffeting the fabric of the pants. Realistic.",
                "image": "",
                "video": "",
                "status": "draft"
            },
            {
                "id": "scene_05",
                "script": "",
                "visualPrompt": "[CAMERA: Low Angle Medium Shot] Looking up at the climber. [ACTION]: He reaches for a handhold but falls short by inches. [PHYSIOLOGY]: Deltoid and tricep muscles spasm and tense under the black t-shirt. [COMPOSITION]: The climber is framed against a vast, empty blue sky (negative space) emphasizing isolation. High stakes, dynamic tension.",
                "image": "",
                "video": "",
                "status": "draft"
            },
            {
                "id": "scene_06",
                "script": "",
                "visualPrompt": "[CAMERA: High Speed Slow Motion] The climber explodes upward in a desperate lunge. [IMPACT]: The gloved hand connects solidly with the metal ledge. [PHYSICS]: Impact tremors travel through the arm. Dust flies off the ledge in a calculated particle simulation. [LIGHTING]: A sudden flare of sunlight breaks the lens as he catches it. Triumphant, cinematic.",
                "image": "",
                "video": "",
                "status": "draft"
            },
            {
                "id": "scene_07",
                "script": "",
                "visualPrompt": "[CAMERA: Eye Level Close-Up] The climber pulls his torso over the roof ledge. [LIGHTING]: blinding Golden Hour sunrise (\"God Rays\") hits his face directly. [EXPRESSION]: Pure exhaustion mixed with ecstasy. Sweat glistens in the golden light. [DETAILS]: Texture of the concrete roof edge. Lens flares and chromatic aberration.",
                "image": "",
                "video": "",
                "status": "draft"
            },
            {
                "id": "scene_08",
                "script": "",
                "visualPrompt": "[CAMERA: Wide Epic Shot] From behind the climber (black t-shirt, grey pants). He stands on the edge of the roof. [BACKGROUND]: A sea of clouds stretches to the horizon, glowing pink and orange with the sunrise. [COMPOSITION]: Caspar David Friedrich style \"Wanderer above the Sea of Fog.\" Majestic, final, viral masterpiece.",
                "image": "",
                "video": "",
                "status": "draft"
            }
        ];

        console.log(`Seeding Motivation Shorts with ${MOTIVATION_SCENES.length} scenes...`);
        await addDoc(collection(db, 'cards'), {
            title: "Motivational Shorts: Vertical Climb",
            description: "Viral climbing video with hyper-realistic physics and cinematics.",
            category: "YouTube",
            status: "in-progress",
            priority: "urgent",
            dueDate: null,
            tags: ["Motivation", "Shorts", "Viral", "Climbing"],
            checklist: [],
            links: [],
            scenes: MOTIVATION_SCENES,
            order: 1,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        console.log("Motivation Shorts seeded.");

        process.exit(0);
    } catch (error) {
        console.error("Error seeding:", error);
        process.exit(1);
    }
}

seed();
