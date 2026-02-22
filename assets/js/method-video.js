document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".video-shell").forEach((shell) => {
    const video = shell.querySelector("video");
    const btn = shell.querySelector(".video-play");
    if (!video || !btn) return;

    const setState = () => {
      if (!video.paused && !video.ended) shell.classList.add("is-playing");
      else shell.classList.remove("is-playing");
    };

    btn.addEventListener("click", async () => {
      try {
        await video.play();
      } catch (_) {
        // If autoplay/play is blocked, the native controls are still there.
      }
      setState();
    });

    video.addEventListener("play", setState);
    video.addEventListener("pause", setState);
    video.addEventListener("ended", setState);

    // initial
    setState();
  });
});
