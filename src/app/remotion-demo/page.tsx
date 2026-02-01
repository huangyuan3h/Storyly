'use client'
import { Composition, continueRender, delayRender } from 'remotion'
import { DemoVideo } from '@/components/DemoVideo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const RemotionDemo = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Remotion 视频实验</h1>
        <p className="text-muted-foreground mb-8">
          Remotion 是一个用 React 创建视频的库。下面是一个简单的视频示例。
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>视频预览区</CardTitle>
            <CardDescription>
              这个 demo 展示了 Remotion 的基本功能：用 React 组件创建视频内容。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <Composition
                id="Demo"
                component={DemoVideo}
                durationInFrames={150}
                fps={30}
                width={1280}
                height={720}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>功能特性</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 使用 React 组件创建视频内容</li>
              <li>• 支持动画和过渡效果</li>
              <li>• 可以使用任何 React 生态库</li>
              <li>• 支持 TypeScript</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default RemotionDemo