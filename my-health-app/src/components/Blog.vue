<template>
  <div class="blog-container">
    <h1>Welcome to the Blog</h1>
    <img
      src="@/assets/health-blog-image.jpg"
      alt="Health Blog Image"
      class="blog-image"
    />
    <div class="blog-content">
      <h2>The Importance of Maintaining a Healthy Lifestyle</h2>
      <p>
        Maintaining a healthy lifestyle is essential for both physical and
        mental well-being. A balanced diet, regular exercise, and sufficient
        sleep are key components of good health. By making conscious choices
        about what you eat and how you move, you can improve your energy levels,
        prevent chronic diseases, and enhance your overall quality of life.
      </p>
      <p>
        Remember, small changes can make a big difference. Start with simple
        habits like walking more, drinking plenty of water, and getting at least
        7-8 hours of sleep each night. Over time, these habits will contribute
        to a healthier, happier you.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Blog",
};
</script>

<style scoped>
.blog-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  background-color: #f9f9f9; /* Added background color for better contrast */
  border-radius: 10px; /* Rounded corners for a softer look */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
}

h1 {
  margin-bottom: 20px;
  color: #333;
}

.blog-image {
  max-width: 100%;
  height: auto;
  margin-bottom: 20px;
  border-radius: 8px;
}

.blog-content {
  text-align: left;
}

.blog-content h2 {
  font-size: 24px;
  margin-bottom: 15px;
  color: #007bff; /* Blue color to highlight the heading */
}

.blog-content p {
  font-size: 18px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
}
</style>
