/**
 * Textbook JavaScript
 * Handles sidebar outline generation, scroll progress tracking, and navigation
 */

(function() {
  'use strict';

  // Configuration
  const CHAPTERS = [
    { id: 'chapter0', num: 0, title: 'What Is a Thought?', part: 'Foundations' },
    { id: 'chapter1', num: 1, title: 'A Short History of Nearly Everything About Minds', part: 'Foundations' },
    { id: 'chapter2', num: 2, title: 'The Language of Electricity', part: 'Foundations' },
    { id: 'chapter3', num: 3, title: 'Chemical Conversations', part: 'Foundations' },
    { id: 'chapter4', num: 4, title: 'Wiring and Rewiring', part: 'Foundations' },
    { id: 'chapter5', num: 5, title: 'The Architecture of Mind', part: 'Structure & Systems' },
    { id: 'chapter6', num: 6, title: 'Sensing the World', part: 'Structure & Systems' },
    { id: 'chapter7', num: 7, title: 'Seeing Is Believing', part: 'Structure & Systems' },
    { id: 'chapter8', num: 8, title: 'The Spotlight of Attention', part: 'Structure & Systems' },
    { id: 'chapter9', num: 9, title: 'Moving Through the World', part: 'Structure & Systems' },
    { id: 'chapter10', num: 10, title: 'Learning and Memory', part: 'Higher Functions' },
    { id: 'chapter11', num: 11, title: 'Executive Function', part: 'Higher Functions' },
    { id: 'chapter12', num: 12, title: 'Sleep and Consciousness', part: 'Higher Functions' },
    { id: 'chapter13', num: 13, title: 'Psychopharmacology', part: 'Higher Functions' },
    { id: 'chapter14', num: 14, title: 'Synthesis and Future Horizons', part: 'Higher Functions' }
  ];

  // Get current chapter from URL
  function getCurrentChapter() {
    const path = window.location.pathname;
    const match = path.match(/chapter(\d+)\.html/);
    if (match) {
      return parseInt(match[1], 10);
    }
    return null;
  }

  // Build sidebar outline from headings
  function buildOutline() {
    const article = document.querySelector('article.chapter');
    if (!article) return null;

    const headings = article.querySelectorAll('h2, h3');
    if (headings.length === 0) return null;

    const outline = document.createElement('nav');
    outline.className = 'chapter-outline';
    outline.setAttribute('aria-label', 'Chapter outline');

    const list = document.createElement('ul');
    list.className = 'outline-list';

    headings.forEach((heading, index) => {
      // Add id if missing
      if (!heading.id) {
        heading.id = 'section-' + index;
      }

      const li = document.createElement('li');
      li.className = 'outline-item' + (heading.tagName === 'H3' ? ' outline-item--sub' : '');

      const link = document.createElement('a');
      link.href = '#' + heading.id;
      link.className = 'outline-link';
      link.textContent = heading.textContent;
      link.dataset.target = heading.id;

      li.appendChild(link);
      list.appendChild(li);
    });

    outline.appendChild(list);
    return outline;
  }

  // Create table of contents navigation
  function createChapterNavigation() {
    const currentChapter = getCurrentChapter();
    
    const container = document.createElement('nav');
    container.className = 'chapter-navigation';
    container.setAttribute('aria-label', 'Chapter navigation');

    const title = document.createElement('div');
    title.className = 'sidebar-title';
    title.textContent = 'All Chapters';
    container.appendChild(title);

    // Add home/contents link
    const homeLink = document.createElement('a');
    homeLink.href = 'index.html';
    homeLink.className = 'toc-home-link';
    homeLink.innerHTML = '<span class="home-icon">←</span> <span>Contents</span>';
    container.appendChild(homeLink);

    // Group chapters by part
    const parts = {
      'Foundations': [],
      'Structure & Systems': [],
      'Higher Functions': []
    };

    CHAPTERS.forEach(chapter => {
      parts[chapter.part].push(chapter);
    });

    // Create sections for each part
    Object.keys(parts).forEach(partName => {
      const partSection = document.createElement('div');
      partSection.className = 'toc-part';

      const partTitle = document.createElement('div');
      partTitle.className = 'toc-part-title';
      partTitle.textContent = partName;
      partSection.appendChild(partTitle);

      const chapterList = document.createElement('ul');
      chapterList.className = 'toc-chapter-list';

      parts[partName].forEach(chapter => {
        const li = document.createElement('li');
        li.className = 'toc-chapter-item';
        if (currentChapter === chapter.num) {
          li.classList.add('current-chapter');
        }

        const link = document.createElement('a');
        link.href = chapter.id + '.html';
        link.className = 'toc-chapter-link';

        const num = document.createElement('span');
        num.className = 'toc-chapter-num';
        num.textContent = chapter.num;

        const titleSpan = document.createElement('span');
        titleSpan.className = 'toc-chapter-title';
        titleSpan.textContent = chapter.title;

        link.appendChild(num);
        link.appendChild(titleSpan);
        li.appendChild(link);
        chapterList.appendChild(li);
      });

      partSection.appendChild(chapterList);
      container.appendChild(partSection);
    });

    return container;
  }

  // Create chapter progress indicator (for outline sidebar)
  function createChapterProgress() {
    const container = document.createElement('div');
    container.className = 'progress-indicator';

    const chapterProgress = document.createElement('div');
    chapterProgress.className = 'progress-section';

    const chapterLabel = document.createElement('div');
    chapterLabel.className = 'progress-label';
    chapterLabel.textContent = 'Chapter Progress';

    const chapterBar = document.createElement('div');
    chapterBar.className = 'progress-bar';

    const chapterFill = document.createElement('div');
    chapterFill.className = 'progress-fill';
    chapterFill.id = 'chapter-progress-fill';

    chapterBar.appendChild(chapterFill);
    chapterProgress.appendChild(chapterLabel);
    chapterProgress.appendChild(chapterBar);

    container.appendChild(chapterProgress);

    return container;
  }

  // Create book progress indicator (for TOC sidebar)
  function createBookProgress() {
    const currentChapter = getCurrentChapter();
    if (currentChapter === null) return null;

    const container = document.createElement('div');
    container.className = 'progress-indicator';

    const overallProgress = document.createElement('div');
    overallProgress.className = 'progress-section';

    const overallLabel = document.createElement('div');
    overallLabel.className = 'progress-label';
    overallLabel.textContent = 'Book Progress';

    const overallBar = document.createElement('div');
    overallBar.className = 'progress-bar';

    const overallFill = document.createElement('div');
    overallFill.className = 'progress-fill';
    overallFill.id = 'overall-progress-fill';
    
    // Calculate overall progress based on current chapter
    const overallPercent = ((currentChapter + 1) / CHAPTERS.length) * 100;
    overallFill.style.width = overallPercent + '%';

    overallBar.appendChild(overallFill);
    overallProgress.appendChild(overallLabel);
    overallProgress.appendChild(overallBar);

    // Chapter info
    const chapterInfo = document.createElement('div');
    chapterInfo.className = 'progress-chapter-info';
    chapterInfo.textContent = 'Chapter ' + currentChapter + ' of ' + (CHAPTERS.length - 1);

    container.appendChild(overallProgress);
    container.appendChild(chapterInfo);

    return container;
  }

  // Create table of contents sidebar (all chapters)
  function createTocSidebar() {
    const chapterNav = createChapterNavigation();
    const bookProgress = createBookProgress();

    if (!chapterNav) return null;

    const sidebar = document.createElement('aside');
    sidebar.className = 'sidebar-toc';
    sidebar.setAttribute('aria-label', 'Table of contents');

    if (chapterNav) {
      sidebar.appendChild(chapterNav);
    }

    if (bookProgress) {
      sidebar.appendChild(bookProgress);
    }

    return sidebar;
  }

  // Create outline sidebar (on this page)
  function createOutlineSidebar() {
    const outline = buildOutline();

    if (!outline) return null;

    const sidebar = document.createElement('aside');
    sidebar.className = 'sidebar-outline';
    sidebar.setAttribute('aria-label', 'Chapter outline');

    const sidebarTitle = document.createElement('div');
    sidebarTitle.className = 'sidebar-title';
    sidebarTitle.textContent = 'On This Page';

    sidebar.appendChild(sidebarTitle);
    sidebar.appendChild(outline);

    // Add chapter progress to outline sidebar
    const chapterProgress = createChapterProgress();
    if (chapterProgress) {
      sidebar.appendChild(chapterProgress);
    }

    return sidebar;
  }

  // Update active outline link based on scroll position
  function updateActiveLink() {
    const headings = document.querySelectorAll('article.chapter h2, article.chapter h3');
    const links = document.querySelectorAll('.outline-link');
    
    if (headings.length === 0 || links.length === 0) return;

    const scrollTop = window.scrollY;
    const offset = 100; // pixels from top to consider "active"

    let activeId = null;

    headings.forEach(heading => {
      const rect = heading.getBoundingClientRect();
      const top = rect.top + scrollTop - offset;
      
      if (scrollTop >= top) {
        activeId = heading.id;
      }
    });

    links.forEach(link => {
      if (link.dataset.target === activeId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Update chapter progress based on scroll position
  function updateChapterProgress() {
    const fill = document.getElementById('chapter-progress-fill');
    if (!fill) return;

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollTop = window.scrollY;
    const progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));

    fill.style.width = progress + '%';
  }

  // Smooth scroll to heading
  function handleOutlineClick(e) {
    const link = e.target.closest('.outline-link');
    if (!link) return;

    e.preventDefault();
    const targetId = link.dataset.target;
    const target = document.getElementById(targetId);

    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      
      window.scrollTo({
        top: top,
        behavior: 'smooth'
      });

      // Update URL without jumping
      history.pushState(null, '', '#' + targetId);
    }
  }

  // Initialize
  function init() {
    // Only run on chapter pages
    const article = document.querySelector('article.chapter');
    if (!article) return;

    const tocSidebar = createTocSidebar();
    const outlineSidebar = createOutlineSidebar();

    // Wrap article in layout container
    const layout = document.createElement('div');
    layout.className = 'chapter-layout';

    article.parentNode.insertBefore(layout, article);
    
    // Add TOC sidebar if it exists
    if (tocSidebar) {
      layout.appendChild(tocSidebar);
    }

    // Create content wrapper for outline and article
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'content-wrapper';
    layout.appendChild(contentWrapper);

    // Add outline sidebar if it exists
    if (outlineSidebar) {
      contentWrapper.appendChild(outlineSidebar);
      // Event listener for outline clicks
      outlineSidebar.addEventListener('click', handleOutlineClick);
    }

    // Add article
    contentWrapper.appendChild(article);

    // Event listeners for scroll
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateActiveLink();
          updateChapterProgress();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Initial update
    updateActiveLink();
    updateChapterProgress();
  }

  // Initialize index page sidebar
  function initIndexPage() {
    const sidebar = document.getElementById('index-sidebar');
    if (!sidebar) return;

    const chapterNav = createChapterNavigation();
    if (chapterNav) {
      sidebar.appendChild(chapterNav);
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init();
      initIndexPage();
    });
  } else {
    init();
    initIndexPage();
  }
})();


