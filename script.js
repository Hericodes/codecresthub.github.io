/**
 * CodeCrest Hub - Main JavaScript
 * Enhanced with accessibility, performance, and better mobile experience
 */

(function() {
  'use strict';
  
  // Configuration
  const CONFIG = {
    observerThreshold: 0.1,
    observerRootMargin: '0px 0px -100px 0px',
    mobileBreakpoint: 880,
    scrollBehavior: 'smooth'
  };
  
  // State management
  const state = {
    isModalOpen: false,
    isMobileMenuOpen: false,
    lastFocusedElement: null
  };
  
  /**
   * Initialize everything when DOM is ready
   */
  function init() {
    // Set current year in footer
    updateCurrentYear();
    
    // Initialize mobile navigation
    initMobileNavigation();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize program cards
    initProgramCards();
    
    // Initialize timeline keyboard navigation
    initTimelineNavigation();
    
    // Initialize modal
    initModal();
    
    // Handle window resize
    initResizeHandler();
    
    // Add keyboard shortcuts
    initKeyboardShortcuts();
    
    // Log initialization
    console.log('CodeCrest Hub initialized successfully 🚀');
  }
  
  /**
   * Update current year in footer
   */
  function updateCurrentYear() {
    try {
      const yearSpan = document.getElementById('year');
      if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
      }
    } catch (error) {
      console.error('Error updating year:', error);
    }
  }
  
  /**
   * Initialize mobile navigation with accessibility
   */
  function initMobileNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav');
    const navClose = document.querySelector('.nav-close');
    const body = document.body;
    
    if (!navToggle || !navMenu) return;
    
    // Toggle mobile menu
    function toggleMobileMenu() {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
      navMenu.classList.toggle('nav--mobile-open', state.isMobileMenuOpen);
      navToggle.setAttribute('aria-expanded', state.isMobileMenuOpen);
      
      if (state.isMobileMenuOpen) {
        // Store last focused element
        state.lastFocusedElement = document.activeElement;
        // Trap focus in mobile menu
        trapFocus(navMenu);
        // Prevent body scroll
        body.style.overflow = 'hidden';
        // Focus first item in menu
        const firstNavItem = navMenu.querySelector('a');
        if (firstNavItem) firstNavItem.focus();
      } else {
        // Restore body scroll
        body.style.overflow = '';
        // Restore focus
        if (state.lastFocusedElement) {
          state.lastFocusedElement.focus();
          state.lastFocusedElement = null;
        }
      }
    }
    
    // Close mobile menu
    function closeMobileMenu() {
      state.isMobileMenuOpen = false;
      navMenu.classList.remove('nav--mobile-open');
      navToggle.setAttribute('aria-expanded', 'false');
      body.style.overflow = '';
      
      if (state.lastFocusedElement) {
        state.lastFocusedElement.focus();
        state.lastFocusedElement = null;
      }
    }
    
    // Event listeners
    navToggle.addEventListener('click', toggleMobileMenu);
    
    if (navClose) {
      navClose.addEventListener('click', closeMobileMenu);
    }
    
    // Close menu when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (state.isMobileMenuOpen && 
          !navMenu.contains(e.target) && 
          !navToggle.contains(e.target)) {
        closeMobileMenu();
      }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (state.isMobileMenuOpen && e.key === 'Escape') {
        closeMobileMenu();
      }
    });
    
    // Close menu on window resize above breakpoint
    window.addEventListener('resize', () => {
      if (window.innerWidth > CONFIG.mobileBreakpoint && state.isMobileMenuOpen) {
        closeMobileMenu();
      }
    });
  }
  
  /**
   * Initialize scroll animations with Intersection Observer
   */
  function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal, .card-anim');
    
    if (!('IntersectionObserver' in window)) {
      // Fallback for older browsers
      revealElements.forEach(el => el.classList.add('visible'));
      return;
    }
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          } else {
            // Remove class when element leaves viewport
            entry.target.classList.remove('visible');
          }
        });
      },
      {
        threshold: CONFIG.observerThreshold,
        rootMargin: CONFIG.observerRootMargin
      }
    );
    
    revealElements.forEach(el => observer.observe(el));
  }
  
  /**
   * Initialize program cards with modal functionality
   */
  function initProgramCards() {
    // Select only regular program cards (not the WhatsApp link)
    const programCards = document.querySelectorAll('.program-card:not(.waitlist-link)');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    
    if (!programCards.length || !modal) return;
    
    programCards.forEach(card => {
      const programName = card.getAttribute('data-program') || 'Program';
      const programStatus = card.querySelector('.program-status')?.textContent || 'Coming Soon';
      
      // Make cards clickable
      card.style.cursor = 'pointer';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `Learn about ${programName} program`);
      
      // Click handler
      card.addEventListener('click', () => {
        openProgramModal(programName, programStatus);
      });
      
      // Keyboard support
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });
    
    // Program modal function
    window.openProgramModal = function(programName, launchInfo) {
      if (!modal || state.isModalOpen) return;
      
      state.isModalOpen = true;
      state.lastFocusedElement = document.activeElement;
      
      // Update modal content
      if (modalTitle) {
        modalTitle.textContent = `${programName} Program`;
      }
      if (modalDesc) {
        modalDesc.innerHTML = `
          <p>The <strong>${programName}</strong> program is currently in development.</p>
          <p><strong>Expected Launch:</strong> ${launchInfo}</p>
          <p>We're building a comprehensive, project-based program with:</p>
          <ul style="text-align: left; margin: 15px 0; padding-left: 20px;">
            <li>Hands-on projects and real-world applications</li>
            <li>Industry mentorship and guidance</li>
            <li>Career pathway support</li>
            <li>Community access and networking</li>
          </ul>
          <p>Want to stay updated? Join our WhatsApp community to connect with other learners and get launch notifications!</p>
        `;
      }
      
      // Update modal buttons
      const closeButton = document.getElementById('close-modal');
      const whatsappButton = document.getElementById('whatsapp-link');
      
      if (whatsappButton) {
        whatsappButton.textContent = 'Join WhatsApp Group';
        whatsappButton.href = 'https://wa.me/2349131575084';
        whatsappButton.onclick = null; // Remove any previous handlers
      }
      
      if (closeButton) {
        closeButton.textContent = 'Close';
        closeButton.onclick = window.closeModal;
      }
      
      // Show modal
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Trap focus in modal
      trapFocus(modal);
      
      // Focus close button
      const closeBtn = modal.querySelector('.modal-close, #close-modal');
      if (closeBtn) closeBtn.focus();
    };
  }
  
  /**
   * Initialize modal functionality
   */
  function initModal() {
    const modal = document.getElementById('modal');
    const closeButtons = modal ? modal.querySelectorAll('.modal-close, #close-modal') : [];
    
    if (!modal) return;
    
    // Close modal on button click
    closeButtons.forEach(btn => {
      btn.addEventListener('click', window.closeModal);
    });
    
    // Close modal on background click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        window.closeModal();
      }
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
      if (state.isModalOpen && e.key === 'Escape') {
        window.closeModal();
      }
    });
  }
  
  /**
   * Initialize timeline keyboard navigation
   */
  function initTimelineNavigation() {
    const timelineWrap = document.querySelector('.timeline-wrap');
    
    if (!timelineWrap) return;
    
    timelineWrap.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        timelineWrap.scrollBy({ left: 320, behavior: CONFIG.scrollBehavior });
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        timelineWrap.scrollBy({ left: -320, behavior: CONFIG.scrollBehavior });
      }
    });
    
    // Add touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    timelineWrap.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    timelineWrap.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleTimelineSwipe();
    });
    
    function handleTimelineSwipe() {
      const swipeThreshold = 50;
      const swipeDistance = touchEndX - touchStartX;
      
      if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
          // Swipe right - scroll left
          timelineWrap.scrollBy({ left: -320, behavior: CONFIG.scrollBehavior });
        } else {
          // Swipe left - scroll right
          timelineWrap.scrollBy({ left: 320, behavior: CONFIG.scrollBehavior });
        }
      }
    }
  }
  
  /**
   * Initialize resize handler
   */
  function initResizeHandler() {
    let resizeTimeout;
    
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Handle any resize-specific logic here
      }, 250);
    });
  }
  
  /**
   * Initialize keyboard shortcuts
   */
  function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Skip if user is typing in an input
      if (e.target.matches('input, textarea, select')) return;
      
      // Escape key closes modals/menus
      if (e.key === 'Escape') {
        if (state.isModalOpen) window.closeModal();
        if (state.isMobileMenuOpen) {
          const navToggle = document.querySelector('.nav-toggle');
          if (navToggle) navToggle.click();
        }
      }
      
      // '/' key focuses search (if you add search later)
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        // Add search functionality here
      }
    });
  }
  
  /**
   * Trap focus within an element for accessibility
   */
  function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    function handleTabKey(e) {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
    
    element.addEventListener('keydown', handleTabKey);
    
    // Cleanup function
    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  }
  
  /**
   * Close modal function
   */
  window.closeModal = function() {
    const modal = document.getElementById('modal');
    if (!modal || !state.isModalOpen) return;
    
    state.isModalOpen = false;
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Restore focus
    if (state.lastFocusedElement) {
      state.lastFocusedElement.focus();
      state.lastFocusedElement = null;
    }
  };
  
  /**
   * Utility: Debounce function for performance
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  /**
   * Utility: Throttle function for performance
   */
  function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Make functions available globally if needed
  window.CodeCrestHub = {
    openProgramModal: window.openProgramModal,
    closeModal: window.closeModal
  };
})();