'use client'

import { motion, useScroll, useTransform } from "framer-motion"
import { Cat, Star } from 'lucide-react'
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

import { Card } from "@/components/ui/card"
import { Projects } from "./projects"
import { Skills } from "@/app/skills"
import { WalletDropdown } from "@/components/wallet-dropdown"
import { BetInput } from '@/components/bet-input'
import Plinko from '@/components/plinko'

type CryptoBalance = {
  symbol: string;
  name: string;
  balance: string;
};

export default function Portfolio() {
  const [isHovered, setIsHovered] = useState(false)
  const { scrollYProgress } = useScroll()
  const navBackgroundOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoBalance>({ 
    symbol: 'ETH', 
    name: 'Ethereum', 
    balance: '0.00' 
  })
  const [betAmount, setBetAmount] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [intricatePattern, setIntricatePattern] = useState<string>('')

  useEffect(() => {
    // Generate intricate pattern
    const generateIntricatePattern = () => {
      const svgWidth = window.innerWidth;
      const svgHeight = window.innerHeight;
      const cellSize = 100; // Size of each cell in the grid
      const lineOpacity = 0.09; // Slightly more visible, but still subtle lines

      let pattern = '';

      for (let x = 0; x < svgWidth; x += cellSize) {
        for (let y = 0; y < svgHeight; y += cellSize) {
          // Randomly choose between square, diamond, or hexagon
          const shapeType = Math.floor(Math.random() * 3);
          
          switch (shapeType) {
            case 0: // Square
              pattern += generateSquare(x, y, cellSize, lineOpacity);
              break;
            case 1: // Diamond
              pattern += generateDiamond(x, y, cellSize, lineOpacity);
              break;
            case 2: // Hexagon
              pattern += generateHexagon(x, y, cellSize, lineOpacity);
              break;
          }
        }
      }

      return pattern;
    };

    const generateSquare = (x: number, y: number, size: number, opacity: number) => {
      return `
        <rect x="${x}" y="${y}" width="${size}" height="${size}" 
              fill="none" stroke="#C4B5E0" stroke-width="0.3" opacity="${opacity}" />
        <line x1="${x}" y1="${y}" x2="${x + size}" y2="${y + size}" 
              stroke="#C4B5E0" stroke-width="0.3" opacity="${opacity}" />
        <line x1="${x + size}" y1="${y}" x2="${x}" y2="${y + size}" 
              stroke="#C4B5E0" stroke-width="0.3" opacity="${opacity}" />
      `;
    };

    const generateDiamond = (x: number, y: number, size: number, opacity: number) => {
      const centerX = x + size / 2;
      const centerY = y + size / 2;
      return `
        <polygon points="${centerX},${y} ${x + size},${centerY} ${centerX},${y + size} ${x},${centerY}"
                 fill="none" stroke="#C4B5E0" stroke-width="0.3" opacity="${opacity}" />
        <line x1="${x}" y1="${centerY}" x2="${x + size}" y2="${centerY}" 
              stroke="#C4B5E0" stroke-width="0.3" opacity="${opacity}" />
        <line x1="${centerX}" y1="${y}" x2="${centerX}" y2="${y + size}" 
              stroke="#C4B5E0" stroke-width="0.3" opacity="${opacity}" />
      `;
    };

    const generateHexagon = (x: number, y: number, size: number, opacity: number) => {
      const centerX = x + size / 2;
      const centerY = y + size / 2;
      const hexPoints = [];
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const hx = centerX + (size / 2) * Math.cos(angle);
        const hy = centerY + (size / 2) * Math.sin(angle);
        hexPoints.push(`${hx},${hy}`);
      }
      return `
        <polygon points="${hexPoints.join(' ')}"
                 fill="none" stroke="#C4B5E0" stroke-width="0.3" opacity="${opacity}" />
        <line x1="${hexPoints[0].split(',')[0]}" y1="${hexPoints[0].split(',')[1]}" 
              x2="${hexPoints[3].split(',')[0]}" y2="${hexPoints[3].split(',')[1]}" 
              stroke="#C4B5E0" stroke-width="0.3" opacity="${opacity}" />
        <line x1="${hexPoints[1].split(',')[0]}" y1="${hexPoints[1].split(',')[1]}" 
              x2="${hexPoints[4].split(',')[0]}" y2="${hexPoints[4].split(',')[1]}" 
              stroke="#C4B5E0" stroke-width="0.3" opacity="${opacity}" />
        <line x1="${hexPoints[2].split(',')[0]}" y1="${hexPoints[2].split(',')[1]}" 
              x2="${hexPoints[5].split(',')[0]}" y2="${hexPoints[5].split(',')[1]}" 
              stroke="#C4B5E0" stroke-width="0.3" opacity="${opacity}" />
      `;
    };

    setIntricatePattern(generateIntricatePattern());
  }, []);

  const handlePlay = () => {
    setIsPlaying(true)
  }

  return (
    <>
      {/* Animated background with intricate pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          dangerouslySetInnerHTML={{ __html: intricatePattern }}
        />

        {/* Subtle gradient overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 30% 50%, rgba(30, 10, 60, 0.2), rgba(10, 5, 25, 0.3))',
            mixBlendMode: 'soft-light'
          }}
        />
        
        {/* Animated particles */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="particle-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.15)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
            </radialGradient>
          </defs>
          {[...Array(20)].map((_, index) => (
            <motion.circle
              key={index}
              r={Math.random() * 4 + 1}
              fill="url(#particle-gradient)"
              initial={{
                x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%',
              }}
              animate={{
                x: [
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%',
                ],
                y: [
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%',
                ],
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </svg>
      </div>

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
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <WalletDropdown onSelectCrypto={setSelectedCrypto} />
          </div>
          <div className="flex items-center gap-6">
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
        </div>
      </motion.nav>

      <main>
        {/* Hero Section with Plinko Game */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="container mx-auto px-4 max-w-5xl relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center"
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 10, 0],
                  transition: { duration: 5, repeat: Infinity },
                }}
                className="inline-block"
              >
              <Cat
                className={`w-24 h-24 mx-auto mb-8 transition-all duration-300 ${
                  isHovered ? "text-pink-400 scale-110" : "text-purple-400"
                }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              />
              </motion.div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 relative glow">
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
                  <Star className="w-12 h-12" />
                </motion.div>
              </h1>
              <p className="text-xl text-purple-300/60 mb-8">
              this cat’s out of the bag and already rolling on a rug 😼
              </p>
              <div className="mb-4 relative z-30">
                <BetInput selectedCrypto={selectedCrypto} onBetChange={setBetAmount} onPlay={handlePlay} />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Plinko Game Canvas */}
        <div className="fixed inset-0 z-0 flex justify-center items-center pointer-events-none">
          <div className="w-full max-w-[800px]">
            <Plinko betAmount={betAmount} onPlay={handlePlay} />
          </div>
        </div>

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
                faster sen la
              </h2>
              <p className="text-purple-300/60 max-w-xl mx-auto">
              who even uses email dude but i mean this is more professional and convincing so i shall abide

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
                    placeholder="name (tbh idc but i think im obligated to include this)"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-purple-300 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-3 py-2 bg-purple-900/20 border border-purple-700/50 rounded-md text-purple-100 placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="email (uk what just leave ur tele or disc name ill dm u)"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-purple-300 mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-3 py-2 bg-purple-900/20 border border-purple-700/50 rounded-md text-purple-100 placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="keep yapping mate"
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

      {/* Footer */}
      <footer className="py-12 border-t border-purple-900/20">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <p className="text-purple-400/60 text-sm">
            this beautiful work of art was conjured up by cheshirecat during the long, painful hours without bullet © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </>
  )
}

