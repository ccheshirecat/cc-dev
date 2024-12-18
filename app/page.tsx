'use client'

import { motion, useScroll, useTransform } from "framer-motion"
import { Star, Menu } from 'lucide-react'
import Link from "next/link"
import { useState, useEffect, useMemo, useCallback, memo, Suspense } from "react"
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'

import { Card } from "@/components/ui/card"
import { WalletDropdown } from "@/components/wallet-dropdown"
import { BetInput } from '@/components/bet-input'
import { SlotMachine } from '@/components/slot-machine'
import { Notification } from '@/components/notification'
import { AnimatePresence } from 'framer-motion'
import { WalletProvider, useWallet } from '@/contexts/WalletContext'
import { exchangeRates } from '@/utils/exchangeRates'
import { isMobile } from '@/utils/isMobile'

const Projects = dynamic(() => import('./projects'), { 
  ssr: false, 
  loading: () => <p>Loading projects...</p>,
  suspense: true 
})
const Skills = dynamic(() => import('@/app/skills').then(mod => mod.default), {
  ssr: false,
  loading: () => <p>Loading skills...</p>,
  suspense: true
})

const PortfolioContent = memo(function PortfolioContent() {
  const { scrollYProgress } = useScroll()
  const navBackgroundOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])
  const { selectedCrypto, updateBalance, addRandomTip, displayFiat, convertFiatToCrypto, convertCryptoToFiat, balances } = useWallet()
  const [betAmount, setBetAmount] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [notification, setNotification] = useState<{ message: string; isVisible: boolean; type: 'success' | 'error' }>({ message: '', isVisible: false, type: 'success' })
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [turboMode, setTurboMode] = useState(false)
  const [autoSpin, setAutoSpin] = useState(false)
  const [isMobileDevice, setIsMobileDevice] = useState(false)
  const [tipAdded, setTipAdded] = useState(false);
  const pathname = usePathname()

  useEffect(() => {
    setIsMobileDevice(isMobile());
    const handleResize = () => setIsMobileDevice(isMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  useEffect(() => {
    if (!tipAdded) {
      addRandomTip().then((tip) => {
        if (tip) {
          setNotification({
            message: `@cheshirecat tipped you ${displayFiat ? `$${tip.fiatAmount}` : `${tip.cryptoAmount} ${tip.symbol}`}`,
            isVisible: true,
            type: 'success'
          });
          setTipAdded(true);
        }
      });
    }
  }, [tipAdded, addRandomTip, displayFiat]);

  // useEffect(() => {
  //   const newBalance = balances.find(b => b.symbol !== 'BTC' && b.symbol !== 'ETH' && parseFloat(b.balance) > 0);
  //   if (newBalance) {
  //     setNotification({
  //       message: `@cheshirecat tipped you ${displayFiat ? `$${convertCryptoToFiat(parseFloat(newBalance.balance), newBalance.symbol)}` : `${newBalance.balance} ${newBalance.symbol}`}`,
  //       isVisible: true,
  //       type: 'success'
  //     });
  //   }
  // }, [balances, displayFiat, convertCryptoToFiat]);

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


  const handlePlay = useCallback((amount: number) => {
    const balance = parseFloat(selectedCrypto.balance);
    const cryptoAmount = displayFiat ? parseFloat(convertFiatToCrypto(amount, selectedCrypto.symbol)) : amount;
    
    if (balance < cryptoAmount || cryptoAmount <= 0) {
      setNotification({
        message: `Insufficient balance or invalid bet. You need ${displayFiat ? `$${amount.toFixed(2)}` : `${cryptoAmount.toFixed(8)} ${selectedCrypto.symbol}`}`,
        isVisible: true,
        type: 'error'
      });
      setAutoSpin(false);
      return false;
    }
    setIsSpinning(true);
    const newBalance = (balance - cryptoAmount).toFixed(8);
    updateBalance(selectedCrypto.symbol, newBalance);
    
    setTimeout(() => {
      setIsSpinning(false);
    }, turboMode ? 1000 : 2000);
    return true;
  }, [selectedCrypto, updateBalance, setIsSpinning, turboMode, setNotification, setAutoSpin, displayFiat, convertFiatToCrypto]);

  const handleWin = useCallback((multiplier: number) => {
    const winAmount = betAmount * multiplier;
    const cryptoWinAmount = displayFiat 
      ? parseFloat(convertFiatToCrypto(winAmount, selectedCrypto.symbol)) 
      : winAmount;
    const currentBalance = parseFloat(selectedCrypto.balance);
    const newBalance = (currentBalance + cryptoWinAmount).toFixed(8);
    updateBalance(selectedCrypto.symbol, newBalance);
    setNotification({
      message: `Congratulations! You won ${
        displayFiat 
          ? `$${winAmount.toFixed(2)}` 
          : `${cryptoWinAmount.toFixed(8)} ${selectedCrypto.symbol}`
      }`,
      isVisible: true,
      type: 'success'
    });
  }, [betAmount, selectedCrypto, updateBalance, setNotification, displayFiat, convertFiatToCrypto]);

  const elementCount = isMobileDevice ? 2 : 3;
  const orbCount = isMobileDevice ? 1 : 2;

  const BackgroundElements = useMemo(() => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-black to-purple-950" />
      <div className="absolute inset-0 opacity-20">
        {[...Array(elementCount)].map((_, index) => (
          <div
            key={index}
            className="absolute w-10 h-10 hw-accelerate animate-float"
            style={{
              animationDelay: `${Math.random() * 20}s`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          >
            <Image
              src={index % 2 === 0 ? "/cat.svg" : "/dog.svg"}
              alt="Slot Symbol"
              width={40}
              height={40}
              loading="lazy"
            />
          </div>
        ))}
      </div>
      {[...Array(orbCount)].map((_, index) => (
        <div
          key={index}
          className="absolute rounded-full bg-purple-400 opacity-10 blur-xl hw-accelerate animate-float animate-pulse"
          style={{
            width: `${Math.random() * 200 + 100}px`,
            height: `${Math.random() * 200 + 100}px`,
            animationDuration: `${isMobileDevice ? '45s' : '30s'}, 3s`,
            animationDelay: `${Math.random() * 30}s, 0s`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(to right, #8b5cf6 1px, transparent 1px), linear-gradient(to bottom, #8b5cf6 1px, transparent 1px)`,
          backgroundSize: isMobileDevice ? '60px 60px' : '40px 40px',
        }}
      />
    </div>
  ), [isMobileDevice, elementCount, orbCount]);

  const toggleAutoSpin = useCallback(() => {
    setAutoSpin(prev => {
      if (!prev && !isSpinning) {
        handlePlay(betAmount);
      }
      return !prev;
    });
  }, [isSpinning, handlePlay, betAmount]);

  const MemoizedSlotMachine = useMemo(() => (
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
      convertFiatToCrypto={convertFiatToCrypto}
      displayFiat={displayFiat}
    />
  ), [handleWin, isSpinning, updateBalance, selectedCrypto, turboMode, setAutoSpin]);

  const MemoizedBetInput = useMemo(() => (
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
      displayFiat={displayFiat}
      convertFiatToCrypto={convertFiatToCrypto}
      convertCryptoToFiat={convertCryptoToFiat}
    />
  ), [selectedCrypto, handlePlay, isSpinning, turboMode, autoSpin, toggleAutoSpin, displayFiat, convertFiatToCrypto, convertCryptoToFiat]);

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
                isMobile={isMobileDevice}
              />
            </div>
            <div className="hidden md:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
              <WalletDropdown 
                onNotification={(message, type) => setNotification({ message, isVisible: true, type })}
                isMobile={isMobileDevice}
              />
            </div>
            <div className="hidden md:flex items-center gap-6">
              {['Projects', 'Skills', 'Contact'].map((item, index) => (
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
                {MemoizedSlotMachine}
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
                <Image 
                  src="/cc-logo.svg" 
                  alt="Cheshire Cat Logo" 
                  width={22} 
                  height={22} 
                  className="inline-block ml-1" 
                  priority
                />
              </p>
              <div className="relative z-30 max-w-md mx-auto">
                {MemoizedBetInput}
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
                &nbsp;&nbsp;&nbsp;&nbsp;fugitive = <span className="text-purple-500">true</span><span className="text-purple-600">;</span>
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
        <Suspense fallback={<div>Loading projects...</div>}>
          <Projects />
        </Suspense>

        {/* Skills Section */}
        <Suspense fallback={<div>Loading skills...</div>}>
          <Skills />
        </Suspense>

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
});

export default function Portfolio() {
  return (
    <WalletProvider>
      <PortfolioContent />
    </WalletProvider>
  )
}
