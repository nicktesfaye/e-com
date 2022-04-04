const plus = document.querySelectorAll("#plus");
const minus = document.querySelectorAll("#minus");
const form = document.querySelectorAll("#spinner-form");

plus.forEach((p, i) => {
  p.addEventListener("click", function () {
    if (form[i].value < 5)
      form[i].setAttribute("value", parseInt(form[i].value) + 1);
  });
});
minus.forEach((m, i) => {
  m.addEventListener("click", function () {
    if (form[i].value > 1)
      form[i].setAttribute("value", parseInt(form[i].value) - 1);
  });
});
