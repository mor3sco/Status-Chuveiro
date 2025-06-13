const addBtn = document.getElementById("addStatus");
const removeBtn = document.getElementById("removeStatus");
const nameInput = document.getElementById("nameInput");
const statusArea = document.getElementById("statusArea");
const statusText = document.getElementById("statusText");
const timerText = document.getElementById("timerText");

let timerInterval;
let timeoutRemove;

function setInputVisibility(visible) {
  nameInput.style.display = visible ? "block" : "none";
  addBtn.style.display = visible ? "inline-block" : "none";
}

function saveStatusLocally(name, startTime) {
  localStorage.setItem("banhoStatus", JSON.stringify({ name, startTime }));
}

function clearLocalStatus() {
  localStorage.removeItem("banhoStatus");
}

function loadStatus() {
  const data = JSON.parse(localStorage.getItem("banhoStatus"));
  if (!data) {
    setInputVisibility(true);
    return;
  }

  const now = Date.now();
  const startTime = new Date(data.startTime);
  const diffMs = now - startTime.getTime();

  if (diffMs >= 30 * 60 * 1000) {
    // Expirado
    clearLocalStatus();
    setInputVisibility(true);
    return;
  }

  const end = new Date(startTime.getTime() + 10 * 60 * 1000); // Previsão
  statusText.innerText = `🚿 ${data.name} está no banho desde: ${startTime.toLocaleTimeString()} (Previsão: ${end.toLocaleTimeString()})`;
  statusArea.classList.remove("status-hidden");
  setInputVisibility(false);
  updateCountdown(end);

  timerInterval = setInterval(() => updateCountdown(end), 1000);
  timeoutRemove = setTimeout(() => removeStatus(), 30 * 60 * 1000 - diffMs);
}

addBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  if (name === "") {
    alert("Digite um nome antes de marcar como ocupado.");
    return;
  }

  const start = new Date();
  const end = new Date(start.getTime() + 10 * 60 * 1000);

  statusText.innerText = `🚿 ${name} está no banho desde: ${start.toLocaleTimeString()} (Previsão: ${end.toLocaleTimeString()})`;
  statusArea.classList.remove("status-hidden");
  setInputVisibility(false);

  updateCountdown(end);
  timerInterval = setInterval(() => updateCountdown(end), 1000);
  timeoutRemove = setTimeout(() => removeStatus(), 30 * 60 * 1000);

  saveStatusLocally(name, start);
  nameInput.value = "";
});

removeBtn.addEventListener("click", removeStatus);

function updateCountdown(endTime) {
  const now = new Date();
  const remaining = Math.max(0, endTime - now);
  const min = Math.floor(remaining / 1000 / 60);
  const sec = Math.floor((remaining / 1000) % 60);
  timerText.innerText = `Tempo restante: ${min}m ${sec}s`;
}

function removeStatus() {
  clearInterval(timerInterval);
  clearTimeout(timeoutRemove);
  statusArea.classList.add("status-hidden");
  statusText.innerText = "";
  timerText.innerText = "";
  clearLocalStatus();
  setInputVisibility(true);
}

window.onload = loadStatus;
