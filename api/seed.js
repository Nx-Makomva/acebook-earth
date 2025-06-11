import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.js";
import Post from "./models/post.js";

dotenv.config();

const MONGO_URL = process.env.MONGODB_URL;

const usersData = [
  {
    name: "Max Vibecheck",
    email: "max@whatevermail.com",
    password: "maxpassword123",
    location: "Nowhere, USA",
    bio: "Breathing and complaining—multitasking legend.",
    dob: "1998-07-04",
    status: "Thinking about deleting the internet.",
  },
  {
    name: "Jessie Chaos",
    email: "jessie@lolmail.net",
    password: "chaos4life",
    location: "Moodville",
    bio: "Currently taking life one regret at a time.",
    dob: "2000-02-29",
    status: "Vibing too hard to function.",
  },
  {
    name: "Brogan Meh",
    email: "brogan@shrugmail.com",
    password: "whateverman123",
    location: "IDK, Earth?",
    bio: "Here to waste your scroll time.",
    dob: "1995-11-11",
    status: "Just here to judge silently.",
  },
  {
    name: "Lola Nope",
    email: "lola@nope.zone",
    password: "nopenopenope",
    location: "404 Not Found",
    bio: "I put the ‘pro’ in procrastinate.",
    dob: "1999-03-15",
    status: "Mildly annoyed by everything.",
  },
  {
    name: "Chad Eternal",
    email: "chad@vibesonly.co",
    password: "liftthenap",
    location: "Gym or couch, nowhere else.",
    bio: "Existence is a flex.",
    dob: "1993-06-21",
    status: "Lowkey spiraling, highkey chillin’.",
  },
  {
    name: "Nina Sighs",
    email: "nina@sarcastik.net",
    password: "ninasighs404",
    location: "Caffeinated Limbo",
    bio: "Living proof caffeine doesn't fix everything.",
    dob: "1997-09-09",
    status: "If lost, return to bed.",
  },
  {
    name: "Theo Typo",
    email: "theo@misspellit.com",
    password: "oopsiedoodle",
    location: "Somewhere between here and there",
    bio: "Keyboard smashing through life.",
    dob: "2001-12-01",
    status: "I meant to do that. Totally.",
  },
  {
    name: "Cleo Shrug",
    email: "cleo@mehmail.org",
    password: "123idkbruh",
    location: "¯\\_(ツ)_/¯",
    bio: "No thoughts, just eyerolls.",
    dob: "1996-08-08",
    status: "Am I thriving or just tired?",
  },
  {
    name: "Zeke Drama",
    email: "zeke@oopsmail.com",
    password: "dramaking69",
    location: "Your notifications",
    bio: "Petty and proud.",
    dob: "1994-10-10",
    status: "Currently overreacting to nothing.",
  },
  {
    name: "Sasha Void",
    email: "sasha@blackholemail.com",
    password: "existential123",
    location: "The algorithm's shadow",
    bio: "I screamed into the void and it ghosted me.",
    dob: "2002-04-20",
    status: "Just here for the memes and mild dread.",
  },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB.");

    await User.deleteMany();
    await Post.deleteMany();

    // Hash passwords and insert users
    const users = await Promise.all(
      usersData.map(async (user) => {
        // const hashed = await bcrypt.hash(user.password, 10);
        return new User({
          ...user
        }).save();
      })
    );

    // Create some friendships (e.g., first 3 users are friends with each other)
    users[0].friends = [users[1]._id, users[2]._id]; // Max → Jessie, Brogan
    users[1].friends = [users[0]._id];               // Jessie → Max
    users[2].friends = [users[0]._id];               // Brogan → Max
    await Promise.all(users.slice(0, 3).map((user) => user.save()));

    // Create some posts
    const posts = [
      {
        userId: users[1]._id,
        username: users[1].name,
        title: "Too much chaos",
        content: "I knocked over a bookshelf and blamed my vibe.",
      },
      {
        userId: users[2]._id,
        username: users[2].name,
        title: "Meh moment",
        content: "I was going to write something, then I didn’t.",
      },
      {
        userId: users[0]._id,
        username: users[0].name,
        title: "Peak Vibe",
        content: "Tried to meditate but ended up napping.",
        imageUrl: "https://placekitten.com/402/302",
      },
    ];

    await Post.insertMany(posts);

    console.log("🌱 Seed complete!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding:", err);
    process.exit(1);
  }
};

seed();
