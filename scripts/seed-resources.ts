/**
 * Seed script to populate initial resources data
 * Run this script to add the default resources to your Firestore database
 * 
 * Usage: 
 * 1. Make sure your Firebase config is set up in .env.local
 * 2. Run: npx tsx scripts/seed-resources.ts
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

const initialResources = [
  {
    title: "FAST Entry Test Past Papers 2023",
    type: "Past Paper",
    category: "Entry Test",
    subject: "All Subjects",
    date: "2023",
    downloads: 1250,
    size: "2.4 MB",
    icon: "FileText",
    color: "bg-blue-500",
  },
  {
    title: "Mathematics Formula Sheet",
    type: "Study Guide",
    category: "Mathematics",
    subject: "Mathematics",
    date: "2024",
    downloads: 890,
    size: "1.1 MB",
    icon: "Calculator",
    color: "bg-emerald-500",
  },
  {
    title: "English Vocabulary Guide",
    type: "Study Guide",
    category: "English",
    subject: "English",
    date: "2024",
    downloads: 756,
    size: "3.2 MB",
    icon: "BookOpen",
    color: "bg-pink-500",
  },
  {
    title: "Computer Science Fundamentals",
    type: "Notes",
    category: "CS",
    subject: "Computer Science",
    date: "2024",
    downloads: 1120,
    size: "5.7 MB",
    icon: "Code",
    color: "bg-indigo-500",
  },
  {
    title: "Entry Test Sample Paper #1",
    type: "Past Paper",
    category: "Entry Test",
    subject: "All Subjects",
    date: "2022",
    downloads: 2340,
    size: "1.8 MB",
    icon: "FileText",
    color: "bg-blue-500",
  },
  {
    title: "Analytical Reasoning Practice",
    type: "Practice Set",
    category: "Analytical",
    subject: "IQ/Analytical",
    date: "2024",
    downloads: 678,
    size: "2.1 MB",
    icon: "GraduationCap",
    color: "bg-orange-500",
  },
  {
    title: "FAST Prospectus 2024",
    type: "Official Document",
    category: "General",
    subject: "Information",
    date: "2024",
    downloads: 3450,
    size: "8.5 MB",
    icon: "FileType",
    color: "bg-cyan-500",
  },
  {
    title: "Calculus Complete Notes",
    type: "Notes",
    category: "Mathematics",
    subject: "Mathematics",
    date: "2024",
    downloads: 567,
    size: "4.2 MB",
    icon: "Calculator",
    color: "bg-emerald-500",
  },
]

async function seedResources() {
  try {
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)

    console.log("Starting to seed resources...")

    for (const resource of initialResources) {
      await addDoc(collection(db, "resources"), {
        ...resource,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
      console.log(`✓ Added: ${resource.title}`)
    }

    console.log("\n✅ Successfully seeded all resources!")
  } catch (error) {
    console.error("❌ Error seeding resources:", error)
    process.exit(1)
  }
}

seedResources()

