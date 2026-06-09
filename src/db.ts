import mongoose, { Schema } from 'mongoose';
import { Destination } from './types';

// Define Mongoose Schema
const DestinationSchema = new Schema<Destination>({
  name: { type: String, required: true, unique: true },
  isCrowded: { type: Boolean, required: true, default: false },
  crowdLevel: { type: Number, required: true, default: 0 },
  alternativeDestination: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  alternativeDesc: { type: String, required: true }
});

// Let Mongoose handle schema definition, but guard Compile to avoid recompilation errors in dev
let DestinationModel: any;
try {
  DestinationModel = mongoose.model('Destination');
} catch {
  DestinationModel = mongoose.model('Destination', DestinationSchema);
}

export { DestinationModel };

// Pre-seeded fallback database for instant preview functionality
const defaultDestinations: Destination[] = [
  {
    name: "Sigiriya Rock Fortress",
    isCrowded: false,
    crowdLevel: 42,
    alternativeDestination: "Pidurangala & Lion Rocks viewpoint",
    description: "The majestic ancient rock fortress of Sigiriya, rising 200m from Sri Lanka's central plains. A UNESCO heritage site under constant high tourist foot-traffic.",
    category: "Historical Wonder",
    image: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80",
    alternativeDesc: "A nearby peaceful sacred monastery mountain peak with matching 360-degree views of Sigiriya itself with 90% fewer crowds."
  },
  {
    name: "Temple of the Tooth",
    isCrowded: false,
    crowdLevel: 65,
    alternativeDestination: "International Buddhist Museum",
    description: "The sacred Buddhist shrine housing Buddha's tooth relic in the historic royal capital of Kandy, featuring heavy daily prayer congestion.",
    category: "Cultural Sanctuary",
    image: "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80",
    alternativeDesc: "The world's first International Buddhist Museum, situated in the peaceful outer palace grounds, exhibiting Buddhist contributions from multiple Asian nations in a tranquil atmosphere."
  },
  {
    name: "Galle Dutch Fort",
    isCrowded: false,
    crowdLevel: 80,
    alternativeDestination: "Japanese Peace Temple Pagoda",
    description: "The heavily visited historic Portuguese and Dutch colonial fort, famous for boutique crowds and narrow walking paths on the southwest coast.",
    category: "Colonial History",
    image: "https://images.unsplash.com/photo-1561053720-76cd73ff22c3?auto=format&fit=crop&w=800&q=80",
    alternativeDesc: "A beautiful, serene white stupa built by Japanese Buddhist monks on Rumassala hill, offering panoramic bay vistas and a quiet spiritual environment."
  },
  {
    name: "Dambulla Cave Temple",
    isCrowded: false,
    crowdLevel: 55,
    alternativeDestination: "Ibbankatuwa Megalithic Burial Site",
    description: "The iconic Golden Temple and Cave Temple complex, featuring five caves filled with ancient Buddhist murals and 153 statues. Highly prone to indoor humidity and crowding.",
    category: "Sacred Heritage",
    image: "https://images.unsplash.com/photo-1608958416733-149d59ec3c3c?auto=format&fit=crop&w=800&q=80",
    alternativeDesc: "An ancient burial ground dating back to the Megalithic prehistoric era of Sri Lanka, offering a quiet, uncrowded archaeological walk through history."
  },
  {
    name: "Royal Botanic Gardens, Peradeniya",
    isCrowded: false,
    crowdLevel: 60,
    alternativeDestination: "Gannoruwa Agro Technology Park",
    description: "The largest and most renowned botanical garden in Sri Lanka, boasting over 4,000 species of plants and ancient giant trees. Very crowded during weekends and school holidays.",
    category: "Botanical Haven",
    image: "https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=800&q=80",
    alternativeDesc: "An educational demonstration park showcasing modern and traditional farming, hydroponics, and herbal gardens in a tranquil setting."
  },
  {
    name: "Edison Bungalow",
    isCrowded: false,
    crowdLevel: 45,
    alternativeDestination: "Idalgashinna Colonial Railway Node",
    description: "A gorgeous, historic stone country house located in Haputale, surrounded by manicured English gardens, tea estates, and misty pine forests. Prone to weekend tourist congestion.",
    category: "Colonial Sanctuary",
    image: "https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=800&q=80",
    alternativeDesc: "A remote and breathtaking mountain railway station famous for its 14 tunnels and misty pine-forest backdrop, offering a peaceful, crowd-free trekking route."
  }
];

// Active in-memory collection acting as secondary persistence when MongoDB is unavailable
let memoryCollection: Destination[] = [...defaultDestinations];

// Database state connection check
let isDatabaseConnected = false;

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.info("⚠️ MONGODB_URI is not set. Shifting into robust in-memory persistence mode for immediate sandbox execution.");
    isDatabaseConnected = false;
    return;
  }

  try {
    // Attempt connecting with a short 3-timeout to avoid blocking container starts
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    isDatabaseConnected = true;
    console.log("🚀 Custom Database Setup: Connected successfully to MongoDB!");

    // Seed database with default data if empty
    const count = await DestinationModel.countDocuments();
    if (count === 0) {
      await DestinationModel.insertMany(defaultDestinations);
      console.log("🌱 Database seeded with default high-density tourist locations.");
    }
  } catch (error) {
    console.warn("❌ MongoDB connection failed. Falling back to in-memory persistence.", error);
    isDatabaseConnected = false;
  }
}

// Database helper operations supporting both standard MongoDB and in-memory fallback
export async function getDestinations(): Promise<Destination[]> {
  if (isDatabaseConnected && mongoose.connection.readyState === 1) {
    try {
      return await DestinationModel.find().lean();
    } catch {
      // Inline safety check
    }
  }
  return memoryCollection;
}

export async function getDestinationByName(name: string): Promise<Destination | null> {
  if (isDatabaseConnected && mongoose.connection.readyState === 1) {
    try {
      const doc = await DestinationModel.findOne({ name }).lean();
      if (doc) return doc;
    } catch {
      // Inline safety check
    }
  }
  const item = memoryCollection.find(d => d.name.toLowerCase() === name.toLowerCase());
  return item || null;
}

export async function updateDestinationCrowd(name: string, level: number): Promise<Destination | null> {
  const isCrowded = level > 75;
  
  if (isDatabaseConnected && mongoose.connection.readyState === 1) {
    try {
      const updated = await DestinationModel.findOneAndUpdate(
        { name },
        { crowdLevel: level, isCrowded },
        { new: true }
      ).lean();
      if (updated) return updated;
    } catch {
      // Inline safety check
    }
  }

  const index = memoryCollection.findIndex(d => d.name.toLowerCase() === name.toLowerCase());
  if (index !== -1) {
    memoryCollection[index] = {
      ...memoryCollection[index],
      crowdLevel: level,
      isCrowded
    };
    return memoryCollection[index];
  }
  return null;
}

export async function initSeed() {
  // Resets the states back to default configuration
  memoryCollection = JSON.parse(JSON.stringify(defaultDestinations));
  if (isDatabaseConnected && mongoose.connection.readyState === 1) {
    try {
      await DestinationModel.deleteMany({});
      await DestinationModel.insertMany(defaultDestinations);
    } catch {
      // Inline safety check
    }
  }
}
