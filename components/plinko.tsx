'use client'

import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface PlinkoProps {
  betAmount: number
  onPlay: () => void
}

const ROWS = 8
const COLS = 17
const BALL_RADIUS = 10
const PEG_RADIUS = 5
const SLOT_WIDTH = 60
const MULTIPLIERS = [1000, 130, 26, 9, 4, 2, 0.2, 0.2, 0.2, 0.2, 0.2, 2, 4, 9, 26, 130, 1000]
const GAME_WIDTH = 800; // You can adjust this value as needed

const Plinko: React.FC<PlinkoProps> = ({ betAmount, onPlay }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [result, setResult] = useState<number | null>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const [highlightedSlot, setHighlightedSlot] = useState<number | null>(null)

  // Function to draw the board
  const drawBoard = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height)

    // Draw pegs
    ctx.fillStyle = 'rgba(147, 51, 234, 0.3)'
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col <= COLS; col++) {
        const x = (col * canvasSize.width) / COLS
        const y = (row + 1) * (canvasSize.height / (ROWS + 2))
        ctx.beginPath()
        ctx.arc(x, y, PEG_RADIUS, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }

  useEffect(() => {
    const updateCanvasSize = () => {
      const height = window.innerHeight - 32 // Subtract multiplier height
      setCanvasSize({
        width: Math.min(GAME_WIDTH, window.innerWidth),
        height: height
      })
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)
    return () => window.removeEventListener('resize', updateCanvasSize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    drawBoard(ctx) // Call the drawBoard function here
  }, [canvasSize])

  const dropBall = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let x = canvasSize.width / 2
    let y = 0
    let vx = 0
    let vy = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height)
      drawBoard(ctx) // Call the drawBoard function here

      // Update ball position
      x += vx
      y += vy
      vy += 0.5 // Gravity

      // Check for collisions with pegs
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col <= COLS; col++) {
          const pegX = (col * canvasSize.width) / COLS
          const pegY = (row + 1) * (canvasSize.height / (ROWS + 2))
          const dx = x - pegX
          const dy = y - pegY
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < BALL_RADIUS + PEG_RADIUS) {
            vx = (Math.random() - 0.5) * 4
            vy = Math.abs(vy)
          }
        }
      }

      // Draw ball
      ctx.fillStyle = '#EF4444'
      ctx.beginPath()
      ctx.arc(x, y, BALL_RADIUS, 0, Math.PI * 2)
      ctx.fill()

      if (y < canvasSize.height - BALL_RADIUS) {
        requestAnimationFrame(animate)
      } else {
        const slot = Math.floor(x / (canvasSize.width / COLS))
        setHighlightedSlot(slot)
        setResult(betAmount * MULTIPLIERS[slot])
      }
    }

    animate()
  }

  const getMultiplierColor = (value: number) => {
    if (value >= 100) return 'bg-purple-900/20 text-purple-300'
    if (value >= 10) return 'bg-purple-800/20 text-purple-300'
    if (value >= 5) return 'bg-purple-700/20 text-purple-300'
    if (value > 1) return 'bg-purple-600/20 text-purple-300'
    return 'bg-purple-500/20 text-purple-300'
  }

  const handlePlay = () => {
    setHighlightedSlot(null)
    setResult(null)
    dropBall()
    onPlay() // Trigger any additional actions after game ends
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="fixed left-1/2 transform -translate-x-1/2"
      />
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 flex justify-between items-end z-10" style={{ width: `${canvasSize.width}px` }}>
        {MULTIPLIERS.map((multiplier, index) => (
          <motion.div
            key={index}
            className={`
              w-[calc(100%/17)] 
              flex items-center justify-center 
              font-medium text-xs
              border-t border-l border-r border-purple-500/10
              ${getMultiplierColor(multiplier)}
              transition-all duration-300
            `}
            style={{
              borderTopLeftRadius: '4px',
              borderTopRightRadius: '4px'
            }}
            initial={{ height: 24 }}
            animate={{ 
              height: highlightedSlot === index ? 36 : 24,
              y: highlightedSlot === index ? -6 : 0
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {multiplier}x
          </motion.div>
        ))}
      </div>
    </>
  )
}

export default Plinko