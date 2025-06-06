const request = require("supertest");
const JWT = require("jsonwebtoken");

const app = require("../../app");
const Post = require("../../models/post");
const User = require("../../models/user");
const mongoose = require('mongoose');
require("../mongodb_helper");

const secret = process.env.JWT_SECRET;

function createToken(userId) {
  return JWT.sign(
    {
      sub: userId,
      // Backdate this token of 5 minutes
      iat: Math.floor(Date.now() / 1000) - 5 * 60,
      // Set the JWT token to expire in 10 minutes
      exp: Math.floor(Date.now() / 1000) + 10 * 60,
    },
    secret
  );
}

let token;
let userId
describe("/posts", () => {
  beforeAll(async () => {
    const user = new User({
      name: "someone",
      email: "post-test@test.com",
      password: "12345678",
      friends: [],
    });
    await user.save();
    userId = user._id
    await Post.deleteMany({});
    token = createToken(user.id);
  });

  afterEach(async () => {
    await User.deleteMany({_id: { $ne: userId }});
    await Post.deleteMany({});
  
  });

  afterAll(async () => {
  await mongoose.connection.close();
  });

  describe("POST, when a valid token is present", () => {
    test("responds with a 201", async () => {
      const response = await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ content: "Hello World!" });
      expect(response.status).toEqual(201);
    });

    test("creates a new post", async () => {
      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ content: "Hello World!!" });

      const posts = await Post.find();
      expect(posts.length).toEqual(1);
      expect(posts[0].content).toEqual("Hello World!!");
    });

    test("returns a new token", async () => {
      const testApp = request(app);
      const response = await testApp
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ content: "hello world" });

      const newToken = response.body.token;
      const newTokenDecoded = JWT.decode(newToken, process.env.JWT_SECRET);
      const oldTokenDecoded = JWT.decode(token, process.env.JWT_SECRET);

      // iat stands for issued at
      expect(newTokenDecoded.iat > oldTokenDecoded.iat).toEqual(true);
    });
  });

  describe("POST, when token is missing", () => {
    test("responds with a 401", async () => {
      const response = await request(app)
        .post("/posts")
        .send({ content: "hello again world" });

      expect(response.status).toEqual(401);
    });

    test("a post is not created", async () => {
      await request(app)
        .post("/posts")
        .send({ content: "hello again world" });

      const posts = await Post.find();
      expect(posts.length).toEqual(0);
    });

    test("a token is not returned", async () => {
      const response = await request(app)
        .post("/posts")
        .send({ content: "hello again world" });

      expect(response.body.token).toEqual(undefined);
    });
  });

  describe("GET, when token is present", () => {
    test("the response code is 200", async () => {
      const post1 = new Post({ content: "I love all my children equally" });
      const post2 = new Post({ content: "I've never cared for GOB" });
      await post1.save();
      await post2.save();

      const response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(200);
    });

    test("returns every post in the collection", async () => {
      const post1 = new Post({ content: "howdy!" });
      const post2 = new Post({ content: "hola!" });
      await post1.save();
      await post2.save();

      const response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`);

      const posts = response.body.posts;
      const firstPost = posts[0];
      const secondPost = posts[1];

      expect(firstPost.content).toEqual("howdy!");
      expect(secondPost.content).toEqual("hola!");
    });

    test("returns a new token", async () => {
      const post1 = new Post({ content: "First Post!" });
      const post2 = new Post({ content: "Second Post!" });
      await post1.save();
      await post2.save();

      const response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`);

      const newToken = response.body.token;
      const newTokenDecoded = JWT.decode(newToken, process.env.JWT_SECRET);
      const oldTokenDecoded = JWT.decode(token, process.env.JWT_SECRET);

      // iat stands for issued at
      expect(newTokenDecoded.iat > oldTokenDecoded.iat).toEqual(true);
    });
  });

  describe("GET, when token is missing", () => {
    test("the response code is 401", async () => {
      const post1 = new Post({ content: "howdy!" });
      const post2 = new Post({ content: "hola!" });
      await post1.save();
      await post2.save();

      const response = await request(app).get("/posts");

      expect(response.status).toEqual(401);
    });

    test("returns no posts", async () => {
      const post1 = new Post({ content: "howdy!" });
      const post2 = new Post({ content: "hola!" });
      await post1.save();
      await post2.save();

      const response = await request(app).get("/posts");

      expect(response.body.posts).toEqual(undefined);
    });

    test("does not return a new token", async () => {
      const post1 = new Post({ content: "howdy!" });
      const post2 = new Post({ content: "hola!" });
      await post1.save();
      await post2.save();

      const response = await request(app).get("/posts");

      expect(response.body.token).toEqual(undefined);
    });
  });

  describe('GET /posts/:postId, when a token is present', () => {
    test("the response code is 200", async () => {
      const post1 = new Post({ content: "I love all my children equally" });
      const post2 = new Post({ content: "I've never cared for GOB" });
      await post1.save();
      await post2.save();


      const response = await request(app)
        .get(`/posts/${post1._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(200);
      
  });
    test('return a specific post', async () => {
      const post1 = new Post({ content: "I love all my children equally" });
      const post2 = new Post({ content: "I've never cared for GOB" });
      await post1.save();
      await post2.save();

      const response = await request(app)
        .get(`/posts/${post1._id}`)
        .set("Authorization", `Bearer ${token}`);

        expect(response.body.post.content).toEqual("I love all my children equally");
    });

    test('return a new token', async () => {
      const post1 = new Post({ content: "I love all my children equally" });
      const post2 = new Post({ content: "I've never cared for GOB" });
      await post1.save();
      await post2.save();

      const response = await request(app)
        .get(`/posts/${post1._id}`)
        .set("Authorization", `Bearer ${token}`);
      const newToken = response.body.token;
      const newTokenDecoded = JWT.decode(newToken, process.env.JWT_SECRET);
      const oldTokenDecoded = JWT.decode(token, process.env.JWT_SECRET);

      // iat stands for issued at
      expect(newTokenDecoded.iat > oldTokenDecoded.iat).toEqual(true);
});
    test("responds with 404 when post not found", async () => {
      const nonExistentId = "64a13f8bcf1e4f13e9d12345"; 
      const response = await request(app)
        .get(`/posts/${nonExistentId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toMatch("Try again loser.")
});

describe('GET /posts/feed/:userId, when a token is present', () => {
  test("the response code is 200 and returns posts from friends only", async () => {
    // 1. Get fresh instance of main user to avoid stale data
    const mainUser = await User.findById(userId).exec();
    if (!mainUser) throw new Error("Main user not found");

    // 2. Create friend users
    const friend1 = await User.create({name: "someone", email: 'f1@test.com', password: 'test123'});
    const friend2 = await User.create({name: "someone", email: 'f2@test.com', password: 'test1234'});

    // 3. Update friends list and save
    mainUser.friends = [friend1._id, friend2._id];
    await mainUser.save();

    // 4. Create test posts - using correct field name (userId)
    await Post.create([
      { content: "Friend 1 post", userId: friend1._id },
      { content: "Friend 2 post", userId: friend2._id },
      { 
        content: 'Stranger post', 
        userId: new mongoose.Types.ObjectId() // Not in friends list
      }
    ]);

    // 5. Make the request
    const response = await request(app)
      .get(`/posts/feed/${mainUser._id}`)
      .set("Authorization", `Bearer ${token}`);

    // Assertions
    expect(response.status).toEqual(200);
    expect(response.body.posts).toHaveLength(2);
    
    // Verify only friend posts are returned
    const returnedContents = response.body.posts.map(p => p.content);
    expect(returnedContents).toContain("Friend 1 post");
    expect(returnedContents).toContain("Friend 2 post");
    expect(returnedContents).not.toContain("Stranger post");

    const newToken = response.body.token;
    const newTokenDecoded = JWT.decode(newToken, process.env.JWT_SECRET);
    const oldTokenDecoded = JWT.decode(token, process.env.JWT_SECRET);
    expect(newTokenDecoded.iat > oldTokenDecoded.iat).toEqual(true);
  
  });
  test("returns 404 for non existent user", async () => {
    const nonExistentId = "64a13f8bcf1e4f13e9d12345"; 
    const response = await request(app)
      .get(`/posts/feed/${nonExistentId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toMatch("User not found.")
  });

describe('PATCH /posts/:postId, when token is present', () => {
  test("responds with 200 and updates the post", async () => {
    const mainUser = await User.findById(userId).exec();
    const post = new Post({content: "Original post", userId: mainUser._id});
    await post.save();
    const response = await request(app)
      .patch(`/posts/${post._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({content: "Updated post"});
    expect(response.status).toEqual(200);
    expect(response.body.posts.content).toBe("Updated post");

  });
  test("responds with 404 when the post doesn't exist", async () => {
    const nonExistentId = "64a13f8bcf1e4f13e9d12345"; 
    const response = await request(app)
      .patch(`/posts/${nonExistentId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({content: "Updated post"});

    expect(response.status).toEqual(404);
    expect(response.body.message).toMatch('Post not found.')
  });
})
describe('DELETE /posts/:postId, when token is present', () => {
  test("responds with 200, deletes the post and generates the token", async () => {
    const mainUser = await User.findById(userId).exec();
    const post = new Post ({content: "Original post", userId: mainUser._id});
    await post.save();

    const response = await request(app)
      .delete(`/posts/${post._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.posts.content).toMatch("Original post");

    const newToken = response.body.token;
    const newTokenDecoded = JWT.decode(newToken, process.env.JWT_SECRET);
    const oldTokenDecoded = JWT.decode(token, process.env.JWT_SECRET);
    expect(newTokenDecoded.iat > oldTokenDecoded.iat).toEqual(true);
  })
  test("responds with 404 when post doesn't exist", async () => {
    const nonExistentId = "64a13f8bcf1e4f13e9d12345"; 
    const response = await request(app)
      .delete(`/posts/${nonExistentId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(404);
    expect(response.body.message).toMatch('Post not found.')
  })
})
});
}) }) 