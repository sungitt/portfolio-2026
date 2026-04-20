/* ════════════════════════════════════════════════════════
   RESPONSIVE-PATCH.JS  —  script.js 아래에 추가
════════════════════════════════════════════════════════ */
(function () {
  if (window.innerWidth > 767) return;

  /* ══════════════════════════════
     1. 햄버거 메뉴
  ══════════════════════════════ */
  var navInner = document.querySelector(".nav-inner");
  var navLinks = document.querySelector(".nav-links");
  if (navInner && navLinks) {
    var hbtn = document.createElement("button");
    hbtn.className = "hamburger";
    hbtn.setAttribute("aria-label", "메뉴");
    hbtn.innerHTML = "<span></span><span></span><span></span>";
    navInner.appendChild(hbtn);

    hbtn.addEventListener("click", function () {
      hbtn.classList.toggle("active");
      navLinks.classList.toggle("mob-open");
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        hbtn.classList.remove("active");
        navLinks.classList.remove("mob-open");
      });
    });
    document.addEventListener("click", function (e) {
      if (!navInner.contains(e.target)) {
        hbtn.classList.remove("active");
        navLinks.classList.remove("mob-open");
      }
    });
  }

  /* ══════════════════════════════
     2. HERO 모바일 애니메이션
  ══════════════════════════════ */
  (function () {
    var portfolioSection = document.getElementById("portfolioSection");
    if (!portfolioSection) return;

    function scaleHeroLine() {
      var line = document.getElementById("portfolioLine");
      if (!line) return;
      var parentW = portfolioSection.offsetWidth || window.innerWidth;
      var lineW = line.scrollWidth;
      if (lineW > 0) {
        var scale = Math.min(1, (parentW * 0.92) / lineW);
        line.style.transform = "translate(-50%, -50%) scale(" + scale + ")";
      }
    }

    function runMobileHeroAnim() {
      var brandCols = portfolioSection.querySelectorAll(".brand-col");
      var fillLetters = portfolioSection.querySelectorAll(".fill-letter");
      var pLetters = portfolioSection.querySelectorAll(".p-letter");

      brandCols.forEach(function (col) {
        col.style.transition =
          "transform 0.6s cubic-bezier(0.22,1,0.36,1), opacity 0.35s ease 0.35s";
        col.style.transform = "translateX(-50%) translateY(180px)";
        col.style.opacity = "0";
      });
      pLetters.forEach(function (pl) {
        pl.style.transition = "opacity 0.3s ease 0.15s";
        pl.style.opacity = "0";
      });
      setTimeout(function () {
        fillLetters.forEach(function (fl, i) {
          fl.style.opacity = "1";
          fl.style.transition =
            "clip-path 0.55s cubic-bezier(0.22,1,0.36,1) " +
            (i * 0.035).toFixed(3) +
            "s";
          fl.style.clipPath = "inset(0% 0 0 0)";
        });
      }, 650);
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        scaleHeroLine();
        setTimeout(runMobileHeroAnim, 350);
      });
    } else {
      window.addEventListener("load", function () {
        scaleHeroLine();
        setTimeout(runMobileHeroAnim, 350);
      });
    }
    window.addEventListener("resize", scaleHeroLine);
  })();

  /* ══════════════════════════════
     3. ABOUT 캐러셀
  ══════════════════════════════ */
  var aboutSection = document.getElementById("aboutSection");
  if (aboutSection) {
    var slides = [
      {
        type: "intro",
        html:
          '<div class="mob-about-card">' +
          '<p class="mob-about-greeting">안녕하세요, 그래픽 전공 베이스로 보기 좋고 쓰기 좋은 경험을 설계하는 UI/UX 디자이너 <strong>박 선영</strong>입니다.</p>' +
          '<p class="mob-about-desc">단순히 예쁜 화면을 만드는 것에서 나아가 왜 이렇게 배치하는가를 고민하고, 화면 하나하나에 논리와 흐름을 심는 작업을 합니다.</p>' +
          '<span class="mob-skill-label">TOOL SKILLS</span>' +
          '<div class="mob-skill-row"><span class="mob-skill-name">Photoshop</span><div class="mob-skill-bar-bg"><div class="mob-skill-bar" data-pct="95"></div></div><span class="mob-skill-pct">95%</span></div>' +
          '<div class="mob-skill-row"><span class="mob-skill-name">Illustrator</span><div class="mob-skill-bar-bg"><div class="mob-skill-bar" data-pct="95"></div></div><span class="mob-skill-pct">95%</span></div>' +
          '<div class="mob-skill-row"><span class="mob-skill-name">Figma</span><div class="mob-skill-bar-bg"><div class="mob-skill-bar" data-pct="80"></div></div><span class="mob-skill-pct">80%</span></div>' +
          '<div class="mob-skill-row"><span class="mob-skill-name">AE · Premiere</span><div class="mob-skill-bar-bg"><div class="mob-skill-bar" data-pct="50"></div></div><span class="mob-skill-pct">50%</span></div>' +
          "</div>",
      },
      {
        type: "profile",
        html:
          '<div class="mob-about-card">' +
          '<div class="mob-profile-item"><div class="mob-profile-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg></div><div><span class="mob-profile-label">학력</span><span class="mob-profile-value">계명문화대학교 디지털컨텐츠 (그래픽 영상학과) 졸업</span></div></div>' +
          '<div class="mob-profile-item"><div class="mob-profile-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg></div><div><span class="mob-profile-label">자격증</span><span class="mob-profile-value">GTQ 그래픽기술자격 1급</span></div></div>' +
          '<div class="mob-profile-item"><div class="mob-profile-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg></div><div><span class="mob-profile-label">Experience</span><span class="mob-profile-value">UI/UX 반응형 웹디자인 & 웹퍼블리셔 교육 (2026) · 월드빌 주택조합위원회</span></div></div>' +
          '<div class="mob-profile-item"><div class="mob-profile-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,7 12,13 2,7"/></svg></div><div><span class="mob-profile-label">이메일</span><span class="mob-profile-value">sun634634@gmail.com</span></div></div>' +
          '<div class="mob-profile-item"><div class="mob-profile-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg></div><div><span class="mob-profile-label">관심 분야</span><span class="mob-profile-value">브랜딩 · 상세페이지 · 랜딩페이지 · UX/UI</span></div></div>' +
          "</div>",
      },
    ];

    var wrap = document.createElement("div");
    wrap.className = "about-carousel-wrap";
    var track = document.createElement("div");
    track.className = "about-carousel-track";
    slides.forEach(function (s) {
      var slide = document.createElement("div");
      slide.className = "about-carousel-slide";
      slide.innerHTML = s.html;
      track.appendChild(slide);
    });
    wrap.appendChild(track);

    var dots = document.createElement("div");
    dots.className = "about-carousel-dots";
    var dotEls = [];
    slides.forEach(function (_, i) {
      var d = document.createElement("div");
      d.className = "about-carousel-dot" + (i === 0 ? " active" : "");
      d.addEventListener("click", function () {
        goAbout(i);
      });
      dots.appendChild(d);
      dotEls.push(d);
    });

    aboutSection.appendChild(wrap);
    aboutSection.appendChild(dots);

    var curAbout = 0;
    function goAbout(idx) {
      curAbout = (idx + slides.length) % slides.length;
      track.style.transform = "translateX(-" + curAbout * 100 + "%)";
      dotEls.forEach(function (d, i) {
        d.classList.toggle("active", i === curAbout);
      });
      if (slides[curAbout].type === "intro") setTimeout(animateSkillBars, 80);
    }
    function animateSkillBars() {
      track.querySelectorAll(".mob-skill-bar").forEach(function (bar) {
        bar.style.width = (bar.getAttribute("data-pct") || "0") + "%";
      });
    }
    setTimeout(animateSkillBars, 400);

    var aStartX = 0;
    track.addEventListener(
      "touchstart",
      function (e) {
        aStartX = e.touches[0].clientX;
      },
      { passive: true },
    );
    track.addEventListener(
      "touchend",
      function (e) {
        var diff = aStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 36)
          goAbout(diff > 0 ? curAbout + 1 : curAbout - 1);
      },
      { passive: true },
    );
  }

  /* ══════════════════════════════
     4. tags-stage 드롭 아이템 크기 패치
  ══════════════════════════════ */
  (function () {
    var stage = document.getElementById("tagsStage");
    if (!stage) return;
    var SCALE = 0.5;
    function patchDropItem(el) {
      var imgs = el.querySelectorAll("img");
      imgs.forEach(function (img) {
        var w = parseFloat(img.style.width);
        var h = parseFloat(img.style.height);
        if (w > 0) img.style.width = Math.round(w * SCALE) + "px";
        if (h > 0) img.style.height = Math.round(h * SCALE) + "px";
        img.style.maxWidth = "none";
      });
    }
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (
            node.nodeType === 1 &&
            node.classList &&
            node.classList.contains("drop-item")
          ) {
            patchDropItem(node);
          }
        });
      });
    });
    observer.observe(stage, { childList: true });
    stage.querySelectorAll(".drop-item").forEach(patchDropItem);
  })();

  /* ══════════════════════════════
     5. WEB DESIGN 카드 스와이퍼
     (contrib-note도 카드 안에 포함)
  ══════════════════════════════ */
  var wdSection = document.getElementById("webDesingSection");
  if (wdSection) {
    var wdData = [
      {
        title: "크린토피아 - 리디자인",
        img: "images/크린토피아 home.png",
        href: "https://sungitt.github.io/my-cleantopia/",
        figma:
          "https://www.figma.com/proto/2y7uezUsrjyksjJh1oDrVV/1-%EC%A1%B0%EB%B3%84%EA%B3%BC%EC%A0%9C?node-id=0-1",
        pdf: "images/cleantopia.pdf",
        bars: [
          { name: "Photoshop · Illustrator", pct: 60 },
          { name: "VSC", pct: 40 },
        ],
        note: "팀 프로젝트에서 전체 디자인 방향 설정과 히어로 섹션 비주얼을 담당하였으며, 반응형 레이아웃 구현 및 CSS 스와이퍼 기능 개발에 기여하였습니다.",
      },
      {
        title: "고가바 - 새로운 서비스",
        img: "images/gogaba home.png",
        href: "https://apzkfhd.github.io/service-platform-project/",
        figma:
          "https://www.figma.com/proto/8RfY4txkmk00nFn8OdFZAE/1%EC%A1%B0---Gogaba?node-id=41-7",
        pdf: "images/gogaba.pdf",
        bars: [
          { name: "Photoshop · Illustrator", pct: 70 },
          { name: "VSC", pct: 30 },
        ],
        note: "서비스 플랫폼 UI 전반의 디자인을 주도하였으며, 브랜드 아이덴티티 구축과 랜딩 페이지 히어로 영역 디자인을 담당하였습니다. 스와이퍼 인터랙션 기능 구현에도 참여하였습니다.",
      },
    ];

    var wdWrap = document.createElement("div");
    wdWrap.className = "mob-wd-swiper-wrap";
    var wdTrack = document.createElement("div");
    wdTrack.className = "mob-wd-swiper-track";

    wdData.forEach(function (d) {
      var slide = document.createElement("div");
      slide.className = "mob-wd-slide";
      var barsHtml = d.bars
        .map(function (b) {
          return (
            '<div class="mob-wd-contrib-row">' +
            '<div class="mob-wd-contrib-header"><span class="mob-wd-contrib-name">' +
            b.name +
            '</span><span class="mob-wd-contrib-pct">' +
            b.pct +
            "%</span></div>" +
            '<div class="mob-wd-contrib-bar-bg"><div class="mob-wd-contrib-bar" data-pct="' +
            b.pct +
            '"></div></div>' +
            "</div>"
          );
        })
        .join("");

      /* contrib-note HTML */
      var noteHtml = d.note
        ? '<div class="webDesing-contrib-note"><p>' + d.note + "</p></div>"
        : "";

      slide.innerHTML =
        '<div class="mob-wd-card">' +
        '<a class="mob-wd-img-wrap" href="' +
        d.href +
        '" target="_blank" rel="noopener">' +
        '<img src="' +
        d.img +
        '" alt="' +
        d.title +
        '">' +
        '<div class="mob-wd-overlay"><span class="mob-wd-open-btn">새탭으로 보기</span></div>' +
        "</a>" +
        '<div class="mob-wd-body">' +
        '<div class="mob-wd-title-row"><span class="mob-wd-title">' +
        d.title +
        "</span>" +
        '<div class="mob-wd-links">' +
        '<a href="' +
        d.figma +
        '" target="_blank" rel="noopener">Figma</a>' +
        '<a href="' +
        d.pdf +
        '" target="_blank" rel="noopener">PDF</a>' +
        "</div></div>" +
        '<div class="mob-wd-contrib">' +
        barsHtml +
        noteHtml +
        "</div>" +
        "</div></div>";
      wdTrack.appendChild(slide);
    });
    wdWrap.appendChild(wdTrack);

    var wdDots = document.createElement("div");
    wdDots.className = "mob-wd-dots";
    var wdDotEls = [];
    wdData.forEach(function (_, i) {
      var d = document.createElement("div");
      d.className = "mob-wd-dot" + (i === 0 ? " active" : "");
      d.addEventListener("click", function () {
        goWd(i);
      });
      wdDots.appendChild(d);
      wdDotEls.push(d);
    });

    var wdInner = wdSection.querySelector(".section-inner");

    /* margin-top 동적 계산 */
    var wdLeft = wdSection.querySelector(".webDesing-left");
    if (wdLeft) {
      var leftH = wdLeft.offsetHeight;
      wdWrap.style.marginTop = "-" + leftH + "px";
    }

    wdInner.appendChild(wdWrap);
    wdInner.appendChild(wdDots);

    var curWd = 0;
    function goWd(idx) {
      curWd = (idx + wdData.length) % wdData.length;
      wdTrack.style.transform = "translateX(-" + curWd * 100 + "%)";
      wdDotEls.forEach(function (d, i) {
        d.classList.toggle("active", i === curWd);
      });
      setTimeout(function () {
        wdTrack.querySelectorAll(".mob-wd-contrib-bar").forEach(function (bar) {
          bar.style.width = (bar.getAttribute("data-pct") || "0") + "%";
        });
      }, 80);
    }
    setTimeout(function () {
      wdTrack.querySelectorAll(".mob-wd-contrib-bar").forEach(function (bar) {
        bar.style.width = (bar.getAttribute("data-pct") || "0") + "%";
      });
    }, 500);

    var wdStartX = 0;
    wdTrack.addEventListener(
      "touchstart",
      function (e) {
        wdStartX = e.touches[0].clientX;
      },
      { passive: true },
    );
    wdTrack.addEventListener(
      "touchend",
      function (e) {
        var diff = wdStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 36) goWd(diff > 0 ? curWd + 1 : curWd - 1);
      },
      { passive: true },
    );
  }

  /* ══════════════════════════════
     6. APP 섹션 — 모바일 즉시 표시
  ══════════════════════════════ */
  (function () {
    var img1 = document.getElementById("appImg1Wrap");
    if (img1) img1.classList.add("app-float-visible");

    var desc = document.getElementById("appSectionDesc");
    if (desc) desc.classList.add("desc-visible");

    /* 기여도 노트도 즉시 표시 */
    var note = document.getElementById("appContribNote");
    if (note) note.classList.add("note-visible");

    /* 데코태그 즉시 표시 (모바일에서는 CSS에서 transition:none 처리) */
    var tags = document.querySelectorAll(".app-deco-tag-new");
    tags.forEach(function (tag) {
      tag.classList.add("tag-visible");
    });
  })();

  /* ══════════════════════════════
     7. CARD 터치 스와이퍼 (2개씩)
  ══════════════════════════════ */
  var cardSection = document.getElementById("cardSection");
  var cardTrack = document.getElementById("cardTrack");
  if (cardSection && cardTrack) {
    cardTrack.classList.add("card-arrived");
    cardTrack.style.cssText =
      "transform:none!important;transition:none!important;display:none;";

    var cardItems = Array.from(cardTrack.querySelectorAll(".card-item"));
    var pages = [];
    for (var ci = 0; ci < cardItems.length; ci += 2) {
      pages.push(cardItems.slice(ci, ci + 2));
    }

    var cardInner = cardSection.querySelector(".card-inner");
    cardInner.style.display = "block";

    var cWrap = document.createElement("div");
    cWrap.style.cssText = "overflow:hidden;width:100%;";
    var cTrack = document.createElement("div");
    cTrack.style.cssText =
      "display:flex;transition:transform .42s cubic-bezier(.22,1,.36,1);will-change:transform;";

    var lbOverlay = document.getElementById("lightboxOverlay");
    var lbImg = document.getElementById("lightboxImg");
    var lbCap = document.getElementById("lightboxCaption");

    pages.forEach(function (pg) {
      var page = document.createElement("div");
      page.style.cssText =
        "flex:0 0 100%;display:flex;gap:10px;box-sizing:border-box;";
      pg.forEach(function (item) {
        var clone = item.cloneNode(true);
        clone.style.flex = "1";
        /* 팝업 요소 확실히 제거 */
        var popup = clone.querySelector(".card-popup");
        if (popup) popup.remove();
        clone.addEventListener("click", function () {
          var src = item.getAttribute("data-img");
          var ttl = item.getAttribute("data-title");
          if (src && lbOverlay && lbImg) {
            lbImg.src = src;
            lbImg.alt = ttl || "";
            if (lbCap) lbCap.textContent = ttl || "";
            function showLb() {
              lbOverlay.classList.add("lb-open");
              document.body.style.overflow = "hidden";
            }
            if (lbImg.complete && lbImg.naturalWidth) showLb();
            else lbImg.onload = showLb;
          }
        });
        page.appendChild(clone);
      });
      if (pg.length < 2) {
        var empty = document.createElement("div");
        empty.style.flex = "1";
        page.appendChild(empty);
      }
      cTrack.appendChild(page);
    });
    cWrap.appendChild(cTrack);

    var cDots = document.createElement("div");
    cDots.className = "mob-card-dots";
    var cDotEls = [];
    pages.forEach(function (_, i) {
      var d = document.createElement("div");
      d.className = "mob-card-dot" + (i === 0 ? " active" : "");
      d.addEventListener("click", function () {
        goCard(i);
      });
      cDots.appendChild(d);
      cDotEls.push(d);
    });

    var cardSectionInner = cardSection.querySelector(".section-inner");
    cardSectionInner.appendChild(cWrap);
    cardSectionInner.appendChild(cDots);

    var curCard = 0;
    function goCard(idx) {
      curCard = (idx + pages.length) % pages.length;
      cTrack.style.transform = "translateX(-" + curCard * 100 + "%)";
      cDotEls.forEach(function (d, i) {
        d.classList.toggle("active", i === curCard);
      });
    }

    var cStartX = 0;
    cTrack.addEventListener(
      "touchstart",
      function (e) {
        cStartX = e.touches[0].clientX;
      },
      { passive: true },
    );
    cTrack.addEventListener(
      "touchend",
      function (e) {
        var diff = cStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 36) goCard(diff > 0 ? curCard + 1 : curCard - 1);
      },
      { passive: true },
    );
  }

  /* ══════════════════════════════
     8. FOOTER 카드
  ══════════════════════════════ */
  (function () {
    var card = document.getElementById("footerCard");
    if (card)
      setTimeout(function () {
        card.classList.add("footer-card-visible");
      }, 100);
  })();

  /* ══════════════════════════════
     9. 섹션 min-height auto
  ══════════════════════════════ */
  (function () {
    var sections = document.querySelectorAll(
      ".section-page, .about-section, .landing-section, .site-footer",
    );
    sections.forEach(function (s) {
      s.style.minHeight = "auto";
    });
    var appSection = document.getElementById("appSection");
    if (appSection) {
      appSection.style.minHeight = "auto";
      appSection.style.paddingBottom = "24px";
    }
    var cardSec = document.getElementById("cardSection");
    if (cardSec) cardSec.style.minHeight = "auto";
  })();
})();
