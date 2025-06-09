import express from 'express';
import * as dotenv from 'dotenv';
import { HfInference } from '@huggingface/inference';
import cloudinary from 'cloudinary';
// --- THE FIX IS HERE ---
// Import both the middleware AND the clerkClient
import { ClerkExpressRequireAuth, clerkClient } from '@clerk/clerk-sdk-node';

import Post from '../mongodb/models/post.js';

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const router = express.Router();
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// GET route (public, no changes)
router.route('/').get(async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ success: false, message: 'Fetching posts failed, please try again' });
  }
});
// CREATE route (secured, with the final fix)
router.route('/').post(ClerkExpressRequireAuth(), async (req, res) => {
  try {
    // --- STEP 1: GET VERIFIED USER ID & FETCH FULL USER PROFILE ---
    // The middleware guarantees we have a valid userId.
    const { userId } = req.auth;
    const { prompt } = req.body;

    // --- THE FIX IS HERE ---
    // Use the clerkClient to fetch the full user object using the userId.
    // This is the necessary step to get details like firstName and lastName.
    const user = await clerkClient.users.getUser(userId);

    // Now that we have the full user object, we can safely construct the name.
    const name = user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.username;

    if (!prompt) {
      return res.status(400).json({ success: false, message: 'A prompt is required.' });
    }

    // --- STEP 2: GENERATE IMAGE ---
    console.log(`1. User '${userId}' (${name}) generating image for prompt: "${prompt}"`);
    const imageResponse = await hf.textToImage({
      model: 'stabilityai/stable-diffusion-xl-base-1.0',
      inputs: prompt,
      parameters: { negative_prompt: 'blurry, ugly, deformed' },
    });
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    console.log('2. Image generated successfully.');

    // --- STEP 3: UPLOAD TO CLOUDINARY ---
    const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
    console.log('3. Uploading image to Cloudinary...');
    const cloudinaryUploadResult = await cloudinary.v2.uploader.upload(base64Image, {
      folder: 'ai-image-generator',
    });
    const photoUrl = cloudinaryUploadResult.secure_url;
    console.log('4. Image uploaded successfully. URL:', photoUrl);

    // --- STEP 4: SAVE TO MONGODB ---
    const newPost = await Post.create({
      name,
      prompt,
      userId,
      photoUrl,
    });
    console.log('5. Post metadata saved to MongoDB.');

    // --- STEP 5: SEND SUCCESS RESPONSE ---
    res.status(201).json({ success: true, data: newPost });

  } catch (err) {
    console.error('--- BACKEND CRASH ---');
    console.error(err);
    res.status(500).json({ success: false, message: 'An error occurred on the server while creating the post.' });
  }
});

export default router;