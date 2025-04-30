import axios from 'axios'


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Custom error class
class AIDesignError extends Error {
  constructor(message, type, details = null) {
    super(message)
    this.name = 'AIDesignError'
    this.type = type
    this.details = details
  }
}

// Generate random seed
const generateRandomSeed = () => {
  return Math.floor(Math.random() * (2**32 - 1))
}

// Build prompt - adjusted for single plant selection
const buildPrompt = (plantName) => {
  return `Lightly decorate the existing scene with ${plantName}, incorporating ${plantName} into the environment. Add a few pots of ${plantName} on flat surfaces like floors or tables, and let some ${plantName} softly climb along available structures such as railings or walls. Ensure the original background, lighting, and furniture remain untouched. The integration of ${plantName} should feel organic, photorealistic, and aesthetically pleasing, with a clean and minimalistic style. Emphasize the presence of ${plantName} throughout the image for a vibrant natural effect.`;
}

export const aiDesignService = {


  // generate balcony image
  async generateBalconyImage(file, prompt) {
    // 添加一个时间戳到URL防止缓存
    const timestamp = new Date().getTime();
    const formData = new FormData();
    formData.append('image', file);
    formData.append('prompt', prompt);
    formData.append('timestamp', timestamp); // 添加时间戳

    try {
      console.log('🚀 Sending image generation request with prompt:', prompt);
      const response = await axios.post(`${API_URL}/api/generate-balcony?t=${timestamp}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Cache-Control': 'no-cache'
        },
        responseType: 'blob'  // 确保接收二进制数据
      });

      // 检查响应类型
      console.log('📧 Response received, content-type:', response.headers['content-type']);

      if (response.headers['content-type'].includes('image/')) {
        // 如果之前存在的Blob URL，先释放它
        if (window._lastBlobUrl) {
          URL.revokeObjectURL(window._lastBlobUrl);
        }

        // 创建新的Blob URL
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const imageUrl = URL.createObjectURL(blob);

        // 保存最后创建的Blob URL以便后续清理
        window._lastBlobUrl = imageUrl;

        console.log('✅ Image generated successfully, URL created');

        // 检查是否包含AI生成的标记和其他元数据
        const isAIGenerated = response.headers['x-ai-generated'] === 'true';
        const disclaimer = 'This image is AI-generated and is for reference only. Results may vary in real implementation.';

        return {
          success: true,
          imageUrl: imageUrl,
          isAIGenerated: isAIGenerated,
          disclaimer: disclaimer,
        };
      } else {
        // 如果不是图片，尝试解析错误信息
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
          reader.onload = () => {
            const text = reader.result;
            console.error('❌ Invalid response format:', text);
            reject(new Error('Invalid response format: ' + text));
          };
          reader.onerror = () => {
            reject(new Error('Failed to read error response'));
          };
          reader.readAsText(response.data);
        });
      }
    } catch (error) {
      console.error('❌ Error generating balcony image:', error);
      if (error.response) {
        console.error('❌ Response status:', error.response.status);
        console.error('❌ Response headers:', error.response.headers);
      }
      throw error.message ? error : new Error('Failed to generate balcony image');
    }
  }
}
