'use client'

import { useState, useEffect, useRef } from 'react'

export default function Home() {
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [status, setStatus] = useState('初始化中...')
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      
      if (!SpeechRecognition) {
        setStatus('浏览器不支持语音识别功能')
        return
      }

      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'zh-CN'

      let pauseTimer: NodeJS.Timeout
      let finalTranscript = ''

      recognition.onstart = () => {
        setIsListening(true)
        setStatus('正在监听...')
      }

      recognition.onresult = (event: any) => {
        let interimTranscript = ''
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          const transcript = result[0].transcript
          
          if (result.isFinal) {
            finalTranscript += transcript + ' [停顿] '
          } else {
            interimTranscript = transcript
          }
        }

        clearTimeout(pauseTimer)
        pauseTimer = setTimeout(() => {
          if (finalTranscript && !interimTranscript) {
            finalTranscript += ' [长停顿] '
          }
        }, 2000)

        setTranscript(finalTranscript + interimTranscript)
      }

      recognition.onerror = (event: any) => {
        setStatus(`错误: ${event.error}`)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
        setStatus('语音识别已停止')
      }

      recognitionRef.current = recognition

      setTimeout(() => {
        startListening()
      }, 1000)
    }
  }, [])

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start()
      } catch (error) {
        console.error('启动语音识别失败:', error)
        setStatus('启动失败，请刷新页面重试')
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  const clearTranscript = () => {
    setTranscript('')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Storyly 语音识别实验
        </p>
      </div>

      <div className="w-full max-w-4xl space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">语音识别功能</h1>
          <div className="flex justify-center items-center space-x-4 mb-6">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              isListening ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}>
              <div className={`w-3 h-3 rounded-full ${
                isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
              }`}></div>
              <span className="font-medium">{status}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">识别结果</h2>
            <div className="flex space-x-2">
              <button
                onClick={isListening ? stopListening : startListening}
                className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isListening ? '停止识别' : '开始识别'}
              </button>
              <button
                onClick={clearTranscript}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-medium transition-colors"
              >
                清除
              </button>
            </div>
          </div>
          
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="w-full h-96 p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="语音识别结果将显示在这里... 停顿已标记为 [停顿] 和 [长停顿]"
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">使用说明：</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 页面加载后会自动启动语音识别</li>
            <li>• [停顿] 表示短暂的停顿（约2秒）</li>
            <li>• [长停顿] 表示较长的停顿</li>
            <li>• 这些标记可以帮助您进行音频切片</li>
          </ul>
        </div>
      </div>
    </main>
  )
}