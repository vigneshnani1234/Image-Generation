import React from 'react';
import { Link, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
// Assuming you have a logo in `src/assets`
import  logo  from './assets/logo.jpg'; // Or wherever your logo is
// import { Home, CreatePost, Login } from './pages';
import Home from './pages/Home';
import Login from './pages/Login';
import CreatePost from './pages/CreatePost';

const App = () => {
  return (
    <div> {/* We don't need BrowserRouter here anymore */}
      <header className='w-full flex justify-between items-center bg-white sm:px-8 px-4 py-4 border-b border-b-[#e6ebf4]'>
        <Link to="/">
          <img src={logo} alt="logo" className='w-28 object-contain' />
        </Link>

        <div className="flex items-center gap-4">
          {/* This link will only be visible to signed-in users */}
          <SignedIn>
            <Link to="/create-post" className='font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md'>
              Create
            </Link>
            <UserButton afterSignOutUrl='/' />
          </SignedIn>

          {/* If the user is signed out, they will be prompted to sign in if they try to access protected content. The Login page will have the button. */}
        </div>
      </header>

      <main className='sm:p-8 px-4 py-8 w-full bg-[#f9fafe] min-h-[calc(100vh-73px)]'>
        <Routes>
          {/* 
            This is the main routing logic.
            If a user is signed in, they will see the Home component at the root path.
            If they are signed out, they will see the Login component.
          */}
          <Route path="/" element={
            <>
              <SignedIn>
                <Home />
              </SignedIn>
              <SignedOut>
                <Login />
              </SignedOut>
            </>
          } />

          {/* This is a protected route. */}
          <Route path="/create-post" element={
            <>
              <SignedIn>
                <CreatePost />
              </SignedIn>
              {/* If a signed-out user tries to access this page, they will be redirected to the sign-in modal. */}
              <SignedOut>
                <Navigate to="/" replace />
              </SignedOut>
            </>
          } />
        </Routes>
      </main>
    </div>
  );
};

export default App;