// 1. Переключение темы (сохраняется в браузере)
var root = document.documentElement;
try {
  var savedTheme = localStorage.getItem("theme");
  if (savedTheme) root.setAttribute("data-theme", savedTheme);
} catch (e) {}

document.getElementById("themeBtn").addEventListener("click", function () {
  var isDark = root.getAttribute("data-theme") === "dark" ||
    (!root.getAttribute("data-theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  var next = isDark ? "light" : "dark";
  root.setAttribute("data-theme", next);
  try { localStorage.setItem("theme", next); } catch (e) {}
});

// 2. Демонстрация CI/CD pipeline
var stageEls = document.querySelectorAll("#stages li");
var statusEl = document.getElementById("pipelineStatus");
var runBtn = document.getElementById("runBtn");
var breakBox = document.getElementById("breakCode");

function wait(ms) {
  return new Promise(function (resolve) { setTimeout(resolve, ms); });
}

function setStatus(text, kind) {
  statusEl.textContent = text;
  statusEl.className = kind || "";
}

async function runPipeline() {
  runBtn.disabled = true;
  stageEls.forEach(function (el) { el.className = ""; });
  setStatus("Pipeline запущен…");

  for (var i = 0; i < stageEls.length; i++) {
    var el = stageEls[i];
    el.classList.add("running");
    await wait(900);
    el.classList.remove("running");

    if (el.dataset.stage === "check" && breakBox.checked) {
      el.classList.add("fail");
      for (var j = i + 1; j < stageEls.length; j++) stageEls[j].classList.add("skipped");
      setStatus("Проверка не пройдена: публикация остановлена, на сайте осталась прошлая рабочая версия.", "bad");
      runBtn.disabled = false;
      return;
    }
    el.classList.add("ok");
  }
  setStatus("Все этапы пройдены: новая версия сайта опубликована.", "ok");
  runBtn.disabled = false;
}
runBtn.addEventListener("click", runPipeline);

// 3. Фильтр навыков
var chips = document.querySelectorAll(".chip");
var skills = document.querySelectorAll("#skillList li");
chips.forEach(function (chip) {
  chip.addEventListener("click", function () {
    chips.forEach(function (c) { c.classList.remove("active"); });
    chip.classList.add("active");
    var f = chip.dataset.filter;
    skills.forEach(function (li) {
      li.hidden = f !== "all" && li.dataset.cat !== f;
    });
  });
});

// 4. Копирование email
var copyBtn = document.getElementById("copyBtn");
copyBtn.addEventListener("click", function () {
  var email = document.getElementById("mailText").textContent;
  var done = function () {
    copyBtn.textContent = "Скопировано";
    setTimeout(function () { copyBtn.textContent = "Скопировать email"; }, 1800);
  };
  if (navigator.clipboard) {
    navigator.clipboard.writeText(email).then(done, function () { window.prompt("Скопируй email:", email); });
  } else {
    window.prompt("Скопируй email:", email);
  }
});
