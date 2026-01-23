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
    lastFocusedElement: null,
    activeModal: null
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
    
    // Initialize Career Guidance
    initCareerGuidance();
    
    // Initialize AI Assistant
    initAIAssistant();
    
    // Handle window resize
    initResizeHandler();
    
    // Add keyboard shortcuts
    initKeyboardShortcuts();
    
    // Log initialization
    console.log('🚀 CodeCrest Hub initialized successfully');
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
      state.activeModal = 'program';
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
        whatsappButton.href = 'https://chat.whatsapp.com/CmUJec2yU4QFihAx3Dmea6';
        whatsappButton.onclick = null;
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
      if (state.isModalOpen && e.key === 'Escape' && state.activeModal === 'program') {
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
        if (state.isModalOpen) {
          if (state.activeModal === 'program') window.closeModal();
          if (state.activeModal === 'career') window.closeCareerModal();
        }
        if (state.isMobileMenuOpen) {
          const navToggle = document.querySelector('.nav-toggle');
          if (navToggle) navToggle.click();
        }
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
    
    // Return cleanup function
    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  }
  
  /**
   * Close modal function
   */
  window.closeModal = function() {
    const modal = document.getElementById('modal');
    if (!modal || !state.isModalOpen || state.activeModal !== 'program') return;
    
    state.isModalOpen = false;
    state.activeModal = null;
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Restore focus
    if (state.lastFocusedElement) {
      state.lastFocusedElement.focus();
      state.lastFocusedElement = null;
    }
  };
  
  /**
   * Initialize Career Guidance features
   */
  function initCareerGuidance() {
    const registerBtn = document.getElementById('registerCareerBtn');
    const careerModal = document.getElementById('careerModal');
    const careerForm = document.getElementById('careerRegistrationForm');
    const careerModalClose = careerModal?.querySelector('.modal-close');
    
    if (!registerBtn || !careerModal) return;
    
    // Open career modal
    registerBtn.addEventListener('click', () => {
      openCareerModal();
    });
    
    // Career modal functionality
    window.openCareerModal = function() {
      if (state.isModalOpen) return;
      
      state.isModalOpen = true;
      state.activeModal = 'career';
      state.lastFocusedElement = document.activeElement;
      
      // Show career modal
      careerModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Trap focus in modal
      trapFocus(careerModal);
      
      // Focus first input
      const firstInput = careerForm?.querySelector('input');
      if (firstInput) firstInput.focus();
    };
    
    // Close career modal
    window.closeCareerModal = function() {
      if (!state.isModalOpen || state.activeModal !== 'career') return;
      
      state.isModalOpen = false;
      state.activeModal = null;
      careerModal.classList.remove('active');
      document.body.style.overflow = '';
      
      // Restore focus
      if (state.lastFocusedElement) {
        state.lastFocusedElement.focus();
        state.lastFocusedElement = null;
      }
    };
    
    // Close modal buttons
    if (careerModalClose) {
      careerModalClose.addEventListener('click', window.closeCareerModal);
    }
    
    // Close modal on background click
    careerModal.addEventListener('click', (e) => {
      if (e.target === careerModal) {
        window.closeCareerModal();
      }
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
      if (state.isModalOpen && e.key === 'Escape' && careerModal.classList.contains('active')) {
        window.closeCareerModal();
      }
    });
    
    // Handle career form submission
    if (careerForm) {
      careerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('careerName').value;
        const email = document.getElementById('careerEmail').value;
        const interest = document.getElementById('careerInterest').value;
        const experience = document.getElementById('careerExperience').value;
        
        // Basic validation
        if (!name || !email || !interest || !experience) {
          alert('Please fill in all fields.');
          return;
        }
        
        // In a real application, you would send this data to your server
        // For now, we'll just show a success message
        alert(`Thank you ${name}! Your interest in the Career Guidance Program has been registered. We'll contact you at ${email} when registration opens.`);
        
        // Reset form
        careerForm.reset();
        
        // Close modal
        window.closeCareerModal();
      });
    }
  }
  
  /**
   * Initialize Floating AI Chat Widget
   */
  function initAIAssistant() {
    const aiToggle = document.getElementById('aiWidgetToggle');
    const aiContainer = document.getElementById('aiWidgetContainer');
    const aiClose = document.getElementById('aiWidgetClose');
    const aiMessages = document.getElementById('aiWidgetMessages');
    const aiInput = document.getElementById('aiWidgetInput');
    const aiSend = document.getElementById('aiWidgetSend');
    const quickQuestions = document.querySelectorAll('.quick-question-btn');
    const aiNotification = document.getElementById('aiNotification');
    
    if (!aiToggle || !aiContainer) return;
    
    let isWidgetOpen = false;
    let unreadMessages = 1; // Initial welcome message
    
    // AI Responses database
    const aiResponses = {
      'career guidance': {
        question: /career guidance|program details|what is the career|guidance program/i,
        response: `The <strong>Career Guidance Program</strong> is a 1-hour intensive empowerment session designed for a maximum of 20 individuals. It focuses on:<br><br>
        • Understanding in-demand tech skills<br>
        • Navigating the tech industry landscape<br>
        • Career path insights and progression strategies<br>
        • Networking with fellow tech enthusiasts<br>
        • Access to curated learning resources<br><br>
        The program launches next month - register your interest now!`
      },
      'registration': {
        question: /register|sign up|how to join|enroll|application/i,
        response: `To register for the Career Guidance Program:<br><br>
        1. Click the "Register Interest" button<br>
        2. Fill in your details in the registration form<br>
        3. We'll contact you when registration opens next month<br>
        4. Limited to 20 spots per session - early registration is recommended!<br><br>
        You can also join our <a href="https://chat.whatsapp.com/CmUJec2yU4QFihAx3Dmea6" target="_blank" style="color: #6c5ce7; font-weight: 600;">WhatsApp community</a> for updates.`
      },
      'tech skills': {
        question: /tech skills|what should i learn|skills in demand|technical skills/i,
        response: `Based on current industry trends, these are the most in-demand tech skills:<br><br>
        <strong>High Demand:</strong><br>
        • Web Development (JavaScript, React, Node.js)<br>
        • Data Analysis & Visualization<br>
        • Cloud Computing (AWS, Azure)<br>
        • Cybersecurity Fundamentals<br><br>
        <strong>Emerging Skills:</strong><br>
        • AI & Machine Learning basics<br>
        • Blockchain fundamentals<br>
        • DevOps practices<br><br>
        Our Career Guidance Program will help you choose the right path based on your interests!`
      },
      'about company': {
        question: /about codecrest|company|who are you|about us/i,
        response: `CodeCrest Hub is a technology learning and growth hub dedicated to bridging the gap between learning and real-world application. We empower learners with practical skills and pathways into tech careers through:<br><br>
        • Project-based learning approaches<br>
        • Continuous mentorship from industry professionals<br>
        • Community support and networking<br>
        • Career pathways and placement assistance<br><br>
        Our mission is to shape tech leaders through affordable, practical, and community-driven education.`
      },
      'courses': {
        question: /courses|programs|what do you teach|offerings/i,
        response: `We offer hands-on courses in:<br><br>
        • <strong>Data Analysis</strong> - From spreadsheets to data storytelling<br>
        • <strong>Web Development</strong> - Modern, responsive websites and apps<br>
        • <strong>Cybersecurity</strong> - Fundamentals of system protection<br>
        • <strong>Digital Marketing</strong> - Practical growth strategies<br>
        • <strong>AI/ML</strong> - Applied machine learning projects<br><br>
        All programs feature project-based learning and mentorship. Check our Programs section for launch dates!`
      },
      'pricing': {
        question: /price|cost|affordable|fee|how much/i,
        response: `We believe in accessible education. Our pricing model includes:<br><br>
        • <strong>Career Guidance Program:</strong> Affordable session-based pricing<br>
        • <strong>Main Courses:</strong> Competitive rates with flexible payment options<br>
        • <strong>Scholarships:</strong> Available for eligible candidates<br>
        • <strong>Community Access:</strong> Free resources and networking<br><br>
        Specific pricing details are shared when programs launch. Join our WhatsApp group for early bird offers!`
      },
      'default': {
        response: `I'm here to help! I can answer questions about:<br><br>
        • Career Guidance Program details<br>
        • Course information and schedules<br>
        • Registration processes<br>
        • Tech career advice<br>
        • Company information<br><br>
        Try asking one of the suggested questions or type your specific query!`
      }
    };
    
    // Toggle widget
    function toggleWidget() {
      isWidgetOpen = !isWidgetOpen;
      aiContainer.classList.toggle('active', isWidgetOpen);
      aiToggle.setAttribute('aria-expanded', isWidgetOpen);
      
      if (isWidgetOpen) {
        // Reset notification when opened
        unreadMessages = 0;
        updateNotification();
        // Focus input when opened
        setTimeout(() => aiInput.focus(), 300);
      }
    }
    
    // Update notification badge
    function updateNotification() {
      if (unreadMessages > 0) {
        aiNotification.textContent = unreadMessages;
        aiNotification.style.display = 'flex';
        aiToggle.style.animation = 'pulse 2s infinite';
      } else {
        aiNotification.style.display = 'none';
        aiToggle.style.animation = 'none';
      }
    }
    
    // Add message to chat
    function addMessage(content, isUser = false) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `ai-widget-message ${isUser ? 'user-message' : 'ai-message'}`;
      
      const messageContent = document.createElement('div');
      messageContent.className = 'message-content';
      messageContent.innerHTML = `<p>${content}</p>`;
      
      messageDiv.appendChild(messageContent);
      aiMessages.appendChild(messageDiv);
      
      // Scroll to bottom
      aiMessages.scrollTop = aiMessages.scrollHeight;
      
      // Add notification if widget is closed
      if (!isWidgetOpen && !isUser) {
        unreadMessages++;
        updateNotification();
      }
    }
    
    // Get AI response
    function getAIResponse(question) {
      question = question.toLowerCase().trim();
      
      // Check for matches
      for (const key in aiResponses) {
        if (key !== 'default' && aiResponses[key].question.test(question)) {
          return aiResponses[key].response;
        }
      }
      
      // Default response
      return aiResponses.default.response;
    }
    
    // Show typing indicator
    function showTypingIndicator() {
      const typingDiv = document.createElement('div');
      typingDiv.className = 'ai-widget-message ai-message typing-indicator';
      typingDiv.innerHTML = `
        <div class="message-content">
          <span></span>
          <span></span>
          <span></span>
        </div>
      `;
      aiMessages.appendChild(typingDiv);
      aiMessages.scrollTop = aiMessages.scrollHeight;
      return typingDiv;
    }
    
    // Handle send message
    function sendMessage() {
      const question = aiInput.value.trim();
      
      if (!question) {
        aiInput.focus();
        return;
      }
      
      // Add user message
      addMessage(question, true);
      
      // Clear input
      aiInput.value = '';
      aiInput.style.height = 'auto';
      
      // Show typing indicator
      const typingIndicator = showTypingIndicator();
      
      // Simulate AI thinking delay
      setTimeout(() => {
        // Remove typing indicator
        typingIndicator.remove();
        
        // Get and add AI response
        const response = getAIResponse(question);
        addMessage(response);
      }, 800 + Math.random() * 800);
    }
    
    // Event listeners
    aiToggle.addEventListener('click', toggleWidget);
    aiClose.addEventListener('click', () => {
      isWidgetOpen = false;
      aiContainer.classList.remove('active');
      aiToggle.setAttribute('aria-expanded', 'false');
    });
    
    aiSend.addEventListener('click', sendMessage);
    
    aiInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
    
    // Auto-resize textarea
    aiInput.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 100) + 'px';
    });
    
    // Quick questions
    quickQuestions.forEach(btn => {
      btn.addEventListener('click', () => {
        const question = btn.getAttribute('data-question');
        aiInput.value = question;
        aiInput.focus();
        aiInput.style.height = Math.min(aiInput.scrollHeight, 100) + 'px';
        
        // If widget is closed, open it
        if (!isWidgetOpen) {
          toggleWidget();
        }
      });
    });
    
    // Close widget when clicking outside
    document.addEventListener('click', (e) => {
      if (isWidgetOpen && 
          !aiContainer.contains(e.target) && 
          !aiToggle.contains(e.target)) {
        toggleWidget();
      }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (isWidgetOpen && e.key === 'Escape') {
        toggleWidget();
      }
    });
    
    // Auto-open on page load after 5 seconds
    setTimeout(() => {
      if (!isWidgetOpen) {
        unreadMessages = 1;
        updateNotification();
      }
    }, 5000);
    
    // Make widget draggable on desktop
    let isDragging = false;
    let startX, startY, initialX, initialY;
    
    // Only enable dragging on desktop
    if (window.innerWidth > 768) {
      aiToggle.addEventListener('mousedown', startDrag);
      
      function startDrag(e) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        initialX = aiToggle.offsetLeft;
        initialY = aiToggle.offsetTop;
        
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
      }
      
      function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        aiToggle.style.left = `${initialX + dx}px`;
        aiToggle.style.top = `${initialY + dy}px`;
        aiToggle.style.position = 'fixed';
        aiToggle.style.right = 'auto';
        aiToggle.style.bottom = 'auto';
      }
      
      function stopDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
        
        // Snap to edges after 1 second
        setTimeout(snapToEdge, 1000);
      }
      
      function snapToEdge() {
        const toggleRect = aiToggle.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Reset to original position if near it
        if (Math.abs(toggleRect.right - (windowWidth - 30)) < 50 && 
            Math.abs(toggleRect.bottom - (windowHeight - 30)) < 50) {
          resetPosition();
          return;
        }
        
        // Snap to nearest edge
        const leftDistance = toggleRect.left;
        const rightDistance = windowWidth - toggleRect.right;
        const topDistance = toggleRect.top;
        const bottomDistance = windowHeight - toggleRect.bottom;
        
        const minDistance = Math.min(leftDistance, rightDistance, topDistance, bottomDistance);
        
        aiToggle.style.transition = 'all 0.3s ease';
        
        if (minDistance === leftDistance) {
          // Snap to left
          aiToggle.style.left = '30px';
          aiToggle.style.top = `${toggleRect.top}px`;
          aiToggle.style.right = 'auto';
          aiToggle.style.bottom = 'auto';
        } else if (minDistance === rightDistance) {
          // Snap to right
          aiToggle.style.left = 'auto';
          aiToggle.style.right = '30px';
          aiToggle.style.top = `${toggleRect.top}px`;
          aiToggle.style.bottom = 'auto';
        } else if (minDistance === topDistance) {
          // Snap to top
          aiToggle.style.left = `${toggleRect.left}px`;
          aiToggle.style.top = '30px';
          aiToggle.style.right = 'auto';
          aiToggle.style.bottom = 'auto';
        } else {
          // Snap to bottom
          aiToggle.style.left = `${toggleRect.left}px`;
          aiToggle.style.top = 'auto';
          aiToggle.style.right = 'auto';
          aiToggle.style.bottom = '30px';
        }
        
        setTimeout(() => {
          aiToggle.style.transition = '';
        }, 300);
      }
      
      function resetPosition() {
        aiToggle.style.transition = 'all 0.3s ease';
        aiToggle.style.left = '';
        aiToggle.style.top = '';
        aiToggle.style.right = '30px';
        aiToggle.style.bottom = '30px';
        
        setTimeout(() => {
          aiToggle.style.transition = '';
        }, 300);
      }
    }
  }
  
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
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Make functions available globally if needed
  window.CodeCrestHub = {
    openProgramModal: window.openProgramModal,
    closeModal: window.closeModal,
    openCareerModal: window.openCareerModal,
    closeCareerModal: window.closeCareerModal
  };
})();
