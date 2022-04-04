const inpFile = document.getElementById("inpFile");
const previewContainer = document.getElementById("imagePreview");
const previewImage = previewContainer.querySelector(".image-Preview__image");
const previewDefaultText = previewContainer.querySelector(
  ".image-preview__default-text"
);
const x = document.querySelector(".x");

console.log("hello");

inpFile.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    previewDefaultText.style.display = "none";
    previewImage.style.display = "block";
    x.style.display = "block";

    reader.addEventListener("load", function () {
      previewImage.setAttribute("src", this.result);
    });
    reader.readAsDataURL(file);
  } else {
    previewDefaultText.style.display = null;
    previewImage.style.display = null;
    x.style.display = null;
    previewImage.setAttribute("src", "");
  }
});

x.addEventListener("click", function (e) {
  previewDefaultText.style.display = null;
  previewImage.style.display = null;
  x.style.display = null;
  previewImage.setAttribute("src", "");
});
