document.addEventListener('DOMContentLoaded', () => {

    /* --- INITIALIZE VECTOR ICONS --- */
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* --- 1. PREMIUM PRELOADER SCREEN --- */
    const preloader = document.getElementById('preloader');
    
    // Ensure loader remains visible for at least 2.2 seconds for full branding reveal
    setTimeout(() => {
        preloader.classList.add('fade-out');
        document.body.classList.add('loaded');
        
        // Trigger initial Hero entry animations
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 800);
    }, 2200);


    /* --- 2. STICKY NAVBAR & ACTIVE LINK HIGH LIGHTER --- */
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function checkHeaderScroll() {
        if (window.scrollY > 60) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    }

    function highlightActiveSection() {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120; // offset navbar size
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                // Desktop
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
                // Mobile
                mobileLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', () => {
        checkHeaderScroll();
        highlightActiveSection();
    });
    // Run on startup
    checkHeaderScroll();


    /* --- 3. MOBILE HAMBURGER MENU OVERLAY --- */
    const hamburger = document.getElementById('hamburger');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const allMobileLinks = document.querySelectorAll('.mobile-link, #mob-cta');

    function toggleMobileMenu() {
        const isOpen = hamburger.classList.toggle('open');
        mobileOverlay.classList.toggle('open');
        
        if (isOpen) {
            document.body.style.overflow = 'hidden'; // Lock scrolling
        } else {
            document.body.style.overflow = ''; // Restore scrolling
        }
    }

    hamburger.addEventListener('click', toggleMobileMenu);

    allMobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Close menu overlay on option click
            hamburger.classList.remove('open');
            mobileOverlay.classList.remove('open');
            document.body.style.overflow = '';
        });
    });


    /* --- 4. LIGHTWEIGHT INTERSECTION REVEALS --- */
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Animate once
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    /* --- 5. ANIMATED STATS COUNTER --- */
    const statsSection = document.getElementById('stats');
    const statNumbers = document.querySelectorAll('.stat-num');
    let countersStarted = false;

    function runCounters() {
        statNumbers.forEach(counter => {
            const targetVal = parseInt(counter.getAttribute('data-val'));
            let currentVal = 0;
            const duration = 2000; // 2 seconds animation
            const increment = targetVal / (duration / 16); // ~60fps updates

            const updateCount = () => {
                currentVal += increment;
                if (currentVal >= targetVal) {
                    counter.innerHTML = targetVal + (targetVal === 100 ? '<span>%</span>' : '<span>+</span>');
                } else {
                    counter.innerHTML = Math.floor(currentVal) + (targetVal === 100 ? '<span>%</span>' : '<span>+</span>');
                    requestAnimationFrame(updateCount);
                }
            };
            
            updateCount();
        });
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersStarted) {
                countersStarted = true;
                runCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3
    });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }


    /* --- 6. SIGNATURE MENU TAB FILTER --- */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuCards = document.querySelectorAll('.menu-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update Active tab class
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterCategory = button.getAttribute('data-filter');

            menuCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // Beautiful entry scale animations on filter change
                if (filterCategory === 'all' || cardCategory === filterCategory) {
                    card.classList.remove('hidden');
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.92)';
                    setTimeout(() => {
                        card.classList.add('hidden');
                    }, 400); // match transition times
                }
            });
        });
    });


    /* --- 7. MASONRY PINTEREST LIGHTBOX GALLERY --- */
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    let currentImgIndex = 0;
    const galleryImagesArray = Array.from(galleryItems).map(item => ({
        src: item.querySelector('img').src,
        title: item.getAttribute('data-title'),
        cat: item.getAttribute('data-cat')
    }));

    function openLightbox(index) {
        currentImgIndex = index;
        const currentData = galleryImagesArray[currentImgIndex];
        
        lightboxImg.src = currentData.src;
        lightboxCaption.innerHTML = `<strong>${currentData.title}</strong> - ${currentData.cat}`;
        
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }

    function navigateLightbox(direction) {
        currentImgIndex += direction;
        if (currentImgIndex < 0) {
            currentImgIndex = galleryImagesArray.length - 1;
        } else if (currentImgIndex >= galleryImagesArray.length) {
            currentImgIndex = 0;
        }
        
        // Add subtle elegant fade interaction inside lightbox during swap
        lightboxImg.style.opacity = '0';
        lightboxImg.style.transform = 'scale(0.97)';
        
        setTimeout(() => {
            const currentData = galleryImagesArray[currentImgIndex];
            lightboxImg.src = currentData.src;
            lightboxCaption.innerHTML = `<strong>${currentData.title}</strong> - ${currentData.cat}`;
            lightboxImg.style.opacity = '1';
            lightboxImg.style.transform = 'scale(1)';
        }, 250);
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    lightboxNext.addEventListener('click', () => navigateLightbox(1));

    // Close lightbox clicking backdrop
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard support for Lightbox and mobile overlays
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('open')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') navigateLightbox(1);
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
        }
    });


    /* --- 8. PATRON REVIEWS TOUCH-ENABLED CAROUSEL --- */
    const track = document.getElementById('carousel-track');
    const slides = Array.from(track.children);
    const dotsContainer = document.getElementById('carousel-dots');
    const dots = Array.from(dotsContainer.children);
    
    let activeSlideIndex = 0;
    let autoSlideInterval;

    function moveCarouselTo(index) {
        track.style.transform = `translateX(-${index * 100}%)`;
        
        // Update active classes
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
        activeSlideIndex = index;
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            let nextIndex = activeSlideIndex + 1;
            if (nextIndex >= slides.length) nextIndex = 0;
            moveCarouselTo(nextIndex);
        }, 6000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // Dots clicks click handler
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            moveCarouselTo(index);
            resetAutoSlide();
        });
    });

    // Mobile swipe controls touch pointers
    let startX = 0;
    let endX = 0;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const threshold = 55; // minimum swipe distance pixels
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Swiped Left -> next slide
                let nextIndex = activeSlideIndex + 1;
                if (nextIndex < slides.length) {
                    moveCarouselTo(nextIndex);
                } else {
                    moveCarouselTo(0);
                }
            } else {
                // Swiped Right -> previous slide
                let prevIndex = activeSlideIndex - 1;
                if (prevIndex >= 0) {
                    moveCarouselTo(prevIndex);
                } else {
                    moveCarouselTo(slides.length - 1);
                }
            }
            resetAutoSlide();
        }
    }

    // Launch Carousel slide timer
    startAutoSlide();


    /* --- 9. LUXURY CONTACT RESERVATION FORM SUBMITTER --- */
    const contactForm = document.getElementById('contact-form');
    const successAlert = document.getElementById('form-success-alert');
    const resetFormBtn = document.getElementById('form-reset-btn');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnContent = submitBtn.innerHTML;
            
            // Set loading micro-interaction
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i data-lucide="loader" class="animation-spin" style="width:16px; height:16px; animation: logoPulse 1s infinite linear;"></i> Transmitting Securely...`;
            if (typeof lucide !== 'undefined') lucide.createIcons();

            // Simulate high-speed gold transmission
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
                if (typeof lucide !== 'undefined') lucide.createIcons();
                
                successAlert.classList.add('show');
            }, 1500);
        });
    }

    if (resetFormBtn) {
        resetFormBtn.addEventListener('click', () => {
            successAlert.classList.remove('show');
            contactForm.reset();
            
            // Reset floating input labels by forcing event checks
            const inputs = contactForm.querySelectorAll('.form-input');
            inputs.forEach(input => {
                input.dispatchEvent(new Event('blur'));
            });
        });
    }


    /* --- 10. FLOATING BACK TO TOP WIDGET --- */
    const toTopBtn = document.getElementById('float-totop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            toTopBtn.classList.add('show');
        } else {
            toTopBtn.classList.remove('show');
        }
    });

    toTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

});
