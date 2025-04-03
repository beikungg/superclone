"use client"

import dynamic from "next/dynamic"
import ErrorBoundary from "../components/error-boundary"

// 动态导入语音克隆组件
const VoiceCloneWindow = dynamic(() => import("../components/VoiceCloneWindow"), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center min-h-screen">加载中...</div>
})

export default function VoiceClonePage() {
    return (
        <div className="flex flex-col min-h-screen">
            <ErrorBoundary>
                <VoiceCloneWindow />
            </ErrorBoundary>
        </div>
    )
} 