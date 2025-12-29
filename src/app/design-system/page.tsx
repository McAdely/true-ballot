// src/app/design-system/page.tsx

"use client";

import React, { useState } from 'react';
import { Lock, Unlock, Download, CheckCircle, AlertTriangle, QrCode, Shield, Key, Eye, Clock, User } from 'lucide-react';

const TrueBallotDesign = () => {
  const [activeTab, setActiveTab] = useState('system');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [voteConfirmed, setVoteConfirmed] = useState(false);
  const [ceremonyStep, setCeremonyStep] = useState(1);
  const [tallyUnlocked, setTallyUnlocked] = useState(false);

  // Design System Component
  const DesignSystem = () => (
    <div className="bg-slate-50 p-8 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">True Ballot Design System</h1>
        <p className="text-slate-600 mb-8">Official • Immutable • Transparent</p>

        {/* Color Palette */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-24 bg-slate-900 rounded-lg shadow-lg"></div>
              <p className="font-mono text-sm">Deep Slate</p>
              <p className="text-xs text-slate-600">#0f172a</p>
              <p className="text-xs">Primary Background</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 bg-indigo-600 rounded-lg shadow-lg"></div>
              <p className="font-mono text-sm">Indigo Action</p>
              <p className="text-xs text-slate-600">#4f46e5</p>
              <p className="text-xs">Interactive Elements</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 bg-emerald-500 rounded-lg shadow-lg"></div>
              <p className="font-mono text-sm">Trust Green</p>
              <p className="text-xs text-slate-600">#10b981</p>
              <p className="text-xs">Cryptographic Success</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 bg-red-600 rounded-lg shadow-lg"></div>
              <p className="font-mono text-sm">Protocol Red</p>
              <p className="text-xs text-slate-600">#dc2626</p>
              <p className="text-xs">Key Ceremony/Danger</p>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Typography</h2>
          <div className="space-y-4 bg-white p-6 rounded-lg shadow">
            <div>
              <p className="text-4xl font-bold text-slate-900">Heading 1 - Inter Bold</p>
              <p className="text-sm text-slate-500 mt-1">font-size: 36px / font-weight: 700</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">Heading 2 - Inter Semibold</p>
              <p className="text-sm text-slate-500 mt-1">font-size: 24px / font-weight: 600</p>
            </div>
            <div>
              <p className="text-base text-slate-700">Body Text - Inter Regular</p>
              <p className="text-sm text-slate-500 mt-1">font-size: 16px / font-weight: 400</p>
            </div>
            <div>
              <p className="font-mono text-sm text-slate-800">8f7a3c2e...9d4b - Monospace for Hashes</p>
              <p className="text-sm text-slate-500 mt-1">font-family: monospace / font-size: 14px</p>
            </div>
          </div>
        </section>

        {/* Button States */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Button States</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:bg-indigo-700 transition-colors">
              Default
            </button>
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold shadow-lg opacity-75 cursor-wait flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Loading
            </button>
            <button className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-semibold shadow-lg flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Success
            </button>
            <button className="px-6 py-3 bg-slate-300 text-slate-500 rounded-lg font-semibold cursor-not-allowed">
              Disabled
            </button>
          </div>
        </section>

        {/* Icons */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Icon System</h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-6 bg-white p-6 rounded-lg shadow">
            <div className="flex flex-col items-center gap-2">
              <Lock className="w-8 h-8 text-slate-700" />
              <p className="text-xs text-center">Lock</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Unlock className="w-8 h-8 text-emerald-500" />
              <p className="text-xs text-center">Unlock</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Shield className="w-8 h-8 text-indigo-600" />
              <p className="text-xs text-center">Shield</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Key className="w-8 h-8 text-red-600" />
              <p className="text-xs text-center">Key</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <QrCode className="w-8 h-8 text-slate-700" />
              <p className="text-xs text-center">QR Code</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
              <p className="text-xs text-center">Check</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <AlertTriangle className="w-8 h-8 text-amber-500" />
              <p className="text-xs text-center">Alert</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Eye className="w-8 h-8 text-slate-700" />
              <p className="text-xs text-center">View</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );

  // Mobile: Voting Booth
  const VotingBooth = () => {
    const candidates = [
      { id: 1, name: 'Sarah Chen', party: 'Innovation Party', image: '👩‍💼' },
      { id: 2, name: 'Marcus Johnson', party: 'Progressive Alliance', image: '👨‍💼' },
      { id: 3, name: 'Aisha Patel', party: 'Student First Coalition', image: '👩‍🎓' }
    ];

    return (
      <div className="bg-slate-900 min-h-screen p-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-white text-2xl font-bold">Student President</h1>
            <Shield className="w-6 h-6 text-indigo-400" />
          </div>
          <p className="text-slate-400 text-sm">Select one candidate</p>
        </div>

        {/* Ballot Cards */}
        <div className="space-y-4 mb-6">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              onClick={() => !voteConfirmed && setSelectedCandidate(candidate.id)}
              className={`relative bg-slate-800 rounded-xl p-5 transition-all duration-300 cursor-pointer ${
                voteConfirmed
                  ? selectedCandidate === candidate.id
                    ? 'ring-4 ring-emerald-500 shadow-2xl shadow-emerald-500/50'
                    : 'opacity-40'
                  : selectedCandidate === candidate.id
                  ? 'ring-4 ring-indigo-500 shadow-2xl shadow-indigo-500/30 transform scale-105'
                  : 'hover:bg-slate-750'
              }`}
            >
              {voteConfirmed && selectedCandidate === candidate.id && (
                <div className="absolute top-3 right-3">
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
              )}
              
              <div className="flex items-center gap-4">
                <div className="text-5xl">{candidate.image}</div>
                <div className="flex-1">
                  <h3 className="text-white text-lg font-semibold">{candidate.name}</h3>
                  <p className="text-slate-400 text-sm">{candidate.party}</p>
                </div>
              </div>

              {voteConfirmed && selectedCandidate === candidate.id && (
                <div className="mt-4 p-3 bg-emerald-950 border border-emerald-500 rounded-lg">
                  <p className="text-emerald-400 text-xs font-semibold mb-1">VOTE HASH (YOUR RECEIPT)</p>
                  <p className="font-mono text-emerald-300 text-xs break-all">
                    8f7a3c2e9b1d4a5c6e8f0a2b4c6d8e0f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Cast Vote Button */}
        {selectedCandidate && !voteConfirmed && (
          <button
            onClick={() => setVoteConfirmed(true)}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/50 hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <Lock className="w-5 h-5" />
            Cast Vote Securely
          </button>
        )}

        {voteConfirmed && (
          <div className="bg-emerald-950 border-2 border-emerald-500 rounded-xl p-4 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
            <p className="text-emerald-400 font-bold text-lg mb-1">Vote Confirmed</p>
            <p className="text-emerald-300 text-sm">Your ballot has been cryptographically sealed</p>
          </div>
        )}
      </div>
    );
  };

  // Mobile: Receipt Portal
  const ReceiptPortal = () => {
    const receipts = [
      { position: 'Student President', hash: '8f7a3c2e...9c1d', time: '2 hours ago' },
      { position: 'Vice President', hash: 'a3b5c7d9...5a7b', time: '2 hours ago' },
      { position: 'Secretary', hash: '1e3f5a7b...3c2e', time: '2 hours ago' }
    ];

    return (
      <div className="bg-slate-900 min-h-screen p-4">
        <div className="mb-6">
          <h1 className="text-white text-2xl font-bold mb-2">Your Vote Receipts</h1>
          <p className="text-slate-400 text-sm">Cryptographic proof of your participation</p>
        </div>

        <div className="space-y-4">
          {receipts.map((receipt, idx) => (
            <div key={idx} className="bg-slate-800 rounded-xl p-5 border-2 border-slate-700">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-white font-bold text-lg">{receipt.position}</h3>
                  <p className="text-slate-400 text-xs flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {receipt.time}
                  </p>
                </div>
                <div className="bg-emerald-950 p-2 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg mb-4">
                <p className="text-slate-500 text-xs font-semibold mb-1">VOTE HASH</p>
                <p className="font-mono text-emerald-400 text-sm">{receipt.hash}</p>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-slate-700 text-white py-2 rounded-lg text-sm font-semibold hover:bg-slate-600 transition-colors flex items-center justify-center gap-2">
                  <QrCode className="w-4 h-4" />
                  Show QR
                </button>
                <button className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-indigo-950 border border-indigo-500 rounded-xl p-4">
          <div className="flex gap-3">
            <Shield className="w-6 h-6 text-indigo-400 flex-shrink-0" />
            <div>
              <p className="text-indigo-400 font-semibold text-sm mb-1">Blockchain Verified</p>
              <p className="text-indigo-300 text-xs">All votes are cryptographically sealed and independently verifiable</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Desktop: Key Ceremony
  const KeyCeremony = () => {
    return (
      <div className="bg-slate-900 min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-950 rounded-full mb-4">
              <Key className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-white text-3xl font-bold mb-2">Key Generation Ceremony</h1>
            <p className="text-slate-400">Step {ceremonyStep} of 3</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex gap-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`h-2 flex-1 rounded-full ${
                    step <= ceremonyStep ? 'bg-red-600' : 'bg-slate-700'
                  }`}
                ></div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          {ceremonyStep === 1 && (
            <div className="bg-red-950 border-2 border-red-500 rounded-xl p-8 mb-6">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-red-400 text-2xl font-bold text-center mb-4">⚠️ Critical Protocol</h2>
              <div className="text-red-300 space-y-3 text-center">
                <p className="font-semibold">You are about to generate the election encryption keys.</p>
                <p className="text-sm">This action will create three cryptographic key shards that must be distributed to separate committee members.</p>
                <p className="text-sm">These keys can ONLY be used together to decrypt the final tally.</p>
              </div>
            </div>
          )}

          {ceremonyStep === 2 && (
            <div className="space-y-4 mb-6">
              <div className="bg-slate-800 rounded-xl p-6 border border-red-500">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-white font-bold text-lg">Committee Shard</h3>
                    <p className="text-slate-400 text-sm">Electoral Committee Member</p>
                  </div>
                  <div className="bg-red-950 p-2 rounded-lg">
                    <Key className="w-6 h-6 text-red-500" />
                  </div>
                </div>
                <button className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Download Committee Key
                </button>
              </div>

              <div className="bg-slate-800 rounded-xl p-6 border border-red-500">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-white font-bold text-lg">Senate Shard</h3>
                    <p className="text-slate-400 text-sm">Student Senate Representative</p>
                  </div>
                  <div className="bg-red-950 p-2 rounded-lg">
                    <Key className="w-6 h-6 text-red-500" />
                  </div>
                </div>
                <button className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Download Senate Key
                </button>
              </div>

              <div className="bg-slate-800 rounded-xl p-6 border border-red-500">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-white font-bold text-lg">Executive Shard</h3>
                    <p className="text-slate-400 text-sm">Student Government Executive</p>
                  </div>
                  <div className="bg-red-950 p-2 rounded-lg">
                    <Key className="w-6 h-6 text-red-500" />
                  </div>
                </div>
                <button className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  Download Executive Key
                </button>
              </div>
            </div>
          )}

          {ceremonyStep === 3 && (
            <div className="bg-slate-800 rounded-xl p-8 mb-6 text-center">
              <div className="w-16 h-16 bg-emerald-950 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-white text-2xl font-bold mb-4">Keys Generated Successfully</h2>
              <p className="text-slate-400 mb-6">All three key shards have been created and distributed.</p>
              <button className="bg-red-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors">
                Wipe Master Key from Memory
              </button>
              <p className="text-red-400 text-sm mt-3">This action is irreversible</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-4">
            {ceremonyStep > 1 && (
              <button
                onClick={() => setCeremonyStep(ceremonyStep - 1)}
                className="flex-1 bg-slate-700 text-white py-3 rounded-lg font-semibold hover:bg-slate-600 transition-colors"
              >
                Back
              </button>
            )}
            {ceremonyStep < 3 && (
              <button
                onClick={() => setCeremonyStep(ceremonyStep + 1)}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Continue Protocol
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Desktop: Tally Room
  const TallyRoom = () => {
    return (
      <div className="bg-black min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              {tallyUnlocked ? (
                <Unlock className="w-10 h-10 text-emerald-500" />
              ) : (
                <Lock className="w-10 h-10 text-red-500" />
              )}
              <div>
                <h1 className="text-white text-3xl font-bold">The Tally Room</h1>
                <p className={`text-sm font-mono ${tallyUnlocked ? 'text-emerald-400' : 'text-red-400'}`}>
                  {tallyUnlocked ? 'DECRYPTION SUCCESSFUL' : 'ENCRYPTED'}
                </p>
              </div>
            </div>
          </div>

          {!tallyUnlocked ? (
            <div className="space-y-6">
              <div className="bg-slate-900 border-2 border-red-500 rounded-xl p-6">
                <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Committee Key Shard
                </h3>
                <textarea
                  className="w-full bg-slate-950 text-slate-300 font-mono text-sm p-4 rounded-lg border border-slate-700 h-24 resize-none focus:border-red-500 focus:outline-none"
                  placeholder="Paste Committee key here..."
                ></textarea>
              </div>

              <div className="bg-slate-900 border-2 border-red-500 rounded-xl p-6">
                <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Senate Key Shard
                </h3>
                <textarea
                  className="w-full bg-slate-950 text-slate-300 font-mono text-sm p-4 rounded-lg border border-slate-700 h-24 resize-none focus:border-red-500 focus:outline-none"
                  placeholder="Paste Senate key here..."
                ></textarea>
              </div>

              <div className="bg-slate-900 border-2 border-red-500 rounded-xl p-6">
                <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Executive Key Shard
                </h3>
                <textarea
                  className="w-full bg-slate-950 text-slate-300 font-mono text-sm p-4 rounded-lg border border-slate-700 h-24 resize-none focus:border-red-500 focus:outline-none"
                  placeholder="Paste Executive key here..."
                ></textarea>
              </div>

              <button
                onClick={() => setTallyUnlocked(true)}
                className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-red-500/50 hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <Unlock className="w-6 h-6" />
                Combine Keys & Decrypt Results
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-emerald-950 border-2 border-emerald-500 rounded-xl p-6 text-center">
                <Unlock className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                <h2 className="text-emerald-400 text-2xl font-bold mb-2">Decryption Complete</h2>
                <p className="text-emerald-300">All key shards verified. Results are now visible.</p>
              </div>

              <div className="bg-slate-900 rounded-xl p-6 border border-emerald-500">
                <h3 className="text-white text-xl font-bold mb-4">Student President Results</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-emerald-950 rounded-lg border border-emerald-500">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">👩‍💼</div>
                      <div>
                        <p className="text-white font-bold">Sarah Chen</p>
                        <p className="text-emerald-400 text-sm">Innovation Party</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 text-2xl font-bold">1,247</p>
                      <p className="text-emerald-300 text-sm">52.3% - WINNER</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">👨‍💼</div>
                      <div>
                        <p className="text-white font-bold">Marcus Johnson</p>
                        <p className="text-slate-400 text-sm">Progressive Alliance</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-2xl font-bold">823</p>
                      <p className="text-slate-400 text-sm">34.5%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">👩‍🎓</div>
                      <div>
                        <p className="text-white font-bold">Aisha Patel</p>
                        <p className="text-slate-400 text-sm">Student First Coalition</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-2xl font-bold">315</p>
                      <p className="text-slate-400 text-sm">13.2%</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-700">
                  <div className="flex justify-between text-slate-400 text-sm">
                    <span>Total Votes Cast</span>
                    <span className="font-bold text-white">2,385</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Navigation Tabs */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="flex overflow-x-auto">
          {[
            { id: 'system', label: 'Design System' },
            { id: 'voting', label: 'Voting Booth (Mobile)' },
            { id: 'receipts', label: 'Receipts (Mobile)' },
            { id: 'ceremony', label: 'Key Ceremony (Desktop)' },
            { id: 'tally', label: 'Tally Room (Desktop)' }
            ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div>
        {activeTab === 'system' && <DesignSystem />}
        {activeTab === 'voting' && <VotingBooth />}
        {activeTab === 'receipts' && <ReceiptPortal />}
        {activeTab === 'ceremony' && <KeyCeremony />}
        {activeTab === 'tally' && <TallyRoom />}
      </div>
    </div>
  );
};

export default TrueBallotDesign;