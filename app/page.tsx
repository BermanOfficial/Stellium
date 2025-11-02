/**
 * Stellium - Gaming Social Platform
 * Premium minimal design with game test listings
 */

'use client';

import { useState } from 'react';
import * as StellarSdk from 'stellar-sdk';
import WalletConnection from '@/components/WalletConnection';
import BalanceDisplay from '@/components/BalanceDisplay';
import PaymentForm from '@/components/PaymentForm';
import TransactionHistory from '@/components/TransactionHistory';

// Mock game test data
const gameTests = [
  {
    id: 1,
    gameName: "Stellar Legends",
    type: "time-based",
    rate: "15 XLM/hour",
    duration: "2 weeks",
    deadline: "Mar 15, 2026",
    timeLeft: "18h 23m",
    description: "Epic space adventure game testing. Play and earn rewards hourly.",
    tags: ["RPG", "Space", "Multiplayer"]
  },
  {
    id: 2,
    gameName: "Crypto Warriors",
    type: "completion",
    reward: "250 XLM",
    duration: "3 weeks",
    deadline: "Mar 22, 2026",
    timeLeft: "7h 45m",
    description: "Complete all game levels and earn rewards. Battle system testing required.",
    tags: ["Action", "PvP", "NFT"]
  },
  {
    id: 3,
    gameName: "DeFi Tycoon",
    type: "time-based",
    rate: "12 XLM/hour",
    duration: "1 week",
    deadline: "Mar 8, 2026",
    timeLeft: "25h 12m",
    description: "Business simulation game. Test trading mechanics and economy balance.",
    tags: ["Strategy", "DeFi", "Economy"]
  },
  {
    id: 4,
    gameName: "Galaxy Miners",
    type: "completion",
    reward: "180 XLM",
    duration: "10 days",
    deadline: "Mar 12, 2026",
    timeLeft: "14h 30m",
    description: "Mining and resource management. Complete tutorial and first mission.",
    tags: ["Mining", "Strategy", "Casual"]
  },
  {
    id: 5,
    gameName: "NFT Racing League",
    type: "time-based",
    rate: "20 XLM/hour",
    duration: "4 weeks",
    deadline: "Mar 29, 2026",
    timeLeft: "3h 55m",
    description: "High-speed racing with NFT cars. Test multiplayer racing mechanics.",
    tags: ["Racing", "NFT", "Multiplayer"]
  },
  {
    id: 6,
    gameName: "Blockchain Quest",
    type: "completion",
    reward: "300 XLM",
    duration: "3 weeks",
    deadline: "Mar 20, 2026",
    timeLeft: "29h 08m",
    description: "Adventure RPG on blockchain. Complete main storyline for full reward.",
    tags: ["RPG", "Adventure", "Story"]
  }
];

// Mock investment data
const myInvestments = [
  {
    id: 1,
    company: "PixelForge Studios",
    amount: "8,500 XLM",
    logo: "🎨",
    change: "+12.5%",
    isPositive: true
  },
  {
    id: 2,
    company: "ChainPlay Games",
    amount: "5,200 XLM",
    logo: "⛓️",
    change: "+8.3%",
    isPositive: true
  },
  {
    id: 3,
    company: "MetaVerse Builders",
    amount: "9,800 XLM",
    logo: "🌐",
    change: "-3.2%",
    isPositive: false
  }
];

export default function Home() {
  const [publicKey, setPublicKey] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [adminSecret, setAdminSecret] = useState('');
  const [rewardPlayerId, setRewardPlayerId] = useState('');
  const [rewardStatus, setRewardStatus] = useState('');
  
  // Pop-up states
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAddGameModal, setShowAddGameModal] = useState(false);
  const [showInvestorsModal, setShowInvestorsModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showShopModal, setShowShopModal] = useState(false);
  
  // User's GAMECOIN balance (mock data - would come from blockchain)
  const [gamecoinBalance] = useState(1250);

  const handleConnect = (key: string) => {
    setPublicKey(key);
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    setPublicKey('');
    setIsConnected(false);
  };

  const handlePaymentSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };
  
  const handleApplyClick = (game: any) => {
    setSelectedGame(game);
    setShowApplyModal(true);
  };
  
  const handleApplySubmit = () => {
    // Here you would handle the application submission
    alert('Application submitted successfully!');
    setShowApplyModal(false);
  };

  const handleSendReward = async () => {
    setRewardStatus('Sending rewards...');
    try {
      const sourceKeypair = StellarSdk.Keypair.fromSecret(adminSecret);
      const sourcePublicKey = sourceKeypair.publicKey();
      const destinationId = rewardPlayerId;

      const GAMECOIN = new StellarSdk.Asset(
        'GAMECOIN',
        'GAI6MS25UJ32TJ5PA5I7TV6EVFNDQO4V5VK5STNMLVCHBTIOTCPURHPZ'
      );
      const LSWORD = new StellarSdk.Asset(
        'LSWORD',
        'GAI6MS25UJ32TJ5PA5I7TV6EVFNDQO4V5VK5STNMLVCHBTIOTCPURHPZ'
      );

      const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
      const sourceAccount = await server.loadAccount(sourcePublicKey);

      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: '100000',
        networkPassphrase: StellarSdk.Networks.TESTNET,
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: destinationId,
            asset: GAMECOIN,
            amount: '100',
          })
        )
        .addOperation(
          StellarSdk.Operation.payment({
            destination: destinationId,
            asset: LSWORD,
            amount: '1',
          })
        )
        .setTimeout(30)
        .build();

      transaction.sign(sourceKeypair);
      await server.submitTransaction(transaction);

      setRewardStatus('Success! Player has been rewarded.');
      handlePaymentSuccess();

    } catch (error: any) {
      console.error('Reward Error:', error);
      console.error('Error details:', error.response?.data);
      
      let errorMessage = 'Error sending reward. ';
      
      if (error.response?.data?.extras?.result_codes) {
        const codes = error.response.data.extras.result_codes;
        console.error('Result codes:', codes);
        
        if (codes.operations?.includes('op_no_trust')) {
          errorMessage += 'Player needs to add trustline for GAMECOIN and LSWORD tokens first!';
        } else if (codes.operations?.includes('op_underfunded')) {
          errorMessage += 'Game Hub account does not have enough tokens!';
        } else if (codes.transaction === 'tx_failed') {
          errorMessage += `Transaction failed: ${codes.operations?.join(', ')}`;
        } else {
          errorMessage += 'Check console for details.';
        }
      } else {
        errorMessage += error.message || 'Unknown error';
      }
      
      setRewardStatus(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-800">
      {/* Premium Header */}
      <header className="border-b border-neutral-700 bg-neutral-900">
        <div className="max-w-[1600px] mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Logo SVG */}
              <div className="relative">
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Outer hexagon (blockchain feel) */}
                  <path d="M28 4L48 16V40L28 52L8 40V16L28 4Z" stroke="url(#gradient1)" strokeWidth="2" fill="none"/>
                  
                  {/* Inner star (Stellar) */}
                  <path d="M28 14L32 24H42L34 30L37 40L28 34L19 40L22 30L14 24H24L28 14Z" fill="url(#gradient2)"/>
                  
                  {/* Game controller d-pad */}
                  <rect x="16" y="26" width="3" height="3" fill="#E8A951" opacity="0.6"/>
                  <rect x="13" y="29" width="3" height="3" fill="#E8A951" opacity="0.6"/>
                  <rect x="19" y="29" width="3" height="3" fill="#E8A951" opacity="0.6"/>
                  <rect x="16" y="32" width="3" height="3" fill="#E8A951" opacity="0.6"/>
                  
                  {/* Blockchain nodes */}
                  <circle cx="40" cy="28" r="2" fill="#E8A951"/>
                  <circle cx="38" cy="34" r="1.5" fill="#E8A951" opacity="0.7"/>
                  <circle cx="42" cy="34" r="1.5" fill="#E8A951" opacity="0.7"/>
                  
                  {/* Connection lines */}
                  <line x1="40" y1="28" x2="38" y2="34" stroke="#E8A951" strokeWidth="0.5" opacity="0.4"/>
                  <line x1="40" y1="28" x2="42" y2="34" stroke="#E8A951" strokeWidth="0.5" opacity="0.4"/>
                  
                  {/* Gradients */}
                  <defs>
                    <linearGradient id="gradient1" x1="8" y1="4" x2="48" y2="52">
                      <stop offset="0%" stopColor="#E8A951"/>
                      <stop offset="50%" stopColor="#F5C675"/>
                      <stop offset="100%" stopColor="#E8A951"/>
                    </linearGradient>
                    <linearGradient id="gradient2" x1="14" y1="14" x2="42" y2="40">
                      <stop offset="0%" stopColor="#F5C675"/>
                      <stop offset="100%" stopColor="#E8A951"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-light tracking-wide text-stone-100">
                  Stellium
                </h1>
                <p className="text-stone-400 text-sm font-light">Blockchain Gaming Platform</p>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <button onClick={() => setShowShopModal(true)} className="text-stone-400 hover:text-orange-500 text-sm font-light transition-colors">
                🛒 Shop
              </button>
              <button onClick={() => setShowLeaderboard(true)} className="text-stone-400 hover:text-orange-500 text-sm font-light transition-colors">
                Leaderboard
              </button>
              <button onClick={() => setShowAboutModal(true)} className="text-stone-400 hover:text-orange-500 text-sm font-light transition-colors">
                About Us
              </button>
              <button className="px-5 py-2 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 text-sm font-light rounded-sm transition-all" onClick={() => setShowInvestorsModal(true)}>
                💼 For Investors
              </button>
              <button className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-light rounded-sm transition-all" onClick={() => setShowAddGameModal(true)}>
                ➕ Add Your Game
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout - 3 Column */}
      <main className="max-w-[1600px] mx-auto px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          
          {/* LEFT SIDEBAR - Popular Tags */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-neutral-900 border border-neutral-700 rounded-sm p-6 sticky top-8">
              <h3 className="text-stone-200 font-light text-lg mb-6 tracking-wide">Popular Tags</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-neutral-800 border border-neutral-700 rounded-sm hover:border-orange-500/30 transition-all cursor-pointer">
                  <span className="text-2xl">🎮</span>
                  <div>
                    <div className="text-stone-300 text-sm font-light">RPG</div>
                    <div className="text-stone-500 text-xs">12 active tests</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-neutral-800 border border-neutral-700 rounded-sm hover:border-orange-500/30 transition-all cursor-pointer">
                  <span className="text-2xl">⚔️</span>
                  <div>
                    <div className="text-stone-300 text-sm font-light">Action</div>
                    <div className="text-stone-500 text-xs">8 active tests</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-neutral-800 border border-neutral-700 rounded-sm hover:border-orange-500/30 transition-all cursor-pointer">
                  <span className="text-2xl">🏎️</span>
                  <div>
                    <div className="text-stone-300 text-sm font-light">Racing</div>
                    <div className="text-stone-500 text-xs">5 active tests</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-neutral-800 border border-neutral-700 rounded-sm hover:border-orange-500/30 transition-all cursor-pointer">
                  <span className="text-2xl">🖼️</span>
                  <div>
                    <div className="text-stone-300 text-sm font-light">NFT Games</div>
                    <div className="text-stone-500 text-xs">15 active tests</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-neutral-800 border border-neutral-700 rounded-sm hover:border-orange-500/30 transition-all cursor-pointer">
                  <span className="text-2xl">💎</span>
                  <div>
                    <div className="text-stone-300 text-sm font-light">DeFi</div>
                    <div className="text-stone-500 text-xs">6 active tests</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-neutral-800 border border-neutral-700 rounded-sm hover:border-orange-500/30 transition-all cursor-pointer">
                  <span className="text-2xl">⛏️</span>
                  <div>
                    <div className="text-stone-300 text-sm font-light">Mining</div>
                    <div className="text-stone-500 text-xs">4 active tests</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-neutral-800 border border-neutral-700 rounded-sm hover:border-orange-500/30 transition-all cursor-pointer">
                  <span className="text-2xl">🌐</span>
                  <div>
                    <div className="text-stone-300 text-sm font-light">Blockchain</div>
                    <div className="text-stone-500 text-xs">20 active tests</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-neutral-800 border border-neutral-700 rounded-sm hover:border-orange-500/30 transition-all cursor-pointer">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <div className="text-stone-300 text-sm font-light">Strategy</div>
                    <div className="text-stone-500 text-xs">9 active tests</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER - Main Content */}
          <div className="col-span-12 lg:col-span-6">
            {/* Wallet Connection */}
            <div className="mb-8">
              <WalletConnection onConnect={handleConnect} onDisconnect={handleDisconnect} />
            </div>

            {/* Balance and Transaction sections when connected */}
            {isConnected && publicKey && (
              <div className="space-y-8 mb-8">
                <div key={`balance-${refreshKey}`}>
                  <BalanceDisplay publicKey={publicKey} />
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <PaymentForm publicKey={publicKey} onSuccess={handlePaymentSuccess} />
                  </div>

                  <div key={`history-${refreshKey}`}>
                    <TransactionHistory publicKey={publicKey} />
                  </div>
                </div>
              </div>
            )}

            {/* Game Test Listings */}
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-light text-stone-100 tracking-wide">Active Game Tests</h2>
                <select className="bg-neutral-900 border border-neutral-700 text-stone-300 px-4 py-2 rounded-sm text-sm font-light">
                  <option>All Games</option>
                  <option>Time-based</option>
                  <option>Completion-based</option>
                </select>
              </div>

              {gameTests.map((game) => (
                <div key={game.id} className="bg-neutral-900 border border-neutral-700 rounded-sm p-6 hover:border-orange-500/30 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-light text-stone-100 mb-2">{game.gameName}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        {game.tags.map((tag) => (
                          <span key={tag} className="px-3 py-1 bg-neutral-800 border border-neutral-700 text-stone-400 text-xs rounded-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-sm text-sm font-light ${
                      game.type === 'time-based' 
                        ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30' 
                        : 'bg-green-500/10 text-green-400 border border-green-500/30'
                    }`}>
                      {game.type === 'time-based' ? game.rate : game.reward}
                    </div>
                  </div>

                  <p className="text-stone-400 text-sm font-light mb-4 leading-relaxed">
                    {game.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-neutral-700">
                    <div className="flex items-center gap-6 text-sm text-stone-500">
                      <span>📅 {game.deadline}</span>
                      <span>⏰ {game.timeLeft} left</span>
                    </div>
                    <button className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-light rounded-sm transition-all" onClick={() => handleApplyClick(game)}>
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDEBAR - Investments & Help */}
          <div className="col-span-12 lg:col-span-3">
            <div className="space-y-6 sticky top-8">
              
              {/* My Investments - Only show when connected */}
              {isConnected && (
                <div className="bg-neutral-900 border-2 border-orange-500/30 rounded-sm p-5">
                  <h3 className="text-stone-200 font-light text-lg mb-5 tracking-wide">My Investments</h3>
                  <div className="space-y-4">
                    {myInvestments.map((investment) => (
                      <div key={investment.id} className="bg-neutral-800 border border-neutral-700 rounded-sm p-4 hover:border-orange-500/30 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-orange-500/20 rounded-sm flex items-center justify-center text-xl">
                            {investment.logo}
                          </div>
                          <div className="flex-1">
                            <div className="text-stone-200 text-sm font-light">{investment.company}</div>
                            <div className="text-stone-400 text-xs">{investment.amount}</div>
                          </div>
                        </div>
                        <div className={`text-xs font-light ${investment.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                          {investment.change}
                        </div>
                      </div>
                    ))}
                    <button className="w-full py-2 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 text-sm font-light rounded-sm transition-all">
                      View All Investments
                    </button>
                  </div>
                </div>
              )}
              
              {/* Quick Help */}
              <div className="bg-neutral-900 border border-neutral-700 rounded-sm p-5">
                <h3 className="text-stone-200 font-light text-sm mb-4 tracking-wide">Quick Help</h3>
                <div className="space-y-3">
                  <a href="#" className="block text-stone-400 hover:text-orange-500 text-xs font-light transition-colors">
                    → How to apply for tests
                  </a>
                  <a href="#" className="block text-stone-400 hover:text-orange-500 text-xs font-light transition-colors">
                    → Payment information
                  </a>
                  <a href="#" className="block text-stone-400 hover:text-orange-500 text-xs font-light transition-colors">
                    → Testing guidelines
                  </a>
                  <a href="#" className="block text-stone-400 hover:text-orange-500 text-xs font-light transition-colors">
                    → FAQ
                  </a>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-neutral-900 border border-neutral-700 rounded-sm p-5">
                <h3 className="text-stone-200 font-light text-sm mb-4 tracking-wide">Platform Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-stone-400 text-xs">Active Tests</span>
                    <span className="text-orange-500 font-light">79</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-400 text-xs">Total Testers</span>
                    <span className="text-orange-500 font-light">12,453</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-400 text-xs">Paid Out</span>
                    <span className="text-orange-500 font-light">2.4M XLM</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-neutral-900 border border-neutral-700 rounded-sm p-5">
                <h3 className="text-stone-200 font-light text-sm mb-4 tracking-wide">Recent Activity</h3>
                <div className="space-y-3 text-xs">
                  <div className="text-stone-400 font-light">
                    <span className="text-stone-300">John_42</span> completed Stellar Legends
                    <div className="text-stone-500 text-xs mt-1">2 min ago</div>
                  </div>
                  <div className="text-stone-400 font-light">
                    <span className="text-stone-300">Alice_89</span> started Galaxy Miners
                    <div className="text-stone-500 text-xs mt-1">15 min ago</div>
                  </div>
                  <div className="text-stone-400 font-light">
                    <span className="text-stone-300">Mike_23</span> earned 250 XLM
                    <div className="text-stone-500 text-xs mt-1">1 hour ago</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Admin Panel - Bottom */}
      <div className="bg-neutral-900 border-t border-neutral-700 mt-16">
        <div className="max-w-[1600px] mx-auto px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-neutral-800 border-2 border-orange-500/30 rounded-sm p-8">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-neutral-700">
                <div className="w-12 h-12 bg-orange-500 rounded-sm flex items-center justify-center text-2xl">
                  👑
                </div>
                <div>
                  <h2 className="text-xl font-light text-stone-100 tracking-wide">Admin Reward Panel</h2>
                  <p className="text-stone-400 text-sm font-light">Distribute rewards to testers</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-light text-stone-300 mb-2 tracking-wide">
                    Game Hub Secret Key
                  </label>
                  <input
                    type="password"
                    placeholder="S... (Your secret key)"
                    value={adminSecret}
                    onChange={(e) => setAdminSecret(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 focus:border-orange-500/50 rounded-sm p-3 text-stone-200 placeholder-stone-500 transition-all outline-none font-light text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light text-stone-300 mb-2 tracking-wide">
                    Player's Public Key
                  </label>
                  <input
                    type="text"
                    placeholder="G... (Player's public key)"
                    value={rewardPlayerId}
                    onChange={(e) => setRewardPlayerId(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 focus:border-orange-500/50 rounded-sm p-3 text-stone-200 placeholder-stone-500 transition-all outline-none font-light text-sm"
                  />
                </div>
              </div>

              <button
                onClick={handleSendReward}
                disabled={!adminSecret || !rewardPlayerId || rewardStatus === 'Sending rewards...'}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-neutral-700 text-white disabled:text-stone-500 font-light py-4 rounded-sm transition-all duration-300 tracking-wide"
              >
                {rewardStatus || 'Send Rewards (100 GAMECOIN + 1 LSWORD)'}
              </button>

              {rewardStatus.includes('Error') && (
                <div className="mt-4 bg-red-900/20 border border-red-800/40 rounded-sm p-4">
                  <p className="text-red-400 text-sm font-light">{rewardStatus}</p>
                </div>
              )}
              
              {rewardStatus.includes('Success') && (
                <div className="mt-4 bg-green-900/20 border border-green-800/40 rounded-sm p-4">
                  <p className="text-green-400 text-sm font-light">{rewardStatus}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-neutral-700 bg-neutral-900">
        <div className="max-w-[1600px] mx-auto px-8 py-8">
          <div className="text-center">
            <p className="text-stone-400 text-sm font-light mb-2">
              Built on Stellar Blockchain | Testnet Environment
            </p>
            <p className="text-stone-500 text-xs font-light">
              © 2025 Stellium. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Apply Modal */}
      {showApplyModal && selectedGame && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowApplyModal(false)}>
          <div className="bg-neutral-900 border-2 border-orange-500/30 rounded-sm p-8 max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-light text-stone-100 mb-2">{selectedGame.gameName}</h3>
                <div className="flex items-center gap-2">
                  {selectedGame.tags.map((tag: string) => (
                    <span key={tag} className="px-3 py-1 bg-neutral-800 border border-neutral-700 text-stone-400 text-xs rounded-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <button onClick={() => setShowApplyModal(false)} className="text-stone-400 hover:text-stone-200 text-2xl">×</button>
            </div>

            <div className="space-y-6">
              <div className="bg-neutral-800 border border-neutral-700 rounded-sm p-6">
                <h4 className="text-stone-200 font-light mb-4">Test Requirements</h4>
                {selectedGame.type === 'time-based' ? (
                  <div className="space-y-3 text-sm text-stone-300">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Payment Type:</span>
                      <span className="text-orange-400">{selectedGame.rate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Max Hours:</span>
                      <span>40 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Test Modes:</span>
                      <span>Story Mode, Multiplayer, Arena</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Deadline:</span>
                      <span>{selectedGame.deadline}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 text-sm text-stone-300">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Payment Type:</span>
                      <span className="text-green-400">Completion-based</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Total Reward:</span>
                      <span className="text-green-400">{selectedGame.reward}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Requirements:</span>
                      <span>Complete all tutorial missions</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Estimated Time:</span>
                      <span>15-20 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Deadline:</span>
                      <span>{selectedGame.deadline}</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-light text-stone-300 mb-2">Your Wallet Address</label>
                <input
                  type="text"
                  placeholder={publicKey || "Connect wallet first"}
                  value={publicKey}
                  disabled
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-sm p-3 text-stone-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-light text-stone-300 mb-2">Why do you want to test this game?</label>
                <textarea
                  placeholder="Tell us about your gaming experience and why you're interested..."
                  className="w-full bg-neutral-800 border border-neutral-700 focus:border-orange-500/50 rounded-sm p-3 text-stone-200 placeholder-stone-500 text-sm h-24 outline-none"
                />
              </div>

              <div className="flex gap-4">
                <button onClick={() => setShowApplyModal(false)} className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-stone-300 font-light py-3 rounded-sm transition-all">
                  Cancel
                </button>
                <button onClick={handleApplySubmit} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-light py-3 rounded-sm transition-all" disabled={!publicKey}>
                  Submit Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Modal - Split into Time & Earnings */}
      {showLeaderboard && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowLeaderboard(false)}>
          <div className="bg-neutral-900 border-2 border-orange-500/30 rounded-sm p-8 max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-light text-stone-100">🏆 Leaderboard</h3>
              <button onClick={() => setShowLeaderboard(false)} className="text-stone-400 hover:text-stone-200 text-2xl">×</button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Time Leaderboard */}
              <div className="bg-neutral-800 border border-neutral-700 rounded-sm p-6">
                <h4 className="text-orange-400 font-light mb-4 text-lg flex items-center gap-2">
                  <span>⏱️</span>
                  <span>Most Active Testers</span>
                </h4>
                <div className="space-y-3">
                  {[
                    { rank: 1, name: 'CryptoGamer_42', hours: '156h', emoji: '🥇' },
                    { rank: 2, name: 'BlockchainPro', hours: '142h', emoji: '🥈' },
                    { rank: 3, name: 'StellarTester', hours: '128h', emoji: '🥉' },
                    { rank: 4, name: 'GameMaster_99', hours: '115h', emoji: '4️⃣' },
                    { rank: 5, name: 'TestKing', hours: '98h', emoji: '5️⃣' },
                  ].map((player) => (
                    <div key={player.rank} className="flex items-center justify-between p-3 bg-neutral-900 border border-neutral-700 rounded-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{player.emoji}</span>
                        <div className="text-stone-200 text-sm">{player.name}</div>
                      </div>
                      <div className="text-orange-400 font-light text-sm">{player.hours}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 bg-orange-500/10 border border-orange-500/30 rounded-sm p-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">👤</span>
                      <span className="text-orange-400">You</span>
                    </div>
                    <div className="text-orange-400 font-light">23h</div>
                  </div>
                </div>
              </div>

              {/* Earnings Leaderboard */}
              <div className="bg-neutral-800 border border-neutral-700 rounded-sm p-6">
                <h4 className="text-green-400 font-light mb-4 text-lg flex items-center gap-2">
                  <span>💰</span>
                  <span>Top Earners</span>
                </h4>
                <div className="space-y-3">
                  {[
                    { rank: 1, name: 'CryptoGamer_42', earnings: '3,120 XLM', emoji: '🥇' },
                    { rank: 2, name: 'BlockchainPro', earnings: '2,840 XLM', emoji: '🥈' },
                    { rank: 3, name: 'StellarTester', earnings: '2,560 XLM', emoji: '🥉' },
                    { rank: 4, name: 'GameMaster_99', earnings: '2,300 XLM', emoji: '4️⃣' },
                    { rank: 5, name: 'TestKing', earnings: '1,960 XLM', emoji: '5️⃣' },
                  ].map((player) => (
                    <div key={player.rank} className="flex items-center justify-between p-3 bg-neutral-900 border border-neutral-700 rounded-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{player.emoji}</span>
                        <div className="text-stone-200 text-sm">{player.name}</div>
                      </div>
                      <div className="text-green-400 font-light text-sm">{player.earnings}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 bg-green-500/10 border border-green-500/30 rounded-sm p-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">👤</span>
                      <span className="text-green-400">You</span>
                    </div>
                    <div className="text-green-400 font-light">460 XLM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Investors Modal */}
      {showInvestorsModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowInvestorsModal(false)}>
          <div className="bg-neutral-900 border-2 border-orange-500/30 rounded-sm p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-light text-stone-100 mb-2">💼 Investment Opportunities</h3>
                <p className="text-stone-400 text-sm">Invest in promising game studios and earn returns</p>
              </div>
              <button onClick={() => setShowInvestorsModal(false)} className="text-stone-400 hover:text-stone-200 text-2xl">×</button>
            </div>

            <div className="space-y-6">
              {/* Investment Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-neutral-800 border border-neutral-700 rounded-sm p-5 text-center">
                  <div className="text-orange-400 text-2xl font-light mb-1">47</div>
                  <div className="text-stone-400 text-xs">Active Projects</div>
                </div>
                <div className="bg-neutral-800 border border-neutral-700 rounded-sm p-5 text-center">
                  <div className="text-green-400 text-2xl font-light mb-1">2.8M XLM</div>
                  <div className="text-stone-400 text-xs">Total Invested</div>
                </div>
                <div className="bg-neutral-800 border border-neutral-700 rounded-sm p-5 text-center">
                  <div className="text-blue-400 text-2xl font-light mb-1">18.5%</div>
                  <div className="text-stone-400 text-xs">Avg. Returns</div>
                </div>
              </div>

              {/* Investment Opportunities */}
              <div className="space-y-4">
                <h4 className="text-stone-200 font-light text-lg">Featured Projects</h4>
                
                {[
                  {
                    name: 'PixelForge Studios',
                    game: 'Stellar Legends 2',
                    logo: '🎨',
                    raised: '45,000 XLM',
                    goal: '100,000 XLM',
                    percentage: 45,
                    roi: '+25%',
                    investors: 234,
                    stage: 'Alpha Testing'
                  },
                  {
                    name: 'ChainPlay Games',
                    game: 'Crypto Arena',
                    logo: '⛓️',
                    raised: '78,000 XLM',
                    goal: '150,000 XLM',
                    percentage: 52,
                    roi: '+18%',
                    investors: 456,
                    stage: 'Beta Launch'
                  },
                  {
                    name: 'MetaVerse Builders',
                    game: 'Virtual Worlds',
                    logo: '🌐',
                    raised: '32,000 XLM',
                    goal: '80,000 XLM',
                    percentage: 40,
                    roi: '+32%',
                    investors: 167,
                    stage: 'Concept'
                  },
                  {
                    name: 'Quantum Gaming',
                    game: 'Space Raiders',
                    logo: '🚀',
                    raised: '91,000 XLM',
                    goal: '120,000 XLM',
                    percentage: 76,
                    roi: '+15%',
                    investors: 589,
                    stage: 'Pre-Launch'
                  }
                ].map((project, idx) => (
                  <div key={idx} className="bg-neutral-800 border border-neutral-700 hover:border-orange-500/30 rounded-sm p-6 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-orange-500/20 rounded-sm flex items-center justify-center text-2xl">
                          {project.logo}
                        </div>
                        <div>
                          <h5 className="text-stone-100 font-light text-lg mb-1">{project.name}</h5>
                          <p className="text-stone-400 text-sm mb-2">{project.game}</p>
                          <div className="flex items-center gap-3 text-xs">
                            <span className="px-2 py-1 bg-orange-500/10 border border-orange-500/30 text-orange-400 rounded-sm">
                              {project.stage}
                            </span>
                            <span className="text-stone-500">👥 {project.investors} investors</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-light text-lg mb-1">{project.roi}</div>
                        <div className="text-stone-500 text-xs">Expected ROI</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-stone-400">Funding Progress</span>
                        <span className="text-stone-300">{project.raised} / {project.goal}</span>
                      </div>
                      <div className="w-full bg-neutral-900 rounded-full h-2">
                        <div className="bg-gradient-to-r from-orange-500 to-orange-400 h-2 rounded-full" style={{ width: `${project.percentage}%` }}></div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-light py-2 rounded-sm transition-all text-sm">
                        Invest Now
                      </button>
                      <button className="px-6 bg-neutral-900 hover:bg-neutral-700 border border-neutral-700 text-stone-300 font-light py-2 rounded-sm transition-all text-sm">
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* How it Works */}
              <div className="bg-orange-500/5 border border-orange-500/20 rounded-sm p-6">
                <h4 className="text-orange-300 font-light mb-3">How Investment Works</h4>
                <div className="space-y-2 text-sm text-stone-400">
                  <p>• Browse active game development projects seeking funding</p>
                  <p>• Invest XLM in projects you believe in</p>
                  <p>• Earn returns when games launch and generate revenue</p>
                  <p>• Track your portfolio and ROI in real-time</p>
                  <p>• Minimum investment: 100 XLM per project</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shop Modal */}
      {showShopModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowShopModal(false)}>
          <div className="bg-neutral-900 border-2 border-orange-500/30 rounded-sm p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-light text-stone-100 mb-2">🛒 Stellium Shop</h3>
                <p className="text-stone-400 text-sm">Redeem your GAMECOIN for rewards</p>
              </div>
              <button onClick={() => setShowShopModal(false)} className="text-stone-400 hover:text-stone-200 text-2xl">×</button>
            </div>

            {/* Balance Display */}
            <div className="bg-gradient-to-r from-orange-500/20 to-neutral-800 border-2 border-orange-500/40 rounded-sm p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-stone-400 text-sm mb-1">Your Balance</div>
                  <div className="text-3xl font-light text-orange-400">{gamecoinBalance.toLocaleString()} GAMECOIN</div>
                  <div className="text-stone-500 text-xs mt-1">≈ {(gamecoinBalance * 0.25).toFixed(2)} XLM</div>
                </div>
                <div className="text-right">
                  <div className="text-stone-400 text-sm mb-1">Exchange Rate</div>
                  <div className="text-lg font-light text-stone-200">100 GAMECOIN = 25 XLM</div>
                </div>
              </div>
            </div>

            {/* Convert to XLM Section */}
            <div className="bg-neutral-800 border border-neutral-700 rounded-sm p-6 mb-8">
              <h4 className="text-lg font-light text-orange-400 mb-4">💱 Convert to XLM</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-light text-stone-300 mb-2">Amount (GAMECOIN)</label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    className="w-full bg-neutral-900 border border-neutral-700 focus:border-orange-500/50 rounded-sm p-3 text-stone-200 placeholder-stone-500 text-sm outline-none"
                  />
                  <div className="text-xs text-stone-500 mt-1">Minimum: 100 GAMECOIN</div>
                </div>
                <div>
                  <label className="block text-sm font-light text-stone-300 mb-2">You'll Receive (XLM)</label>
                  <div className="bg-neutral-900 border border-neutral-700 rounded-sm p-3 text-stone-400 text-sm">
                    0.00 XLM
                  </div>
                  <div className="text-xs text-stone-500 mt-1">Rate: 1 GAMECOIN = 0.25 XLM</div>
                </div>
              </div>
              <button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-light py-3 rounded-sm transition-all">
                Convert to XLM
              </button>
            </div>

            {/* Shop Items */}
            <div>
              <h4 className="text-lg font-light text-orange-400 mb-6">🎁 Reward Store</h4>
              
              <div className="grid md:grid-cols-3 gap-6">
                {/* Steam Gift Cards */}
                <div className="bg-neutral-800 border border-neutral-700 hover:border-orange-500/30 rounded-sm p-6 transition-all">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-sm flex items-center justify-center text-3xl mb-4 mx-auto">
                    🎮
                  </div>
                  <h5 className="text-stone-200 font-light text-center mb-2">Steam Gift Card $10</h5>
                  <div className="text-center mb-4">
                    <div className="text-2xl font-light text-orange-400">160 GAMECOIN</div>
                    <div className="text-xs text-stone-500">≈ $10 USD</div>
                  </div>
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-light py-2 rounded-sm transition-all text-sm">
                    Redeem
                  </button>
                </div>

                <div className="bg-neutral-800 border border-neutral-700 hover:border-orange-500/30 rounded-sm p-6 transition-all">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-sm flex items-center justify-center text-3xl mb-4 mx-auto">
                    🎮
                  </div>
                  <h5 className="text-stone-200 font-light text-center mb-2">Steam Gift Card $20</h5>
                  <div className="text-center mb-4">
                    <div className="text-2xl font-light text-orange-400">320 GAMECOIN</div>
                    <div className="text-xs text-stone-500">≈ $20 USD</div>
                  </div>
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-light py-2 rounded-sm transition-all text-sm">
                    Redeem
                  </button>
                </div>

                <div className="bg-neutral-800 border border-neutral-700 hover:border-orange-500/30 rounded-sm p-6 transition-all">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-sm flex items-center justify-center text-3xl mb-4 mx-auto">
                    🎮
                  </div>
                  <h5 className="text-stone-200 font-light text-center mb-2">Steam Gift Card $50</h5>
                  <div className="text-center mb-4">
                    <div className="text-2xl font-light text-orange-400">800 GAMECOIN</div>
                    <div className="text-xs text-stone-500">≈ $50 USD</div>
                  </div>
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-light py-2 rounded-sm transition-all text-sm">
                    Redeem
                  </button>
                </div>

                {/* Amazon Gift Cards */}
                <div className="bg-neutral-800 border border-neutral-700 hover:border-orange-500/30 rounded-sm p-6 transition-all">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-sm flex items-center justify-center text-3xl mb-4 mx-auto">
                    📦
                  </div>
                  <h5 className="text-stone-200 font-light text-center mb-2">Amazon Gift Card $10</h5>
                  <div className="text-center mb-4">
                    <div className="text-2xl font-light text-orange-400">160 GAMECOIN</div>
                    <div className="text-xs text-stone-500">≈ $10 USD</div>
                  </div>
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-light py-2 rounded-sm transition-all text-sm">
                    Redeem
                  </button>
                </div>

                <div className="bg-neutral-800 border border-neutral-700 hover:border-orange-500/30 rounded-sm p-6 transition-all">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-sm flex items-center justify-center text-3xl mb-4 mx-auto">
                    📦
                  </div>
                  <h5 className="text-stone-200 font-light text-center mb-2">Amazon Gift Card $20</h5>
                  <div className="text-center mb-4">
                    <div className="text-2xl font-light text-orange-400">320 GAMECOIN</div>
                    <div className="text-xs text-stone-500">≈ $20 USD</div>
                  </div>
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-light py-2 rounded-sm transition-all text-sm">
                    Redeem
                  </button>
                </div>

                <div className="bg-neutral-800 border border-neutral-700 hover:border-orange-500/30 rounded-sm p-6 transition-all">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-sm flex items-center justify-center text-3xl mb-4 mx-auto">
                    📦
                  </div>
                  <h5 className="text-stone-200 font-light text-center mb-2">Amazon Gift Card $50</h5>
                  <div className="text-center mb-4">
                    <div className="text-2xl font-light text-orange-400">800 GAMECOIN</div>
                    <div className="text-xs text-stone-500">≈ $50 USD</div>
                  </div>
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-light py-2 rounded-sm transition-all text-sm">
                    Redeem
                  </button>
                </div>

                {/* XLM Direct Conversion Options */}
                <div className="bg-neutral-800 border-2 border-orange-500/40 hover:border-orange-500/60 rounded-sm p-6 transition-all">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-sm flex items-center justify-center text-3xl mb-4 mx-auto">
                    ⭐
                  </div>
                  <h5 className="text-stone-200 font-light text-center mb-2">Convert to 25 XLM</h5>
                  <div className="text-center mb-4">
                    <div className="text-2xl font-light text-orange-400">100 GAMECOIN</div>
                    <div className="text-xs text-stone-500">Quick Convert</div>
                  </div>
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-light py-2 rounded-sm transition-all text-sm">
                    Convert Now
                  </button>
                </div>

                <div className="bg-neutral-800 border-2 border-orange-500/40 hover:border-orange-500/60 rounded-sm p-6 transition-all">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-sm flex items-center justify-center text-3xl mb-4 mx-auto">
                    ⭐
                  </div>
                  <h5 className="text-stone-200 font-light text-center mb-2">Convert to 50 XLM</h5>
                  <div className="text-center mb-4">
                    <div className="text-2xl font-light text-orange-400">200 GAMECOIN</div>
                    <div className="text-xs text-stone-500">Quick Convert</div>
                  </div>
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-light py-2 rounded-sm transition-all text-sm">
                    Convert Now
                  </button>
                </div>

                <div className="bg-neutral-800 border-2 border-orange-500/40 hover:border-orange-500/60 rounded-sm p-6 transition-all">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-sm flex items-center justify-center text-3xl mb-4 mx-auto">
                    ⭐
                  </div>
                  <h5 className="text-stone-200 font-light text-center mb-2">Convert to 125 XLM</h5>
                  <div className="text-center mb-4">
                    <div className="text-2xl font-light text-orange-400">500 GAMECOIN</div>
                    <div className="text-xs text-stone-500">Quick Convert</div>
                  </div>
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-light py-2 rounded-sm transition-all text-sm">
                    Convert Now
                  </button>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-orange-500/5 border border-orange-500/20 rounded-sm p-6 mt-8">
              <h5 className="text-orange-300 font-light mb-3 text-sm">How It Works</h5>
              <ul className="space-y-2 text-xs text-stone-400">
                <li>• Earn GAMECOIN by testing games on Stellium</li>
                <li>• Exchange rate: 100 GAMECOIN = 25 XLM (1 GAMECOIN = 0.25 XLM)</li>
                <li>• Redeem for gift cards or convert directly to XLM</li>
                <li>• Gift cards are delivered via email within 24 hours</li>
                <li>• XLM conversions are instant and sent to your wallet</li>
                <li>• Minimum conversion: 100 GAMECOIN</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* About Us Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowAboutModal(false)}>
          <div className="bg-neutral-900 border-2 border-orange-500/30 rounded-sm p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                {/* Logo */}
                <svg width="48" height="48" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M28 4L48 16V40L28 52L8 40V16L28 4Z" stroke="url(#gradient1)" strokeWidth="2" fill="none"/>
                  <path d="M28 14L32 24H42L34 30L37 40L28 34L19 40L22 30L14 24H24L28 14Z" fill="url(#gradient2)"/>
                  <rect x="16" y="26" width="3" height="3" fill="#E8A951" opacity="0.6"/>
                  <rect x="13" y="29" width="3" height="3" fill="#E8A951" opacity="0.6"/>
                  <rect x="19" y="29" width="3" height="3" fill="#E8A951" opacity="0.6"/>
                  <rect x="16" y="32" width="3" height="3" fill="#E8A951" opacity="0.6"/>
                  <circle cx="40" cy="28" r="2" fill="#E8A951"/>
                  <circle cx="38" cy="34" r="1.5" fill="#E8A951" opacity="0.7"/>
                  <circle cx="42" cy="34" r="1.5" fill="#E8A951" opacity="0.7"/>
                  <line x1="40" y1="28" x2="38" y2="34" stroke="#E8A951" strokeWidth="0.5" opacity="0.4"/>
                  <line x1="40" y1="28" x2="42" y2="34" stroke="#E8A951" strokeWidth="0.5" opacity="0.4"/>
                  <defs>
                    <linearGradient id="gradient1" x1="8" y1="4" x2="48" y2="52">
                      <stop offset="0%" stopColor="#E8A951"/>
                      <stop offset="50%" stopColor="#F5C675"/>
                      <stop offset="100%" stopColor="#E8A951"/>
                    </linearGradient>
                    <linearGradient id="gradient2" x1="14" y1="14" x2="42" y2="40">
                      <stop offset="0%" stopColor="#F5C675"/>
                      <stop offset="100%" stopColor="#E8A951"/>
                    </linearGradient>
                  </defs>
                </svg>
                <div>
                  <h3 className="text-3xl font-light text-stone-100">About Stellium</h3>
                  <p className="text-stone-400 text-sm mt-1">The Future of Gaming on Blockchain</p>
                </div>
              </div>
              <button onClick={() => setShowAboutModal(false)} className="text-stone-400 hover:text-stone-200 text-2xl">×</button>
            </div>

            <div className="space-y-8">
              {/* Mission */}
              <div>
                <h4 className="text-xl font-light text-orange-400 mb-4">Our Mission</h4>
                <p className="text-stone-300 font-light leading-relaxed">
                  Stellium revolutionizes the gaming industry by connecting game developers with passionate testers through the power of blockchain technology. We believe that quality game testing should be rewarding, transparent, and accessible to everyone.
                </p>
              </div>

              {/* Why Stellar */}
              <div className="bg-neutral-800 border border-neutral-700 rounded-sm p-6">
                <h4 className="text-xl font-light text-orange-400 mb-4 flex items-center gap-2">
                  <span>⭐</span>
                  <span>Why Stellar Blockchain?</span>
                </h4>
                <div className="space-y-4 text-stone-300 font-light">
                  <div className="flex items-start gap-3">
                    <span className="text-orange-500 mt-1">⚡</span>
                    <div>
                      <div className="font-medium mb-1">Lightning Fast Transactions</div>
                      <div className="text-sm text-stone-400">Payments confirmed in 3-5 seconds, ensuring testers receive rewards instantly</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-orange-500 mt-1">💰</span>
                    <div>
                      <div className="font-medium mb-1">Extremely Low Fees</div>
                      <div className="text-sm text-stone-400">Transaction costs as low as 0.00001 XLM (fractions of a cent), making micro-payments viable</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-orange-500 mt-1">🔒</span>
                    <div>
                      <div className="font-medium mb-1">Enterprise-Grade Security</div>
                      <div className="text-sm text-stone-400">Battle-tested network securing billions of dollars in assets</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-orange-500 mt-1">🌍</span>
                    <div>
                      <div className="font-medium mb-1">Global Accessibility</div>
                      <div className="text-sm text-stone-400">Send payments to anyone, anywhere in the world, instantly</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-orange-500 mt-1">🪙</span>
                    <div>
                      <div className="font-medium mb-1">Native Custom Tokens</div>
                      <div className="text-sm text-stone-400">Easily create and manage game-specific tokens and rewards</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Our Model */}
              <div>
                <h4 className="text-xl font-light text-orange-400 mb-4">Fair & Transparent Model</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-neutral-800 border border-neutral-700 rounded-sm p-5 text-center">
                    <div className="text-3xl font-light text-orange-400 mb-2">5%</div>
                    <div className="text-stone-300 text-sm font-light mb-1">Platform Fee</div>
                    <div className="text-stone-500 text-xs">Industry's lowest commission</div>
                  </div>
                  <div className="bg-neutral-800 border border-neutral-700 rounded-sm p-5 text-center">
                    <div className="text-3xl font-light text-green-400 mb-2">95%</div>
                    <div className="text-stone-300 text-sm font-light mb-1">Goes to Testers</div>
                    <div className="text-stone-500 text-xs">Maximum value for your work</div>
                  </div>
                  <div className="bg-neutral-800 border border-neutral-700 rounded-sm p-5 text-center">
                    <div className="text-3xl font-light text-blue-400 mb-2">0%</div>
                    <div className="text-stone-300 text-sm font-light mb-1">Hidden Fees</div>
                    <div className="text-stone-500 text-xs">What you see is what you get</div>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-light text-orange-400 mb-4">For Testers</h4>
                  <ul className="space-y-2 text-stone-300 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">✓</span>
                      <span>Earn crypto while playing upcoming games</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">✓</span>
                      <span>Instant payments via blockchain</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">✓</span>
                      <span>Flexible time-based or completion rewards</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">✓</span>
                      <span>Access to exclusive alpha/beta games</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">✓</span>
                      <span>Build your reputation as a trusted tester</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-light text-orange-400 mb-4">For Developers</h4>
                  <ul className="space-y-2 text-stone-300 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">✓</span>
                      <span>Access to quality, motivated testers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">✓</span>
                      <span>Automated payment distribution</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">✓</span>
                      <span>Only 5% platform fee - keep more budget</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">✓</span>
                      <span>Attract investors for your project</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-500">✓</span>
                      <span>Transparent, verifiable testing data</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-gradient-to-br from-orange-500/10 to-neutral-800 border border-orange-500/30 rounded-sm p-6">
                <h4 className="text-lg font-light text-orange-300 mb-4 text-center">Platform Impact</h4>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-light text-orange-400 mb-1">2.4M+</div>
                    <div className="text-stone-400 text-xs">XLM Distributed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-light text-orange-400 mb-1">12,453</div>
                    <div className="text-stone-400 text-xs">Active Testers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-light text-orange-400 mb-1">847</div>
                    <div className="text-stone-400 text-xs">Games Tested</div>
                  </div>
                  <div>
                    <div className="text-2xl font-light text-orange-400 mb-1">99.8%</div>
                    <div className="text-stone-400 text-xs">Uptime</div>
                  </div>
                </div>
              </div>

              {/* Vision */}
              <div className="text-center">
                <p className="text-stone-300 font-light leading-relaxed italic">
                  "We envision a future where gaming and blockchain technology merge seamlessly, creating opportunities for players worldwide to earn while contributing to game development. Stellium is building that future, one game at a time."
                </p>
              </div>

              {/* CTA */}
              <div className="flex gap-4 pt-4">
                <button onClick={() => {setShowAboutModal(false); setShowAddGameModal(true);}} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-light py-3 rounded-sm transition-all">
                  Join as Developer
                </button>
                <button onClick={() => setShowAboutModal(false)} className="flex-1 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-stone-300 font-light py-3 rounded-sm transition-all">
                  Start Testing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Game Modal */}
      {showAddGameModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowAddGameModal(false)}>
          <div className="bg-neutral-900 border-2 border-orange-500/30 rounded-sm p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-light text-stone-100">Add Your Game</h3>
              <button onClick={() => setShowAddGameModal(false)} className="text-stone-400 hover:text-stone-200 text-2xl">×</button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-light text-stone-300 mb-2">Game Name *</label>
                <input
                  type="text"
                  placeholder="Enter your game name"
                  className="w-full bg-neutral-800 border border-neutral-700 focus:border-orange-500/50 rounded-sm p-3 text-stone-200 placeholder-stone-500 text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-light text-stone-300 mb-2">Game Files / Build *</label>
                <div className="border-2 border-dashed border-neutral-700 hover:border-orange-500/30 rounded-sm p-8 text-center transition-all cursor-pointer">
                  <div className="text-4xl mb-3">📁</div>
                  <div className="text-stone-400 text-sm mb-1">Drop your game files here or click to browse</div>
                  <div className="text-stone-500 text-xs">Supported: .zip, .apk, .exe (Max 500MB)</div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-light text-stone-300 mb-2">Description *</label>
                <textarea
                  placeholder="Describe your game, features, and what you want testers to focus on..."
                  className="w-full bg-neutral-800 border border-neutral-700 focus:border-orange-500/50 rounded-sm p-3 text-stone-200 placeholder-stone-500 text-sm h-32 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-light text-stone-300 mb-3">Payment Type *</label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 bg-neutral-800 border border-neutral-700 hover:border-orange-500/30 rounded-sm cursor-pointer transition-all">
                    <input type="radio" name="paymentType" className="w-4 h-4 text-orange-500" />
                    <div className="flex-1">
                      <div className="text-stone-200 text-sm font-light">Time-based Payment</div>
                      <div className="text-stone-500 text-xs">Pay testers per hour (e.g., 15 XLM/hour)</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 bg-neutral-800 border border-neutral-700 hover:border-orange-500/30 rounded-sm cursor-pointer transition-all">
                    <input type="radio" name="paymentType" className="w-4 h-4 text-orange-500" />
                    <div className="flex-1">
                      <div className="text-stone-200 text-sm font-light">Completion-based Payment</div>
                      <div className="text-stone-500 text-xs">Pay when testers complete specific tasks (e.g., 250 XLM)</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-light text-stone-300 mb-2">Payment Amount (XLM) *</label>
                  <input
                    type="number"
                    placeholder="e.g., 15 or 250"
                    className="w-full bg-neutral-800 border border-neutral-700 focus:border-orange-500/50 rounded-sm p-3 text-stone-200 placeholder-stone-500 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light text-stone-300 mb-2">Test Duration *</label>
                  <select className="w-full bg-neutral-800 border border-neutral-700 focus:border-orange-500/50 rounded-sm p-3 text-stone-200 text-sm outline-none">
                    <option>1 week</option>
                    <option>2 weeks</option>
                    <option>3 weeks</option>
                    <option>4 weeks</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-light text-stone-300 mb-2">Tags (Select up to 3)</label>
                <div className="flex flex-wrap gap-2">
                  {['RPG', 'Action', 'Strategy', 'NFT', 'Racing', 'DeFi', 'Casual', 'Multiplayer', 'PvP'].map((tag) => (
                    <button key={tag} className="px-4 py-2 bg-neutral-800 border border-neutral-700 hover:border-orange-500/50 hover:bg-orange-500/10 text-stone-300 text-xs rounded-sm transition-all">
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowAddGameModal(false)} className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-stone-300 font-light py-3 rounded-sm transition-all">
                  Cancel
                </button>
                <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-light py-3 rounded-sm transition-all">
                  Submit Game for Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}