// 加载环境变量
require('dotenv').config();

// 1. 导入express模块
const express = require('express');
// 2. 导入cors模块
const cors = require('cors');
// 3. 导入 OpenAI SDK
const { OpenAI } = require('openai');

// 4. 创建express应用实例
const app = express();

// 5. 启用CORS中间件（允许所有来源的请求）
app.use(cors());

// 6. 添加JSON解析中间件
app.use(express.json());

// 7. 配置 DeepSeek 客户端
const deepseekClient = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

// 8. 添加模拟/真实API开关
const USE_REAL_API = true;  // 设为 true 使用真实API，false 使用模拟

// 9. 定义一个最简单的路由
app.get('/', (req, res) => {
  res.send('服务器运行成功！');
});

// 10. 添加健康检查接口
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: '服务器运行正常',
    timestamp: new Date().toISOString(),
    apiMode: USE_REAL_API ? '真实API' : '模拟API',
    hasApiKey: !!process.env.DEEPSEEK_API_KEY
  });
});

// 11. 聊天接口（支持模拟和真实API切换）
app.post('/api/chat', async (req, res) => {
  console.log('📨 收到聊天请求');
  console.log('📄 请求体内容:', req.body);
  
  try {
    let aiResponse;
    
    if (USE_REAL_API && process.env.DEEPSEEK_API_KEY) {
      // 使用真实 DeepSeek API
      console.log('🚀 调用真实 DeepSeek API');
      
      const completion = await deepseekClient.chat.completions.create({
        model: 'deepseek-chat',
        messages: req.body.messages,
        stream: false,
      });
      
      aiResponse = completion.choices[0].message;
      console.log('✅ 收到真实API回复:', aiResponse);
      
    } else {
      // 使用模拟回复
      console.log('🔄 使用模拟回复');
      
      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      aiResponse = {
        role: 'assistant',
        content: '这是一个模拟回复，实际会连接DeepSeek API',
        timestamp: new Date().toISOString()
      };
    }
    
    // 添加时间戳
    aiResponse.timestamp = new Date().toISOString();
    
    console.log('📤 返回响应:', aiResponse);
    res.json(aiResponse);
    
  } catch (error) {
    console.error('❌ API调用失败:', error);
    
    // 即使API失败，也返回一个错误回复
    res.json({
      role: 'assistant',
      content: `抱歉，AI服务暂时不可用。错误: ${error.message}`,
      timestamp: new Date().toISOString(),
      isError: true
    });
  }
});

// 12. 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ 服务器启动成功！`);
  console.log(`🌐 访问地址：http://localhost:${PORT}`);
  console.log(`🔍 健康检查：http://localhost:${PORT}/health`);
  console.log(`💬 聊天接口：POST http://localhost:${PORT}/api/chat`);
  console.log(`🔧 CORS已启用，允许跨域请求`);
  console.log(`📦 JSON解析中间件已启用`);
  console.log(`🤖 API模式：${USE_REAL_API ? '真实API' : '模拟API'}`);
  console.log(`🔑 API Key状态：${process.env.DEEPSEEK_API_KEY ? '已配置' : '未配置'}`);
});