"use client"

import { Zap, Mic, Headphones, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const features = [
  {
    name: "快速克隆",
    description: "只需几分钟的语音样本，即可生成高质量的语音克隆模型。",
    icon: Zap,
  },
  {
    name: "高保真音质",
    description: "采用先进的 AI 技术，确保克隆声音的音质和情感表达与原声高度一致。",
    icon: Mic,
  },
  {
    name: "多场景应用",
    description: "支持多种语言和场景，适用于内容创作、游戏配音、语音助手等。",
    icon: Headphones,
  },
  {
    name: "持续优化",
    description: "基于用户反馈不断优化算法，提供更自然、更真实的语音克隆体验。",
    icon: TrendingUp,
  },
]

export default function Features() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className="py-24 bg-background relative overflow-hidden" id="features">
      {/* 背景动画 */}
      {isClient && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-1/2 -right-1/4 w-1/2 h-1/2 bg-primary-light rounded-full"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-1/2 -left-1/4 w-1/2 h-1/2 bg-secondary-light rounded-full"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: 2,
              ease: "easeInOut",
            }}
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="lg:text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">功能特点</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-foreground sm:text-4xl">
            为您提供最专业的语音克隆解决方案
          </p>
          <p className="mt-4 max-w-2xl text-xl text-muted-foreground lg:mx-auto">
            SUPERCLONE 提供全方位的语音克隆服务，让您轻松实现声音的完美复制。
          </p>
        </motion.div>

        <div className="mt-20">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <dt>
                  <motion.div
                    className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </motion.div>
                  <p className="ml-16 text-lg leading-6 font-medium text-foreground">{feature.name}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-muted-foreground">{feature.description}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

