<template>
  <div class="mitigation-container">
    <h1 class="page-title">Heat Island Effect Mitigation Measures</h1>
    <p class="page-description">
      Learn how to reduce Melbourne's urban heat island effect through various methods and
      strategies, creating a more livable urban environment.
    </p>

    <div class="strategies-section">
      <h2 class="section-title">Main Mitigation Strategies</h2>

      <div class="strategy-cards">
        <div class="strategy-card">
          <div class="strategy-icon">
            <i class="fas fa-tree"></i>
          </div>
          <h3>Enhance Urban Green Spaces</h3>
          <p>
            Adding 30% more urban greenery can reduce temperatures by 2-4°C through natural shading
            and cooling.
          </p>
          <ul class="strategy-tips">
            <li>Plant more trees in communities and streets</li>
            <li>Develop urban parks and green spaces</li>
          </ul>
        </div>

        <div class="strategy-card">
          <div class="strategy-icon">
            <i class="fas fa-building"></i>
          </div>
          <h3>Use Reflective Building Materials</h3>
          <p>Light-colored, reflective materials can lower surface temperatures by up to 40°C.</p>
          <ul class="strategy-tips">
            <li>Install light-colored or reflective roofing materials</li>
            <li>Use special coatings to increase building reflectivity</li>
          </ul>
        </div>

        <div class="strategy-card">
          <div class="strategy-icon">
            <i class="fas fa-mountain"></i>
          </div>
          <h3>Promote Green Roofs and Walls</h3>
          <p>
            Building-integrated vegetation provides natural insulation and cooling while adding
            green space.
          </p>
          <ul class="strategy-tips">
            <li>Install green roof systems on flat-roofed buildings</li>
            <li>Construct vertical gardens and green walls</li>
          </ul>
        </div>

        <div class="strategy-card">
          <div class="strategy-icon">
            <i class="fas fa-bus"></i>
          </div>
          <h3>Minimize Transport Pollution</h3>
          <p>
            Decreasing vehicle traffic helps minimize heat waste from engines and exhaust systems.
          </p>
          <ul class="strategy-tips">
            <li>Use public transportation</li>
            <li>Promote cycling and walking</li>
          </ul>
        </div>

        <div class="strategy-card">
          <div class="strategy-icon">
            <i class="fas fa-heart"></i>
          </div>
          <h3>Support Community Green Initiatives</h3>
          <p>
            Collective environmental projects amplify individual efforts for broader neighborhood
            impact.
          </p>
          <ul class="strategy-tips">
            <li>Encourage your body corporate to explore green roof funding</li>
            <li>Join local environmental or sustainability groups</li>
          </ul>
        </div>

        <div class="strategy-card">
          <div class="strategy-icon">
            <i class="fas fa-fan"></i>
          </div>
          <h3>Use Energy-Efficient Cooling Habits</h3>
          <p>
            Smarter appliance use reduces energy consumption and associated urban heat production.
          </p>
          <ul class="strategy-tips">
            <li>Use fans combined with AC to circulate air more effectively</li>
            <li>Set air conditioners to 25-26°C with energy-saving mode</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="case-studies-section">
      <h2 class="section-title">Successful Case Studies</h2>

      <div class="case-study">
        <div class="case-study-image melbourne-example"></div>
        <a
          href="https://www.melbourne.vic.gov.au/green-our-rooftop-project"
          target="_blank"
          class="case-study-content"
        >
          <h3>Green Our Rooftop Project</h3>
          <p>
            This $2.5 million joint initiative between the City of Melbourne and Victorian
            Government demonstrates innovative green roof retrofitting at 1 Treasury Place,
            featuring diverse plant systems that provide significant cooling, biodiversity, and
            water management benefits.
          </p>
        </a>
      </div>

      <div class="case-study reverse">
        <a
          href="https://www.melbourne.vic.gov.au/greening-laneways"
          target="_blank"
          class="case-study-content"
        >
          <h3>Green Your Laneway Program</h3>
          <p>
            This program has transformed over 400 city laneways into vibrant green spaces, with
            successful pilot projects at Meyers Place, Guildford Lane, and Coromandel Place that
            cool the urban environment, boost biodiversity, and improve community wellbeing.
          </p>
        </a>
        <div class="case-study-image cool-streets"></div>
      </div>
    </div>

    <div class="community-action-section">
      <h2 class="section-title">Community Action Guide</h2>

      <div class="action-grid">
        <div class="action-item">
          <h3>Individual Initiatives</h3>
          <ul>
            <li>Plant trees and plants in your yard or balcony</li>
            <li>Choose light-colored roofing and wall materials</li>
          </ul>
        </div>

        <div class="action-item">
          <h3>Community Organizations</h3>
          <ul>
            <li>Organize community tree-planting events</li>
            <li>Create community gardens and green spaces</li>
          </ul>
        </div>

        <div class="action-item">
          <h3>Business Engagement</h3>
          <ul>
            <li>Install green roofs or solar panels on commercial buildings</li>
            <li>Support employee use of public transport and remote work</li>
          </ul>
        </div>

        <div class="action-item">
          <h3>Legislative Advocacy</h3>
          <ul>
            <li>Support policies to increase urban greening</li>
            <li>Advocate for stricter building energy standards</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// more function to be added later
</script>

<style scoped>
.mitigation-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-title {
  color: var(--color-heading);
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 1rem;
}

.page-description {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 3rem;
  color: var(--color-text);
  line-height: 1.6;
  font-size: 1.1rem;
}

.section-title {
  color: var(--color-heading);
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.strategies-section {
  margin-bottom: 4rem;
  margin-top: 4rem;
}

.strategy-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

.strategy-card {
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.strategy-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: #034c26;
}

.strategy-icon {
  width: 80px;
  height: 80px;
  margin-bottom: 1.5rem;
  background: #034c26;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 15px rgba(46, 204, 113, 0.3);
}

.strategy-icon i {
  font-size: 2rem;
  color: white;
}

.strategy-card h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.4rem;
  font-weight: 600;
}

.strategy-card p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.strategy-tips {
  list-style: disc;
  padding: 0 0 0 1.2rem;
  margin: 0;
}

.strategy-tips li {
  margin-bottom: 1rem;
  color: #555;
  font-size: 0.95rem;
  line-height: 1.5;
  padding-left: 0.3rem;
}

.case-studies-section {
  margin-bottom: 5rem;
  margin-top: 5rem;
}

.case-study {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 3rem;
  background-color: var(--color-background-soft);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.case-study:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.case-study-image {
  flex: 1;
  min-width: 300px;
  height: 350px;
  background-color: #e0f2e1;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.melbourne-example {
  background-image: url('@/assets/Skyhouse362.jpg');
  position: relative;
}

.melbourne-example::after {
  content: '© Lisa Ellis Gardens';
  position: absolute;
  bottom: 10px;
  left: 10px;
  font-size: 12px;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 4px 8px;
  border-radius: 4px;
}

.cool-streets {
  background-image: url('@/assets/rankins-lane_mel.jpg');
  position: relative;
}

.cool-streets::after {
  content: '© Rebecca Newman';
  position: absolute;
  bottom: 10px;
  left: 10px;
  font-size: 12px;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 4px 8px;
  border-radius: 4px;
}

.case-study-content {
  flex: 1;
  min-width: 300px;
  padding: 2rem;
  text-decoration: none;
  color: inherit;
}

.case-study-content:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.case-study-content h3 {
  color: var(--color-heading);
  margin-bottom: 1.5rem;
  font-size: 1.6rem;
}

.case-study-content p {
  margin-bottom: 1rem;
  line-height: 1.6;
}

.case-study.reverse {
  flex-direction: row-reverse;
}

.community-action-section {
  margin-top: 5rem;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.action-item {
  background-color: var(--color-background-soft);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-item h3 {
  color: var(--color-heading);
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
  text-align: center;
}

.action-item ul {
  padding-left: 1.5rem;
}

.action-item li {
  margin-bottom: 0.8rem;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .case-study-image {
    height: 250px;
  }

  .case-study-content {
    padding: 1.5rem;
  }

  .case-study-content h3 {
    font-size: 1.4rem;
  }
}
</style>
