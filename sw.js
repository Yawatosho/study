const CACHE_NAME = "ndc-quiz-v6-help";

const APP_FILES = [
  "./",
  "./index.html",
  "./app.js?v=20260720-help",
  "./style.css?v=20260720-help",
  "./manifest.webmanifest",
  "./ndc.json",
  "./favicon.ico",
  "./apple-touch-icon.png",
  "./icon-192.png",
  "./icon-512.png",
  "./logo.webp",
  "./ndc.webp",
  "./ogp.png",
  "./record.webp",
  "./training.webp",
  "./quiz_chara_1.webp",
  "./quiz_chara_2.webp",
  "./quiz_chara_3.webp",
  "./quiz_chara_4.webp",
  "./quiz_chara_5.webp",
  "./quiz_chara_6.webp",
  "./quiz_chara_ok.webp",
  "./quiz_chara_ng.webp",
  "./quiz_result_0-2.webp",
  "./quiz_result_3-5.webp",
  "./quiz_result_6-8.webp",
  "./quiz_result_9.webp",
  "./quiz_result_10.webp",
  "./quiz_result_hard_0-2.webp",
  "./quiz_result_hard_3-5.webp",
  "./quiz_result_hard_6-8.webp",
  "./quiz_result_hard_9.webp",
  "./quiz_result_hard_10.webp",
  "./pon.mp3",
  "./mode_select.mp3",
  "./training.mp3",
  "./ok.mp3",
  "./ok_3.mp3",
  "./ok_6.mp3",
  "./ok_9.mp3",
  "./ng.mp3",
  "./q1.mp3",
  "./q2.mp3",
  "./q3.mp3",
  "./q4.mp3",
  "./q5.mp3",
  "./q6.mp3",
  "./q7.mp3",
  "./q8.mp3",
  "./q9.mp3",
  "./q10.mp3",
  "./result_0-2.mp3",
  "./result_3-5.mp3",
  "./result_6-8.mp3",
  "./result_9-10.mp3"
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
