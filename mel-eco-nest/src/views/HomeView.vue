<script setup>
import { RouterLink } from 'vue-router'
import h1 from '@/assets/h1.jpg'
import r1 from '@/assets/r1.jpg'
import r2 from '@/assets/r2.jpg'
import r3 from '@/assets/r3.jpg'
import r4 from '@/assets/r4.jpg'
import r5 from '@/assets/r5.jpg'
import b1 from '@/assets/b1.jpg'
</script>

<template>
  <div class="home is-preload">
    <!-- Header -->
    <section id="header">
      <div class="inner">
        <i
          class="fas fa-leaf"
          style="font-size: 4rem; color: #034c26; margin-bottom: 2rem; margin-top: -1rem"
        ></i>
        <h1>Welcome to <strong>Mel Eco Nest</strong></h1>
        <p>Join us in shaping a better, more sustainable future for our cities</p>
        <ul class="actions special">
          <li>
            <div class="scroll-indicator">
              <a href="#one" class="scroll-down-arrow">
                <i class="fas fa-angles-down"></i>
              </a>
              <div class="scroll-down-text">Scroll Down</div>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- One -->
    <section id="one" class="main style1">
      <div class="container">
        <div class="row gtr-150">
          <div class="col-6 col-12-medium">
            <header class="major">
              <h2>What is the Urban Heat Island Effect?</h2>
            </header>
            <p>
              The urban heat island effect means that cities are hotter than nearby rural areas
              because buildings and roads absorb and keep more heat, mainly due to human activities
              and materials like concrete and asphalt.
            </p>
          </div>
          <div class="col-6 col-12-medium imp-medium">
            <span class="image fit"><img :src="h1" alt="Urban Heat Island Effect" /></span>
          </div>
        </div>
      </div>
    </section>

    <!-- Two -->
    <section id="two" class="main style2">
      <div class="container">
        <div class="row gtr-150">
          <div class="col-4 col-12-medium">
            <ul class="major-icons">
              <li><span class="icon solid style1 major fa-thermometer-full"></span></li>
              <li><span class="icon solid style2 major fa-sun"></span></li>
              <li><span class="icon solid style3 major fa-leaf"></span></li>
              <li><span class="icon solid style4 major fa-building"></span></li>
              <li><span class="icon solid style5 major fa-chart-line"></span></li>
              <li><span class="icon solid style6 major fa-calendar"></span></li>
            </ul>
          </div>
          <div class="col-8 col-12-medium">
            <div class="heat-island-info">
              <div class="heat-section">
                <header class="major">
                  <h2>A Growing Urban Threat</h2>
                </header>
                <p>
                  Melbourne's Urban Heat Island (UHI) effect is intensifying due to expanding
                  impervious surfaces and vegetation loss. Combined with climate change, UHI
                  increases health risks, especially during heatwaves, which are Australia's
                  deadliest natural hazard.
                </p>
              </div>

              <div class="heat-section">
                <header class="major">
                  <h2>Spatial and Temporal Variations</h2>
                </header>
                <p>
                  UHI impacts vary across Melbourne. Inner-city areas experience elevated night-time
                  temperatures, while western outer suburbs face intense daytime heat. Differences
                  in vegetation, urban density, and rainfall patterns contribute to these localised
                  heat stress conditions.
                </p>
              </div>

              <div class="heat-section">
                <header class="major">
                  <h2>Future Risks from Urban Growth</h2>
                </header>
                <p>
                  Melbourne is expected to add 600,000 dwellings by 2030. Without strategic
                  intervention, new developments will amplify UHI. Projections suggest UHI could
                  raise local temperatures by an additional 1°C per decade on top of global warming.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Three -->
    <section id="three" class="main style1 special">
      <div class="container">
        <header class="major">
          <h2>Take a Tour of Our Features</h2>
        </header>
        <p>Features Portal</p>
        <div class="row gtr-150">
          <div class="col-4 col-12-medium">
            <div class="feature-card">
              <span class="image fit"><img :src="r1" alt="Micro Oasis" /></span>
              <h3>Build Micro Oasis</h3>
              <p>Create your own green space to combat urban heat</p>
              <ul class="actions special">
                <li>
                  <RouterLink to="/actions/build-micro-oasis" class="button">Explore</RouterLink>
                </li>
              </ul>
            </div>
          </div>
          <div class="col-4 col-12-medium">
            <div class="feature-card">
              <span class="image fit"><img :src="r2" alt="Energy Plan" /></span>
              <h3>My Energy Plan</h3>
              <p>Discover your personalized energy saving plan</p>
              <ul class="actions special">
                <li><RouterLink to="/actions/my-plan" class="button">Explore</RouterLink></li>
              </ul>
            </div>
          </div>
          <div class="col-4 col-12-medium">
            <div class="feature-card">
              <span class="image fit"><img :src="r3" alt="Goal Tracker" /></span>
              <h3>Goal Tracker</h3>
              <p>Monitor your progress towards sustainability goals</p>
              <ul class="actions special">
                <li><RouterLink to="/actions/goal-tracker" class="button">Explore</RouterLink></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="row gtr-150" style="margin-top: 3rem">
          <div class="col-4 col-12-medium offset-2">
            <div class="feature-card">
              <span class="image fit"><img :src="r4" alt="Heat Map" /></span>
              <h3>Melbourne Heat Map</h3>
              <p>View Melbourne's urban heat island effect map</p>
              <ul class="actions special">
                <li><RouterLink to="/explore/heat-map" class="button">Explore</RouterLink></li>
              </ul>
            </div>
          </div>
          <div class="col-4 col-12-medium">
            <div class="feature-card">
              <span class="image fit"><img :src="r5" alt="Energy Progress" /></span>
              <h3>Energy Progress</h3>
              <p>Track community energy conservation achievements</p>
              <ul class="actions special">
                <li>
                  <RouterLink to="/explore/energy-progress" class="button">Explore</RouterLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Four -->
    <section id="four" class="main style2 special">
      <div class="container">
        <header class="major">
          <h2>Join Us in Taking Action</h2>
        </header>
        <p>Small changes, big impact - help us reshape Melbourne's climate future.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,300italic,400,400italic');
@import url('../../html5up-photon/assets/css/fontawesome-all.min.css');
@import url('../../html5up-photon/assets/css/main.css');
@import url('../../html5up-photon/assets/css/noscript.css');

/* Remove duplicate styles as they are imported via main.css */
/* Only keep specific overrides */
.home {
  width: 100%;
  background-color: var(--color-background);
}

#header {
  background-image: url('@/assets/melskyline.jpg');
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  position: relative;
  background-color: #000;
}

#header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 1;
}

#header .inner {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: calc(5vh + 3rem);
  width: 90%;
  max-width: 1200px;
}

#header .inner i.fas.fa-leaf {
  font-size: min(4.5rem, 8vw);
  color: #4acaa8;
  margin-bottom: 2rem;
  margin-top: -2rem;
}

#header .inner h1 {
  font-size: min(3.2rem, 6.5vw);
  margin-top: min(1rem, 3vw);
  padding: 0;
  letter-spacing: 0.03em;
}

#header .inner p {
  font-size: min(1.5rem, 3.2vw);
  margin: min(1.5rem, 3vw) 0;
  color: #ffffff;
  padding: 0.5em 1.2em;
  border-radius: 0.4em;
  display: inline-block;

}



/* Ensure images display correctly */
.image.fit img {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 4px;
}

/* Ensure button styles are correct */
.button {
  background-color: #4acaa8;
  color: white;
  padding: 0.6rem 1.8rem;
  border-radius: 25px;
  text-decoration: none;
  transition: all 0.3s ease;
}

/* Ensure responsive layout is correct */
@media screen and (max-width: 980px) {
  .col-4,
  .col-6 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}

@media screen and (max-width: 736px) {
  body,
  input,
  select,
  textarea {
    font-size: 14pt;
  }
}

@media screen and (max-width: 480px) {
  .container {
    max-width: calc(100% - 2em);
  }
}

#header .actions:after,
#header .actions:before,
#header .actions li:after,
#header .actions li:before {
  display: none !important;
  background: none !important;
  border: none !important;
  content: none !important;
  height: 0 !important;
  width: 0 !important;
}
#header .actions {
  border: none !important;
  box-shadow: none !important;
}

.scroll-indicator {
  animation: bounce 1.5s infinite;
  display: inline-block;
  margin-top: min(1rem, 2vw);
  border: none;
  background: none;
}

.scroll-down-arrow {
  display: inline-block;
  font-size: min(2rem, 4vw);
  color: #fafafa;
  margin-top: min(0.5rem, 2vw);
  transition: color 0.3s;
  text-decoration: none !important;
  line-height: 1;
  background: none;
  border-bottom: none;
}

.scroll-down-arrow i {
  display: block;
  color: #fafafa;
  background: none;
  border: none;
  outline: none;
}

/* Remove all possible bottom decorations */
.scroll-down-arrow::after,
.scroll-down-arrow::before {
  display: none !important;
  content: none !important;
  border: none !important;
  background: none !important;
}

.scroll-down-text {
  font-size: min(1rem, 2vw);
  color: #fbfefd;
  margin-top: 0.2rem;
  letter-spacing: 0.08em;
  text-align: center;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.8;
  }
  50% {
    transform: translateY(18px);
    opacity: 1;
  }
}

/* Add media queries for extreme cases */
@media screen and (max-width: 768px) {
  #header .inner {
    padding-top: 8vh;
  }

  #header .inner i.fas.fa-leaf {
    font-size: 3rem;
  }

  #header .inner h1 {
    font-size: 2.5rem;
  }

  #header .inner p {
    font-size: 1.2rem;
  }
}

@media screen and (max-width: 480px) {
  #header .inner {
    padding-top: 6vh;
  }

  #header .inner i.fas.fa-leaf {
    font-size: 2.5rem;
  }

  #header .inner h1 {
    font-size: 2rem;
  }

  #header .inner p {
    font-size: 1rem;
  }
}

/* Handle extra large screens */
@media screen and (min-width: 1920px) {
  #header .inner {
    max-width: 1400px;
  }
}

#one .major h2 {
  font-size: min(2.5rem, 5vw);
  color: #272626;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1.3;
}

/* Responsive adjustments */
@media screen and (max-width: 768px) {
  #one .major h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
}

@media screen and (max-width: 480px) {
  #one .major h2 {
    font-size: 1.8rem;
  }
}

#one,
#three {
  background-color: var(--color-background);
}

#two {
  background-color: var(--color-background-soft);
  background-image: url('@/assets/h2.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  color: white;
}

#two::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

#two .container {
  position: relative;
  z-index: 2;
  max-width: 95%;
  width: 95%;
}

#two p,
#two h2,
#two .major-icons span {
  color: white;
}

#two .heat-island-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
}

#two .heat-section {
  background-color: rgba(0, 0, 0, 0.34);
  border-radius: 8px;
  padding: 1.5rem 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  width: 95%;
  max-width: 100%;
  box-sizing: border-box;
}

#two .heat-section h2 {
  font-size: 1.6rem;
  color: white;
  margin-bottom: 0.8rem;
  letter-spacing: 0.05em;
  white-space: normal;
  word-wrap: break-word;
}

#two .heat-section p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
  width: 100%;
}

@media screen and (min-width: 769px) {
  #two .row .col-8 {
    padding-left: 2rem;
  }
}

@media screen and (max-width: 768px) {
  #two .heat-section {
    padding: 1.2rem 1.5rem;
  }

  #two .heat-section h2 {
    font-size: 1.4rem;
  }
}

#four {
  background-color: var(--color-background-mute);
  background-image: url('@/assets/b1.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  color: white;
}

#four::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

#four .container {
  position: relative;
  z-index: 2;
  padding: 4rem 0;
}

#four .major h2 {
  color: white;
  font-weight: 600;
  font-size: min(2.5rem, 6vw);
  margin-bottom: 1.5rem;
}

#four p {
  color: rgba(255, 255, 255, 0.9);
  font-size: min(1.3rem, 3vw);
  max-width: 80%;
  margin: 0 auto;
  line-height: 1.6;
}

@media screen and (max-width: 768px) {
  #four .container {
    padding: 3rem 0;
  }

  #four .major h2 {
    font-size: 2rem;
  }

  #four p {
    font-size: 1.1rem;
    max-width: 90%;
  }
}

@media screen and (max-width: 480px) {
  #four .container {
    padding: 2.5rem 0;
  }

  #four .major h2 {
    font-size: 1.8rem;
  }

  #four p {
    font-size: 1rem;
    max-width: 95%;
  }
}

/* Make text more readable against the light background */
#one p,
#three p {
  color: var(--color-text);
}

#two p {
  color: var(--color-text-light);
}

#two .major-icons {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Two column layout */
  grid-gap: 0.2rem; /* Grid gap */
  justify-content: center;
  align-items: center;
  height: 89%;
  padding: 1rem;
}

#two .major-icons li {
  margin: 0.3rem;
  display: flex;
  justify-content: center;
}

#two .major-icons span {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
}

@media screen and (max-width: 768px) {
  #two .major-icons {
    grid-template-columns: repeat(3, 1fr); /* Switch to 3 columns on medium screens */
  }
}

@media screen and (max-width: 480px) {
  #two .major-icons {
    grid-template-columns: repeat(2, 1fr); /* Keep 2 columns on small screens */
  }
}

/* Ensure no extra borders in the container */
#header .actions li a {
  border: none !important;
  text-decoration: none !important;
  box-shadow: none !important;
}

#three.main.style1 .major h2 {
  font-size: min(2.2rem, 5vw);
  color: #272626;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1.3;
  text-align: center;
}

#three.main.style1 .container > p {
  font-size: min(1.3rem, 3vw);
  color: #4a4a4a;
  margin-bottom: 3rem;
  text-align: center;
  max-width: 80%;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.5;
  font-weight: 500;
}

@media screen and (max-width: 768px) {
  #three.main.style1 .major h2 {
    font-size: 2.2rem;
  }

  #three.main.style1 .container > p {
    font-size: 1.1rem;
    max-width: 90%;
  }
}

@media screen and (max-width: 480px) {
  #three.main.style1 .major h2 {
    font-size: 1.8rem;
  }

  #three.main.style1 .container > p {
    font-size: 1rem;
    max-width: 95%;
  }
}

/* Feature cards styling */
.feature-card {
  background: white;
  border-radius: 10px;
  padding: 1.8rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 105%;
  margin: 0 auto;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin: 1rem 0;
  color: #333;
  font-weight: 600;
}

.feature-card p {
  color: #666;
  flex-grow: 1;
  margin-bottom: 1.5rem;
}

.feature-card .image.fit {
  margin-bottom: 1rem;
  overflow: hidden;
  border-radius: 4px;
}

.feature-card .image.fit img {
  height: 220px;
  object-fit: cover;
}

.feature-card .button {
  align-self: center;
  background-color: #4095bc;
  color: white !important;
  padding: 0.7rem 2rem;
  text-align: center;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 3rem;
  border-radius: 30px;
  font-weight: 600;
  letter-spacing: 0.05em;
  transition:
    background-color 0.3s ease,
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.feature-card .button span,
.feature-card .button a,
.feature-card a.button {
  color: white !important;
  text-decoration: none !important;
}

.feature-card .actions a {
  color: white !important;
}

.feature-card .button:hover {
  background-color: #289952;
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  color: white !important;
}

.feature-card a,
.feature-card a:link,
.feature-card a:visited,
.feature-card a:hover,
.feature-card a:active {
  color: white !important;
  text-decoration: none !important;
}

.feature-card ul.actions {
  margin: 0;
  padding: 0;
  width: 100%;
}

.feature-card ul.actions li {
  width: 100%;
  padding: 0;
}

@media screen and (max-width: 980px) {
  .feature-card {
    margin-bottom: 2rem;
    width: 100%;
  }

  .feature-card .image.fit img {
    height: 180px;
  }
}

@media screen and (max-width: 480px) {
  .feature-card .image.fit img {
    height: 160px;
  }
}

/* Four */
#four .button.primary {
  background-color: #4095bc;
}

#four .button.primary:hover {
  background-color: #289952;
}

#four .button.wide {
  border-radius: 30px;
  padding: 0.8rem 2.2rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  transition:
    background-color 0.3s ease,
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

#four .button.wide:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Adjust card layout */
#three .row.gtr-150 {
  margin-left: -1rem;
  margin-right: -1rem;
}
</style>
