import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    // The name of the user who created the post.
    name: { type: String, required: true },

    // The Clerk user ID to link the post to a user.
    userId: { type: String, required: true },

    // The prompt used for generation.
    prompt: { type: String, required: true },

    // The public URL of the image in Firebase.
    // CORRECTED: Changed from 'photourl' to 'photoUrl' to match our route logic.
    photoUrl: { type: String, required: true },
  },
  {
    // Automatically adds `createdAt` and `updatedAt` fields.
    timestamps: true,
  }
);

const PostModel = mongoose.model('Post', PostSchema);

export default PostModel;