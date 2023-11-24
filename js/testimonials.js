document.addEventListener("DOMContentLoaded", function () {
  // Initialize the carousel
  var testimonialCarousel = new bootstrap.Carousel(
    document.getElementById("carouselExampleCaptions"),
    {
      interval: 5000, // Set the interval between slides in milliseconds (adjust as needed)
      wrap: true, // Set to false if you don't want the carousel to wrap around
    }
  );

  var carouselResume = new bootstrap.Carousel(
    document.getElementById("carouselResume"),
    {
      interval: 5000, // Set the interval between slides in milliseconds (adjust as needed)
      wrap: true, // Set to false if you don't want the carousel to wrap around
    }
  );

  // Optional: Add event listeners for the carousel controls
  var carouselControls = document.querySelectorAll(".controls a");

  carouselControls.forEach(function (control) {
    control.addEventListener("click", function (event) {
      event.preventDefault();
      var direction = this.classList.contains("left") ? "prev" : "next";
      testimonialCarousel[direction]();

      var directionTwo = this.classList.contains("left") ? "prev" : "next";
      carouselResume[directionTwo]();
    });
  });
});
