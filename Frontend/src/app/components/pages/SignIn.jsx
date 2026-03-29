'use client';
import React, { useState } from 'react';
import { useFinancial } from '../../context/FinancialContext';
import {useRouter} from 'next/navigation'

export default function SignIn({ onNavigate }) {
  const [isSignUp, setIsSignUp] = useState(true);
  const { login  } = useFinancial();
  
  const [formData, setFormData] = useState({
   name: '',
    email: '',
    password: '',
    
  
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const router=useRouter();

  const handleChange = (e) => 
  {
    const {name,value,checked,type} = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
  };
  const validateForm = () => {
    const newErrors = {}
    
    if (isSignUp && !formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    return newErrors
  }
 const handleSubmit = async (e) => {
  e.preventDefault();

  setIsLoading(true);

  try {
    if (isSignUp) {
      // SIGN UP flow
      const newErrors = validateForm();
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setIsLoading(false);
        return;
      }

      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || JSON.stringify(data));
        return;
      }

      login(data.user, data.token);
      // New users go through onboarding
      if (onNavigate) onNavigate('onboarding');

    } else {
      // LOGIN flow
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Invalid email or password');
        return;
      }

      login(data.user, data.token);
      // Existing users go straight to dashboard
      if (onNavigate) onNavigate('dashboard');
    }

  } catch (error) {
    // If backend is not running, navigate anyway for demo purposes
    if (isSignUp) {
      if (onNavigate) onNavigate('onboarding');
    } else {
      if (onNavigate) onNavigate('dashboard');
    }
  } finally {
    setIsLoading(false);
  }
};
  const handleGoogleAuth = () => {
    signup('google_user@gmail.com', 'oauth');
    if (onNavigate) {
      onNavigate('onboarding');
    } else {
      router.push("/onboarding");
    }
  };

 

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] text-[#F2EFE8] font-sans selection:bg-orange-400/30">
      
      {/* Logo to go back to landing */}
      <button 
        onClick={() => onNavigate('landing')}
        className="absolute top-8 left-8 text-2xl font-bold font-serif hover:text-[#F5840C] transition-colors"
      >
        r4<span className="text-[#F5840C]">rupee</span>
      </button>

      <div className="w-full max-w-md p-8 bg-[#111111] rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Subtle glow effect */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#F5840C]/10 rounded-full blur-3xl pointer-events-none"></div>

        <h2 className="text-3xl font-serif italic mb-2">
          {isSignUp ? 'Create an account' : 'Welcome back'}
        </h2>
        <p className="text-[#8A8780] mb-8 text-sm">
          {isSignUp ? 'Sign up to start tracking where your money actually goes.' : 'Enter your details to access your dashboard.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-[#8A8780] uppercase tracking-widest mb-2">Full Name</label>
              <input 
                type="text" 
                name="name"
               required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-[#181818] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#F5840C]/50 transition-colors"
                placeholder="John Doe"
              />
            </div>
          )}
          
          <div>
            <label className="block text-xs font-semibold text-[#8A8780] uppercase tracking-widest mb-2">Email Address</label>
            <input 
              type="email" 
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-[#181818] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#F5840C]/50 transition-colors"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold text-[#8A8780] uppercase tracking-widest">Password</label>
              {!isSignUp && <a href="#" className="text-xs text-[#F5840C] hover:underline">Forgot?</a>}
            </div>
            <input 
              type="password" 
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-[#181818] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#F5840C]/50 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#F5840C] text-[#0A0A0A] font-bold py-3 rounded-lg hover:bg-[#F5840C]/90 hover:shadow-[0_4px_20px_rgba(245,132,12,0.3)] transition-all mt-4"
          >
            {isSignUp ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <div className="mt-8 flex items-center gap-4 text-xs text-[#8A8780]">
          <div className="flex-1 h-px bg-white/10"></div>
          <span>OR</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        <div className="mt-6 space-y-3">
          <button onClick={handleGoogleAuth} className="w-full flex items-center justify-center gap-3 bg-[#181818] hover:bg-[#222222] border border-white/10 py-3 rounded-lg text-sm font-medium transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-1 7.28-2.69l-3.57-2.77c-.99.69-2.26 1.1-3.71 1.1-2.87 0-5.3-1.94-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.69-.35-1.43-.35-2.09s.13-1.4.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
            Continue with Google
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-[#8A8780]">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"} 
          <button 
            type="button"
            onClick={() => setIsSignUp(!isSignUp)} 
            className="text-[#F2EFE8] font-medium hover:text-[#F5840C] transition-colors ml-1 border-none bg-transparent cursor-pointer"
          >
            {isSignUp ? 'Login' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
}
