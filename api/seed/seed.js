import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/user.js";
import Post from "../models/post.js";
import Image from "../models/imageSchema.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MONGO_URL = process.env.MONGODB_URL;

// Sample user data
const usersData = [
  {
    name: "Max Vibecheck",
    email: "max@whatevermail.com",
    password: "maxpassword123",
    location: "Nowhere, USA",
    bio: "Breathing and complaining—multitasking legend.",
    dob: "1998-07-04",
    status: "Thinking about deleting the internet.",
    image: "seedImages/profile_1.png",
  },
  {
    name: "Jessie Chaos",
    email: "jessie@lolmail.net",
    password: "chaos4life",
    location: "Moodville",
    bio: "Currently taking life one regret at a time.",
    dob: "2000-02-29",
    status: "Vibing too hard to function.",
    image: "seedImages/profile_2.jpeg",
  },
  {
    name: "Brogan Meh",
    email: "brogan@shrugmail.com",
    password: "whateverman123",
    location: "IDK, Earth?",
    bio: "Here to waste your scroll time.",
    dob: "1995-11-11",
    status: "Just here to judge silently.",
    image: "seedImages/profile_3.webp",
  },
  {
    name: "Lola Nope",
    email: "lola@nope.zone",
    password: "nopenopenope",
    location: "404 Not Found",
    bio: "I put the ‘pro’ in procrastinate.",
    dob: "1999-03-15",
    status: "Mildly annoyed by everything.",
    image: "seedImages/profile_4.webp",
  },
  {
    name: "Chad Eternal",
    email: "chad@vibesonly.co",
    password: "liftthenap",
    location: "Gym or couch, nowhere else.",
    bio: "Existence is a flex.",
    dob: "1993-06-21",
    status: "Lowkey spiraling, highkey chillin’.",
    image: "seedImages/profile_5.jpg",
  },
  {
    name: "Nina Sighs",
    email: "nina@sarcastik.net",
    password: "ninasighs404",
    location: "Caffeinated Limbo",
    bio: "Living proof caffeine doesn't fix everything.",
    dob: "1997-09-09",
    status: "If lost, return to bed.",
    image: "seedImages/profile_6.jpg",
  },
  {
    name: "Theo Typo",
    email: "theo@misspellit.com",
    password: "oopsiedoodle",
    location: "Somewhere between here and there",
    bio: "Keyboard smashing through life.",
    dob: "2001-12-01",
    status: "I meant to do that. Totally.",
    image: "seedImages/profile_7.jpg",
  },
  {
    name: "Cleo Shrug",
    email: "cleo@mehmail.org",
    password: "123idkbruh",
    location: "¯\\_(ツ)_/¯",
    bio: "No thoughts, just eyerolls.",
    dob: "1996-08-08",
    status: "Am I thriving or just tired?",
    image: "seedImages/profile_8.jpeg",
  },
  {
    name: "Zeke Drama",
    email: "zeke@oopsmail.com",
    password: "dramaking69",
    location: "Your notifications",
    bio: "Petty and proud.",
    dob: "1994-10-10",
    status: "Currently overreacting to nothing.",
    image: "seedImages/profile_9.jpeg",
  },
  {
    name: "Sasha Void",
    email: "sasha@blackholemail.com",
    password: "existential123",
    location: "The algorithm's shadow",
    bio: "I screamed into the void and it ghosted me.",
    dob: "2002-04-20",
    status: "Just here for the memes and mild dread.",
    image: "seedImages/profile_10.jpg"
  },
];

// Get all image files from directory
const getImageFiles = (dir) => {
  try {
    return fs.readdirSync(dir)
      .filter(file => ['.jpg', '.jpeg', '.png', '.gif'].includes(path.extname(file).toLowerCase()))
      .map(file => path.join(dir, file));
  } catch (err) {
    console.error(`Error reading directory ${dir}:`, err.message);
    return [];
  }
};

// Path to your seed images
const seedImageDir = path.join(__dirname, "seedImages");
const profileImages = getImageFiles(seedImageDir).filter(f => f.includes('profile_'));
const postImages = getImageFiles(seedImageDir).filter(f => f.includes('post_'));

// Helper function to create image documents
const createImageDocument = async (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Image file not found: ${filePath}`);
    }
    
    const ext = path.extname(filePath).toLowerCase();
    const contentType = ext === '.png' ? 'image/png' : 
                       ext === '.gif' ? 'image/gif' : 'image/jpeg';
    
    const imageData = fs.readFileSync(filePath);
    return new Image({
      name: path.basename(filePath),
      image: {
        data: imageData,
        contentType
      }
    }).save();
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err.message);
    return null;
  }
};

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB.");

    // Clear existing data
    await User.deleteMany();
    await Post.deleteMany();
    await Image.deleteMany();

    console.log("Processing profile images...");
    const createdProfileImages = (await Promise.all(
      profileImages.map(createImageDocument)
    )).filter(img => img !== null);

    console.log("Processing post images...");
    const createdPostImages = (await Promise.all(
      postImages.map(createImageDocument)
    ));

    if (createdProfileImages.length === 0 || createdPostImages.length === 0) {
      throw new Error("Not enough images were processed successfully");
    }

    console.log("Creating users...");
    const users = await Promise.all(
      usersData.map(async (user, index) => {
        const profileImage = createdProfileImages[index % createdProfileImages.length];
        
        return new User({
          ...user,
          image: profileImage._id
        }).save();
      })
    );

    // Create friendships (each user friends with next 2 users)
    await Promise.all(users.map(async (user, index) => {
      user.friends = [
        users[(index + 1) % users.length]._id,
        users[(index + 2) % users.length]._id
      ];
      await user.save();
    }));

    // Create posts (25% with images)
    const posts = [];
    const postContents = [
      "I knocked over a bookshelf and blamed my vibe.",
      "I was going to write something, then I didn't.",
      "Tried to meditate but ended up napping.",
      "Currently questioning all my life choices.",
      "My plants are judging my life decisions.",
      "I put the 'pro' in procrastination.",
      "My bed and I have a strong connection.",
      "I'm not lazy, I'm in energy-saving mode."
    ];
    
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      
      // First post (text only)
      posts.push({
        userId: user._id,
        content: `${postContents[i % postContents.length]}`,
        likes: []
      });
      
      // Second post (25% chance of image)
      const postData = {
        userId: user._id,
        content: `${postContents[(i + 2) % postContents.length]}`,
        likes: []
      };
      
      if (i % 4 === 0) { // 25% of posts will have images
        const randomImage = createdPostImages[Math.floor(Math.random() * createdPostImages.length)];
        postData.images = [randomImage._id];
      }
      
      posts.push(postData);
    }

    await Post.insertMany(posts);

    console.log("🌱 Seed complete!");
    console.log(`Created: 
      - ${users.length} users with profile pictures
      - ${posts.length} posts (${posts.filter(p => p.images).length} with images)
      - ${createdPostImages.length} post images`);
    
    process.exit(0);
  } catch (err) {
    console.error("Error seeding:", err);
    process.exit(1);
  }
};

seed();