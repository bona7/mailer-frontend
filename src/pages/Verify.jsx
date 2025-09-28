import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MailerLogoHeader from '../assets/mailer-logo-header.svg';
import DomainDrop from '../components/domain_drop';

function Verify() {
  const navigate = useNavigate();
  const [selectedDomain, setSelectedDomain] = useState('gmail.com');
  const [isDirectInput, setIsDirectInput] = useState(false);

  const handleDomainSelect = (domain) => {
    if (domain === '직접 입력') {
      setIsDirectInput(true);
      setSelectedDomain('');
    } else {
      setIsDirectInput(false);
      setSelectedDomain(domain);
    }
  };

  // In a real app, you'd handle form state and submission
  const handleVerification = () => {
    // Logic to verify the code
    console.log('Verification logic goes here');
    // Navigate to the main page or dashboard on success
    navigate('/'); 
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-primary-light/35 p-4">
      <img src={MailerLogoHeader} alt="Mailer Header Logo" className="absolute top-8 left-8 w-32" />
      <div className="w-full max-w-4xl pt-8 pb-8 pr-48 pl-48 sm:pt-12 sm:pb-12 sm:pr-48 sm:pl-48 rounded-xl shadow-lg bg-card-bg min-h-[580px]">
        <div className="px-8 -mx-44 sm:-mx-44">
          <h1 className="text-xl sm:text-2xl font-regular text-primary-dark mb-8 text-left">Verification Code</h1>
        </div>

        <div className="space-y-4 sm:space-y-5">
          <div className="flex items-center space-x-2">
            <input 
              type="text" 
              placeholder="@"
              className="w-full px-4 py-3 sm:py-3 border rounded-xl text-right placeholder-gray-400 border-primary-dark h-11"
            />
            {isDirectInput ? (
              <div className="relative w-36">
                <input
                  type="text"
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  placeholder="domain.com"
                  className="w-full px-4 py-3 sm:py-3 border rounded-xl border-primary-dark pr-8 h-11"
                />
                <button
                  type="button"
                  onClick={() => setIsDirectInput(false)}
                  className="absolute inset-y-0 right-0 flex items-center pr-2"
                >
                  <svg className={`w-4 h-4 text-gray-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
              </div>
            ) : (
              <DomainDrop 
                selectedDomain={selectedDomain} 
                onDomainChange={handleDomainSelect} 
              />
            )}
          </div>
          <input 
            type="text" 
            placeholder="two-factor verification code" 
            className="w-full px-4 py-3 sm:py-3 border rounded-xl placeholder-gray-400 border-primary-dark h-11"
          />
        </div>

        <div className="text-right mt-3">
          <a href="#" className="text-sm text-[#456FB1] hover:underline">
            Go to get your code
          </a>
        </div>

        <div className="flex justify-end">
          <button 
            onClick={handleVerification}
            className="mt-6 sm:mt-6 py-3 px-6 rounded-xl text-white text-md bg-primary-dark"
          >
            Verified
          </button>
        </div>
      </div>
    </div>
  );
}

export default Verify;
