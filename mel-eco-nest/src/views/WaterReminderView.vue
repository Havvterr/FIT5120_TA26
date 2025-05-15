<template>
  <div class="water-reminder">
    <h1>Set Watering Reminder</h1>
    <div class="reminder-form">
      <div class="form-group">
        <label for="plantName">Plant Name</label>
        <input
          type="text"
          id="plantName"
          v-model="reminder.plantName"
          class="form-control"
          readonly
        />
      </div>

      <div class="form-group">
        <label for="frequency">Watering Frequency</label>
        <select id="frequency" v-model="reminder.frequency" class="form-control">
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="biweekly">Biweekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div class="form-group">
        <label for="startDate">Start Date</label>
        <input type="date" id="startDate" v-model="reminder.startDate" class="form-control" />
      </div>

      <div class="form-group">
        <label for="timeOfDay">Watering Time</label>
        <select id="timeOfDay" v-model="reminder.timeOfDay" class="form-control">
          <option value="09:00">09:00 AM</option>
          <option value="12:00">12:00 PM</option>
          <option value="15:00">3:00 PM</option>
          <option value="18:00">6:00 PM</option>
        </select>
      </div>

      <div class="form-group">
        <label for="notes">Notes</label>
        <textarea
          id="notes"
          v-model="reminder.notes"
          placeholder="Add specific instructions for watering"
          class="form-control"
        ></textarea>
      </div>

      <button class="submit-button" @click="createReminder">Create Reminder</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const plantNames = ref([])

const reminder = ref({
  plantName: '',
  frequency: 'daily', // 默认每天浇水
  startDate: new Date().toISOString().split('T')[0],
  timeOfDay: '09:00', // 默认早上9点
  notes: '',
})

onMounted(() => {
  // 设置默认开始日期为今天
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  reminder.value.startDate = `${year}-${month}-${day}`

  // 从路由参数获取植物名称
  if (route.query.plants) {
    plantNames.value = route.query.plants.split(',')
    reminder.value.plantName = plantNames.value.join(', ')
  }
})

const createReminder = () => {
  const [year, month, day] = reminder.value.startDate.split('-').map(Number)
  const [hours, minutes] = reminder.value.timeOfDay.split(':').map(Number)

  const startDate = new Date(year, month - 1, day, hours, minutes, 0)
  const endDate = new Date(startDate)
  endDate.setHours(endDate.getHours() + 1)

  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`
  }

  const event = {
    text: `Water ${reminder.value.plantName}`,
    dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
    details: `Time to water your plants:\n${plantNames.value.join('\n')}\n\nFrequency: ${reminder.value.frequency}\n${reminder.value.notes ? `Notes: ${reminder.value.notes}` : ''}`,
    location: 'Your Garden',
    sf: true,
    output: 'xml',
  }

  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.text)}&dates=${encodeURIComponent(event.dates)}&details=${encodeURIComponent(event.details)}&location=${encodeURIComponent(event.location)}&sf=true&output=xml`

  window.open(url, '_blank')
}
</script>

<style scoped>
.water-reminder {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  text-align: center;
  color: #014421;
  margin-bottom: 2rem;
}

.reminder-form {
  background-color: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #014421;
  box-shadow: 0 0 0 2px rgba(1, 68, 33, 0.1);
}

textarea.form-control {
  min-height: 100px;
  resize: vertical;
}

.submit-button {
  width: 100%;
  padding: 1rem;
  background-color: #396690;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button:hover {
  background-color: #014421;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .water-reminder {
    padding: 1rem;
  }

  .reminder-form {
    padding: 1.5rem;
  }
}

.form-control[readonly] {
  background-color: #f5f5f5;
  cursor: not-allowed;
}
</style>
