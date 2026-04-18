class PortfolioSlider {
  constructor() {
    this.currentSlide = 0;
    this.slides = document.querySelectorAll('.slide');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.sliderContainer = document.getElementById('sliderContainer');
    this.totalSlides = this.slides.length;
    this.statsRow = document.getElementById('statsRow');
    this.bindEvents();
    this.showSlide(0);
  }

  bindEvents() {
    this.navLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const slideIndex = Number.parseInt(link.dataset.slide, 10);
        if (!Number.isNaN(slideIndex)) {
          this.goToSlide(slideIndex);
        }
      });
    });

    const hireMeBtn = document.getElementById('hireMeBtn');
    if (hireMeBtn) {
      hireMeBtn.addEventListener('click', (event) => {
        event.preventDefault();
        this.goToSlide(4);
      });
    }

    document.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        this.prevSlide();
      } else if (event.key === 'ArrowRight') {
        this.nextSlide();
      }
    });

    let startX = null;
    let dragging = false;

    const beginSwipe = (clientX) => {
      startX = clientX;
      dragging = true;
    };

    const endSwipe = (clientX) => {
      if (!dragging || startX === null) {
        return;
      }

      const swipeDistance = startX - clientX;
      if (Math.abs(swipeDistance) > 50) {
        if (swipeDistance > 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
      }

      dragging = false;
      startX = null;
    };

    this.sliderContainer.addEventListener('touchstart', (event) => {
      if (event.touches.length === 1) {
        beginSwipe(event.touches[0].clientX);
      }
    });

    this.sliderContainer.addEventListener('touchend', (event) => {
      if (event.changedTouches.length === 1) {
        endSwipe(event.changedTouches[0].clientX);
      }
    });

    this.sliderContainer.addEventListener('mousedown', (event) => {
      beginSwipe(event.clientX);
    });

    this.sliderContainer.addEventListener('mouseup', (event) => {
      endSwipe(event.clientX);
    });

    this.sliderContainer.addEventListener('mouseleave', (event) => {
      if (dragging) {
        endSwipe(event.clientX);
      }
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
    const translateX = -(index * (100 / this.totalSlides));
    this.sliderContainer.style.transform = `translateX(${translateX}%)`;

    this.slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('active', slideIndex === index);
    });

    this.navLinks.forEach((link) => {
      link.classList.toggle('active', Number.parseInt(link.dataset.slide, 10) === index);
    });

    if (this.statsRow) {
      this.statsRow.style.display = index === 0 ? 'flex' : 'none';
    }

    const animatedElements = this.slides[index].querySelectorAll('.slide-in-left, .slide-in-right');
    animatedElements.forEach((element) => {
      element.style.animation = 'none';
      element.offsetHeight;
      element.style.animation = '';
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

class AchievementsModal {
  constructor() {
    this.collage = document.getElementById('achievementsCollage');
    this.modal = document.getElementById('achModal');
    this.modalImg = document.getElementById('achModalImg');
    this.modalName = document.getElementById('achModalName');
    this.modalDesc = document.getElementById('achModalDesc');
    this.modalClose = document.getElementById('achModalClose');
    this.modalPrev = document.getElementById('achModalPrev');
    this.modalNext = document.getElementById('achModalNext');
    this.cards = this.collage ? Array.from(this.collage.querySelectorAll('.achievement-card')) : [];
    this.currentIndex = 0;

    if (!this.collage || !this.modal || !this.modalImg || !this.modalName || !this.modalDesc || !this.modalClose || !this.modalPrev || !this.modalNext) {
      return;
    }

    this.bindEvents();
  }

  bindEvents() {
    this.collage.addEventListener('click', (event) => {
      const selectedCard = event.target.closest('.achievement-card');
      if (!selectedCard) {
        return;
      }

      const imageIndex = this.cards.indexOf(selectedCard);
      if (imageIndex >= 0) {
        this.open(imageIndex);
      }
    });

    this.modalPrev.addEventListener('click', (event) => {
      event.stopPropagation();
      this.open((this.currentIndex - 1 + this.cards.length) % this.cards.length);
    });

    this.modalNext.addEventListener('click', (event) => {
      event.stopPropagation();
      this.open((this.currentIndex + 1) % this.cards.length);
    });

    this.modalClose.addEventListener('click', () => this.close());

    this.modal.addEventListener('click', (event) => {
      if (event.target === this.modal) {
        this.close();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (!this.modal.classList.contains('open')) {
        return;
      }

      if (event.key === 'Escape') {
        this.close();
      } else if (event.key === 'ArrowLeft') {
        this.modalPrev.click();
      } else if (event.key === 'ArrowRight') {
        this.modalNext.click();
      }
    });
  }

  open(index) {
    if (!this.cards.length) {
      return;
    }

    const card = this.cards[index];
    const image = card.querySelector('img');
    this.currentIndex = index;
    this.modal.classList.add('open');
    document.body.classList.add('modal-open');
    this.modalImg.src = image.src;
    this.modalImg.alt = image.alt;
    this.modalName.textContent = card.getAttribute('data-name') || image.alt || '';
    this.modalDesc.textContent = card.getAttribute('data-desc') || '';
  }

  close() {
    this.modal.classList.remove('open');
    document.body.classList.remove('modal-open');
    this.modalImg.src = '';
    this.modalImg.alt = '';
    this.modalName.textContent = '';
    this.modalDesc.textContent = '';
  }
}

class GitHubProjects {
  constructor(username) {
    this.username = username;
    this.projectsGrid = document.getElementById('projectsGrid');
    this.apiUrl = `https://api.github.com/users/${username}/repos?per_page=100&sort=updated&direction=desc`;
    this.starredProjects = new Set(['huslr', 'shudh', 'namma-traffic-ai']);

    if (this.projectsGrid) {
      this.load();
    }
  }

  async load() {
    try {
      const response = await fetch(this.apiUrl, {
        headers: {
          Accept: 'application/vnd.github+json'
        }
      });

      if (!response.ok) {
        throw new Error(`GitHub request failed with ${response.status}`);
      }

      const repositories = await response.json();
      const visibleRepos = repositories.filter((repo) => !repo.fork);
      this.renderProjects(visibleRepos);
    } catch (error) {
      this.projectsGrid.innerHTML = `
        <div class="projects-state">
          I couldn't load GitHub projects right now.
          <a href="https://github.com/${this.username}?tab=repositories" target="_blank" rel="noopener">View them on GitHub</a>
        </div>
      `;
      console.error(error);
    }
  }

  renderProjects(repositories) {
    if (!repositories.length) {
      this.projectsGrid.innerHTML = `
        <div class="projects-state">
          No public repositories found yet.
        </div>
      `;
      return;
    }

    const cards = repositories.map((repo) => {
      const tags = this.getTags(repo);
      const isStarred = this.starredProjects.has(repo.name.toLowerCase());
      const tagsMarkup = tags.length
        ? `
          <div class="project-tags">
            ${tags.map((tag) => `<span class="project-tag">${this.escapeHtml(tag)}</span>`).join('')}
          </div>
        `
        : '';

      return `
        <article class="project-card${isStarred ? ' project-card-starred' : ''}">
          <img
            class="project-image"
            src="https://repository-images.githubusercontent.com/${repo.id}"
            alt="${this.escapeHtml(repo.name)} project preview"
            loading="lazy"
          />
          <div class="project-card-body">
            <div class="project-title-row">
              <div class="project-heading">
                <h4>${this.escapeHtml(repo.name)}</h4>
                ${isStarred ? '<span class="project-featured-badge">★ Featured</span>' : ''}
              </div>
              ${tagsMarkup}
            </div>
            <p class="project-description">${this.escapeHtml(repo.description || 'Project repository on GitHub.')}</p>
            <div class="project-links">
              <a href="${repo.html_url}" target="_blank" rel="noopener">GitHub Repo</a>
              ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" rel="noopener">Live Site</a>` : ''}
            </div>
          </div>
        </article>
      `;
    }).join('');

    this.projectsGrid.innerHTML = cards;
  }

  getTags(repo) {
    const tags = [];

    if (repo.language) {
      tags.push(repo.language);
    }

    if (Array.isArray(repo.topics) && repo.topics.length) {
      tags.push(...repo.topics.slice(0, 3));
    }

    if (!tags.length && repo.homepage) {
      tags.push('Deployed');
    }

    return tags.slice(0, 4);
  }

  escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }
}

function initContactForm() {
  const emailForm = document.getElementById('emailForm');
  if (!emailForm) {
    return;
  }

  emailForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    const mailto = `mailto:ssshanmukha.emani@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.location.href = mailto;
  });
}

function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const themeToggleIcon = document.getElementById('themeToggleIcon');

  if (!themeToggle || !themeToggleIcon) {
    return;
  }

  const setTheme = (theme) => {
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
  };

  let savedTheme = localStorage.getItem('theme');
  if (!savedTheme) {
    savedTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  setTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-mode');
    setTheme(isLight ? 'dark' : 'light');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  new PortfolioSlider();
  new AchievementsModal();
  new GitHubProjects('Sai-Emani25');
  initContactForm();
  initThemeToggle();
});
