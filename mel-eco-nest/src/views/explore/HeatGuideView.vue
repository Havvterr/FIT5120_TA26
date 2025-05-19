<template>
  <div class="heat-guide-page">
    <!-- Hero Section with Edge-to-Edge Image and Text Overlay -->
    <section class="hero-section">
      <div class="parallax-container">
        <img
          src="@/assets/he1.jpg"
          alt="Urban Heat Impact"
          class="parallax-image"
          ref="parallaxImage"
        />
        <div class="text-overlay">
          <h1 class="hero-title">Urban Heat: How to Stay Safe</h1>
        </div>
      </div>
    </section>

    <div class="heat-guide-container">
      <!-- Danger Section -->
      <section class="content-section danger-section" data-aos="fade-up">
        <div class="section-header" data-aos="fade-right" data-aos-delay="200">
          <span class="section-number">01</span>
          <h2 class="section-title">Why is High Temperature Dangerous?</h2>
        </div>

        <div class="content-container">
          <p class="intro-text" data-aos="fade-up" data-aos-delay="300">
            High temperature is a serious environmental and public health threat, with effects that
            can rapidly lead to illness or even death.
          </p>

          <div class="highlight-box" data-aos="zoom-in" data-aos-delay="400">
            <div class="highlight-icon"><i class="fas fa-exclamation-triangle"></i></div>
            <p class="highlight-text">
              Heat stress is the leading cause of all weather-related deaths.
            </p>
          </div>

          <div class="condition-grid" data-aos="fade-up" data-aos-delay="500">
            <h3>It significantly aggravates underlying conditions:</h3>
            <div class="grid-layout">
              <div class="condition-card" data-aos="flip-left" data-aos-delay="100">
                <i class="fas fa-heart"></i>
                <h4>Cardiovascular</h4>
                <p>Hypertension, stroke, and heart conditions worsen in extreme heat</p>
              </div>
              <div class="condition-card" data-aos="flip-left" data-aos-delay="200">
                <i class="fas fa-lungs"></i>
                <h4>Respiratory</h4>
                <p>Asthma, COPD, and other breathing issues become more severe</p>
              </div>
              <div class="condition-card" data-aos="flip-left" data-aos-delay="300">
                <i class="fas fa-tint"></i>
                <h4>Metabolic</h4>
                <p>Diabetes and kidney diseases are significantly impacted</p>
              </div>
              <div class="condition-card" data-aos="flip-left" data-aos-delay="400">
                <i class="fas fa-brain"></i>
                <h4>Neurological</h4>
                <p>Mental health issues and cognitive function deteriorate</p>
              </div>
            </div>
          </div>

          <div class="additional-note" data-aos="fade-up" data-aos-delay="600">
            <p>
              Heat also increases the risk of accidental injuries (e.g., heat stroke at construction
              sites, traffic accidents) and the spread of certain infectious diseases.
            </p>
          </div>
        </div>
      </section>

      <!-- Data Section -->
      <section class="content-section data-section" data-aos="fade-up">
        <div class="section-header" data-aos="fade-left" data-aos-delay="200">
          <span class="section-number">02</span>
          <h2 class="section-title">What the Data Tells Us</h2>
        </div>

        <div class="content-container">
          <p class="intro-text" data-aos="fade-up" data-aos-delay="300">
            Between 2000-2019, approximately
            <span class="highlight-inline">489,000 people died annually</span> worldwide due to high
            temperatures.
          </p>

          <div class="data-statistics" data-aos="fade-up" data-aos-delay="400">
            <div class="stat-card" data-aos="zoom-in" data-aos-delay="100">
              <div class="stat-value">45%</div>
              <div class="stat-label">Deaths in Asia</div>
              <div class="stat-bar" style="width: 45%"></div>
            </div>
            <div class="stat-card" data-aos="zoom-in" data-aos-delay="200">
              <div class="stat-value">36%</div>
              <div class="stat-label">Deaths in Europe</div>
              <div class="stat-bar" style="width: 36%"></div>
            </div>
            <div class="stat-card" data-aos="zoom-in" data-aos-delay="300">
              <div class="stat-value">85%</div>
              <div class="stat-label">Increase in mortality for age 65+</div>
              <div class="stat-bar" style="width: 85%"></div>
            </div>
          </div>

          <div class="timeline-container" data-aos="fade-up" data-aos-delay="500">
            <h3 class="timeline-title" data-aos="fade-right">Historical Heat Waves</h3>
            <div class="timeline">
              <div class="timeline-item" data-aos="fade-right" data-aos-delay="100">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                  <h4>2022</h4>
                  <p>An estimated 61,672 excess deaths related to heat in Europe during summer</p>
                </div>
              </div>
              <div class="timeline-item" data-aos="fade-right" data-aos-delay="200">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                  <h4>2003</h4>
                  <p>European heat wave caused approximately 70,000 deaths</p>
                </div>
              </div>
              <div class="timeline-item" data-aos="fade-right" data-aos-delay="300">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                  <h4>2010</h4>
                  <p>Russian 44-day heat wave resulted in 56,000 deaths</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Prevention Section -->
      <section class="content-section prevention-section" data-aos="fade-up">
        <div class="section-header" data-aos="fade-right" data-aos-delay="200">
          <span class="section-number">03</span>
          <h2 class="section-title">Heat-Related Injuries are Preventable</h2>
        </div>

        <div class="content-container">
          <p class="intro-text" data-aos="fade-up" data-aos-delay="300">
            The World Health Organization states that health impacts related to high temperatures
            are largely predictable and preventable.
          </p>

          <div class="prevention-steps">
            <div class="step-card" data-aos="slide-up" data-aos-delay="100">
              <div class="step-icon">
                <i class="fas fa-bullhorn"></i>
              </div>
              <div class="step-content">
                <h3>Raise Awareness</h3>
                <p>Among the public and health professionals about heat-related risks</p>
              </div>
            </div>

            <div class="step-card" data-aos="slide-up" data-aos-delay="200">
              <div class="step-icon">
                <i class="fas fa-exclamation-triangle"></i>
              </div>
              <div class="step-content">
                <h3>Issue Timely Heat Warnings</h3>
                <p>Early alert systems for extreme heat events to prepare communities</p>
              </div>
            </div>

            <div class="step-card" data-aos="slide-up" data-aos-delay="300">
              <div class="step-icon">
                <i class="fas fa-user-shield"></i>
              </div>
              <div class="step-content">
                <h3>Provide Personalized Guidance</h3>
                <p>Targeted emergency instructions for different vulnerable groups</p>
              </div>
            </div>

            <div class="step-card" data-aos="slide-up" data-aos-delay="400">
              <div class="step-icon">
                <i class="fas fa-hands-helping"></i>
              </div>
              <div class="step-content">
                <h3>Strengthen Community Support</h3>
                <p>Regular check-ins and assistance mechanisms for vulnerable individuals</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Age Group Section -->
      <section class="content-section age-section" data-aos="fade-up">
        <div class="section-header" data-aos="fade-left" data-aos-delay="200">
          <span class="section-number">04</span>
          <h2 class="section-title">What Measures Should Different Age Groups Take?</h2>
        </div>

        <div class="content-container">
          <p class="intro-text" data-aos="fade-up" data-aos-delay="300">
            Different age groups have unique vulnerabilities and require specific precautions during
            extreme heat.
          </p>

          <div class="age-cards">
            <div
              class="age-card"
              @click="showAgeInfo('infants')"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div class="age-image-container">
                <img src="@/assets/a1.jpg" alt="Infants and Toddlers" class="age-image" />
                <div class="age-overlay"></div>
              </div>
              <div class="age-content">
                <div class="age-icon"><i class="fas fa-baby"></i></div>
                <h3 class="age-title">Infants and Toddlers</h3>
                <span class="age-range">0-5 years</span>
                <div class="click-hint">
                  Click for guidelines <i class="fas fa-arrow-right"></i>
                </div>
              </div>
            </div>

            <div
              class="age-card"
              @click="showAgeInfo('children')"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div class="age-image-container">
                <img src="@/assets/a2.jpg" alt="Children and Adolescents" class="age-image" />
                <div class="age-overlay"></div>
              </div>
              <div class="age-content">
                <div class="age-icon"><i class="fas fa-child"></i></div>
                <h3 class="age-title">Children and Adolescents</h3>
                <span class="age-range">6-17 years</span>
                <div class="click-hint">
                  Click for guidelines <i class="fas fa-arrow-right"></i>
                </div>
              </div>
            </div>

            <div
              class="age-card"
              @click="showAgeInfo('adults')"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div class="age-image-container">
                <img src="@/assets/a3.jpg" alt="Adults" class="age-image" />
                <div class="age-overlay"></div>
              </div>
              <div class="age-content">
                <div class="age-icon"><i class="fas fa-user"></i></div>
                <h3 class="age-title">Adults</h3>
                <span class="age-range">18-64 years</span>
                <div class="click-hint">
                  Click for guidelines <i class="fas fa-arrow-right"></i>
                </div>
              </div>
            </div>

            <div
              class="age-card"
              @click="showAgeInfo('elderly')"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <div class="age-image-container">
                <img src="@/assets/a4.jpg" alt="Elderly" class="age-image" />
                <div class="age-overlay"></div>
              </div>
              <div class="age-content">
                <div class="age-icon"><i class="fas fa-user-friends"></i></div>
                <h3 class="age-title">Elderly</h3>
                <span class="age-range">65+ years</span>
                <div class="click-hint">
                  Click for guidelines <i class="fas fa-arrow-right"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Modal for Age-Specific Information -->
    <div class="age-modal" v-if="showModal" @click.self="closeModal">
      <div class="modal-content">
        <span class="close-button" @click="closeModal">&times;</span>

        <div v-if="selectedAge === 'infants'">
          <h2>Infants and Toddlers (0-5 years)</h2>
          <div class="modal-section">
            <h3>Main Risks:</h3>
            <p>
              Incompletely developed temperature regulation, rapid dehydration, dependence on
              caregivers
            </p>
          </div>

          <div class="modal-section">
            <h3>Recommendations:</h3>
            <ul class="recommendation-list">
              <li>Keep indoor temperature cool (day &lt;32°C, night &lt;24°C)</li>
              <li>Feed frequently (breastmilk/water), avoid sugary drinks and juices</li>
              <li>Use cool damp towels, lukewarm baths to reduce temperature</li>
              <li>Avoid thick covers or warm clothing during sleep</li>
              <li>Never leave infants alone in enclosed spaces (like cars)</li>
              <li>
                Seek medical attention immediately for drowsiness, reduced crying, rapid breathing
              </li>
            </ul>
          </div>
        </div>

        <div v-if="selectedAge === 'children'">
          <h2>Children and Adolescents (6-17 years)</h2>
          <div class="modal-section">
            <h3>Main Risks:</h3>
            <p>
              High activity levels but inconsistent hydration, delayed recognition of heat-related
              symptoms
            </p>
          </div>

          <div class="modal-section">
            <h3>Recommendations:</h3>
            <ul class="recommendation-list">
              <li>Schedule outdoor activities in early morning or evening</li>
              <li>Drink water once every hour, avoid high-sugar beverages</li>
              <li>Wear loose-fitting, light-colored clothing; use hats for sun protection</li>
              <li>Avoid intense exercise, especially during midday heat</li>
              <li>
                If headache, fatigue, vomiting, or leg cramps occur, rest immediately and cool down
              </li>
            </ul>
          </div>
        </div>

        <div v-if="selectedAge === 'adults'">
          <h2>Adults (18-64 years)</h2>
          <div class="modal-section">
            <h3>Main Risks:</h3>
            <p>
              Exposure to high temperatures during work or exercise, often ignoring signs of heat
              stroke
            </p>
          </div>

          <div class="modal-section">
            <h3>Recommendations:</h3>
            <ul class="recommendation-list">
              <li>Hydrate regularly and take scheduled breaks while working</li>
              <li>Avoid alcohol and high-protein food intake</li>
              <li>Keep living spaces ventilated, avoid going out during midday</li>
              <li>Learn to recognize heat stroke signals (dizziness, nausea, rapid pulse)</li>
              <li>
                If taking medication, understand whether it affects sweating or electrolyte balance
              </li>
            </ul>
          </div>
        </div>

        <div v-if="selectedAge === 'elderly'">
          <h2>Elderly (65+ years)</h2>
          <div class="modal-section">
            <h3>Main Risks:</h3>
            <p>
              Decreased temperature regulation ability, higher prevalence of illness, reduced thirst
              sensation
            </p>
          </div>

          <div class="modal-section">
            <h3>Recommendations:</h3>
            <ul class="recommendation-list">
              <li>Measure indoor temperature daily (8 AM, 1 PM, 10 PM)</li>
              <li>Arrange for someone to check in at least 1 times daily</li>
              <li>Use damp towels, foot baths, and other cooling aids</li>
              <li>Drink water regularly, even without feeling thirsty</li>
              <li>
                Seek immediate medical attention for confusion, hot dry skin, or altered
                consciousness
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Knowledge Check Button Section -->
    <section class="knowledge-check-section" data-aos="fade-up">
      <div class="knowledge-check-container">
        <h2>Ready to test your knowledge?</h2>
        <p>Take a simple quiz to assess your understanding of heatwave protection</p>
        <router-link to="/explore/heatwave-survival-quiz" class="quiz-button">
          <i class="fas fa-graduation-cap"></i>
          Start Quiz
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import AOS from 'aos'
import 'aos/dist/aos.css'

const showModal = ref(false)
const selectedAge = ref('')
const parallaxImage = ref(null)

const showAgeInfo = (age) => {
  selectedAge.value = age
  showModal.value = true
  document.body.classList.add('modal-open')
}

const closeModal = () => {
  showModal.value = false
  document.body.classList.remove('modal-open')
}

// For parallax effect
const handleScroll = () => {
  if (parallaxImage.value) {
    const scrollPosition = window.scrollY
    const translateY = scrollPosition * 0.4 // Adjust this value to control the parallax effect speed
    parallaxImage.value.style.transform = `translate3d(0, ${translateY}px, 0)`
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)

  // Initialize AOS
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: false,
    mirror: true,
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* Base Styles */
.heat-guide-page {
  width: 100%;
  font-family: 'Roboto', 'Arial', sans-serif;
  color: #333;
  overflow-x: hidden;
}

.heat-guide-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Hero Section */
.hero-section {
  width: 100%;
  margin-bottom: 60px;
  position: relative;
  overflow: hidden;
  height: 100vh;
}

.parallax-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.parallax-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 120%; /* Extra height for parallax movement */
  object-fit: cover;
  will-change: transform;
}

.text-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  text-align: center;
  width: 80%;
  max-width: 800px;
  padding: 25px 40px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 5px;
}

.hero-title {
  color: white;
  margin: 0;
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.4;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

/* Content Sections Styles */
.content-section {
  margin-bottom: 100px;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.danger-section {
  background-color: #fff5f5;
  border-left: 5px solid #dc3545;
}

.data-section {
  background-color: #f0f8ff;
  border-left: 5px solid #0d6efd;
}

.prevention-section {
  background-color: #f6fff6;
  border-left: 5px solid #198754;
}

.age-section {
  background-color: #fff8f0;
  border-left: 5px solid #fd7e14;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.section-number {
  font-size: 5rem;
  font-weight: 800;
  opacity: 0.2;
  margin-right: 20px;
  line-height: 1;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.content-container {
  padding: 20px 0;
}

.intro-text {
  font-size: 1.3rem;
  line-height: 1.6;
  margin-bottom: 30px;
  color: #444;
}

.highlight-inline {
  color: #dc3545;
  font-weight: 700;
}

/* Danger Section Specific */
.highlight-box {
  display: flex;
  align-items: center;
  background-color: rgba(220, 53, 69, 0.1);
  padding: 20px;
  border-radius: 10px;
  margin: 30px 0;
}

.highlight-icon {
  font-size: 2rem;
  color: #dc3545;
  margin-right: 20px;
}

.highlight-text {
  font-size: 1.5rem;
  font-weight: 600;
  color: #dc3545;
  margin: 0;
}

.condition-grid h3 {
  font-size: 1.4rem;
  margin-bottom: 20px;
  color: #444;
}

.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.condition-card {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: transform 0.3s ease;
}

.condition-card:hover {
  transform: translateY(-5px);
}

.condition-card i {
  font-size: 2.5rem;
  color: #dc3545;
  margin-bottom: 15px;
}

.condition-card h4 {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #333;
}

.condition-card p {
  font-size: 0.95rem;
  color: #666;
  margin: 0;
}

.additional-note {
  background-color: rgba(0, 0, 0, 0.04);
  padding: 20px;
  border-radius: 10px;
  margin-top: 30px;
}

.additional-note p {
  font-size: 1.1rem;
  margin: 0;
  color: #555;
}

/* Data Section Specific */
.data-statistics {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin: 40px 0;
}

.stat-card {
  width: 300px;
  background-color: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  margin: 15px;
  position: relative;
  overflow: hidden;
}

.stat-value {
  font-size: 3rem;
  font-weight: 700;
  color: #0d6efd;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 1rem;
  color: #444;
  margin-bottom: 15px;
}

.stat-bar {
  height: 6px;
  background-color: #0d6efd;
  border-radius: 3px;
  margin-top: 15px;
}

.timeline-container {
  margin-top: 50px;
}

.timeline-title {
  font-size: 1.5rem;
  margin-bottom: 30px;
  color: #333;
  border-bottom: 2px solid #ddd;
  padding-bottom: 10px;
}

.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 2px;
  background-color: #0d6efd;
}

.timeline-item {
  margin-bottom: 40px;
  position: relative;
}

.timeline-dot {
  position: absolute;
  left: -39px;
  top: 5px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: white;
  border: 2px solid #0d6efd;
}

.timeline-content {
  padding: 15px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.timeline-content h4 {
  color: #0d6efd;
  margin: 0 0 10px;
  font-size: 1.2rem;
}

.timeline-content p {
  margin: 0;
  color: #555;
}

/* Prevention Section Specific */
.prevention-steps {
  margin-top: 30px;
}

.step-card {
  display: flex;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.step-card:hover {
  transform: translateX(10px);
}

.step-icon {
  width: 60px;
  height: 60px;
  background-color: #198754;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  flex-shrink: 0;
}

.step-icon i {
  font-size: 1.8rem;
  color: white;
}

.step-content {
  flex: 1;
}

.step-content h3 {
  margin: 0 0 10px;
  color: #198754;
  font-size: 1.3rem;
}

.step-content p {
  margin: 0;
  color: #555;
  font-size: 1rem;
}

/* Age Section Specific */
.age-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 80px;
  margin-top: 50px;
}

.age-card {
  background-color: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  position: relative;
}

.age-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.age-card:hover .age-overlay {
  opacity: 0.3;
}

.age-image-container {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.age-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.age-card:hover .age-image {
  transform: scale(1.1);
}

.age-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fd7e14;
  opacity: 0.1;
  transition: opacity 0.3s ease;
}

.age-content {
  padding: 20px;
  position: relative;
}

.age-icon {
  position: absolute;
  top: -30px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #fd7e14;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.age-icon i {
  font-size: 1.8rem;
  color: white;
}

.age-title {
  margin: 0 0 5px;
  font-size: 1.2rem;
  color: #333;
}

.age-range {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 15px;
}

.click-hint {
  font-size: 0.85rem;
  color: #fd7e14;
  display: flex;
  align-items: center;
}

.click-hint i {
  margin-left: 5px;
  transition: transform 0.3s ease;
}

.age-card:hover .click-hint i {
  transform: translateX(5px);
}

/* Modal Styles */
.age-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background-color: white;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  border-radius: 15px;
  padding: 30px;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.close-button {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 2rem;
  cursor: pointer;
  color: #999;
  transition: color 0.3s ease;
}

.close-button:hover {
  color: #333;
}

.modal-content h2 {
  color: #fd7e14;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.8rem;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

.modal-section {
  margin-bottom: 25px;
}

.modal-section h3 {
  color: #444;
  margin: 0 0 10px;
  font-size: 1.2rem;
}

.modal-section p {
  margin: 0;
  color: #555;
  line-height: 1.6;
}

.recommendation-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.recommendation-list li {
  position: relative;
  padding-left: 25px;
  margin-bottom: 12px;
  color: #555;
}

.recommendation-list li::before {
  content: '\2022';
  position: absolute;
  left: 0;
  top: 0;
  color: #fd7e14;
  font-size: 1.5rem;
  line-height: 1;
}

/* Media Queries */
@media (max-width: 992px) {
  .section-number {
    font-size: 4rem;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .content-section {
    padding: 30px;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .text-overlay {
    padding: 20px 30px;
    width: 90%;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .section-number {
    margin-right: 0;
    margin-bottom: 10px;
    font-size: 3rem;
  }

  .section-title {
    font-size: 1.6rem;
  }

  .highlight-text {
    font-size: 1.3rem;
  }

  .step-card {
    flex-direction: column;
  }

  .step-icon {
    margin-right: 0;
    margin-bottom: 15px;
  }

  .stat-card {
    width: 100%;
  }

  .age-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (max-width: 576px) {
  .hero-title {
    font-size: 2rem;
  }

  .text-overlay {
    padding: 15px 20px;
    width: 95%;
  }

  .content-section {
    padding: 20px;
  }

  .intro-text {
    font-size: 1.1rem;
  }

  .grid-layout {
    grid-template-columns: 1fr;
  }

  .age-cards {
    grid-template-columns: 1fr;
  }
}

/* Animation for body when modal is open */
:global(body.modal-open) {
  overflow: hidden;
}

/* Knowledge Check Section Styles */
.knowledge-check-section {
  background-color: #f8f9fa;
  padding: 60px 0;
  text-align: center;
  margin-top: 40px;
}

.knowledge-check-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 20px;
}

.knowledge-check-container h2 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
}

.knowledge-check-container p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 30px;
}

.quiz-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 15px 30px;
  background-color: #0d6efd;
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(13, 110, 253, 0.2);
}

.quiz-button:hover {
  background-color: #0b5ed7;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(13, 110, 253, 0.3);
}

.quiz-button i {
  margin-right: 10px;
  font-size: 1.4rem;
}

@media (max-width: 576px) {
  .knowledge-check-container h2 {
    font-size: 1.6rem;
  }
  
  .knowledge-check-container p {
    font-size: 1rem;
  }
  
  .quiz-button {
    padding: 12px 25px;
    font-size: 1.1rem;
  }
}
</style>
