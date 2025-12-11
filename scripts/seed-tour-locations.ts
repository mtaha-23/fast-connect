/**
 * Seed script to populate initial tour locations data
 * Run this script to add the default tour locations to your Firestore database
 * 
 * Usage: 
 * 1. Make sure your Firebase config is set up in .env.local
 * 2. Run: npx tsx scripts/seed-tour-locations.ts
 */

import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const initialTourLocations = [
  {
    name: "Main Building",
    description: "The central administrative building housing offices, lecture halls, and the library.",
    image: "/tour imgs/Main Building.jpeg",
    icon: "Building",
    order: 1,
  },
  {
    name: "Library",
    description: "State-of-the-art library with digital resources, study areas, and research facilities.",
    image: "/tour imgs/Library.jpeg",
    icon: "BookOpen",
    order: 2,
  },
  {
    name: "Computer Labs",
    description: "Advanced computing facilities with latest hardware and software for practical learning.",
    image: "/tour imgs/Computer Lab.jpg",
    icon: "FlaskConical",
    order: 3,
  },
  {
    name: "Cafeteria",
    description: "Spacious dining area offering diverse food options for students and faculty.",
    image: "/tour imgs/Dhabaa.jpeg",
    icon: "Utensils",
    order: 4,
  },
  {
    name: "Hostel",
    description: "Comfortable accommodation facilities for students with modern amenities and a supportive living environment.",
    image: "/tour imgs/Hostel.png",
    icon: "Trees",
    order: 5,
  },
]

async function seedTourLocations() {
  try {
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)

    console.log("Starting to seed tour locations...")

    for (const location of initialTourLocations) {
      await addDoc(collection(db, "tourLocations"), {
        ...location,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
      console.log(`✓ Added: ${location.name}`)
    }

    console.log("\n✅ Successfully seeded all tour locations!")
  } catch (error) {
    console.error("❌ Error seeding tour locations:", error)
    process.exit(1)
  }
}

seedTourLocations()

