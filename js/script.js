const clickBurger = () => {
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".nav");
  const body = document.querySelector("body");

  burger.addEventListener("click", () => {
    nav.classList.toggle("js-active");
    burger.classList.toggle("js-active");
    body.classList.toggle("js-overflow");
  });
};

clickBurger();
