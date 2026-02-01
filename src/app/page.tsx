import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Storyly 实验室</h1>
        <p className="text-xl text-muted-foreground mb-8">
          探索语音识别、视频创作等前沿技术
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎤 语音识别
            </CardTitle>
            <CardDescription>
              体验实时语音识别技术，支持中文语音转文字
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/speech-recognition">
              <Button className="w-full">开始体验</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎬 Remotion 视频
            </CardTitle>
            <CardDescription>
              使用 React 代码创建精美的视频内容
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/remotion-demo">
              <Button className="w-full">查看演示</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🚀 更多实验
            </CardTitle>
            <CardDescription>
              更多有趣的技术实验即将推出
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              敬请期待
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">关于 Storyly</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Storyly 是一个技术创新平台，专注于探索和展示前沿技术的实际应用。
          通过简单直观的界面，让用户体验语音识别、视频生成等技术的魅力。
        </p>
      </div>
    </div>
  )
}