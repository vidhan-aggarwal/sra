document.addEventListener("DOMContentLoaded", () => {
  const type = document.body.dataset.page;
  if (type === "pilates" || type === "gyrotonics") {
    initMachineAccordion(type);
  }
});
