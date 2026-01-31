'use client'
import { Composition, continueRender, delayRender } from 'remotion'
import { DemoVideo } from '@/components/DemoVideo'

export const RemotionDemo = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8">Remotion Demo</h1>
      <p className="text-center text-gray-600 mb-8">
        Remotion 是一个用 React 创建视频的库。下面是一个简单的视频示例。
      </p>
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-100 rounded-lg p-8">
          <h2 className="text-xl font-semibold mb-4">视频预览区</h2>
          <p className="text-gray-600 mb-4">
            这个 demo 展示了 Remotion 的基本功能：用 React 组件创建视频内容。
          </p>
          
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
        </div>
      </div>
    </div>
  )
}

export default RemotionDemo