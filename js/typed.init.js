document.querySelectorAll(".element").forEach((element) => {
  let typed = new Typed(element, {
    strings: element.getAttribute("data-elements").split(","),
    typeSpeed: 100,
    backDelay: 3000,
  });
});
