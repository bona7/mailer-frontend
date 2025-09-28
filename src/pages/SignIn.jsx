
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MailerLogo from '../assets/mailer-logo.svg';
import MailerLogoHeader from '../assets/mailer-logo-header.svg';

function SignIn() {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-primary-light/35 p-4">
      <img src={MailerLogoHeader} alt="Mailer Header Logo" className="absolute top-8 left-8 w-32" />
      <div className="w-full max-w-xl p-8 sm:p-12 rounded-2xl shadow-lg bg-card-bg">
        <div className="flex justify-center mb-6 sm:mb-8">
          <img src={MailerLogo} alt="Mailer Logo" className="w-48" />
        </div>

        <div className="flex justify-center space-x-2 mb-6 sm:mb-8">
          <button 
            className="w-1/2 py-2 px-4 sm:py-3 rounded-2xl border-2 text-base sm:text-lg text-white bg-primary-dark border-primary-dark"
          >
            Sign IN
          </button>
          <button 
            className="w-1/2 py-2 px-4 sm:py-3 rounded-2xl border-2 text-base sm:text-lg border-primary-dark text-primary-dark hover:bg-[#A5BDE4]/20 transition-colors"
            onClick={handleSignUpClick}
          >
            Sign Up
          </button>
        </div>

        <div className="space-y-4 sm:space-y-5">
          <input 
            type="email" 
            placeholder="@gmail.com" 
            className="w-full px-4 py-3 sm:py-4 border rounded-lg text-right placeholder-gray-400 border-primary-dark"
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full px-4 py-3 sm:py-4 border rounded-lg placeholder-gray-400 border-primary-dark"
          />
        </div>

        <button 
          className="w-full mt-6 sm:mt-8 py-3 rounded-lg text-white text-lg sm:text-xl bg-primary-dark"
        >
          sign in
        </button>
      </div>
    </div>
  );
}

export default SignIn;
