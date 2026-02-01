'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SpeechRecognition() {
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
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">语音识别实验</h1>
        <p className="text-muted-foreground">
          体验实时语音识别技术，支持中文语音转文字
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>识别状态</span>
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                isListening ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
              }`}>
                <div className={`w-3 h-3 rounded-full ${
                  isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                }`}></div>
                <span className="font-medium">{status}</span>
              </div>
            </CardTitle>
            <CardDescription>
              页面加载后会自动启动语音识别
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>识别结果</CardTitle>
            <CardDescription>
              语音识别的实时结果，停顿已标记为 [停顿] 和 [长停顿]
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                className="w-full h-96 p-4 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="语音识别结果将显示在这里... 停顿已标记为 [停顿] 和 [长停顿]"
              />
              <div className="flex space-x-2">
                <Button
                  onClick={isListening ? stopListening : startListening}
                  variant={isListening ? "destructive" : "default"}
                >
                  {isListening ? '停止识别' : '开始识别'}
                </Button>
                <Button onClick={clearTranscript} variant="outline">
                  清除
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>使用说明</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 页面加载后会自动启动语音识别</li>
              <li>• [停顿] 表示短暂的停顿（约2秒）</li>
              <li>• [长停顿] 表示较长的停顿</li>
              <li>• 这些标记可以帮助您进行音频切片</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}