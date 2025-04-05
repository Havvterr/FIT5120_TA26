<template>
  <div class="about">
    <div class="about-content">
      <h1 class="about-title">About Us</h1>
      <div class="about-description">
        <p>We are committed to researching and addressing the urban heat island effect in Melbourne, using data analysis and visualization to help residents better understand and respond to this environmental challenge.</p>
      </div>
      <div class="video-container">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          frameborder="0"
          allow="autoplay; encrypted-media"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </div>
</template>

<style>
.about {
  padding: 1rem;
  width: 100%;
  min-height: 100vh;
}

.about-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.about-title {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;
}

.about-description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #34495e;
  text-align: justify;
}

/* on mobile platform */
@media (max-width: 768px) {
  .about {
    padding: 0.5rem;
  }

  .about-content {
    padding: 0.5rem;
  }

  .about-title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .about-description {
    font-size: 1rem;
  }
}

/* 桌面端样式 */
@media (min-width: 1024px) {
  .about {
    display: flex;
    align-items: center;
  }

  .about-content {
    padding: 2rem;
  }
}

.video-container {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
  max-width: 100%;
  margin-top: 2rem;
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
