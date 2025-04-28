<template>
  <div class="my-plan">
    <h1 class="page-title" data-aos="fade-down">My Energy Plan</h1>

    <div class="plan-overview" data-aos="fade-up" data-aos-delay="200">
      <div class="plan-card">
        <h2>Current Energy Saving Plan</h2>
        <p>You are currently on track to reduce your energy consumption by 20% by December.</p>
        <p>Your primary focus areas include: Lighting, Heating, and Appliances.</p>
        <p>
          Start implementing small changes in your daily routine to see significant energy savings
          over time.
        </p>
      </div>
    </div>

    <div class="action-items" data-aos="fade-up" data-aos-delay="400">
      <h2>Action Items</h2>
      <div class="action-list">
        <div class="action-item completed" data-aos="fade-right" data-aos-delay="100">
          <div class="action-status">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="action-content">
            <h3>Replace light bulbs with LEDs</h3>
            <p>Switch all household lighting to energy-efficient LED bulbs</p>
            <div class="action-meta">Completed: January 15, 2023</div>
          </div>
        </div>

        <div class="action-item in-progress" data-aos="fade-right" data-aos-delay="200">
          <div class="action-status">
            <i class="fas fa-spinner"></i>
          </div>
          <div class="action-content">
            <h3>Install smart thermostat</h3>
            <p>Replace old thermostat with a programmable smart device</p>
            <div class="action-meta">In Progress: 50% complete</div>
          </div>
        </div>

        <div class="action-item" data-aos="fade-right" data-aos-delay="300">
          <div class="action-status">
            <i class="fas fa-circle"></i>
          </div>
          <div class="action-content">
            <h3>Energy audit assessment</h3>
            <p>Schedule professional energy audit to identify additional saving opportunities</p>
            <div class="action-meta">Planned: March 2023</div>
          </div>
        </div>
      </div>
    </div>

    <div class="recommendations" data-aos="fade-up" data-aos-delay="600">
      <h2>Recommended Next Steps</h2>
      <div class="recommendation-cards">
        <div class="recommendation-card" data-aos="flip-left" data-aos-delay="700">
          <div class="card-icon">
            <i class="fas fa-plug"></i>
          </div>
          <h3>Standby Power Reduction</h3>
          <p>Use smart power strips to eliminate phantom energy use from electronics</p>
          <button class="add-action-btn">Add to Plan</button>
        </div>

        <div class="recommendation-card" data-aos="flip-left" data-aos-delay="800">
          <div class="card-icon">
            <i class="fas fa-sun"></i>
          </div>
          <h3>Solar Panel Installation</h3>
          <p>Consider installing rooftop solar panels to generate clean electricity</p>
          <button class="add-action-btn">Add to Plan</button>
        </div>

        <div class="recommendation-card" data-aos="flip-left" data-aos-delay="900">
          <div class="card-icon">
            <i class="fas fa-door-closed"></i>
          </div>
          <h3>Improve Home Insulation</h3>
          <p>Seal doors and windows to prevent energy loss through air leaks</p>
          <button class="add-action-btn">Add to Plan</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import AOS from 'aos'
import 'aos/dist/aos.css'

onMounted(() => {
  AOS.init({
    duration: 800,
    easing: 'ease-out',
    once: false,
  })
})
</script>

<style scoped>
.my-plan {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.page-title {
  color: #1a2a3a;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
}

.plan-overview {
  margin-bottom: 3rem;
}

.plan-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  transition: transform 0.3s ease;
}

.plan-card:hover {
  transform: translateY(-5px);
}

.plan-card h2 {
  color: #1e6a93;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
}

.plan-card p {
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1rem;
}

h2 {
  color: #1a2a3a;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}

.action-items {
  margin-bottom: 3rem;
}

.action-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.action-item {
  display: flex;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  gap: 1.5rem;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.action-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.action-status {
  font-size: 1.8rem;
  display: flex;
  align-items: center;
}

.completed .action-status i {
  color: #10b981;
}

.in-progress .action-status i {
  color: #f59e0b;
}

.action-content h3 {
  margin: 0 0 0.5rem 0;
  color: #1e6a93;
  font-size: 1.4rem;
}

.action-content p {
  color: #4a5568;
  margin: 0 0 0.8rem 0;
  line-height: 1.5;
}

.action-meta {
  font-size: 0.9rem;
  color: #718096;
}

.recommendations {
  margin-bottom: 2rem;
}

.recommendation-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.recommendation-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  text-align: center;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.recommendation-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.card-icon {
  font-size: 2.5rem;
  color: #1e6a93;
  margin-bottom: 1rem;
}

.recommendation-card h3 {
  color: #1e6a93;
  margin: 0 0 1rem 0;
  font-size: 1.3rem;
}

.recommendation-card p {
  color: #4a5568;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.add-action-btn {
  background-color: #1e6a93;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-action-btn:hover {
  background-color: #165a7d;
}

@media (max-width: 768px) {
  .recommendation-cards {
    grid-template-columns: 1fr;
  }

  .action-item {
    flex-direction: column;
    gap: 1rem;
  }

  .action-status {
    justify-content: center;
  }
}
</style>
