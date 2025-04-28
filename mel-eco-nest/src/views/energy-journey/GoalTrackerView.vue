<template>
  <div class="goal-tracker">
    <h1 class="page-title" data-aos="fade-down">Energy Goal Tracker</h1>

    <div class="goal-summary" data-aos="fade-up" data-aos-delay="200">
      <div class="summary-card">
        <h2>Your Energy Saving Goals</h2>
        <p>
          Setting measurable goals is a key step toward reducing your carbon footprint and achieving
          energy efficiency.
        </p>
        <div class="goal-progress-container">
          <div class="circular-progress" data-aos="zoom-in" data-aos-delay="300">
            <svg viewBox="0 0 36 36" class="circular-chart">
              <path
                class="circle-bg"
                d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                class="circle"
                stroke-dasharray="65, 100"
                d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <text x="18" y="18.5" class="percentage">65%</text>
              <text x="18" y="23.5" class="percentage-label">Complete</text>
            </svg>
          </div>
          <div class="goals-overview">
            <div class="goal-stat" data-aos="fade-left" data-aos-delay="400">
              <div class="stat-label">Total Goals</div>
              <div class="stat-value">5</div>
            </div>
            <div class="goal-stat completed" data-aos="fade-left" data-aos-delay="500">
              <div class="stat-label">Completed</div>
              <div class="stat-value">3</div>
            </div>
            <div class="goal-stat in-progress" data-aos="fade-left" data-aos-delay="600">
              <div class="stat-label">In Progress</div>
              <div class="stat-value">2</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="goals-list" data-aos="fade-up" data-aos-delay="300">
      <h2>Your Current Goals</h2>
      <div class="goal-items">
        <div class="goal-item completed" data-aos="fade-right" data-aos-delay="100">
          <div class="goal-status">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="goal-content">
            <h3>Reduce electricity consumption by 15%</h3>
            <div class="goal-details">
              <div class="goal-progress">
                <div class="progress-bar">
                  <div class="progress-fill" style="width: 100%"></div>
                </div>
                <span class="progress-text">100% Complete</span>
              </div>
              <div class="goal-meta">
                <span class="goal-date"
                  ><i class="fas fa-calendar-check"></i> Achieved: Jan 30, 2023</span
                >
                <span class="goal-impact"><i class="fas fa-bolt"></i> Saved: 230 kWh</span>
              </div>
            </div>
          </div>
        </div>

        <div class="goal-item completed" data-aos="fade-right" data-aos-delay="200">
          <div class="goal-status">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="goal-content">
            <h3>Install LED lighting throughout home</h3>
            <div class="goal-details">
              <div class="goal-progress">
                <div class="progress-bar">
                  <div class="progress-fill" style="width: 100%"></div>
                </div>
                <span class="progress-text">100% Complete</span>
              </div>
              <div class="goal-meta">
                <span class="goal-date"
                  ><i class="fas fa-calendar-check"></i> Achieved: Dec 15, 2022</span
                >
                <span class="goal-impact"
                  ><i class="fas fa-dollar-sign"></i> Saved: $145 annually</span
                >
              </div>
            </div>
          </div>
        </div>

        <div class="goal-item completed" data-aos="fade-right" data-aos-delay="300">
          <div class="goal-status">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="goal-content">
            <h3>Reduce standby power consumption</h3>
            <div class="goal-details">
              <div class="goal-progress">
                <div class="progress-bar">
                  <div class="progress-fill" style="width: 100%"></div>
                </div>
                <span class="progress-text">100% Complete</span>
              </div>
              <div class="goal-meta">
                <span class="goal-date"
                  ><i class="fas fa-calendar-check"></i> Achieved: Feb 10, 2023</span
                >
                <span class="goal-impact"><i class="fas fa-leaf"></i> Reduced: 85 kg CO2</span>
              </div>
            </div>
          </div>
        </div>

        <div class="goal-item in-progress" data-aos="fade-right" data-aos-delay="400">
          <div class="goal-status">
            <i class="fas fa-spinner"></i>
          </div>
          <div class="goal-content">
            <h3>Improve home insulation</h3>
            <div class="goal-details">
              <div class="goal-progress">
                <div class="progress-bar">
                  <div class="progress-fill" style="width: 60%"></div>
                </div>
                <span class="progress-text">60% Complete</span>
              </div>
              <div class="goal-meta">
                <span class="goal-date"><i class="fas fa-calendar"></i> Due: May 1, 2023</span>
                <span class="goal-impact"
                  ><i class="fas fa-temperature-low"></i> Target: 20% heating reduction</span
                >
              </div>
            </div>
          </div>
        </div>

        <div class="goal-item in-progress" data-aos="fade-right" data-aos-delay="500">
          <div class="goal-status">
            <i class="fas fa-spinner"></i>
          </div>
          <div class="goal-content">
            <h3>Install solar hot water system</h3>
            <div class="goal-details">
              <div class="goal-progress">
                <div class="progress-bar">
                  <div class="progress-fill" style="width: 25%"></div>
                </div>
                <span class="progress-text">25% Complete</span>
              </div>
              <div class="goal-meta">
                <span class="goal-date"><i class="fas fa-calendar"></i> Due: July 15, 2023</span>
                <span class="goal-impact"
                  ><i class="fas fa-leaf"></i> Target: 250 kg CO2 reduction</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="add-goal-section" data-aos="fade-up" data-aos-delay="600">
      <h2>Set a New Goal</h2>
      <div class="add-goal-card" data-aos="zoom-in" data-aos-delay="700">
        <div class="add-goal-icon">
          <i class="fas fa-plus-circle"></i>
        </div>
        <h3>Add a New Energy Saving Goal</h3>
        <p>
          Create a personalized energy saving goal to track your progress towards a more sustainable
          lifestyle.
        </p>
        <button class="add-goal-btn">Create New Goal</button>
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
.goal-tracker {
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

.goal-summary {
  margin-bottom: 3rem;
}

.summary-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.summary-card h2 {
  color: #1e6a93;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
}

.summary-card p {
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.goal-progress-container {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.circular-progress {
  width: 180px;
  height: 180px;
}

.circular-chart {
  display: block;
  width: 100%;
  height: 100%;
}

.circle-bg {
  fill: none;
  stroke: #edf2f7;
  stroke-width: 3.8;
}

.circle {
  fill: none;
  stroke: #1e6a93;
  stroke-width: 3.8;
  stroke-linecap: round;
}

.percentage {
  fill: #1e6a93;
  font-size: 0.5em;
  text-anchor: middle;
  font-weight: bold;
}

.percentage-label {
  fill: #718096;
  font-size: 0.3em;
  text-anchor: middle;
}

.goals-overview {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  flex: 1;
}

.goal-stat {
  background: #f4f6f8;
  border-radius: 8px;
  padding: 1.2rem;
  min-width: 120px;
  flex: 1;
}

.stat-label {
  color: #718096;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  color: #1a2a3a;
  font-size: 2rem;
  font-weight: bold;
}

.goal-stat.completed .stat-value {
  color: #10b981;
}

.goal-stat.in-progress .stat-value {
  color: #f59e0b;
}

.goals-list {
  margin-bottom: 3rem;
}

.goals-list h2 {
  color: #1a2a3a;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}

.goal-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.goal-item {
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

.goal-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.goal-status {
  font-size: 1.8rem;
  display: flex;
  align-items: flex-start;
  padding-top: 0.5rem;
}

.completed .goal-status i {
  color: #10b981;
}

.in-progress .goal-status i {
  color: #f59e0b;
}

.goal-content {
  flex: 1;
}

.goal-content h3 {
  margin: 0 0 1rem 0;
  color: #1e6a93;
  font-size: 1.4rem;
}

.goal-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.goal-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.progress-bar {
  flex: 1;
  height: 10px;
  background: #edf2f7;
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #1e6a93;
  border-radius: 5px;
}

.completed .progress-fill {
  background: #10b981;
}

.in-progress .progress-fill {
  background: #f59e0b;
}

.progress-text {
  color: #718096;
  font-size: 0.9rem;
  min-width: 90px;
}

.goal-meta {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.goal-date,
.goal-impact {
  color: #718096;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.add-goal-section {
  margin-bottom: 2rem;
}

.add-goal-section h2 {
  color: #1a2a3a;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}

.add-goal-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  text-align: center;
  transition: transform 0.3s ease;
}

.add-goal-card:hover {
  transform: translateY(-5px);
}

.add-goal-icon {
  font-size: 3rem;
  color: #1e6a93;
  margin-bottom: 1rem;
}

.add-goal-card h3 {
  color: #1e6a93;
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
}

.add-goal-card p {
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.add-goal-btn {
  background-color: #1e6a93;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-goal-btn:hover {
  background-color: #165a7d;
}

@media (max-width: 768px) {
  .goal-progress-container {
    flex-direction: column;
    align-items: center;
  }

  .goals-overview {
    width: 100%;
  }

  .goal-meta {
    flex-direction: column;
    gap: 0.5rem;
  }

  .goal-item {
    flex-direction: column;
    gap: 1rem;
  }

  .goal-status {
    justify-content: center;
  }
}
</style>
