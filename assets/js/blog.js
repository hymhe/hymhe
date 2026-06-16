/* HYMHE - Healthy Young Mind for Healthy Earth Blog JavaScript */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Reading Progress Bar ---
  const progressBar = document.querySelector('.reading-progress-bar');
  const article = document.querySelector('.blog-post-article');

  if (progressBar && article) {
    function updateProgress() {
      const rect = article.getBoundingClientRect();
      const articleHeight = article.offsetHeight;
      
      // Calculate how far down the article content we have scrolled
      const scrolled = window.innerHeight - rect.top;
      let progressPercent = 0;
      
      if (rect.top > window.innerHeight) {
        progressPercent = 0;
      } else if (rect.bottom < window.innerHeight) {
        progressPercent = 100;
      } else {
        progressPercent = (scrolled / articleHeight) * 100;
      }
      
      progressBar.style.width = Math.min(100, Math.max(0, progressPercent)) + '%';
    }
    
    window.addEventListener('scroll', updateProgress);
    window.addEventListener('resize', updateProgress);
    updateProgress();
  }

  // --- 2. Image Zoom Lightbox ---
  const articleImages = document.querySelectorAll('.blog-post-image-block img');
  if (articleImages.length > 0) {
    // Create lightbox DOM elements if they don't exist
    let lightbox = document.querySelector('.blog-lightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.className = 'blog-lightbox';
      lightbox.innerHTML = `
        <button class="blog-lightbox-close" aria-label="Close Image Preview">&times;</button>
        <img src="" alt="Expanded preview">
      `;
      document.body.appendChild(lightbox);
    }
    
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.blog-lightbox-close');
    
    function showLightbox(src, alt) {
      lightboxImg.src = src;
      lightboxImg.alt = alt || 'Expanded blog illustration';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden'; // Stop scrolling
    }
    
    function hideLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = ''; // Resume scrolling
    }
    
    articleImages.forEach(img => {
      img.addEventListener('click', () => {
        showLightbox(img.src, img.alt);
      });
    });
    
    closeBtn.addEventListener('click', hideLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        hideLightbox();
      }
    });
    
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        hideLightbox();
      }
    });
  }

  // --- 3. Future Search & Filtering Placeholders ---
  const searchInput = document.getElementById('blog-search-input');
  const categoryFilters = document.querySelectorAll('.blog-category-filter');
  const blogCards = document.querySelectorAll('.blog-card');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      filterBlogs(query);
    });
  }

  if (categoryFilters.length > 0) {
    categoryFilters.forEach(filter => {
      filter.addEventListener('click', (e) => {
        e.preventDefault();
        categoryFilters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');
        
        const category = filter.getAttribute('data-category');
        filterBlogsByCat(category);
      });
    });
  }

  function filterBlogs(query) {
    console.log(`Searching blogs for keyword: "${query}"`);
    blogCards.forEach(card => {
      const title = card.querySelector('.blog-card-title').textContent.toLowerCase();
      const excerpt = card.querySelector('.blog-card-excerpt').textContent.toLowerCase();
      
      if (title.includes(query) || excerpt.includes(query)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  function filterBlogsByCat(category) {
    console.log(`Filtering blogs by category: "${category}"`);
    blogCards.forEach(card => {
      const cardCategory = card.querySelector('.blog-card-category').textContent.toLowerCase();
      
      if (category === 'all' || cardCategory === category.toLowerCase()) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // --- 4. Smooth Scrolling for Anchor Links ---
  const localAnchors = document.querySelectorAll('a[href^="#"]');
  localAnchors.forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
});
