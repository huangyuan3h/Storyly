import { 
  useCurrentFrame, 
  useVideoConfig, 
  spring, 
  interpolate,
  AbsoluteFill
} from 'remotion'

export const DemoVideo = () => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  // 动画参数
  const textScale = spring({
    frame,
    fps,
    config: { damping: 10 }
  })

  const textOpacity = interpolate(
    frame,
    [0, 30, durationInFrames - 30, durationInFrames],
    [0, 1, 1, 0]
  )

  const logoRotation = spring({
    frame,
    fps,
    config: { damping: 20 }
  })

  return (
    <AbsoluteFill style={{ backgroundColor: '#1a1a1a' }}>
      {/* 背景渐变效果 */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(135deg, 
            rgba(59, 130, 246, ${interpolate(frame, [0, 60], [0, 0.3])}) 0%, 
            rgba(139, 92, 246, ${interpolate(frame, [0, 60], [0, 0.2])}) 100%)`
        }}
      />

      {/* 主要内容 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          color: 'white'
        }}
      >
        {/* 旋转的Logo */}
        <div
          style={{
            width: 120,
            height: 120,
            backgroundColor: '#3b82f6',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 40,
            transform: `rotate(${logoRotation * 360}deg)`,
            fontSize: 48,
            fontWeight: 'bold'
          }}
        >
          R
        </div>

        {/* 标题文字 */}
        <h1
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            marginBottom: 20,
            textAlign: 'center',
            transform: `scale(${textScale})`,
            opacity: textOpacity
          }}
        >
          Hello Remotion!
        </h1>

        {/* 副标题 */}
        <p
          style={{
            fontSize: 32,
            textAlign: 'center',
            opacity: textOpacity * 0.8,
            maxWidth: 800
          }}
        >
          用 React 代码创建精美的视频内容
        </p>

        {/* 动态进度条 */}
        <div
          style={{
            width: 300,
            height: 6,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 3,
            marginTop: 40,
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: `${interpolate(frame, [0, durationInFrames], [0, 100])}%`,
              height: '100%',
              backgroundColor: '#3b82f6',
              borderRadius: 3
            }}
          />
        </div>

        {/* 帧数显示 */}
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            fontSize: 14,
            color: 'rgba(255, 255, 255, 0.5)',
            fontFamily: 'monospace'
          }}
        >
          Frame: {frame} / {durationInFrames}
        </div>
      </div>
    </AbsoluteFill>
  )
}