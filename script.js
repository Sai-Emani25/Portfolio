class PortfolioSlider {
  constructor() {
    this.currentSlide = 0;
    this.slides = document.querySelectorAll('.slide');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.sliderContainer = document.getElementById('sliderContainer');
    this.totalSlides = this.slides.length;
    this.container = document.querySelector('.container');
    this.statsRow = document.getElementById('statsRow');
    this.init();
  }

  init() {
    this.bindEvents();
    this.showSlide(0);

    // Contact form mailto logic (Subject & Message only)
    const emailForm = document.getElementById('emailForm');
    if (emailForm) {
      emailForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        // Updated mailto address
        const mailto = `mailto:ssshanmukha.emani@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
        window.location.href = mailto;
      });
    }s

    // Achievements image modal logic
    const collage = document.getElementById('achievementsCollage');
    const modal = document.getElementById('achModal');
    const modalImg = document.getElementById('achModalImg');
    const modalName = document.getElementById('achModalName');
    const modalDesc = document.getElementById('achModalDesc');
    const modalClose = document.getElementById('achModalClose');

    if (collage && modal && modalImg && modalName && modalDesc && modalClose) {
      collage.addEventListener('click', function(e) {
        const img = e.target.closest('img');
        if (!img) return;
        modal.classList.add('open');
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        modalName.textContent = img.getAttribute('data-name') || img.alt || '';
        modalDesc.textContent = img.getAttribute('data-desc') || '';
      });
              // 1. Get all required elements
        const collage = document.getElementById('achievementsCollage');
        const modal = document.getElementById('achModal');
        const modalImg = document.getElementById('achModalImg');
        const modalName = document.getElementById('achModalName');
        const modalDesc = document.getElementById('achModalDesc');
        const modalClose = document.getElementById('achModalClose');
        const modalPrev = document.getElementById('achModalPrev');
        const modalNext = document.getElementById('achModalNext');

        let achImages = [];
        let currentAchIndex = 0;

        // 2. Function to show modal for a specific image
        function showAchModal(index) {
            if (!achImages.length) return;
            const img = achImages[index];
            modal.classList.add('open');
            modalImg.src = img.src;
            modalImg.alt = img.alt;
            modalName.textContent = img.getAttribute('data-name') || img.alt || '';
            modalDesc.textContent = img.getAttribute('data-desc') || '';
            currentAchIndex = index;
        }

        // 3. Setup event listeners after DOM is ready
        if (
            collage && modal && modalImg &&
            modalName && modalDesc &&
            modalClose && modalPrev && modalNext
        ) {
            achImages = Array.from(collage.querySelectorAll('img'));

            // Open modal on image click
            collage.addEventListener('click', function(e) {
                const img = e.target.closest('img');
                if (!img) return;
                const idx = achImages.indexOf(img);
                if (idx !== -1) showAchModal(idx);
            });

            // Previous image button
            modalPrev.addEventListener('click', function(e) {
                e.stopPropagation();
                if (!achImages.length) return;
                let idx = (currentAchIndex - 1 + achImages.length) % achImages.length;
                showAchModal(idx);
            });

            // Next image button
            modalNext.addEventListener('click', function(e) {
                e.stopPropagation();
                if (!achImages.length) return;
                let idx = (currentAchIndex + 1) % achImages.length;
                showAchModal(idx);
            });

            // Close modal
            modalClose.addEventListener('click', function() {
                modal.classList.remove('open');
                modalImg.src = '';
                modalName.textContent = '';
                modalDesc.textContent = '';
            });

            // Click outside modal content to close
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.classList.remove('open');
                    modalImg.src = '';
                    modalName.textContent = '';
                    modalDesc.textContent = '';
                }
            });

            // Keyboard navigation (optional)
            document.addEventListener('keydown', function(e) {
                if (!modal.classList.contains('open')) return;
                if (e.key === 'Escape') {
                    modal.classList.remove('open');
                    modalImg.src = '';
                    modalName.textContent = '';
                    modalDesc.textContent = '';
                } else if (e.key === 'ArrowLeft') {
                    modalPrev.click();
                } else if (e.key === 'ArrowRight') {
                    modalNext.click();
                }
            });
        }


      // Close modal on close button or outside click
      modalClose.addEventListener('click', function() {
        modal.classList.remove('open');
        modalImg.src = '';
        modalName.textContent = '';
        modalDesc.textContent = '';
      });
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          modal.classList.remove('open');
          modalImg.src = '';
          modalName.textContent = '';
          modalDesc.textContent = '';
        }
      });
      // Optional: close modal on ESC key
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
          modal.classList.remove('open');
          modalImg.src = '';
          modalName.textContent = '';
          modalDesc.textContent = '';
        }
      });
    }
  }

  bindEvents() {
    // Navigation links
    this.navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const slideIndex = parseInt(link.dataset.slide);
        if (slideIndex < this.totalSlides) {
          this.goToSlide(slideIndex);
        }
      });
    });

    // "Hire me" button scrolls to Contact slide
    const hireMeBtn = document.getElementById('hireMeBtn');
    if (hireMeBtn) {
      hireMeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.goToSlide(4); // Contact slide
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.prevSlide();
      } else if (e.key === 'ArrowRight') {
        this.nextSlide();
      }
    });

    // Touch and mouse/trackpad swipe support
    let startX = null;
    let isDragging = false;

    const start = (clientX) => {
      startX = clientX;
      isDragging = true;
    };

    const end = (clientX) => {
      if (!isDragging || startX === null) return;
      const threshold = 50;
      const diff = startX - clientX;
      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
      }
      isDragging = false;
      startX = null;
    };

    // Touch events
    this.sliderContainer.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) start(e.touches[0].clientX);
    });
    this.sliderContainer.addEventListener('touchend', (e) => {
      if (e.changedTouches.length === 1) end(e.changedTouches[0].clientX);
    });

    // Mouse events (for trackpad/drag)
    this.sliderContainer.addEventListener('mousedown', (e) => {
      start(e.clientX);
    });
    this.sliderContainer.addEventListener('mouseup', (e) => {
      end(e.clientX);
    });
    this.sliderContainer.addEventListener('mouseleave', (e) => {
      if (isDragging) end(e.clientX);
    });
  }

  goToSlide(index) {
    if (index === this.currentSlide || index < 0 || index >= this.totalSlides) {
      return;
    }
    this.currentSlide = index;
    this.showSlide(index);
  }

  showSlide(index) {
    // Update slider container position
    const translateX = -(index * (100 / this.totalSlides));
    this.sliderContainer.style.transform = `translateX(${translateX}%)`;

    // Update active states
    this.updateActiveStates(index);

    // Show stats row only on Home (slide 0)
    if (this.statsRow) {
      if (index === 0) {
        this.statsRow.style.display = 'flex';
      } else {
        this.statsRow.style.display = 'none';
      }
    }

    // Trigger animations
    setTimeout(() => {
      this.triggerSlideAnimations(index);
    }, 100);
  }

  updateActiveStates(index) {
    // Update slides
    this.slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    // Update navigation links
    this.navLinks.forEach((link) => {
      const slideIndex = parseInt(link.dataset.slide);
      link.classList.toggle('active', slideIndex === index);
    });
  }

  triggerSlideAnimations(index) {
    const currentSlideElement = this.slides[index];
    const animatedElements = currentSlideElement.querySelectorAll('.slide-in-left, .slide-in-right');
    animatedElements.forEach((element) => {
      element.style.animation = 'none';
      element.offsetHeight; // Trigger reflow
      element.style.animation = null;
    });
  }

  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.totalSlides;
    this.goToSlide(nextIndex);
  }

  prevSlide() {
    const prevIndex = this.currentSlide === 0 ? this.totalSlides - 1 : this.currentSlide - 1;
    this.goToSlide(prevIndex);
  }
}

// Initialize slider when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PortfolioSlider();
});
const collage = document.getElementById('achievementsCollage');
const modal = document.getElementById('achModal');
const modalImg = document.getElementById('achModalImg');
const modalName = document.getElementById('achModalName');
const modalDesc = document.getElementById('achModalDesc');
const modalClose = document.getElementById('achModalClose');
const modalPrev = document.getElementById('achModalPrev');
const modalNext = document.getElementById('achModalNext');

let achImages = [];
let currentAchIndex = 0;

function showAchModal(index) {
  if (!achImages.length) return;
  const img = achImages[index];
  modal.classList.add('open');
  modalImg.src = img.src;
  modalImg.alt = img.alt;
  modalName.textContent = img.getAttribute('data-name') || img.alt || '';
  modalDesc.textContent = img.getAttribute('data-desc') || '';
  currentAchIndex = index;
}

if (collage && modal && modalImg && modalName && modalDesc && modalClose && modalPrev && modalNext) {
  achImages = Array.from(collage.querySelectorAll('img'));

  collage.addEventListener('click', function(e) {
    const img = e.target.closest('img');
    if (!img) return;
    const idx = achImages.indexOf(img);
    if (idx !== -1) showAchModal(idx);
  });

  modalPrev.addEventListener('click', function(e) {
    e.stopPropagation();
    if (!achImages.length) return;
    let idx = (currentAchIndex - 1 + achImages.length) % achImages.length;
    showAchModal(idx);
  });
  modalNext.addEventListener('click', function(e) {
    e.stopPropagation();
    if (!achImages.length) return;
    let idx = (currentAchIndex + 1) % achImages.length;
    showAchModal(idx);
  });

  modalClose.addEventListener('click', function() {
    modal.classList.remove('open');
    modalImg.src = '';
    modalName.textContent = '';
    modalDesc.textContent = '';
  });
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.classList.remove('open');
      modalImg.src = '';
      modalName.textContent = '';
      modalDesc.textContent = '';
    }
  });
  document.addEventListener('keydown', function(e) {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') {
      modal.classList.remove('open');
      modalImg.src = '';
      modalName.textContent = '';
      modalDesc.textContent = '';
    } else if (e.key === 'ArrowLeft') {
      modalPrev.click();
    } else if (e.key === 'ArrowRight') {
      modalNext.click();
    }
  });
}
const themeToggle = document.getElementById('themeToggle');
const themeToggleIcon = document.getElementById('themeToggleIcon');

// Helper: Set theme and icon
function setTheme(theme) {
  if (theme === 'light') {
    document.body.classList.add('light-mode');
    themeToggleIcon.classList.remove('fa-moon');
    themeToggleIcon.classList.add('fa-sun');
    themeToggleIcon.setAttribute('title', 'Switch to dark mode');
  } else {
    document.body.classList.remove('light-mode');
    themeToggleIcon.classList.remove('fa-sun');
    themeToggleIcon.classList.add('fa-moon');
    themeToggleIcon.setAttribute('title', 'Switch to light mode');
  }
  localStorage.setItem('theme', theme);
}

// On load: restore theme
(function(){
  let saved = localStorage.getItem('theme');
  if (!saved) {
    saved = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  setTheme(saved);
})();

// Toggle on click
themeToggle.addEventListener('click', () => {
  const isLight = document.body.classList.contains('light-mode');
  setTheme(isLight ? 'dark' : 'light');
});
