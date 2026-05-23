const APP_NAME = "司書さんと覚える日本十進分類";
const STORAGE_KEY = "ndcQuizRecordsV1";
const QUIZ_LENGTH = 10;
const QUESTION_SECONDS = 10;
const MAX_MISTAKES = 20;
const NDC_DIGIT_OPTIONS = ["any", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const AUDIO = {
  pon: "pon.mp3",
  modeSelect: "mode_select.mp3",
  training: "training.mp3",
  ok: "ok.mp3",
  ng: "ng.mp3",
  questions: Array.from({ length: QUIZ_LENGTH }, (_, index) => `q${index + 1}.mp3`),
  results: {
    low: "result_0-2.mp3",
    mid: "result_3-5.mp3",
    high: "result_6-8.mp3",
    perfect: "result_9-10.mp3",
  },
};

const app = document.querySelector("#app");
const ndcDrumScrollTimers = new Map();

const state = {
  ndc: [],
  view: "home",
  mode: "quiz",
  direction: "codeToSubject",
  division: "secondary",
  selectedClasses: new Set(),
  ndcFilters: ["any", "any", "any"],
  quiz: null,
  timerId: null,
  remaining: QUESTION_SECONDS,
  audioChannels: {},
};

const defaultRecords = {
  quiz: {
    plays: 0,
    correct: 0,
    total: 0,
    perfects: 0,
  },
  training: {
    plays: 0,
    byClass: Object.fromEntries(Array.from({ length: 10 }, (_, index) => [String(index), 0])),
  },
  mistakes: [],
};

function readRecords() {
  try {
    return mergeRecords(JSON.parse(localStorage.getItem(STORAGE_KEY)) || {});
  } catch {
    return structuredClone(defaultRecords);
  }
}

function mergeRecords(records) {
  return {
    quiz: { ...defaultRecords.quiz, ...(records.quiz || {}) },
    training: {
      plays: records.training?.plays || 0,
      byClass: { ...defaultRecords.training.byClass, ...(records.training?.byClass || {}) },
    },
    mistakes: Array.isArray(records.mistakes) ? records.mistakes.slice(0, MAX_MISTAKES) : [],
  };
}

function writeRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function playSound(src, channel = "se") {
  if (!src) return;
  const current = state.audioChannels[channel];
  if (current) {
    current.pause();
    current.currentTime = 0;
  }
  const audio = new Audio(src);
  state.audioChannels[channel] = audio;
  audio.play().catch(() => {});
}

function playButtonSound() {
  if (state.view !== "quiz") playSound(AUDIO.pon, "se");
}

async function init() {
  try {
    const response = await fetch("ndc.json");
    state.ndc = await response.json();
  } catch {
    app.innerHTML = `<section class="screen"><h1 class="section-title">NDCデータを読み込めませんでした</h1></section>`;
    return;
  }
  renderHome();
}

function setView(view) {
  clearQuestionTimer();
  state.view = view;
  window.scrollTo({ top: 0, behavior: "instant" });
}

function renderHome() {
  setView("home");
  app.innerHTML = `
    <section class="screen home">
      <div class="brand">
        <img class="logo-slot" src="logo.png" alt="${APP_NAME}ロゴ">
        <h1 class="title">${APP_NAME}</h1>
      </div>
      <img class="hero-character" src="quiz_chara_1.png" alt="">
      <div class="menu-stack home-menu">
        <button class="soft-button" data-action="quiz-options">クイズモード</button>
        <button class="soft-button" data-action="training-options">トレーニングモード</button>
        <div class="home-action-row">
          <button class="soft-button" data-action="records">これまでの記録</button>
          <button class="soft-button" data-action="ndc-lookup">NDCを確認</button>
        </div>
        <div class="home-credit" aria-label="クレジット">
          <span>音声：効果音ラボ</span>
          <span>NDC：日本図書館協会</span>
          <span>作成：やわらか図書館学</span>
          <span>画像・コーディングにAIを使用</span>
        </div>
      </div>
    </section>
  `;
  const logo = app.querySelector(".logo-slot");
  logo.addEventListener("load", () => logo.classList.add("is-visible"), { once: true });
}

function renderOptions(mode) {
  const isEnteringOptions = state.view !== `${mode}-options`;
  setView(`${mode}-options`);
  state.mode = mode;
  if (isEnteringOptions) playSound(AUDIO.modeSelect, "voice");
  const isTraining = mode === "training";
  app.innerHTML = `
    <section class="screen">
      <div class="top-bar">
        <h1 class="section-title">${isTraining ? "トレーニング" : "クイズ"}設定</h1>
        <button class="soft-button small ghost" data-action="home">戻る</button>
      </div>
      <div class="panel">
        <h2>出題スタイル</h2>
        <div class="segmented" data-option-group="direction">
          <button class="option-button ${state.direction === "codeToSubject" ? "is-selected" : ""}" data-direction="codeToSubject">NDC→主題</button>
          <button class="option-button ${state.direction === "subjectToCode" ? "is-selected" : ""}" data-direction="subjectToCode">主題→NDC</button>
        </div>
      </div>
      <div class="panel">
        <h2>区分</h2>
        <div class="segmented" data-option-group="division">
          <button class="option-button ${state.division === "secondary" ? "is-selected" : ""}" data-division="secondary">二次区分</button>
          <button class="option-button ${state.division === "tertiary" ? "is-selected" : ""}" data-division="tertiary">三次区分</button>
        </div>
      </div>
      ${isTraining ? renderClassSelector() : ""}
      <div class="menu-stack">
        ${isTraining ? `<button class="soft-button ghost" data-action="mistakes">これまでに間違えた問題</button>` : ""}
        <button class="soft-button primary" data-action="${isTraining ? "start-training" : "start-quiz"}">スタート</button>
      </div>
    </section>
  `;
}

function renderClassSelector() {
  return `
    <div class="panel">
      <h2>出題範囲</h2>
      <div class="range-grid">
        ${Array.from({ length: 10 }, (_, index) => {
          const key = String(index);
          return `<button class="class-toggle ${state.selectedClasses.has(key) ? "is-selected" : ""}" data-class="${key}">${key}類</button>`;
        }).join("")}
      </div>
    </div>
  `;
}

function startQuiz(mode) {
  const pool = getPool();
  if (pool.length < 4) {
    showNotice("選べるNDCが少なすぎます。出題範囲を広げてください。", () => renderOptions(mode));
    return;
  }

  state.mode = mode;
  state.quiz = {
    questions: mode === "quiz" ? sample(pool, Math.min(QUIZ_LENGTH, pool.length)) : [],
    current: 0,
    correct: 0,
    answered: false,
    activeItem: null,
    pool,
    startedAt: Date.now(),
  };

  if (mode === "training") {
    const records = readRecords();
    records.training.plays += 1;
    for (const classKey of state.selectedClasses) records.training.byClass[classKey] += 1;
    writeRecords(records);
  }

  nextQuestion();
}

function getPool() {
  return state.ndc.filter((item) => {
    const divisionOk = state.division === "tertiary" || item.ndc.endsWith("0");
    const classOk = state.mode !== "training" || state.selectedClasses.has(item.ndc[0]);
    return divisionOk && classOk;
  });
}

function nextQuestion() {
  clearQuestionTimer();
  state.view = "quiz";
  if (state.mode === "quiz" && state.quiz.answered) {
    state.quiz.current += 1;
  }
  if (state.mode === "quiz" && state.quiz.current >= state.quiz.questions.length) {
    finishQuiz();
    return;
  }
  state.quiz.answered = false;
  state.quiz.selectedAnswer = null;
  state.quiz.activeItem = state.mode === "quiz"
    ? state.quiz.questions[state.quiz.current]
    : sample(state.quiz.pool, 1)[0];
  state.quiz.activeAnswers = makeAnswers(state.quiz.activeItem);
  state.remaining = QUESTION_SECONDS;
  renderQuestion();
  playQuestionSound();
  startQuestionTimer();
}

function playQuestionSound() {
  if (state.mode === "training") {
    playSound(AUDIO.training, "voice");
    return;
  }
  playSound(AUDIO.questions[state.quiz.current], "voice");
}

function renderQuestion(feedback = "") {
  const questionNumber = state.mode === "quiz" ? `${state.quiz.current + 1}/${QUIZ_LENGTH}` : `正解 ${state.quiz.correct}`;
  const item = state.quiz.activeItem;
  const answers = state.quiz.activeAnswers;
  const question = state.direction === "codeToSubject" ? item.ndc : item.subject;
  const questionClass = state.direction === "codeToSubject" ? "code-question" : "subject-question";
  const kicker = state.direction === "codeToSubject" ? "このNDCの主題は？" : "この主題のNDCは？";
  const character = feedback === "correct" ? "quiz_chara_ok.png" : feedback === "wrong" ? "quiz_chara_ng.png" : `quiz_chara_${randomInt(1, 4)}.png`;

  app.innerHTML = `
    <section class="screen quiz-screen">
      <div class="quiz-meta">
        <span>${state.mode === "quiz" ? "クイズ" : "トレーニング"}</span>
        <span>${questionNumber}</span>
      </div>
      <div class="timer-track" aria-label="残り時間">
        <div class="timer-fill" style="width: ${(state.remaining / QUESTION_SECONDS) * 100}%"></div>
      </div>
      <div class="question-card">
        <div class="question-kicker">${kicker}</div>
        <div class="question-text ${questionClass}">${escapeHtml(question)}</div>
      </div>
      <div class="answer-grid">
        ${answers.map((answer) => {
          const value = state.direction === "codeToSubject" ? answer.subject : answer.ndc;
          const isCorrectAnswer = state.quiz.answered && answer.ndc === item.ndc;
          const isWrongSelection = state.quiz.answered && state.quiz.selectedAnswer === answer.ndc && answer.ndc !== item.ndc;
          const className = isCorrectAnswer ? " correct" : isWrongSelection ? " wrong" : "";
          return `<button class="answer-button${className}" data-answer="${answer.ndc}" ${state.quiz.answered ? "disabled" : ""}>${escapeHtml(value)}</button>`;
        }).join("")}
      </div>
      <img class="quiz-character" src="${character}" alt="">
      <div class="button-row">
        <button class="soft-button small ghost" data-action="${state.mode === "quiz" ? "quit-quiz" : "training-options"}">やめる</button>
        ${state.quiz.answered ? `<button class="soft-button small primary" data-action="next-question">次へ</button>` : ""}
      </div>
    </section>
  `;
}

function makeAnswers(correctItem) {
  const others = state.quiz.pool.filter((item) => item.ndc !== correctItem.ndc);
  return shuffle([correctItem, ...sample(others, 3)]);
}

function answerQuestion(answerNdc, timedOut = false, floatPoint = null) {
  if (state.quiz.answered) return;
  clearQuestionTimer();
  const item = state.quiz.activeItem;
  const isCorrect = !timedOut && answerNdc === item.ndc;
  state.quiz.answered = true;
  state.quiz.selectedAnswer = answerNdc;
  if (isCorrect) {
    state.quiz.correct += 1;
  } else {
    saveMistake(item);
  }
  renderQuestion(isCorrect ? "correct" : "wrong");
  if (floatPoint) showAnswerFloat(isCorrect ? "OK" : "NG", isCorrect, floatPoint);
  playSound(isCorrect ? AUDIO.ok : AUDIO.ng, "voice");
}

function showAnswerFloat(text, isCorrect, point) {
  const screen = app.querySelector(".quiz-screen");
  if (!screen) return;
  const marker = document.createElement("div");
  marker.className = `answer-float ${isCorrect ? "ok" : "ng"}`;
  marker.textContent = text;
  marker.style.left = `${point.x}px`;
  marker.style.top = `${point.y}px`;
  screen.append(marker);
  marker.addEventListener("animationend", () => marker.remove(), { once: true });
}

function finishQuiz() {
  clearQuestionTimer();
  state.view = "result";
  const score = state.quiz.correct;
  const records = readRecords();
  records.quiz.plays += 1;
  records.quiz.correct += score;
  records.quiz.total += QUIZ_LENGTH;
  if (score === QUIZ_LENGTH) records.quiz.perfects += 1;
  writeRecords(records);

  const resultKey = score <= 2
    ? "low"
    : score <= 5
      ? "mid"
      : score <= 8
        ? "high"
        : "perfect";
  const resultImage = {
    low: "quiz_result_0-2.png",
    mid: "quiz_result_3-5.png",
    high: "quiz_result_6-8.png",
    perfect: "quiz_result_9-10.png",
  }[resultKey];

  app.innerHTML = `
    <section class="screen result-screen">
      <h1 class="section-title">結果</h1>
      <img class="result-art" src="${resultImage}" alt="">
      <div class="score">${score}/${QUIZ_LENGTH}</div>
      <p class="speech">${resultSpeech(score)}</p>
      <div class="menu-stack">
        <button class="soft-button primary" data-action="share-x">Xにポスト</button>
        <button class="soft-button ghost" data-action="home">スタート画面へ</button>
      </div>
    </section>
  `;
  playSound(AUDIO.results[resultKey], "voice");
}

function resultSpeech(score) {
  const speeches = [
    "はじめの一歩です。ゆっくり覚えていきましょう♪",
    "ちゃんとできています。少しずつ増やしていきましょう♪",
    "また挑戦してみましょう。少しずつ覚えれば大丈夫です♪",
    "コツをつかめば、もっと正解できますよ♪",
    "いい調子です！次は半分超えをめざしましょう！",
    "大丈夫です。次はもっと正解できますよ♪",
    "かなり覚えられています！次はもっと上を目指せますよ♪",
    "すごいです！しっかり身についてきましたね♪",
    "すごいです！たくさん覚えられましたね♪",
    "すばらしいです！満点までもうひと息です♪",
    "満点です！素晴らしいです♪",
  ];
  return speeches[score] || speeches[0];
}

function shareToX() {
  const score = state.quiz?.correct || 0;
  const directionLabel = state.direction === "codeToSubject" ? "NDC→主題" : "主題→NDC";
  const divisionLabel = state.division === "secondary" ? "二次区分" : "三次区分";
  const text = `${APP_NAME}のクイズモード（${directionLabel} / ${divisionLabel}）で${QUIZ_LENGTH}問中${score}問正解しました！\n${APP_NAME}`;
  const url = new URL("https://twitter.com/intent/tweet");
  url.searchParams.set("text", text);
  url.searchParams.set("url", location.origin + location.pathname);
  window.open(url.toString(), "_blank", "noopener,noreferrer");
}

function renderRecords() {
  setView("records");
  const records = readRecords();
  const rate = records.quiz.total ? Math.round((records.quiz.correct / records.quiz.total) * 100) : 0;
  app.innerHTML = `
    <section class="screen scroll-screen records-screen">
      <div class="top-bar">
        <h1 class="section-title">これまでの記録</h1>
        <button class="soft-button small ghost" data-action="home">戻る</button>
      </div>
      <div class="panel">
        <h2>クイズモード</h2>
        <div class="stats-grid">
          ${statCard("プレイ回数", `${records.quiz.plays}回`)}
          ${statCard("正解率", `${rate}%`)}
          ${statCard("10点を取った回数", `${records.quiz.perfects}回`)}
        </div>
      </div>
      <div class="panel">
        <h2>トレーニングモード</h2>
        <div class="stats-grid">
          ${statCard("プレイ回数", `${records.training.plays}回`)}
        </div>
        <div class="stats-grid">
          ${Array.from({ length: 10 }, (_, index) => statCard(`${index}類`, `${records.training.byClass[index]}回`)).join("")}
        </div>
      </div>
    </section>
  `;
}

function statCard(label, value) {
  return `<div class="stat-card"><div class="stat-label">${label}</div><div class="stat-value">${value}</div></div>`;
}

function renderNdcLookup() {
  setView("ndc-lookup");
  const filtered = getFilteredNdc();
  app.innerHTML = `
    <section class="screen scroll-screen ndc-lookup-screen">
      <div class="top-bar">
        <h1 class="section-title">NDCを確認</h1>
        <button class="soft-button small ghost" data-action="home">戻る</button>
      </div>
      <div class="ndc-filter-panel">
        <div class="ndc-drum-grid">
          ${state.ndcFilters.map((value, index) => renderNdcDrum(index, value)).join("")}
        </div>
      </div>
      <div class="ndc-result-heading">
        <span>分類番号</span>
        <span class="ndc-result-count">該当 ${filtered.length}件</span>
      </div>
      <div class="ndc-table-wrap">
        ${renderNdcTable(filtered)}
      </div>
    </section>
  `;
  requestAnimationFrame(syncNdcDrums);
}

function renderNdcDrum(index, value) {
  const labels = ["百の位", "十の位", "一の位"];
  return `
    <div class="ndc-drum-control">
      <div class="ndc-drum" aria-label="${labels[index]}">
        <div class="ndc-drum-highlight" aria-hidden="true"></div>
        <div class="ndc-drum-options" data-ndc-digit="${index}">
          ${NDC_DIGIT_OPTIONS.map((option) => `
            <button
              type="button"
              class="ndc-drum-option ${option === value ? "is-selected" : ""}"
              data-ndc-digit="${index}"
              data-ndc-choice="${option}"
              aria-pressed="${option === value ? "true" : "false"}"
            >${option}</button>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

function getFilteredNdc() {
  return state.ndc.filter((item) => {
    return state.ndcFilters.every((digit, index) => digit === "any" || item.ndc[index] === digit);
  });
}

function updateNdcLookup() {
  const screen = app.querySelector(".ndc-lookup-screen");
  if (!screen) return;
  for (const [index, value] of state.ndcFilters.entries()) {
    const label = screen.querySelector(`[data-ndc-value="${index}"]`);
    if (label) label.textContent = value;
  }
  const filtered = getFilteredNdc();
  const count = screen.querySelector(".ndc-result-count");
  const tableWrap = screen.querySelector(".ndc-table-wrap");
  if (count) count.textContent = `該当 ${filtered.length}件`;
  if (tableWrap) tableWrap.innerHTML = renderNdcTable(filtered);
}

function syncNdcDrums() {
  app.querySelectorAll(".ndc-drum-options").forEach((drum) => syncNdcDrumElement(drum));
}

function syncNdcDrum(digitIndex) {
  const drum = app.querySelector(`.ndc-drum-options[data-ndc-digit="${digitIndex}"]`);
  if (drum) syncNdcDrumElement(drum);
}

function syncNdcDrumElement(drum) {
  const digitIndex = Number(drum.dataset.ndcDigit);
  const value = state.ndcFilters[digitIndex];
  const selectedOption = drum.querySelector(`[data-ndc-choice="${value}"]`);
  updateNdcDrumSelection(digitIndex);
  if (!selectedOption) return;
  drum.scrollTop = selectedOption.offsetTop - (drum.clientHeight - selectedOption.clientHeight) / 2;
}

function updateNdcDrumSelection(digitIndex) {
  const value = state.ndcFilters[digitIndex];
  const valueLabel = app.querySelector(`[data-ndc-value="${digitIndex}"]`);
  if (valueLabel) valueLabel.textContent = value;
  app.querySelectorAll(`.ndc-drum-option[data-ndc-digit="${digitIndex}"]`).forEach((option) => {
    const isSelected = option.dataset.ndcChoice === value;
    option.classList.toggle("is-selected", isSelected);
    option.setAttribute("aria-pressed", String(isSelected));
  });
}

function getCenteredDrumChoice(drum) {
  const options = Array.from(drum.querySelectorAll(".ndc-drum-option"));
  const center = drum.scrollTop + drum.clientHeight / 2;
  let closestOption = options[0];
  let closestDistance = Number.POSITIVE_INFINITY;
  for (const option of options) {
    const optionCenter = option.offsetTop + option.offsetHeight / 2;
    const distance = Math.abs(optionCenter - center);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestOption = option;
    }
  }
  return closestOption?.dataset.ndcChoice || "any";
}

function handleNdcDrumScroll(drum) {
  const digitIndex = Number(drum.dataset.ndcDigit);
  window.clearTimeout(ndcDrumScrollTimers.get(digitIndex));
  ndcDrumScrollTimers.set(digitIndex, window.setTimeout(() => {
    const nextValue = getCenteredDrumChoice(drum);
    if (state.ndcFilters[digitIndex] !== nextValue) {
      state.ndcFilters[digitIndex] = nextValue;
      updateNdcLookup();
      updateNdcDrumSelection(digitIndex);
    }
  }, 100));
}

function renderNdcTable(items) {
  if (!items.length) return `<div class="empty">該当する分類はありません</div>`;
  return `
    <div class="ndc-table" role="table" aria-label="NDC分類表">
      <div class="ndc-table-row ndc-table-head" role="row">
        <div role="columnheader">分類番号</div>
        <div role="columnheader">分類の内容</div>
      </div>
      ${items.map((item) => `
        <div class="ndc-table-row" role="row">
          <div class="ndc-code-cell" role="cell">${escapeHtml(item.ndc)}</div>
          <div role="cell">${escapeHtml(item.subject)}</div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderMistakes() {
  setView("mistakes");
  const records = readRecords();
  app.innerHTML = `
    <section class="screen scroll-screen mistakes-screen">
      <div class="top-bar">
        <h1 class="section-title">間違えた問題</h1>
        <button class="soft-button small ghost" data-action="training-options">戻る</button>
      </div>
      <div class="mistake-list">
        ${records.mistakes.length ? records.mistakes.map((item) => `
          <div class="mistake-item">
            <div><span class="mistake-code">${item.ndc}</span> ${escapeHtml(item.subject)}</div>
            <div class="stat-label">${item.direction === "codeToSubject" ? "NDC→主題" : "主題→NDC"} / ${item.division === "secondary" ? "二次区分" : "三次区分"}</div>
          </div>
        `).join("") : `<div class="empty">まだ間違えた問題はありません</div>`}
      </div>
    </section>
  `;
}

function saveMistake(item) {
  const records = readRecords();
  records.mistakes = [
    {
      ndc: item.ndc,
      subject: item.subject,
      direction: state.direction,
      division: state.division,
      at: Date.now(),
    },
    ...records.mistakes.filter((mistake) => mistake.ndc !== item.ndc || mistake.direction !== state.direction),
  ].slice(0, MAX_MISTAKES);
  writeRecords(records);
}

function showNotice(message, back) {
  app.innerHTML = `
    <section class="screen">
      <h1 class="section-title">お知らせ</h1>
      <p class="speech">${escapeHtml(message)}</p>
      <button class="soft-button primary" data-action="notice-back">戻る</button>
    </section>
  `;
  app.querySelector("[data-action='notice-back']").addEventListener("click", back);
}

function startQuestionTimer() {
  const started = Date.now();
  state.timerId = window.setInterval(() => {
    const elapsed = (Date.now() - started) / 1000;
    state.remaining = Math.max(0, QUESTION_SECONDS - elapsed);
    const fill = app.querySelector(".timer-fill");
    if (fill) fill.style.width = `${(state.remaining / QUESTION_SECONDS) * 100}%`;
    if (state.remaining <= 0) answerQuestion(null, true);
  }, 200);
}

function clearQuestionTimer() {
  if (state.timerId) window.clearInterval(state.timerId);
  state.timerId = null;
}

function sample(items, count) {
  return shuffle(items).slice(0, count);
}

function shuffle(items) {
  const copied = [...items];
  for (let index = copied.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copied[index], copied[swapIndex]] = [copied[swapIndex], copied[index]];
  }
  return copied;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

app.addEventListener("click", (event) => {
  const target = event.target.closest("button");
  if (!target) return;

  playButtonSound();

  const action = target.dataset.action;
  if (target.dataset.direction) {
    state.direction = target.dataset.direction;
    renderOptions(state.mode);
    return;
  }
  if (target.dataset.division) {
    state.division = target.dataset.division;
    renderOptions(state.mode);
    return;
  }
  if (target.dataset.class) {
    const classKey = target.dataset.class;
    if (state.selectedClasses.has(classKey)) {
      state.selectedClasses.delete(classKey);
    } else {
      state.selectedClasses.add(classKey);
    }
    renderOptions("training");
    return;
  }
  if (target.dataset.ndcChoice) {
    const digitIndex = Number(target.dataset.ndcDigit);
    state.ndcFilters[digitIndex] = target.dataset.ndcChoice;
    updateNdcLookup();
    syncNdcDrum(digitIndex);
    return;
  }
  if (target.dataset.answer) {
    answerQuestion(target.dataset.answer, false, {
      x: event.clientX,
      y: event.clientY,
    });
    return;
  }

  if (action === "home") renderHome();
  if (action === "quiz-options") renderOptions("quiz");
  if (action === "training-options") renderOptions("training");
  if (action === "records") renderRecords();
  if (action === "ndc-lookup") renderNdcLookup();
  if (action === "mistakes") renderMistakes();
  if (action === "start-quiz") startQuiz("quiz");
  if (action === "start-training") startQuiz("training");
  if (action === "next-question") nextQuestion();
  if (action === "quit-quiz") renderHome();
  if (action === "share-x") shareToX();
});

app.addEventListener("scroll", (event) => {
  const target = event.target;
  if (!(target instanceof Element) || !target.matches(".ndc-drum-options")) return;
  handleNdcDrumScroll(target);
}, true);

init();
