<template>
  <div class="about page-background">
    <div class="video-container">
      <video class="main-video" autoplay loop muted playsinline>
        <source src="@/assets/mainVedio.mp4" type="video/mp4" />
        Sorry, your browser may not support video playback
      </video>
      <div class="video-overlay">
        <h1>About Us</h1>
      </div>
    </div>

    <div class="about-content">
      <div class="about-description">
        <p class="paragraph">
          We are dedicated to addressing the growing challenges posed by the Urban Heat Island (UHI)
          effect in Melbourne, which presents significant environmental and public health risks for
          urban residents. Our goal is to provide a user-friendly and intuitive platform that
          encourages and supports city residents in actively engaging in environmentally responsible
          actions through meaningful and interactive features. By doing so, we aim to contribute
          collectively to mitigating the climate crisis.
        </p>

        <p class="paragraph">
          We aim to raise awareness that combating climate change does not solely depend on
          large-scale greening projects or infrastructure upgrades driven by governments or
          corporations. Every individual's participation in environmental efforts is equally
          crucial. Through this initiative, we hope to inspire residents to take action and make a
          tangible difference in creating a sustainable urban environment.
        </p>
      </div>
    </div>
  </div>
</template>

<style>
.page-background {
  background-color: var(--color-background-soft);
  min-height: 100vh;
  width: 100%;
}

.about {
  width: 100%;
  min-height: 100vh;
}

.video-container {
  position: relative;
  width: 100%;
  height: 44vh;
  overflow: hidden;
  margin-bottom: 2rem;
}

.main-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.05);
}

.video-overlay h1 {
  color: white;
  font-size: 4rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  position: relative;
  top: 12.4%;
}

.about-content {
  max-width: 1000px;
  margin: 0 auto;
}

.about-description {
  font-size: 1.5rem;
  line-height: 1.8;
  text-align: justify;
}

.about-description .paragraph {
  margin-bottom: 2.2rem;
  letter-spacing: 0.3px;
}

.about-description .paragraph:last-child {
  margin-bottom: 0;
}

/* Mobile styles */
@media (max-width: 768px) {
  .video-container {
    height: 50vh;
  }

  .video-overlay h1 {
    font-size: 2.5rem;
  }

  .about-content {
    padding: 1rem;
  }

  .about-description {
    font-size: 1rem;
    line-height: 1.6;
  }

  .about-description .paragraph {
    margin-bottom: 1.5rem;
  }
}

/* Desktop styles */
@media (min-width: 1024px) {
  .about-content {
    padding: 2rem;
  }
}
</style>
