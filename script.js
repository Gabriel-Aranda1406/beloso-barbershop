AOS.init();

const gallerySwiper = new Swiper('.gallery-swiper', {
  loop: true,
  speed: 900,
  autoplay: {
    delay: 2800,
    disableOnInteraction: false,
  },
  effect: 'coverflow',
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: 'auto',
  coverflowEffect: {
    rotate: 30,
    stretch: 0,
    depth: 150,
    modifier: 1,
    slideShadows: true,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});
 

(function () {
  var viewport = document.getElementById('fbEmbla');
  if (!viewport) return;
 
  var prevBtn  = document.getElementById('fbPrev');
  var nextBtn  = document.getElementById('fbNext');
  var dotsWrap = document.getElementById('fbDots');
  var AUTO_DELAY = 6000;
  var PARALLAX_FACTOR = 0.15;
 
  var embla = EmblaCarousel(viewport, {
    loop: true,
    dragFree: false,
    align: 'center',
    containScroll: false
  });
 
  var slides = embla.slideNodes();
  var layers = Array.from(viewport.querySelectorAll('.embla-fb__layer'));
  var isDesktop = window.innerWidth >= 769;
 
  function applyTweens() {
    var snapList = embla.scrollSnapList();
    var progress = embla.scrollProgress();
 
    snapList.forEach(function (snap, i) {
      var diff    = snap - progress;
      var absDiff = Math.abs(diff);
 
      // parallax sempre
      var px = diff * (-1 / PARALLAX_FACTOR) * 100;
      if (layers[i]) layers[i].style.transform = 'translateX(' + px + '%)';
 
      if (isDesktop) {
  var opacity = Math.max(0, 1 - absDiff * 8);
  slides[i].style.opacity = opacity;
  slides[i].style.pointerEvents = absDiff < 0.01 ? 'auto' : 'none';
  var rotateY = Math.max(-22, Math.min(22, diff * -14));
  var scale   = Math.max(0.88, 1 - absDiff * 0.1);
  slides[i].style.transform = 'rotateY(' + rotateY + 'deg) scale(' + scale + ')';
} else {
  var opacity = Math.max(0.45, 1 - absDiff * 1.8);
  slides[i].style.opacity = opacity;
  slides[i].style.pointerEvents = 'auto';
  var rotateY = Math.max(-22, Math.min(22, diff * -14));
  var scale   = Math.max(0.88, 1 - absDiff * 0.1);
  slides[i].style.transform = 'rotateY(' + rotateY + 'deg) scale(' + scale + ')';
}
    });
  }
 
  function buildDots() {
    dotsWrap.innerHTML = '';
    var counter = document.createElement('p');
    counter.className = 'feedbacks__counter';
    counter.id = 'fbCounter';
    dotsWrap.appendChild(counter);
    updateCounter();
  }
 
  function updateCounter() {
    var counter = document.getElementById('fbCounter');
    if (!counter) return;
    var sel   = embla.selectedScrollSnap() + 1;
    var total = embla.scrollSnapList().length;
    counter.innerHTML = '<span>' + sel + '</span> / ' + total;
  }
 
  function updateActive() {
    var sel = embla.selectedScrollSnap();
    slides.forEach(function (s, i) {
      s.classList.toggle('is-active', i === sel);
    });
    updateCounter();
  }
 
  var autoTimer = null;
  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(function () { embla.scrollNext(); }, AUTO_DELAY);
  }
  function resetAuto() { clearInterval(autoTimer); startAuto(); }
 
  viewport.addEventListener('mouseenter', function () { clearInterval(autoTimer); });
  viewport.addEventListener('mouseleave', startAuto);
  prevBtn.addEventListener('click', function () { embla.scrollPrev(); resetAuto(); });
  nextBtn.addEventListener('click', function () { embla.scrollNext(); resetAuto(); });
 
  window.addEventListener('resize', function () {
    isDesktop = window.innerWidth >= 769;
    applyTweens();
  });
 
  embla.on('scroll', applyTweens);
  embla.on('select', updateActive);
  embla.on('reInit', function () { buildDots(); applyTweens(); updateActive(); });
 
  buildDots();
  applyTweens();
  updateActive();
  startAuto();
})();