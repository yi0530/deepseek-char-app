// 1. 创建Vue应用实例
const { createApp, ref, computed, nextTick, onMounted, onUpdated } = Vue;

// 2. 定义Vue应用
const app = createApp({
    // 3. setup函数是Vue 3的组合式API入口
    setup() {
        // 4. 定义响应式数据（ref：基本类型，reactive：对象类型）
        
        // 用户输入的消息
        const userInput = ref('');
        
        // 当前是否正在加载（等待AI回复）
        const isLoading = ref(false);
        
        // 当前聊天ID
        const currentChatId = ref(0);
        
        // 聊天历史
        const chatHistory = ref([
            {
                id: 0,
                title: '新对话',
                messages: [
                    {
                        role: 'assistant',
                        content: '你好！我是DeepSeek AI助手。我可以帮你解答问题、编写代码、进行对话。有什么我可以帮助你的吗？',
                        timestamp: new Date().toLocaleTimeString(),
                        isCode: false
                    }
                ]
            }
        ]);
        
        // 5. 计算属性：获取当前聊天
        const currentChat = computed(() => {
            return chatHistory.value[currentChatId.value];
        });
        
        // 6. 引用DOM元素
        const textarea = ref(null);
        const messagesContainer = ref(null);
        
        // 7. 组件挂载时的生命周期钩子
        onMounted(() => {
            // 自动聚焦到输入框
            if (textarea.value) {
                textarea.value.focus();
            }
        });
        
        // 8. 当消息更新时自动滚动到底部
        onUpdated(() => {
            scrollToBottom();
        });
        
        // 9. 方法定义
        
        // 发送消息
        const sendMessage = async () => {
            const message = userInput.value.trim();
            if (!message || isLoading.value) return;
            
            // 添加用户消息
            currentChat.value.messages.push({
                role: 'user',
                content: message,
                timestamp: new Date().toLocaleTimeString(),
                isCode: false
            });
            
            // 清空输入框
            userInput.value = '';
            resetTextareaHeight();
            
            // 设置加载状态
            isLoading.value = true;
            
            // 这里稍后会连接后端API
            // 暂时模拟AI回复
            setTimeout(() => {
                // 模拟AI回复
                const responses = [
                    "这是一个模拟回复。实际使用时会连接DeepSeek API。",
                    "我理解您的问题了。这是一个演示版本的聊天界面。",
                    "要使用完整功能，需要连接后端API并配置API密钥。",
                    "这个界面模仿了DeepSeek官网的样式，包含代码高亮、历史对话等功能。"
                ];
                
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                
                currentChat.value.messages.push({
                    role: 'assistant',
                    content: randomResponse,
                    timestamp: new Date().toLocaleTimeString(),
                    isCode: false
                });
                
                isLoading.value = false;
            }, 1000);
        };
        
        // 创建新对话
        const newChat = () => {
            const newChatId = chatHistory.value.length;
            chatHistory.value.push({
                id: newChatId,
                title: `对话 ${newChatId + 1}`,
                messages: [
                    {
                        role: 'assistant',
                        content: '这是一个新的对话。我可以帮你解答问题、编写代码、进行对话。',
                        timestamp: new Date().toLocaleTimeString(),
                        isCode: false
                    }
                ]
            });
            currentChatId.value = newChatId;
        };
        
        // 加载历史对话
        const loadChat = (index) => {
            currentChatId.value = index;
        };
        
        // 根据角色获取头像图标
        const getAvatarIcon = (role) => {
            switch(role) {
                case 'user': return 'fas fa-user';
                case 'assistant': return 'fas fa-robot';
                default: return 'fas fa-user';
            }
        };
        
        // 复制消息
        const copyMessage = (text) => {
            navigator.clipboard.writeText(text).then(() => {
                alert('已复制到剪贴板！');
            }).catch(err => {
                console.error('复制失败:', err);
            });
        };
        
        // 复制代码
        const copyCode = (code) => {
            navigator.clipboard.writeText(code).then(() => {
                alert('代码已复制！');
            });
        };
        
        // 重新生成消息
        const regenerateMessage = (index) => {
            if (confirm('重新生成这条消息？')) {
                // 这里可以调用API重新生成
                alert('重新生成功能需要连接后端API');
            }
        };
        
        // 插入示例
        const insertExample = (type) => {
            const examples = {
                '代码': '用JavaScript写一个快速排序函数',
                '问题': '请解释什么是人工智能'
            };
            userInput.value = examples[type] || '';
            if (textarea.value) {
                textarea.value.focus();
            }
        };
        
        // 自动调整输入框高度
        const autoResize = () => {
            if (!textarea.value) return;
            
            textarea.value.style.height = 'auto';
            textarea.value.style.height = textarea.value.scrollHeight + 'px';
            
            // 限制最大高度
            if (textarea.value.scrollHeight > 200) {
                textarea.value.style.height = '200px';
                textarea.value.style.overflowY = 'auto';
            } else {
                textarea.value.style.overflowY = 'hidden';
            }
        };
        
        // 重置输入框高度
        const resetTextareaHeight = () => {
            if (textarea.value) {
                textarea.value.style.height = 'auto';
                textarea.value.style.overflowY = 'hidden';
            }
        };
        
        // 滚动到消息底部
        const scrollToBottom = () => {
            if (messagesContainer.value) {
                messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
            }
        };
        
        // 10. 监听键盘事件
        const handleKeyDown = (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
            }
        };
        
        // 11. 暴露给模板使用的数据和方法
        return {
            // 数据
            userInput,
            isLoading,
            currentChatId,
            chatHistory,
            currentChat,
            
            // 引用
            textarea,
            messagesContainer,
            
            // 方法
            sendMessage,
            newChat,
            loadChat,
            getAvatarIcon,
            copyMessage,
            copyCode,
            regenerateMessage,
            insertExample,
            autoResize,
            handleKeyDown
        };
    }
});

// 12. 挂载Vue应用到DOM
app.mount('#app');