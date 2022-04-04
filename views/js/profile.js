//change Email
const email_default = document.querySelector(".email-default");
const email__edit = document.querySelector(".email_edit");
const email_edit = document.querySelector(".email-edit");
const cross_email = document.querySelector(".cross_email");

//change full name

const name_default = document.querySelector(".name-default");
const name__edit = document.querySelector(".name_edit");
const name_edit = document.querySelector(".name-edit");
const cross_name = document.querySelector(".cross_name");

email__edit.addEventListener("click", function () {
  email_default.style.display = "none";
  email_edit.style.display = "block";
});

cross_email.addEventListener("click", function () {
  email_default.style.display = "block";
  email_edit.style.display = "none";
});

name__edit.addEventListener("click", function () {
  name_default.style.display = "none";
  name_edit.style.display = "block";
});

cross_name.addEventListener("click", function () {
  name_default.style.display = "block";
  name_edit.style.display = "none";
});

email_default.addEventListener("click", function () {
  email_default.style.display = "none";
  email_edit.style.display = "block";
});

name_default.addEventListener("click", function () {
  name_default.style.display = "none";
  name_edit.style.display = "block";
});
