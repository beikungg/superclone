"use client"

import dynamic from 'next/dynamic'

const VoiceCloneWindow = dynamic(() => import('./VoiceCloneWindow'), {
    ssr: false,
})

export default function VoiceCloneWrapper() {
    return <VoiceCloneWindow />
} 