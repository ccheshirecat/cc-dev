'use client'

import { motion, useScroll, useTransform } from "framer-motion"
import { Cat, Star, Menu, WalletIcon, Zap, PlayCircle, Pause } from 'lucide-react'
import Link from "next/link"
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import Image from 'next/image'

import { Card } from "@/components/ui/card"
import { Projects } from "./projects"
import { Skills } from "@/app/skills"
import { WalletDropdown } from "@/components/wallet-dropdown"
import { BetInput } from '@/components/bet-input'
import { SlotMachine } from '@/components/slot-machine'
import { Notification } from '@/components/notification'
import { AnimatePresence } from 'framer-motion'
import { WalletProvider, useWallet } from '@/contexts/WalletContext'
import { exchangeRates } from '@/utils/exchangeRates';

function PortfolioContent() {
  const [isHovered, setIsHovered] = useState(false)
  const { scrollYProgress } = useScroll()
  const navBackgroundOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])
  const { selectedCrypto, updateBalance, addRandomTip, displayFiat } = useWallet()
  const [betAmount, setBetAmount] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [intricatePattern, setIntricatePattern] = useState<string>('')
  const [notification, setNotification] = useState<{ message: string; isVisible: boolean; type: 'success' | 'error' }>({ message: '', isVisible: false, type: 'success' })
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [turboMode, setTurboMode] = useState(false);
  const [autoSpin, setAutoSpin] = useState(false);

  console.log('Rendering page, turboMode:', turboMode);

  useEffect(() => {
    const initializeRandomTip = async () => {
      const tip = await addRandomTip();
      if (tip) {
        setNotification({
          message: `@cheshirecat tipped you ${displayFiat ? `$${tip.fiatAmount}` : `${tip.cryptoAmount} ${tip.symbol}`}`,
          isVisible: true,
          type: 'success'
        });
      }
    };

    initializeRandomTip();
  }, [addRandomTip, displayFiat]);

  useEffect(() => {
    let autoSpinInterval: NodeJS.Timeout;
    if (autoSpin && !isSpinning) {
      autoSpinInterval = setInterval(() => {
        handlePlay(betAmount);
      }, turboMode ? 1000 : 2000);
    }
    return () => {
      if (autoSpinInterval) {
        clearInterval(autoSpinInterval);
      }
    };
  }, [autoSpin, isSpinning, turboMode, betAmount]);

  const handlePlay = (amount: number) => {
    const balance = parseFloat(selectedCrypto.balance);
    if (balance < amount || amount <= 0) {
      const rate = exchangeRates[selectedCrypto.symbol] || 1;
      setNotification({
        message: `Insufficient balance or invalid bet. You need ${displayFiat ? `$${(amount * rate).toFixed(2)}` : `${amount.toFixed(8)} ${selectedCrypto.symbol}`}`,
        isVisible: true,
        type: 'error'
      });
      setAutoSpin(false);
      return false;
    }
    setIsSpinning(true);
    const newBalance = (balance - amount).toFixed(8);
    updateBalance(selectedCrypto.symbol, newBalance);
    
    setTimeout(() => {
      setIsSpinning(false);
    }, turboMode ? 1000 : 2000);
    return true;
  };

  const handleWin = (multiplier: number) => {
    const winAmount = betAmount * multiplier;
    const currentBalance = parseFloat(selectedCrypto.balance);
    const newBalance = (currentBalance + winAmount).toFixed(8);
    updateBalance(selectedCrypto.symbol, newBalance);
    const rate = exchangeRates[selectedCrypto.symbol] || 1;
    setNotification({
      message: `Congratulations! You won ${displayFiat ? `$${(winAmount * rate).toFixed(2)}` : `${winAmount.toFixed(8)} ${selectedCrypto.symbol}`}`,
      isVisible: true,
      type: 'success'
    });
  };

  const BackgroundElements = useMemo(() => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-black to-purple-950" />

      {/* Animated slot symbols */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute"
            initial={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              rotate: Math.random() * 360,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              top: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              left: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              rotate: [0, 360],
              scale: [Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Image
              src={index % 3 === 0 ? "/cat.svg" : index % 3 === 1 ? "/dog.svg" : "/fox.svg"}
              alt="Slot Symbol"
              width={40}
              height={40}
            />
          </motion.div>
        ))}
      </div>

      {/* Glowing orbs */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full bg-purple-400 opacity-20 blur-xl"
            style={{
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 200 + 100}px`,
            }}
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Subtle grid overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(to right, #8b5cf6 1px, transparent 1px), linear-gradient(to bottom, #8b5cf6 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />
    </div>
  ), []);

  const toggleAutoSpin = () => {
    if (autoSpin) {
      setAutoSpin(false);
    } else {
      setAutoSpin(true);
      if (!isSpinning) {
        handlePlay(betAmount);
      }
    }
  };

  return (
    <>
      {BackgroundElements}

      {/* Navigation */}
      <motion.nav
        style={{ backgroundColor: `rgba(0, 0, 0, ${navBackgroundOpacity})` }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-purple-900/20"
      >
        <div className="container mx-auto px-4 max-w-5xl flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-xl font-bold bg-gradient-to-r from-purple-300 to-purple-400 bg-clip-text text-transparent"
          >
            cc
          </Link>
          <div className="flex items-center space-x-4">
            <div className="md:hidden flex justify-center flex-1 max-w-[200px]">
              <WalletDropdown 
                onNotification={(message, type) => setNotification({ message, isVisible: true, type })}
                isMobile={true}
              />
            </div>
            <div className="hidden md:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
              <WalletDropdown 
                onNotification={(message, type) => setNotification({ message, isVisible: true, type })}
                isMobile={false}
              />
            </div>
            <div className="hidden md:flex items-center gap-6">
              {['projects', 'skills', 'contact'].map((item, index) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="relative text-sm group"
                >
                  <span className="relative z-10 text-purple-400 hover:text-purple-300 transition-colors">{item}</span>
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-700 origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              ))}
            </div>
            <Button
              className="md:hidden text-purple-300 hover:text-purple-100"
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-50 bg-black/20 backdrop-blur-md border-b border-purple-500/20 md:hidden"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col gap-2">
                {['Projects', 'Skills', 'Contact'].map((item, index) => (
                  <Link
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-purple-300 hover:text-purple-100 transition-colors py-3 px-4 rounded-lg bg-purple-800/20 hover:bg-purple-700/30"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="relative z-10">{item}</span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-16 sm:pt-0">
        {/* Hero Section with Slot Machine */}
        <section className="relative pt-20 sm:pt-0 pb-20 min-h-[100svh] flex items-center justify-center overflow-hidden">
          <div className="container mx-auto px-4 py-8 sm:py-16 max-w-5xl relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto text-center mb-8 sm:mb-0"
            >
              <div className="mb-8 sm:mb-12 relative z-30 mx-auto max-w-full sm:max-w-[90%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%]">
                <SlotMachine 
                  onWin={handleWin} 
                  isSpinning={isSpinning} 
                  spinSoundPath="/sounds/spin.mp3"
                  winSoundPath="/sounds/win.mp3"
                  loseSoundPath="/sounds/lose.mp3"
                  updateBalance={updateBalance}
                  selectedCrypto={selectedCrypto}
                  turboMode={turboMode}
                  setAutoSpin={setAutoSpin}
                />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 relative glow">
                <span className="bg-gradient-to-r from-purple-300 to-purple-400 bg-clip-text text-transparent">
                  cheshirecat.dev
                </span>
                <motion.div
                  className="absolute -top-6 -right-6 text-purple-800"
                  animate={{
                    rotate: 360,
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                  }}
                >
                  <Star className="w-8 h-8 sm:w-12 sm:h-12" />
                </motion.div>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-purple-300/60 mb-6 sm:mb-8 flex items-center justify-center">
                a sneak peek into my world {' '}
                <Image src="/cc-logo.svg" alt="Cheshire Cat Logo" width={22} height={22} className="inline-block ml-1" />
              </p>
              <div className="relative z-30 max-w-md mx-auto">
                <BetInput 
                  selectedCrypto={selectedCrypto} 
                  onBetChange={setBetAmount} 
                  onPlay={handlePlay}
                  isSpinning={isSpinning}
                  turboMode={turboMode}
                  onTurboToggle={() => setTurboMode(prev => !prev)}
                  autoSpin={autoSpin}
                  onAutoSpinToggle={toggleAutoSpin}
                  onNotification={(message, type) => setNotification({ message, isVisible: true, type })}
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4 max-w-5xl">
            <Card className="relative bg-black border border-purple-800/30 overflow-hidden rounded-3xl p-6 shadow-lg shadow-purple-900/10 hover:shadow-purple-800/20 hover:border-purple-700/50 transition-all duration-300">
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                }}
                className="absolute -top-6 -left-6 w-20 h-20 bg-purple-800/20 rounded-lg blur-2xl"
              />
              <motion.div
                animate={{
                  rotate: [0, -5, 5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                }}
                className="absolute -bottom-6 -right-6 w-20 h-20 bg-purple-700/20 rounded-lg blur-2xl"
              />
              <code className="text-sm text-purple-300 block relative z-9">
                <span className="text-purple-500">function</span> infiniteMoneyGlitch<span className="text-purple-400">()</span> &#123;
                <br />
                &nbsp;&nbsp;<span className="text-purple-500">try</span> &#123;
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;run(<span className="text-green-400">&quot;internationalDrugDealing()&quot;</span>)<span className="text-purple-600">;</span>
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-500">throw</span> <span className="text-purple-500">new</span> Error(<span className="text-green-400">&quot;busto&quot;</span>)<span className="text-purple-600">;</span>
                <br />
                &nbsp;&nbsp;&#125; <span className="text-purple-500">catch</span> &#123;
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;fugitive = <span className="text-purple-500">true</span><span className="text-purplepurple-600">;</span>
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;status = <span className="text-green-400">&quot;busto -.-&quot;</span><span className="text-purple-600">;</span>
                <br />
                &nbsp;&nbsp;&#125;
                <br />
                <br />
                &nbsp;&nbsp;name = <span className="text-green-400">&quot;cheshirecat&quot;</span><span className="text-purple-600">;</span>
                <br />
                &nbsp;&nbsp;run(<span className="text-green-400">&quot;turnInvisible()&quot;</span>)<span className="text-purple-600">;</span>
                <br />
                <br />
                &nbsp;&nbsp;<span className="text-purple-500">let</span> assets = [<span className="text-green-400">&quot;IDontReadDocs&quot;</span>, <span className="text-green-400">&quot;PressedRandomButtonsLol&quot;</span>, <span className="text-green-400">&quot;RNGesusBlessedMe&quot;</span>]<span className="text-purple-600">;</span>
                <br />
                &nbsp;&nbsp;<span className="text-purple-500">let</span> competition = <span className="text-green-400">&quot;cooked&quot;</span><span className="text-purple-600">;</span>
                <br />
                &nbsp;&nbsp;assets = [<span className="text-green-400">&quot;dustBunNY&quot;</span>, <span className="text-green-400">&quot;KingoFbusto&quot;</span>, <span className="text-green-400">&quot;AccidentalMillionaire&quot;</span>]<span className="text-purple-600">;</span>
<br />
&nbsp;&nbsp;competition = <span className="text-green-400">&quot;even more cooked&quot;</span><span className="text-purple-600">;</span>
<br />
<br />
&nbsp;&nbsp;<span className="text-purple-500">if</span> (Math.random() &lt; <span className="text-green-400">0.9</span>) status = <span className="text-green-400">&quot;BUSTO&quot;</span><span className="text-purple-600">;</span>
<br />
<br />
&nbsp;&nbsp;<span className="text-purple-500">return</span> &#123; 
name, 
assets, 
competition, 
status 
&#125;<span className="text-purple-600">;</span>
<br />
&#125;
</code>
            </Card>
          </div>
        </section>

        {/* Projects Section */}
        <Projects />

        {/* Skills Section */}
        <Skills />

        {/* Contact Section */}
        <section id="contact" className="py-20 relative overflow-hidden">
          <div className="container mx-auto px-4 max-w-5xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-300 to-purple-400 bg-clip-text text-transparent mb-4">
                contact
              </h2>
              <p className="text-purple-300/60 max-w-xl mx-auto">
                who even uses email right but it looks professional so i shall abide
              </p>
            </motion.div>
            <Card className="bg-black border-purple-900/20 overflow-hidden rounded-3xl p-6">
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-purple-300 mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-3 py-2 bg-purple-900/20 border border-purple-700/50 rounded-md text-purple-100 placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="pretty self explanatory if u ask me"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-purple-300 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-3 py-2 bg-purple-900/20 border border-purple-700/50 rounded-md text-purple-100 placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="unfortunately this is obligatory but u can include ur tele/discord below"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-purple-300 mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-3 py-2 bg-purple-900/20 border border-purple-700/50 rounded-md text-purple-100 placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="blah blah blah"
                  ></textarea>
                </div>
                <div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-purple-900 hover:bg-purple-800 text-purple-100 rounded-md group relative overflow-hidden"
                  >
                    <span className="relative z-10">sen</span>
                    <motion.div
                      className="absolute inset-0 bg-purple-700"
                      initial={{ x: "100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </section>
      </main>

      {/* Notification */}
      <Notification
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
        type={notification.type}
        autoHideDuration={5000}
      />

      {/* Footer */}
      <footer className="py-12 border-t border-purple-900/20 relative z-10">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <p className="text-purple-400/60 text-sm">
            this beautiful creation was conjured up by me obviously © cheshirecat {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </>
  )
}

export default function Portfolio() {
  return (
    <WalletProvider>
      <PortfolioContent />
    </WalletProvider>
  )
}

