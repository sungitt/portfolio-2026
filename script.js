document.addEventListener("DOMContentLoaded", function () {
  /* ════════════════════════════════════════
     PORTFOLIO 애니메이션
  ════════════════════════════════════════ */
  var LETTERS = ["P", "O", "R", "T", "F", "O", "L", "I", "O"];
  var BRANDS = [
    { idx: 0, word: "P", down: false, overlapIndex: 0 },
    { idx: 1, word: "CLEANTOPIA", down: true, overlapIndex: 6, delay: 11 },
    { idx: 2, word: "FRIENDSDROP", down: true, overlapIndex: 8, delay: 10 },
    { idx: 3, word: "RAREBEAUTY", down: true, overlapIndex: 8, delay: 9 },
    { idx: 4, word: "·····F", down: true, overlapIndex: 5, delay: 7 },
    { idx: 5, word: "DANSON", down: true, overlapIndex: 4, delay: 4 },
    { idx: 6, word: "COLGATE", down: true, overlapIndex: 2, delay: 3 },
    { idx: 7, word: "JINS", down: true, overlapIndex: 1, delay: 2 },
    { idx: 8, word: "GOgaba", down: true, overlapIndex: 1 },
  ];
  var LETTER_GAP = 50,
    OVERLAP_ROW = 5;
  var ALIGN_FIX = {
    0: -600,
    1: -150,
    2: -300,
    3: -450,
    4: -600,
    5: -450,
    6: 0,
    7: -300,
    8: 0,
  };
  var DROP_EXTRA = 180,
    WHEEL_PER_STEP = 80,
    FILL_STEPS = 8;

  var portfolioSection = document.getElementById("portfolioSection");
  var container = document.getElementById("portfolioLine");
  var FS =
    parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--font-size-hero",
      ),
    ) || 150;

  var widthCache = {};
  function getWidth(ch) {
    if (!widthCache[ch]) {
      var p = document.createElement("span");
      p.style.cssText =
        "position:absolute;visibility:hidden;white-space:nowrap;font-family:'Pretendard',sans-serif;font-size:" +
        FS +
        "px;font-weight:900;line-height:1;letter-spacing:0;";
      p.textContent = ch;
      document.body.appendChild(p);
      widthCache[ch] = Math.ceil(p.getBoundingClientRect().width);
      document.body.removeChild(p);
    }
    return widthCache[ch];
  }

  var slots = [];
  BRANDS.forEach(function (b, index) {
    var ch = LETTERS[b.idx],
      w = getWidth(ch);
    var chars = b.word ? b.word.split([]) : [],
      numChars = Math.max(chars.length, 1);
    var slot = document.createElement("div");
    slot.className = "letter-slot";
    slot.style.width = w + "px";
    slot.style.height = FS + "px";
    slot.style.marginRight =
      index !== BRANDS.length - 1 ? LETTER_GAP + "px" : "0";
    var pL = document.createElement("span");
    pL.className = "p-letter";
    pL.textContent = ch;
    if (b.idx === 0) {
      pL.style.color = "#ff2d42";
      pL.style.opacity = "1";
    } else {
      pL.style.color = "transparent";
      pL.style.opacity = "0";
    }
    var fL = document.createElement("span");
    fL.className = "fill-letter";
    fL.textContent = ch;
    fL.style.clipPath = "inset(100% 0 0 0)";
    fL.style.opacity = "0";
    fL.style.transition = "none";
    var bCol = document.createElement("div");
    bCol.className = "brand-col";
    chars.forEach(function (c, ci) {
      var isO = ci === b.overlapIndex,
        sp = document.createElement("span");
      if (c === "·") {
        sp.className = "brand-letter";
        sp.textContent = "A";
        sp.style.visibility = "hidden";
      } else {
        sp.className = "brand-letter" + (isO ? " red" : "");
        sp.textContent = c;
      }
      bCol.appendChild(sp);
    });
    var colTop = -((numChars - OVERLAP_ROW) * FS) + (ALIGN_FIX[b.idx] || 0);
    bCol.style.top = colTop + "px";
    slot.appendChild(bCol);
    slot.appendChild(pL);
    slot.appendChild(fL);
    container.appendChild(slot);
    slots.push({
      b,
      pLetter: pL,
      fillLetter: fL,
      brandCol: bCol,
      numChars,
      colTop,
    });
  });

  var MOVING = slots.filter(function (s) {
    return s.b.down;
  });
  function calcTotalSteps() {
    var max = 0;
    MOVING.forEach(function (s) {
      var st = Math.ceil((-s.colTop + window.innerHeight + DROP_EXTRA) / FS);
      if (st > max) max = st;
    });
    return max;
  }
  var totalSteps = calcTotalSteps(),
    grandTotal = totalSteps + FILL_STEPS;
  var currentStep = 0,
    wheelAccum = 0,
    animationDone = false,
    isInsidePortfolio = true;

  function render() {
    var dp = Math.min(currentStep, totalSteps);
    MOVING.forEach(function (s) {
      var delay = s.b.delay || 0,
        eStep = Math.max(0, dp - delay),
        eTotal = totalSteps - delay;
      var colMax = Math.ceil(
        (-s.colTop + window.innerHeight + DROP_EXTRA) / FS,
      );
      var colStep = Math.round((eStep / eTotal) * colMax);
      var y = Math.min(colStep, colMax) * FS;
      s.brandCol.style.transform = "translateX(-50%) translateY(" + y + "px)";
    });
    var done = currentStep >= totalSteps;
    slots.forEach(function (s) {
      if (s.b.down) s.brandCol.style.opacity = done ? "0" : "1";
      if (s.b.idx === 0) s.pLetter.style.opacity = done ? "0" : "1";
    });
    if (done) {
      var fp = Math.min((currentStep - totalSteps) / FILL_STEPS, 1);
      var it = Math.round((1 - fp) * 100);
      slots.forEach(function (s) {
        s.fillLetter.style.opacity = "1";
        s.fillLetter.style.clipPath = "inset(" + it + "% 0 0 0)";
      });
    } else {
      slots.forEach(function (s) {
        s.fillLetter.style.opacity = "0";
        s.fillLetter.style.clipPath = "inset(100% 0 0 0)";
      });
    }
  }
  render();

  function checkZone() {
    var r = portfolioSection.getBoundingClientRect();
    isInsidePortfolio = r.top <= 0 && r.bottom > window.innerHeight * 0.3;
  }
  window.addEventListener("scroll", checkZone);
  checkZone();
  window.addEventListener(
    "wheel",
    function (e) {
      checkZone();
      if (!isInsidePortfolio || animationDone) return;
      e.preventDefault();
      wheelAccum += e.deltaY;
      while (wheelAccum >= WHEEL_PER_STEP && currentStep < grandTotal) {
        wheelAccum -= WHEEL_PER_STEP;
        currentStep++;
        render();
      }
      while (wheelAccum <= -WHEEL_PER_STEP && currentStep > 0) {
        wheelAccum += WHEEL_PER_STEP;
        currentStep--;
        render();
      }
      if (currentStep >= grandTotal) animationDone = true;
      if (currentStep < grandTotal) animationDone = false;
    },
    { passive: false },
  );
  window.addEventListener("resize", function () {
    totalSteps = calcTotalSteps();
    grandTotal = totalSteps + FILL_STEPS;
    render();
  });

  /* ════════════════════════════════════════
     ABOUT 낙하
  ════════════════════════════════════════ */
  var resetDrop = (function () {
    var stage = document.getElementById("tagsStage");
    if (!stage) return function () {};
    var ITEMS = [
      { type: "text", text: "CLEANTOPIA", fontSize: 32, color: "#007BFF" },
      {
        type: "image",
        src: "images/c3Dlogo.png",
        width: 120,
        height: 110,
        rotate: 10,
      },
      { type: "text", text: "FRIENDSDROP", fontSize: 28, color: "#2c2938" },
      { type: "text", text: "RAREBEAUTY", fontSize: 30, color: "#E8B1BD" },
      { type: "text", text: "DANSON", fontSize: 36, color: "#555555" },
      { type: "text", text: "COLGATE", fontSize: 28, color: "#A81723" },
      {
        type: "image",
        src: "images/colgate logo.png",
        width: 100,
        height: 55,
        rotate: -15,
      },
      { type: "text", text: "JINS", fontSize: 40, color: "#18343F" },
      {
        type: "image",
        src: "images/jins logo.png",
        width: 100,
        height: 65,
        rotate: 13,
      },
      { type: "text", text: "GOgaba", fontSize: 26, color: "#FE7901" },
      {
        type: "image",
        src: "images/gogaba.png",
        width: 130,
        height: 90,
        rotate: 13,
      },
      { type: "text", text: "CREATIVITY", fontSize: 24, color: "#121212" },
      {
        type: "image",
        src: "images/phg2.png",
        width: 100,
        height: 65,
        rotate: -13,
      },
      {
        type: "image",
        src: "images/Fdrop.png",
        width: 110,
        height: 80,
        rotate: -13,
      },
    ];
    var GRAVITY = 0.555,
      BOUNCE = 0.42,
      FRICTION = 0.85,
      DROP_INTERVAL = 150;
    var SW = stage.offsetWidth || window.innerWidth - 200,
      SH = stage.offsetHeight || 700,
      FLOOR = SH - 80;
    var particles = ITEMS.map(function (item, i) {
      var el = document.createElement("div");
      el.className = "drop-item";
      if (item.type === "text") {
        el.classList.add("type-text");
        el.textContent = item.text;
        el.style.fontSize = item.fontSize + "px";
        el.style.color = item.color;
      } else {
        el.classList.add("type-image");
        var img = document.createElement("img");
        img.src = item.src;
        img.alt = "";
        img.style.width = item.width + "px";
        img.style.height = item.height + "px";
        img.style.display = "block";
        el.appendChild(img);
      }
      var rotate =
        item.rotate !== undefined ? item.rotate : (Math.random() - 0.5) * 30;
      stage.appendChild(el);
      var tw =
        el.offsetWidth ||
        (item.type === "text"
          ? item.text.length * item.fontSize * 0.6
          : item.width);
      var th =
        el.offsetHeight ||
        (item.type === "image" ? item.height : item.fontSize + 8);
      return {
        el,
        tw,
        th,
        rotate,
        item,
        x: 0,
        y: 0,
        vy: 0,
        vx: 0,
        active: false,
        landed: false,
        bounceCount: 0,
        finalY: FLOOR,
        dropDelay: i * DROP_INTERVAL,
      };
    });
    var landed = [],
      startTime = null,
      rafId = null;
    function initParticles() {
      landed = [];
      particles.forEach(function (p, i) {
        p.x = Math.random() * Math.max(10, SW - p.tw);
        p.y = -(p.th + 10);
        p.vy = 0;
        p.vx = (Math.random() - 0.5) * 3;
        p.active = false;
        p.landed = false;
        p.bounceCount = 0;
        p.finalY = FLOOR;
        p.dropDelay = i * DROP_INTERVAL;
        p.el.style.left = p.x + "px";
        p.el.style.top = p.y + "px";
        p.el.style.transform = "rotate(" + p.rotate + "deg)";
      });
    }
    function getFloorFor(p) {
      var floor = FLOOR;
      for (var i = 0; i < landed.length; i++) {
        var o = landed[i];
        if (o === p) continue;
        var oL = p.x + p.tw - o.x,
          oR = o.x + o.tw - p.x;
        if (oL < 10 || oR < 10) continue;
        if (o.finalY < floor) floor = o.finalY;
      }
      return floor;
    }
    function loop(ts) {
      if (!startTime) startTime = ts;
      var elapsed = ts - startTime,
        any = false;
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        if (!p.active) {
          if (elapsed >= p.dropDelay) p.active = true;
          else {
            any = true;
            continue;
          }
        }
        if (p.landed) continue;
        any = true;
        p.vy += GRAVITY;
        p.y += p.vy;
        p.x += p.vx;
        if (p.x < 0) {
          p.x = 0;
          p.vx = Math.abs(p.vx) * 0.4;
        }
        if (p.x + p.tw > SW) {
          p.x = SW - p.tw;
          p.vx = -Math.abs(p.vx) * 0.4;
        }
        var floor = getFloorFor(p);
        if (p.y + p.th >= floor) {
          p.y = floor - p.th;
          p.vy = -Math.abs(p.vy) * BOUNCE;
          p.vx *= FRICTION;
          p.bounceCount++;
          if (Math.abs(p.vy) < 1.5) {
            p.vy = 0;
            p.vx = 0;
            p.landed = true;
            p.finalY = p.y;
            landed.push(p);
          }
        }
        p.el.style.left = p.x + "px";
        p.el.style.top = p.y + "px";
        p.el.style.transform = "rotate(" + p.rotate + "deg)";
      }
      if (any) rafId = requestAnimationFrame(loop);
    }
    function startDrop() {
      if (rafId) cancelAnimationFrame(rafId);
      initParticles();
      startTime = null;
      rafId = requestAnimationFrame(loop);
    }
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            startDrop();
            obs.disconnect();
          }
        });
      },
      { threshold: 0.1 },
    );
    obs.observe(stage);
    return startDrop;
  })();

  /* ════════════════════════════════════════
     ABOUT 스킬바 애니메이션
  ════════════════════════════════════════ */
  (function () {
    var section = document.getElementById("aboutSection");
    if (!section) return;
    var triggered = false;
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !triggered) {
            triggered = true;
            section.classList.add("skills-visible");
            obs.disconnect();
          }
        });
      },
      { threshold: 0.2 },
    );
    obs.observe(section);
  })();

  /* ════════════════════════════════════════
     WEB DESING 기여도 바 애니메이션
  ════════════════════════════════════════ */
  (function () {
    var section = document.getElementById("webDesingSection");
    if (!section) return;
    var triggered = false;
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !triggered) {
            triggered = true;
            section.classList.add("contrib-visible");
            obs.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );
    obs.observe(section);
    function isVisible(el) {
      var rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    }
    function animateBars() {
      if (isVisible(section)) {
        section.classList.add("contrib-visible");
        window.removeEventListener("scroll", animateBars);
      }
    }
    window.addEventListener("scroll", animateBars);
    animateBars();
  })();

  /* ════════════════════════════════════════
     LANDING 오른쪽 자동 스크롤
  ════════════════════════════════════════ */
  (function () {
    var wrap = document.getElementById("landingAutoScroll");
    var img = document.getElementById("landingImg");
    var rightBox = wrap ? wrap.closest(".landing-right-image") : null;
    if (!wrap || !img || !rightBox) return;
    var scrollRafId = null,
      isPaused = false,
      currentY = 0,
      speed = 3;
    function startScroll() {
      if (scrollRafId) cancelAnimationFrame(scrollRafId);
      function tick() {
        if (!isPaused) {
          var containerH = rightBox.offsetHeight;
          var imgH = img.naturalHeight * (wrap.offsetWidth / img.naturalWidth);
          var maxScroll = Math.max(0, imgH - containerH);
          if (maxScroll > 0) {
            currentY += speed;
            if (currentY >= maxScroll) {
              currentY = maxScroll;
              isPaused = true;
              setTimeout(function () {
                var rewindRaf;
                function rewind() {
                  currentY -= speed * 2;
                  wrap.style.transform =
                    "translateY(-" + Math.max(0, currentY) + "px)";
                  if (currentY > 0) {
                    rewindRaf = requestAnimationFrame(rewind);
                  } else {
                    currentY = 0;
                    isPaused = false;
                  }
                }
                rewindRaf = requestAnimationFrame(rewind);
              }, 1200);
            }
            wrap.style.transform = "translateY(-" + currentY + "px)";
          }
        }
        scrollRafId = requestAnimationFrame(tick);
      }
      scrollRafId = requestAnimationFrame(tick);
    }
    rightBox.addEventListener("mouseenter", function () {
      isPaused = true;
    });
    rightBox.addEventListener("mouseleave", function () {
      isPaused = false;
    });
    if (img.complete && img.naturalWidth) {
      startScroll();
    } else {
      img.addEventListener("load", startScroll);
    }
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            if (img.complete && img.naturalWidth) startScroll();
          } else {
            if (scrollRafId) {
              cancelAnimationFrame(scrollRafId);
              scrollRafId = null;
            }
          }
        });
      },
      { threshold: 0.1 },
    );
    obs.observe(rightBox);
  })();

  /* ════════════════════════════════════════
     APP 섹션 하단 애니메이션
     - 태그: 왼쪽→오른쪽 순서대로 슥
     - 설명: opacity 0→1 페이드인
     - 이미지1: 아래→위 동시 등장
  ════════════════════════════════════════ */
  (function () {
    var bottomArea = document.querySelector(".app-bottom-area");
    if (!bottomArea) return;
    var triggered = false;

    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !triggered) {
            triggered = true;

            // 1) 태그 왼쪽→오른쪽 슥슥 (CSS transition-delay로 순서 처리)
            var tags = document.querySelectorAll(".app-deco-tag-new");
            tags.forEach(function (tag) {
              tag.classList.add("tag-visible");
            });

            // 2) 설명 텍스트 opacity 0→1 (태그 마지막 딜레이 0.45s + 여유 0.2s)
            var desc = document.getElementById("appSectionDesc");
            if (desc) {
              desc.classList.add("desc-visible");
            }

            // 3) 이미지1 아래→위 (태그와 동시)
            var img1 = document.getElementById("appImg1Wrap");
            if (img1) {
              img1.classList.add("app-float-visible");
            }

            obs.disconnect();
          }
        });
      },
      { threshold: 0.15 },
    );

    obs.observe(bottomArea);
  })();

  /* ════════════════════════════════════════
     APP 영상 opacity 0→1
  ════════════════════════════════════════ */
  (function () {
    var video = document.getElementById("appMockupVideo");
    if (!video) return;
    var triggered = false;
    function showVideo() {
      if (!triggered) {
        triggered = true;
        video.classList.add("video-visible");
      }
    }
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) showVideo();
        });
      },
      { threshold: 0.1 },
    );
    obs.observe(video);
    document
      .querySelectorAll(".nav-links a[data-target]")
      .forEach(function (link) {
        link.addEventListener("click", function () {
          if (this.getAttribute("data-target") === "appSection")
            setTimeout(showVideo, 400);
        });
      });
  })();

  /* ════════════════════════════════════════
     섹션 타이틀 슬라이드
  ════════════════════════════════════════ */
  (function () {
    var wraps = document.querySelectorAll(".section-title-wrap");
    if (!wraps.length) return;
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("title-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 },
    );
    wraps.forEach(function (w) {
      obs.observe(w);
    });
  })();

  /* ════════════════════════════════════════
     SALES 순차 등장
  ════════════════════════════════════════ */
  (function () {
    var items = document.querySelectorAll("[data-sales]");
    if (!items.length) return;
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("sales-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    items.forEach(function (item) {
      obs.observe(item);
    });
  })();

  /* ════════════════════════════════════════
     SALES 클릭 기능 + 눌리는 효과
  ════════════════════════════════════════ */
  const salesClickables = document.querySelectorAll(".sales-img-clickable");
  const salesModal = document.getElementById("salesModal");
  const salesModalImg = document.getElementById("salesModalImg");
  const salesModalClose = document.getElementById("salesModalClose");

  salesClickables.forEach((item) => {
    const target =
      item.querySelector(".sales-img-wrap") ||
      item.querySelector(".sales-browser-wrap") ||
      item;

    item.addEventListener("mousedown", () => {
      target.style.transition = "transform 0.1s ease, box-shadow 0.1s ease";
      target.style.transform = "translateY(-1px) scale(0.985)";
      target.style.boxShadow = "0 8px 24px rgba(0,0,0,0.14)";
    });
    item.addEventListener("mouseup", () => {
      target.style.transition = "transform 0.25s ease, box-shadow 0.25s ease";
      target.style.transform = "translateY(-4px)";
      target.style.boxShadow = "0 24px 60px rgba(0,0,0,0.18)";
    });
    item.addEventListener("mouseleave", () => {
      target.style.transition = "transform 0.35s ease, box-shadow 0.35s ease";
      target.style.transform = "translateY(0)";
      target.style.boxShadow = "0 16px 56px rgba(0,0,0,0.14)";
    });

    item.addEventListener("click", () => {
      const type = item.dataset.type;
      if (type === "modal") {
        const imgSrc = item.dataset.lightboxSrc;
        const imgTitle = item.dataset.lightboxTitle || "";
        salesModalImg.src = imgSrc;
        salesModalImg.alt = imgTitle;
        salesModal.classList.add("show");
        document.body.style.overflow = "hidden";
      }
      if (type === "link") {
        const link = item.dataset.link;
        if (link) window.open(link, "_blank", "noopener,noreferrer");
      }
    });
  });

  if (salesModalClose) {
    salesModalClose.addEventListener("click", () => {
      salesModal.classList.remove("show");
      document.body.style.overflow = "";
    });
  }
  if (salesModal) {
    salesModal.addEventListener("click", (e) => {
      if (e.target === salesModal) {
        salesModal.classList.remove("show");
        document.body.style.overflow = "";
      }
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      salesModal && salesModal.classList.remove("show");
      document.body.style.overflow = "";
    }
  });

  /* ════════════════════════════════════════
     네비게이션 — 섹션별 정확한 스크롤
  ════════════════════════════════════════ */
  var NAV_H = 80;
  var SECTION_OFFSET = {
    aboutSection: NAV_H - 30,
    webDesingSection: NAV_H - 90,
    appSection: NAV_H - 90,
    salesSection: NAV_H - 90,
    cardSection: NAV_H - 90,
  };

  function scrollToSection(targetId) {
    var targetEl = document.getElementById(targetId);
    if (!targetEl) return;
    if (targetId === "landingSection") {
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (targetId === "cardSection") {
      var track = document.getElementById("cardTrack");
      if (track) {
        track.classList.remove("card-arrived");
        track.style.transition = "none";
        track.style.transform = "translateX(110%)";
      }
      var offset = SECTION_OFFSET[targetId] || NAV_H;
      var top =
        targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: top, behavior: "smooth" });
      if (track) {
        var checkTimer = null;
        var onScroll = function () {
          clearTimeout(checkTimer);
          checkTimer = setTimeout(function () {
            var rect = targetEl.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
              window.removeEventListener("scroll", onScroll);
              requestAnimationFrame(function () {
                track.classList.add("card-arrived");
              });
            }
          }, 60);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        setTimeout(function () {
          var rect = targetEl.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            window.removeEventListener("scroll", onScroll);
            requestAnimationFrame(function () {
              track.classList.add("card-arrived");
            });
          }
        }, 80);
      }
      return;
    }
    var offset =
      SECTION_OFFSET[targetId] !== undefined ? SECTION_OFFSET[targetId] : NAV_H;
    var top =
      targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: top, behavior: "smooth" });
  }

  var navLogo = document.querySelector(".nav-logo");
  if (navLogo) {
    navLogo.addEventListener("click", function (e) {
      e.preventDefault();
      currentStep = 0;
      animationDone = false;
      wheelAccum = 0;
      render();
      resetDrop();
      document
        .getElementById("portfolioSection")
        .scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  document
    .querySelectorAll(".nav-links a[data-target]")
    .forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        var targetId = this.getAttribute("data-target");
        currentStep = grandTotal;
        animationDone = true;
        render();
        scrollToSection(targetId);
      });
    });

  /* ════════════════════════════════════════
     Landing — View Project 팝업
  ════════════════════════════════════════ */
  var viewBtn = document.getElementById("landingViewBtn");
  if (viewBtn) {
    viewBtn.addEventListener("click", function (e) {
      e.preventDefault();
      var imgEl = document.getElementById("landingImg");
      var imgSrc = imgEl ? imgEl.src : "";
      var html = [
        '<!doctype html><html lang="ko"><head>',
        '<meta charset="UTF-8">',
        "<title>View Project</title>",
        "<style>*{margin:0;padding:0;box-sizing:border-box;}body{background:#fff;display:flex;flex-direction:column;align-items:center;}img{width:1920px;max-width:100%;height:auto;display:block;}</style>",
        "</head><body>",
        '<img src="' + imgSrc + '" alt="프로젝트 이미지">',
        "</body></html>",
      ].join("");
      var popup = window.open(
        "",
        "_blank",
        "width=1920,height=900,scrollbars=yes,resizable=yes",
      );
      if (popup) {
        popup.document.write(html);
        popup.document.close();
      }
    });
  }

  /* ════════════════════════════════════════
     Landing 진입 애니메이션
  ════════════════════════════════════════ */
  (function () {
    var ls = document.getElementById("landingSection");
    if (!ls) return;
    var triggered = false;
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !triggered) {
            triggered = true;
            ls.classList.add("is-visible");
            setTimeout(function () {
              ls.classList.add("is-floating");
            }, 1900);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.15 },
    );
    obs.observe(ls);
  })();

  /* ════════════════════════════════════════
     CARD 스크롤 슬라이드인
  ════════════════════════════════════════ */
  (function () {
    var section = document.getElementById("cardSection");
    var track = document.getElementById("cardTrack");
    if (!section || !track) return;
    var SCROLL_RANGE = window.innerHeight;
    function getProgress() {
      var rect = section.getBoundingClientRect();
      return Math.max(
        0,
        Math.min(1, (window.innerHeight - rect.top) / SCROLL_RANGE),
      );
    }
    function updateCard() {
      if (track.classList.contains("card-arrived")) return;
      track.style.transform = "translateX(" + (1 - getProgress()) * 110 + "%)";
    }
    window.addEventListener(
      "scroll",
      function () {
        if (track.classList.contains("card-arrived")) {
          var rect = section.getBoundingClientRect();
          if (rect.top >= window.innerHeight || rect.bottom <= 0) {
            track.classList.remove("card-arrived");
            track.style.transition = "none";
          }
          return;
        }
        updateCard();
      },
      { passive: true },
    );
    window.addEventListener("resize", updateCard);
    updateCard();
  })();

  /* ════════════════════════════════════════
     FOOTER 카드 슬라이드업
  ════════════════════════════════════════ */
  (function () {
    var card = document.getElementById("footerCard");
    if (!card) return;
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            card.classList.add("footer-card-visible");
            obs.unobserve(card);
          }
        });
      },
      { threshold: 0.3 },
    );
    obs.observe(card);
  })();

  /* ════════════════════════════════════════
     라이트박스 — 카드 + 세일즈 공용
  ════════════════════════════════════════ */
  (function () {
    var overlay = document.getElementById("lightboxOverlay");
    var imgEl = document.getElementById("lightboxImg");
    var caption = document.getElementById("lightboxCaption");
    var closeBtn = document.getElementById("lightboxClose");
    if (!overlay || !imgEl) return;
    function open(src, title, sub) {
      imgEl.src = src;
      imgEl.alt = title || "";
      caption.textContent = title ? title + (sub ? "  ·  " + sub : "") : "";
      if (imgEl.complete && imgEl.naturalWidth) show();
      else imgEl.onload = show;
    }
    function show() {
      overlay.classList.add("lb-open");
      document.body.style.overflow = "hidden";
    }
    function close() {
      overlay.classList.remove("lb-open");
      document.body.style.overflow = "";
      setTimeout(function () {
        imgEl.src = "";
      }, 380);
    }
    closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
    document.querySelectorAll(".card-item").forEach(function (card) {
      card.addEventListener("click", function () {
        var src = this.getAttribute("data-img");
        if (src)
          open(
            src,
            this.getAttribute("data-title"),
            this.getAttribute("data-sub"),
          );
      });
    });
    document.querySelectorAll(".sales-img-clickable").forEach(function (el) {
      el.addEventListener("click", function () {
        var src = this.getAttribute("data-lightbox-src");
        var title = this.getAttribute("data-lightbox-title") || "";
        if (src) open(src, title, "");
      });
    });
  })();
});
