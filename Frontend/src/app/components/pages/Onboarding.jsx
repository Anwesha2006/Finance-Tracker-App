'use client';
import React, { useState } from 'react';

export default function Onboarding({ onNavigate }) {
  const [step, setStep] = useState(1);

  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Navigate to dashboard after completing onboarding
      if (onNavigate) {
        onNavigate('dashboard');
      }
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] text-[#F2EFE8] font-sans selection:bg-orange-400/30 p-6">
      
      {/* Brand Header */}
      <div className="absolute top-8 left-8 text-2xl font-bold font-serif pointer-events-none">
        r4<span className="text-[#F5840C]">rupee</span>
      </div>

      <div className="w-full max-w-2xl bg-[#111111] rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden p-10">
        
        {/* Subtle glow effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F5840C]/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-10 relative z-10">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex-1 h-1.5 rounded-full bg-[#181818] overflow-hidden">
              <div 
                className={`h-full ${s <= step ? 'bg-[#F5840C]' : 'bg-transparent'} transition-all duration-300`} 
              ></div>
            </div>
          ))}
        </div>

        <div className="relative z-10 min-h-[300px]">
          {step === 1 && (
            <div className="animate-fadeIn" style={{ animation: 'fadeIn 0.5s ease' }}>
              <h2 className="text-3xl font-serif italic mb-4">Welcome to r4rupee.</h2>
              <p className="text-[#8A8780] mb-8 leading-relaxed">Let's get your account set up so you can start tracking where your money actually goes. We need a few details to personalize your AI financial assistant.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#8A8780] uppercase tracking-widest mb-2">What should we call you?</label>
                  <input type="text" className="w-full bg-[#181818] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#F5840C]/50 transition-colors" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8A8780] uppercase tracking-widest mb-2">Primary Currency</label>
                  <select className="w-full bg-[#181818] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#F5840C]/50 transition-colors text-[#F2EFE8] appearance-none">
                    <option>₹ INR (Indian Rupee)</option>
                    <option>$ USD (US Dollar)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fadeIn" style={{ animation: 'fadeIn 0.5s ease' }}>
              <h2 className="text-3xl font-serif italic mb-4">Set your goals.</h2>
              <p className="text-[#8A8780] mb-8 leading-relaxed">What do you want to achieve with r4rupee in the next 6 months?</p>
              
              <div className="grid grid-cols-2 gap-4">
                 {['Save for a trip', 'Build emergency fund', 'Pay off debt', 'Invest more', 'Track expenses', 'Other'].map(goal => (
                   <div key={goal} className="bg-[#181818] border border-white/10 rounded-lg p-4 cursor-pointer hover:border-[#F5840C]/50 hover:bg-[#F5840C]/5 transition-all text-sm font-medium">
                     {goal}
                   </div>
                 ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fadeIn" style={{ animation: 'fadeIn 0.5s ease' }}>
              <h2 className="text-3xl font-serif italic mb-4">Connect your bank.</h2>
              <p className="text-[#8A8780] mb-8 leading-relaxed">Link your accounts securely to let our LangChain AI automatically categorize your expenses. You can also skip this and enter them manually.</p>
              
              <div className="space-y-4">
                <button className="w-full bg-[#181818] border border-white/10 rounded-lg p-5 flex items-center justify-between hover:border-[#F5840C]/30 transition-colors text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-xl">🏦</div>
                    <div>
                      <div className="font-semibold text-sm">Connect Bank Account</div>
                      <div className="text-xs text-[#8A8780]">HDFC, SBI, ICICI, etc. via Secure API</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#F5840C]">Secure</span>
                </button>

                <button className="w-full bg-[#181818] border border-white/10 rounded-lg p-5 flex items-center justify-between hover:border-white/30 transition-colors text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-xl">📱</div>
                    <div>
                      <div className="font-semibold text-sm">Scan UPI SMS History</div>
                      <div className="text-xs text-[#8A8780]">PhonePe, Google Pay, Paytm</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fadeIn" style={{ animation: 'fadeIn 0.5s ease' }}>
              <h2 className="text-3xl font-serif italic mb-4">Notification preferences.</h2>
              <p className="text-[#8A8780] mb-8 leading-relaxed">How often do you want your AI assistant to check in with insights or warnings?</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-[#181818] border border-white/10 rounded-lg p-4 hover:border-[#F5840C]/50 transition-colors cursor-pointer">
                  <div>
                    <div className="text-sm font-semibold">Only when breaking budget</div>
                    <div className="text-xs text-[#8A8780]">Zero nagging. Only alerts you on overspending.</div>
                  </div>
                  <input type="radio" name="notifs" className="w-4 h-4 accent-[#F5840C]" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between bg-[#181818] border border-white/10 rounded-lg p-4 hover:border-[#F5840C]/50 transition-colors cursor-pointer">
                  <div>
                    <div className="text-sm font-semibold">Weekly summaries</div>
                    <div className="text-xs text-[#8A8780]">A Sunday morning brief on your week's spending.</div>
                  </div>
                  <input type="radio" name="notifs" className="w-4 h-4 accent-[#F5840C]" />
                </div>
                
                <div className="flex items-center justify-between bg-[#181818] border border-white/10 rounded-lg p-4 hover:border-[#F5840C]/50 transition-colors cursor-pointer">
                  <div>
                    <div className="text-sm font-semibold">Daily quick insights</div>
                    <div className="text-xs text-[#8A8780]">A very brief morning update on daily pace.</div>
                  </div>
                  <input type="radio" name="notifs" className="w-4 h-4 accent-[#F5840C]" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex justify-between items-center relative z-10">
          <button 
            onClick={prevStep}
            className={`text-sm font-semibold text-[#8A8780] hover:text-[#F2EFE8] transition-colors ${step === 1 ? 'invisible' : ''}`}
          >
            ← Back
          </button>
          
          <button 
            onClick={nextStep}
            className="bg-[#F5840C] text-[#0A0A0A] px-8 py-3 rounded-lg font-bold hover:bg-[#F5840C]/90 hover:shadow-[0_4px_20px_rgba(245,132,12,0.3)] transition-all"
          >
            {step === 4 ? 'Go to Dashboard' : 'Continue'}
          </button>
        </div>

      </div>
    </div>
  );
}
