import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const balconyService = {
  // 获取基础植物列表
  async getBasicPlants() {
    try {
      const response = await axios.get(`${API_URL}/api/plants/basic`)
      return response.data
    } catch (error) {
      console.error('获取植物列表失败:', error)
      throw error
    }
  },

  // 上传阳台图片和选择的植物，开始AI设计
  async startAIDesign(file, selectedPlants) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('plants', JSON.stringify(selectedPlants))

      const response = await axios.post(`${API_URL}/api/ai-design`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      console.error('AI设计启动失败:', error)
      throw error
    }
  },

  // 获取AI设计结果
  async getDesignResult(designId) {
    try {
      const response = await axios.get(`${API_URL}/api/ai-design/${designId}`)
      return response.data
    } catch (error) {
      console.error('获取设计结果失败:', error)
      throw error
    }
  }
}
