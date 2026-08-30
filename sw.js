const CACHE_NAME = "ndc-quiz-v10-lessons-mvp18";

const APP_FILES = [
  "./",
  "./index.html",
  "./lesson_data.js?v=20260830-lessons-mvp18",
  "./app.js?v=20260830-lessons-mvp18",
  "./style.css?v=20260830-lessons-mvp18",
  "./manifest.webmanifest",
  "./ndc.json",
  "./images/favicon.ico",
  "./images/apple-touch-icon.png",
  "./images/icon-192.png",
  "./images/icon-512.png",
  "./images/logo.webp",
  "./images/lecture01.webp",
  "./images/lecture02.webp",
  "./images/lecture03.webp",
  "./images/lecture04.webp",
  "./images/ndc.webp",
  "./images/ogp.png",
  "./images/record.webp",
  "./images/training.webp",
  "./images/quiz_chara_1.webp",
  "./images/quiz_chara_2.webp",
  "./images/quiz_chara_3.webp",
  "./images/quiz_chara_4.webp",
  "./images/quiz_chara_5.webp",
  "./images/quiz_chara_6.webp",
  "./images/quiz_chara_ok.webp",
  "./images/quiz_chara_ng.webp",
  "./images/quiz_result_0-2.webp",
  "./images/quiz_result_3-5.webp",
  "./images/quiz_result_6-8.webp",
  "./images/quiz_result_9.webp",
  "./images/quiz_result_10.webp",
  "./images/quiz_result_hard_0-2.webp",
  "./images/quiz_result_hard_3-5.webp",
  "./images/quiz_result_hard_6-8.webp",
  "./images/quiz_result_hard_9.webp",
  "./images/quiz_result_hard_10.webp",
  "./audio/pon.mp3",
  "./audio/mode_select.mp3",
  "./audio/training.mp3",
  "./audio/ok.mp3",
  "./audio/ok_3.mp3",
  "./audio/ok_6.mp3",
  "./audio/ok_9.mp3",
  "./audio/ng.mp3",
  "./audio/q1.mp3",
  "./audio/q2.mp3",
  "./audio/q3.mp3",
  "./audio/q4.mp3",
  "./audio/q5.mp3",
  "./audio/q6.mp3",
  "./audio/q7.mp3",
  "./audio/q8.mp3",
  "./audio/q9.mp3",
  "./audio/q10.mp3",
  "./audio/result_0-2.mp3",
  "./audio/result_3-5.mp3",
  "./audio/result_6-8.mp3",
  "./audio/result_9-10.mp3"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(
        names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type !== "basic") return response;
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      });
    })
  );
});
