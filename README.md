# Storyly


---

# 📄 Storyly — AWS Serverless 架构文档  
**版本**：1.0  
**目标**：支持语音输入 → AI 生成课程 → 流式文字+语音输出 → 陪伴式交互  

---

## 🎯 核心功能需求
1. 用户通过 Web 端语音输入课程主题（如“讲讲光合作用”）
2. 后端生成：
   - 趣味课程内容（文本 + 图片/动画描述）
   - 分段 TTS 音频（流式 PCM）
3. 前端实时显示文字 + 播放语音（MediaSource）
4. 支持用户在 AI 讲解中插话提问（打断式交互）

---

## 🧱 整体架构图（Serverless on AWS）

```mermaid
graph LR
  A[Frontend: React + TS] -->|WebSocket / HTTP| B(API Gateway)
  B --> C[Lambda: Chat Handler]
  C --> D[AWS Bedrock<br>(Claude 3 Sonnet)]
  C --> E[Amazon Polly<br>(Zhiyu, PCM)]
  C --> F[DynamoDB<br>(Session History)]
  A -->|Optional: Audio Upload| G[S3]
  G --> H[Transcribe Streaming<br>(Fallback ASR)]
```

---

## 🛠️ 技术栈选型

| 层级 | 技术 |
|------|------|
| **基础设施** | SST (v3+) + AWS CDK (TypeScript) |
| **前端** | React + Vite + TypeScript + Web Speech API / MediaRecorder |
| **后端运行时** | AWS Lambda (Node.js 20.x) |
| **AI 文本生成** | Amazon Bedrock (Claude 3 Sonnet) |
| **语音合成** | Amazon Polly (Neural, VoiceId: Zhiyu, OutputFormat: pcm) |
| **语音识别（备选）** | Amazon Transcribe Streaming（用于高精度场景） |
| **数据存储** | DynamoDB（会话状态）、S3（生成的媒体资源） |
| **实时通信** | API Gateway WebSocket（用于流式 TTS 推送） |
| **部署** | SST CLI（`sst deploy`） |

---

## 📦 SST 项目结构（TypeScript）

```bash
storyly/
├── sst.config.ts          # SST 配置入口
├── stacks/
│   └── ApiStack.ts        # API Gateway + Lambda
│   └── StorageStack.ts    # DynamoDB + S3
├── functions/
│   ├── chatHandler.ts     # 主逻辑：LLM + Polly
│   ├── transcribeStream.ts# Transcribe 流处理（可选）
│   └── utils/
│       ├── ttsChunker.ts  # 文本分段 + Polly 调用
│       └── pcmUtils.ts    # PCM 封装工具
├── frontend/              # React SPA（可独立部署）
└── package.json
```

---

## 🔧 关键组件实现说明

### 1. **API Gateway WebSocket（用于流式响应）**
- 创建 `$connect`, `$disconnect`, `$default` 路由
- 每个用户会话绑定一个 `connectionId`
- Lambda 通过 `ApiGatewayManagementApi.postToConnection()` 推送文字/PCM 片段

```ts
// functions/chatHandler.ts
const api = new ApiGatewayManagementApi({
  endpoint: event.requestContext.domainName + '/' + event.requestContext.stage,
});

await api.postToConnection({
  ConnectionId: connectionId,
  Data: JSON.stringify({ type: 'text', content: '你好！' }),
}).promise();
```

---

### 2. **AI 课程生成（Bedrock + 分段策略）**
- 使用 `InvokeModelWithResponseStream` 实现流式 LLM 输出
- 按标点（。！？\n）切分句子
- 每句立即调用 Polly 生成 PCM

```ts
// functions/utils/ttsChunker.ts
export async function streamTTS(text: string, voiceId = 'Zhiyu') {
  const polly = new Polly({ region: 'us-east-1' });
  const params = {
    Text: text,
    OutputFormat: 'pcm',
    VoiceId: voiceId,
    SampleRate: '16000',
  };
  const data = await polly.synthesizeSpeech(params).promise();
  return data.AudioStream as Buffer;
}
```

---

### 3. **前端播放 PCM（Web Audio API）**
- 不依赖 `<audio>`，直接用 `AudioContext` 播放 PCM
- 支持无缝拼接、低延迟

```ts
// frontend/src/audioPlayer.ts
const ctx = new AudioContext();
function playPCM(pcmBuffer: ArrayBuffer) {
  const buffer = ctx.createBuffer(1, pcmBuffer.byteLength / 2, 16000);
  const channelData = buffer.getChannelData(0);
  const view = new Int16Array(pcmBuffer);
  for (let i = 0; i < view.length; i++) {
    channelData[i] = view[i] / 32768.0; // normalize
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  source.start();
}
```

---

### 4. **会话管理（DynamoDB）**
- 表名：`StorylySessions`
- 主键：`sessionId`（UUID）
- 属性：`userId`, `transcript`, `courseState`, `lastActive`

---

## 💰 成本估算（初期 MVP）
| 服务 | 月用量（100 用户） | 预估成本 |
|------|------------------|--------|
| Lambda | 50k 请求 | ~$0.50 |
| Bedrock (Claude) | 500k tokens | ~$1.50 |
| Polly (TTS) | 100k 字符 | ~$0.40 |
| DynamoDB | 10k R/W | ~$0.25 |
| **总计** | — | **~$2.65/月** |

> ✅ 极低成本启动，适合验证市场

---

## 🚀 部署命令
```bash
# 初始化 SST
npm create sst@latest storyly --template typescript

# 开发模式（本地调试 Lambda）
sst dev

# 生产部署
sst deploy --stage prod
```

---

## 🔐 安全与合规
- 所有 API 通过 Cognito 或自定义 JWT 鉴权（可选）
- S3 存储桶设为私有，通过预签名 URL 访问
- DynamoDB 启用 PITR（按需恢复）

---

## 📈 下一步扩展
- 加入 **S3 + CloudFront** 托管前端
- 集成 **Transcribe Streaming** 作为高精度 ASR 备选
- 添加 **Step Functions** 编排复杂课程生成流程

---

需要我为你生成：
1. **完整的 `sst.config.ts` 和 `ApiStack.ts` 代码**？
2. **前端 React 组件（语音输入 + PCM 播放器）**？
3. **CDK 部署后的 API 调用示例**？

请告诉我，我可以立即输出可运行的代码模板。
