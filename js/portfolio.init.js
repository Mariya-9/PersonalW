//Portfolio filter

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".projects-wrapper");
  const filter = document.getElementById("filter");

  const iso = new Isotope(container, {
    filter: "*",
    layoutMode: "masonry",
    animationOptions: {
      duration: 750,
      easing: "linear",
    },
  });

  const filterLinks = filter.querySelectorAll("a");

  filterLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const selector = link.getAttribute("data-filter");
      filterLinks.forEach((link) => link.classList.remove("active"));
      link.classList.add("active");

      iso.arrange({
        filter: selector,
        animationOptions: {
          duration: 750,
          easing: "linear",
          queue: false,
        },
      });
    });
  });
});
