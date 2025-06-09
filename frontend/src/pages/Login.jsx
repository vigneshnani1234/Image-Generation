import React from 'react';
import { SignInButton } from '@clerk/clerk-react';

const Login = () => {
  return (
    <section className="max-w-7xl mx-auto flex flex-col items-center text-center">
      <div>
        <h1 className='font-extrabold text-[#222328] text-[32px]'>
          Create Imaginative and Visually Stunning Images
        </h1>
        <p className='mt-2 text-[#666e75] text-[16px] max-w-[500px]'>
          Welcome to our AI Image Generation platform. Sign in to bring your text prompts to life and explore a community of amazing creations.
        </p>
      </div>

      <div className="mt-8">
        <SignInButton mode="modal">
          <button
            type="button"
            className="font-inter font-medium bg-[#6469ff] text-white px-6 py-3 rounded-md text-lg"
          >
            Sign In to Get Started
          </button>
        </SignInButton>
      </div>
    </section>
  );
};

export default Login;