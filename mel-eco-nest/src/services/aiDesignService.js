import axios from 'axios'

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const API_URL = import.meta.env.VITE_API_URL || '/api'

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
  return Math.floor(Math.random() * (2 ** 32 - 1))
}

// Build prompt - adjusted for single plant selection
const buildPrompt = (plantName) => {
  return `Lightly decorate the existing scene with ${plantName}, incorporating ${plantName} into the environment. Add a few pots of ${plantName} on flat surfaces like floors or tables, and let some ${plantName} softly climb along available structures such as railings or walls. Ensure the original background, lighting, and furniture remain untouched. The integration of ${plantName} should feel organic, photorealistic, and aesthetically pleasing, with a clean and minimalistic style. Emphasize the presence of ${plantName} throughout the image for a vibrant natural effect.`
}

export const aiDesignService = {
  // generate balcony image
  async generateBalconyImage(file, prompt) {
    // Add a timestamp to URL to prevent caching
    const timestamp = new Date().getTime()
    const formData = new FormData()
    formData.append('image', file)
    formData.append('prompt', prompt)
    formData.append('timestamp', timestamp) // Add timestamp

    try {
      console.log('🚀 Sending image generation request with prompt:', prompt)
      const response = await axios.post(
        `${API_URL}/api/generate-balcony?t=${timestamp}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Cache-Control': 'no-cache',
          },
          responseType: 'blob', // Ensure receiving binary data
        },
      )

      // Check response type
      console.log('📧 Response received, content-type:', response.headers['content-type'])

      if (response.headers['content-type'].includes('image/')) {
        // If previous Blob URL exists, release it
        if (window._lastBlobUrl) {
          URL.revokeObjectURL(window._lastBlobUrl)
        }

        // Create new Blob URL
        const blob = new Blob([response.data], { type: response.headers['content-type'] })
        const imageUrl = URL.createObjectURL(blob)

        // Save the last created Blob URL for later cleanup
        window._lastBlobUrl = imageUrl

        console.log('✅ Image generated successfully, URL created')

        // Check if response contains AI generation markers and other metadata
        const isAIGenerated = response.headers['x-ai-generated'] === 'true'
        const disclaimer =
          'This image is AI-generated and is for reference only. Results may vary in real implementation.'

        return {
          success: true,
          imageUrl: imageUrl,
          isAIGenerated: isAIGenerated,
          disclaimer: disclaimer,
        }
      } else {
        // If not an image, try to parse error message
        const reader = new FileReader()
        return new Promise((resolve, reject) => {
          reader.onload = () => {
            const text = reader.result
            console.error('❌ Invalid response format:', text)
            reject(new Error('Invalid response format: ' + text))
          }
          reader.onerror = () => {
            reject(new Error('Failed to read error response'))
          }
          reader.readAsText(response.data)
        })
      }
    } catch (error) {
      console.error('❌ Error generating balcony image:', error)
      if (error.response) {
        console.error('❌ Response status:', error.response.status)
        console.error('❌ Response headers:', error.response.headers)
      }
      throw error.message ? error : new Error('Failed to generate balcony image')
    }
  },
}
