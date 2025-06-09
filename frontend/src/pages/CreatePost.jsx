import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// CORRECTED: Combined imports into one line to remove the duplicate.
import { useUser, useAuth } from '@clerk/clerk-react';

// A simple loader component
const Loader = () => (
  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
);

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();

  const [form, setForm] = useState({
    prompt: '',
  });

  const [generatingImg, setGeneratingImg] = useState(false);
  const [generatedPhoto, setGeneratedPhoto] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.prompt) {
      alert('Please enter a prompt to generate an image.');
      return;
    }

    if (!user) {
      alert('You must be logged in to create a post.');
      return;
    }

    setGeneratingImg(true);
    setGeneratedPhoto(null);

    try {
      const token = await getToken();
      const apiEndpoint = `${import.meta.env.VITE_API_URL}/api/v1/posts`;

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        // --- THE FIX IS HERE ---
        // The backend now securely gets the user's name from the token.
        // We only need to send the data the backend can't figure out on its own: the prompt.
        body: JSON.stringify({
          prompt: form.prompt,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong on the server.');
      }

      const result = await response.json();

      setGeneratedPhoto(result.data.photoUrl);
      
      alert('Success! Your image has been generated and shared with the community.');
      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (err) {
      alert(`An error occurred: ${err.message}`);
      console.error(err);
    } finally {
      setGeneratingImg(false);
    }
  };

  // The JSX for the form and display area remains the same.
  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">Create</h1>
        <p className="mt-2 text-[#666e75] text-[16px]">
          Describe your vision, and let our AI bring it to life. Once generated, your image will be shared with the community.
        </p>
      </div>

      <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-900">
            Your Prompt
          </label>
          <textarea
            id="prompt"
            name="prompt"
            value={form.prompt}
            onChange={handleChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary outline-none block w-full p-3"
            placeholder="A photorealistic cat wearing a tiny wizard hat..."
            rows="4"
            required
          />
        </div>
        
        <div className="mt-5">
          <button
            type="submit"
            className="font-inter font-medium bg-primary text-white px-8 py-2.5 rounded-md w-full sm:w-auto text-center"
            disabled={generatingImg}
          >
            {generatingImg ? 'Generating...' : 'Generate & Share'}
          </button>
        </div>
      </form>
      
      <div className="mt-10">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Your Generated Image:</h2>
        <div className="relative bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg w-full sm:w-96 p-3 h-96 flex justify-center items-center mx-auto shadow-inner">
          {generatedPhoto ? (
            <img src={generatedPhoto} alt={form.prompt} className="w-full h-full object-contain" />
          ) : generatingImg ? (
            <Loader />
          ) : (
            <div className="text-gray-400 text-center p-4">
              Your generated image will appear here after you submit a prompt.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CreatePost;