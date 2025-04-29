import axios from 'axios'

const COMFY_API = 'http://58.178.177.133:8188/'
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

// Build prompt - using the same detailed prompt format as Python script
const buildPrompt = (plants) => {
  return `Lightly decorate the existing modern city balcony with ${plants.join(', ')}. Place a few pots on the floor and the table, let a few light vines climb along the railings, but keep the white balcony railing, chairs, and urban skyline visible and unchanged. Subtle, realistic integration of plants without changing the original architecture or background. Photorealistic, minimalistic, clean style.`
}

export const aiDesignService = {
  // Start AI design
  async startDesign(file, selectedPlants) {
    try {
      // Validate input
      if (!file) {
        throw new AIDesignError('No image file provided', 'MISSING_FILE')
      }
      if (!selectedPlants || !selectedPlants.length) {
        throw new AIDesignError('No plants selected', 'MISSING_PLANTS')
      }
      if (selectedPlants.length > 3) {
        throw new AIDesignError('Too many plants selected', 'TOO_MANY_PLANTS')
      }

      // 1. First load the local workflow JSON file
      console.log('Loading workflow template...')
      try {
        // Directly load local JSON file, consistent with Python script
        const workflowResponse = await axios.get(`${API_URL}/src/services/flux.1_img2img.json`)
        var workflow = workflowResponse.data
        console.log('Workflow loaded successfully')
      } catch (error) {
        console.error('Failed to load workflow:', error)
        throw new AIDesignError('Workflow loading failed', 'WORKFLOW_LOADING_ERROR', error.message)
      }

      // 2. Generate random seed
      const randomSeed = generateRandomSeed()
      console.log('✅ Generated random seed:', randomSeed)

      // 3. Update random seed in workflow
      for (const nodeId in workflow) {
        const node = workflow[nodeId]
        if (node.inputs && 'noise_seed' in node.inputs) {
          node.inputs.noise_seed = randomSeed
        }
      }

      // 4. Upload image to ComfyUI server
      const formData = new FormData()
      const fileName = file.name || `upload_${Date.now()}.jpg`
      formData.append('image', file, fileName)

      console.log('✅ Uploading image to ComfyUI server...')
      const uploadResponse = await axios.post(`${COMFY_API}upload/image`, formData)

      if (!uploadResponse.data || uploadResponse.status !== 200) {
        console.error('❌ Image upload failed:', uploadResponse.status, uploadResponse.data)
        throw new AIDesignError(
          'Image upload failed',
          'UPLOAD_ERROR',
          uploadResponse.data
        )
      }
      console.log('✅ Image uploaded successfully')

      // Wait 3 seconds to ensure image processing is complete, consistent with Python script
      await new Promise(resolve => setTimeout(resolve, 3000))

      // 5. Update image path
      if (workflow['27'] && workflow['27'].inputs) {
        workflow['27'].inputs.image = fileName // Use uploaded filename
        console.log('✅ Image path updated successfully')
      } else {
        console.error('❌ Image node (27) not found')
        throw new AIDesignError('Image node not found', 'WORKFLOW_ERROR')
      }

      // 6. Update prompt
      let foundPrompt = false
      for (const nodeId in workflow) {
        const node = workflow[nodeId]
        if (node.class_type === 'CLIPTextEncode' && node.inputs && 'text' in node.inputs) {
          node.inputs.text = buildPrompt(selectedPlants)
          foundPrompt = true
          console.log('✅ Prompt updated successfully')
          break
        }
      }

      if (!foundPrompt) {
        console.error('❌ Prompt node not found')
        throw new AIDesignError('Prompt node not found', 'WORKFLOW_ERROR')
      }

      // 7. Submit task to ComfyUI
      console.log('✅ Submitting task to ComfyUI...')
      const payload = {
        prompt: workflow
      }

      const response = await axios.post(`${COMFY_API}prompt`, payload)

      if (!response.data || !response.data.prompt_id) {
        console.error('❌ Submission failed:', response.status, response.data)
        throw new AIDesignError(
          'Design task submission failed',
          'SUBMISSION_ERROR',
          response.data
        )
      }

      const promptId = response.data.prompt_id
      console.log('✅ Task submitted successfully, ID:', promptId)

      return {
        success: true,
        message: 'Design task submitted',
        promptId: promptId
      }

    } catch (error) {
      console.error('❌ AI design startup failed:', error)

      if (error instanceof AIDesignError) {
        throw error
      }

      if (error.response) {
        throw new AIDesignError(
          `Server error: ${error.response.status}`,
          'SERVER_ERROR',
          error.response.data
        )
      }

      throw new AIDesignError(
        'Error occurred during design startup',
        'UNKNOWN_ERROR',
        error.message
      )
    }
  },

  // Get design result
  async getDesignResult(promptId) {
    try {
      if (!promptId) {
        throw new AIDesignError('No design ID provided', 'MISSING_PROMPT_ID')
      }

      console.log('⏳ Querying history for results, ID:', promptId)

      // Query history to get results
      const historyResponse = await axios.get(`${COMFY_API}history/${promptId}`)

      if (historyResponse.status !== 200) {
        console.error('❌ History query failed:', historyResponse.status, historyResponse.data)
        throw new AIDesignError(
          'Failed to get history',
          'HISTORY_ERROR',
          historyResponse.data
        )
      }

      const history = historyResponse.data[promptId]

      if (!history) {
        console.log('⏳ Design is being processed...')
        return {
          success: true,
          status: 'pending',
          message: 'Design is being processed'
        }
      }

      // Check if there are output images
      const outputs = history.outputs || {}

      if (Object.keys(outputs).length > 0) {
        for (const nodeId in outputs) {
          const nodeOutput = outputs[nodeId]

          if (nodeOutput.images && nodeOutput.images.length > 0) {
            const image = nodeOutput.images[0]
            const filename = image.filename
            const subfolder = image.subfolder || ''

            console.log('✅ Generated image found:', filename)

            return {
              success: true,
              status: 'completed',
              message: 'Design completed',
              result: {
                imageUrl: `${COMFY_API}view?filename=${filename}&type=output&subfolder=${subfolder}`,
                filename: filename
              }
            }
          }
        }
      }

      console.log('⏳ Generating design image...')
      return {
        success: true,
        status: 'processing',
        message: 'Generating design image'
      }

    } catch (error) {
      console.error('❌ Failed to get design result:', error)

      if (error instanceof AIDesignError) {
        throw error
      }

      if (error.response) {
        throw new AIDesignError(
          `Server error: ${error.response.status}`,
          'SERVER_ERROR',
          error.response.data
        )
      }

      throw new AIDesignError(
        'Error occurred while getting design result',
        'UNKNOWN_ERROR',
        error.message
      )
    }
  },

  // Poll for design result until complete - closer to Python script polling logic
  async pollDesignResult(promptId, options = {}) {
    const {
      interval = 10000, // Default polling interval 10 seconds, consistent with Python script
      maxAttempts = 60, // Default maximum attempts (10 minutes), consistent with Python script
      onProgress = () => {} // Progress callback function
    } = options

    if (!promptId) {
      throw new AIDesignError('No design ID provided', 'MISSING_PROMPT_ID')
    }

    console.log('⏳ Waiting for generation results...')
    let attempts = 0

    const poll = async () => {
      try {
        console.log(`⏳ Waiting... (${attempts+1}/${maxAttempts})`)
        const result = await this.getDesignResult(promptId)

        // Call progress callback
        onProgress(result)

        if (result.status === 'completed') {
          console.log('✅ Image generation completed!')
          return result
        }

        if (result.status === 'pending' || result.status === 'processing') {
          attempts++
          if (attempts >= maxAttempts) {
            console.error('❌ Timeout waiting for generation results!')
            throw new AIDesignError(
              'Design generation timeout',
              'TIMEOUT',
              { attempts, maxAttempts }
            )
          }

          // Continue polling
          await new Promise(resolve => setTimeout(resolve, interval))
          return poll()
        }

        throw new AIDesignError(
          'Unknown design status',
          'INVALID_STATUS',
          { status: result.status }
        )
      } catch (error) {
        console.error('❌ Polling for design result failed:', error)

        if (error instanceof AIDesignError) {
          throw error
        }

        throw new AIDesignError(
          'Error occurred while polling for design result',
          'UNKNOWN_ERROR',
          error.message
        )
      }
    }

    return poll()
  }
}
