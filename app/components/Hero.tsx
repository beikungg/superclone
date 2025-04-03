"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function Hero() {
  // Use useState to safely handle client-side animations
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className="bg-background py-20 md:py-32 overflow-hidden relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-primary block mb-2">SUPERCLONE</span>
            <span className="text-foreground">Clone Your Voice with AI</span>
          </motion.h1>
          <motion.p
            className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            使用先进的 AI 技术，只需几分钟即可完美克隆任何人的声音。无论是内容创作、游戏配音还是个性化语音助手，SUPERCLONE 都能满足您的需求。
          </motion.p>
          <motion.div
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link href="/voice-clone">
              <Button size="lg" className="w-full sm:w-auto">
                立即体验
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              了解更多
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* 声音波纹动画背景 */}
      {isClient && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-full h-full bg-primary/10 dark:bg-primary/20 rounded-full"
              style={{
                top: `${-50 + i * 20}%`,
                left: `${-50 + i * 20}%`,
                width: `${100 + i * 40}%`,
                height: `${100 + i * 40}%`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

