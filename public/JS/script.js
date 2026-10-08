const position = document.getElementById("position");
position.addEventListener("change", () => {
  console.log(position.value);
  if (position.value === "all") {
    window.location.href = "/list";
  } else {
    window.location.href = "/list?roles=" + position.value ;
  }
});
