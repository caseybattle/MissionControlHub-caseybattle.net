
'use client';

import { useState } from 'react';
import { addCard } from '@/lib/firestore';

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

export default function SeedMotivationPage() {
    const [status, setStatus] = useState<'idle' | 'seeding' | 'success' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);

    const handleSeed = async () => {
        setStatus('seeding');
        setError(null);
        try {
            await addCard({
                title: "Motivational Shorts: Vertical Climb",
                description: "Viral climbing video with hyper-realistic physics and cinematics.",
                category: "YouTube",
                status: "in-progress",
                priority: "urgent",
                dueDate: null,
                tags: ["Motivation", "Shorts", "Viral", "Climbing"],
                checklist: [],
                links: [],
                scenes: MOTIVATION_SCENES as any,
                order: 1,
            });
            setStatus('success');
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to seed data");
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100 p-6">
            <div className="max-w-md w-full text-center space-y-6">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                    Motivational Seeder
                </h1>
                <p className="text-zinc-400">
                    Create "Vertical Climb" project with {MOTIVATION_SCENES.length} cinematic scenes.
                </p>

                {status === 'idle' && (
                    <button
                        onClick={handleSeed}
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20"
                    >
                        Create Video Project
                    </button>
                )}

                {status === 'seeding' && (
                    <div className="flex justify-center">
                        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    </div>
                )}

                {status === 'success' && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg">
                        <h3 className="font-bold mb-1">Success!</h3>
                        <p className="text-sm">Project created. Check the Dashboard.</p>
                        <a href="/" className="inline-block mt-4 text-white underline hover:text-green-300">
                            Go to Dashboard
                        </a>
                    </div>
                )}

                {status === 'error' && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
                        <h3 className="font-bold mb-1">Error</h3>
                        <p className="text-sm">{error}</p>
                        <button onClick={handleSeed} className="mt-4 text-sm underline">Try Again</button>
                    </div>
                )}
            </div>
        </div>
    );
}
