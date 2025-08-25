document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileMenu = document.getElementById('mobile-menu');
  const menuButton = document.getElementById('menu-button');
  const closeButton = document.getElementById('menu-close-button'); // Ensure you have a close button in the mobile menu
  const focusableElements = mobileMenu ? mobileMenu.querySelectorAll('a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])') : []; // Select focusable elements

  if (menuButton && mobileMenu && closeButton) {
    menuButton.addEventListener('click', () => {
      mobileMenu.classList.add('active');
      document.body.classList.add('mobile-menu-open');
      if (focusableElements.length > 0) {
        focusableElements[0].focus(); // Focus the first focusable element when the menu opens
      }

    });

    closeButton.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      document.body.classList.remove('mobile-menu-open');
      menuButton.focus(); // Return focus to the menu button after closing
    });

    document.addEventListener('keydown', (event) => {
      if (mobileMenu.classList.contains('active')) {
        if (event.key === 'Escape') {
          mobileMenu.classList.remove('active');
          document.body.classList.remove('mobile-menu-open');
          menuButton.focus();
        }

        // Trap Focus (simplified) - needs better handling for complex menus
        if (event.key === 'Tab') {
          const isTabForward = !event.shiftKey;
          const firstFocusable = focusableElements[0];
          const lastFocusable = focusableElements[focusableElements.length - 1];

          if (isTabForward) {
            if (document.activeElement === lastFocusable) {
              firstFocusable.focus();
              event.preventDefault();
            }
          } else {
            if (document.activeElement === firstFocusable) {
              lastFocusable.focus();
              event.preventDefault();
            }
          }
        }
      }
    });
  }

  // Smooth Scroll & Back to Top
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 50, // Adjust for fixed header
          behavior: 'smooth'
        });
      }
    });
  });

  const backToTopButton = document.getElementById('back-to-top');

  if (backToTopButton) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopButton.style.display = 'block';
      } else {
        backToTopButton.style.display = 'none';
      }
    });

    backToTopButton.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Testimonial Slider
  const sliderContainer = document.querySelector('.testimonial-slider');
  if (sliderContainer) {
    const slides = sliderContainer.querySelectorAll('.testimonial');
    const prevButton = sliderContainer.querySelector('.slider-prev');
    const nextButton = sliderContainer.querySelector('.slider-next');
    let slideIndex = 0;
    let autoAdvanceInterval;

    function showSlide(index) {
      slides.forEach(slide => slide.classList.remove('active'));
      slides[index].classList.add('active');
    }

    function nextSlide() {
      slideIndex = (slideIndex + 1) % slides.length;
      showSlide(slideIndex);
    }

    function prevSlide() {
      slideIndex = (slideIndex - 1 + slides.length) % slides.length;
      showSlide(slideIndex);
    }

    function startAutoAdvance() {
      autoAdvanceInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoAdvance() {
      clearInterval(autoAdvanceInterval);
    }

    if (slides.length > 0 && prevButton && nextButton) {
      showSlide(slideIndex);
      startAutoAdvance();

      sliderContainer.addEventListener('mouseenter', stopAutoAdvance);
      sliderContainer.addEventListener('mouseleave', startAutoAdvance);

      nextButton.addEventListener('click', () => {
        stopAutoAdvance();
        nextSlide();
        startAutoAdvance();
      });

      prevButton.addEventListener('click', () => {
        stopAutoAdvance();
        prevSlide();
        startAutoAdvance();
      });
    }
  }

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      faqItems.forEach(otherItem => {
        otherItem.classList.remove('open');
        otherItem.querySelector('.faq-content').setAttribute('aria-hidden', 'true');
      });

      if (!isOpen) {
        item.classList.add('open');
        content.setAttribute('aria-hidden', 'false');
      } else {
          content.setAttribute('aria-hidden', 'true'); // Close it when clicking again
      }
    });
  });

  // Email Capture Validation
  const emailForm = document.getElementById('email-capture-form');
  if (emailForm) {
    emailForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const emailInput = document.getElementById('email');
      const email = emailInput.value.trim();

      if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return;
      }

      console.log('Email submitted:', email); // Simulate submission
      emailInput.value = ''; // Clear the input after submission
    });
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // UTM-aware CTA Click Logging (Stub)
  document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', (event) => {
      const utmParams = getUtmParams();
      console.log('CTA Clicked:', button.textContent, 'UTM Params:', utmParams);
      // In a real implementation, you'd send this data to an analytics service.
    });
  });

  function getUtmParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = {};
    for (const [key, value] of urlParams.entries()) {
      if (key.startsWith('utm_')) {
        utmParams[key] = value;
      }
    }
    return utmParams;
  }
});

// Defer loading of non-critical image assets
document.addEventListener('DOMContentLoaded', () => {
  const lazyImages = document.querySelectorAll('img[data-src]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });

  lazyImages.forEach((img) => {
    observer.observe(img);
  });
});