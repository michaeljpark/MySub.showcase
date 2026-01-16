// Design Showcase Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer for scroll-triggered animations
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);

    // Observe all showcase items and rows
    const showcaseItems = document.querySelectorAll('.showcase-item, .showcase-row');
    showcaseItems.forEach(item => {
        item.style.animationPlayState = 'paused';
        observer.observe(item);
    });

    // Lazy load images
    const images = document.querySelectorAll('.showcase-image');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });

    // Add smooth scroll behavior for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Handle image load errors
    images.forEach(img => {
        img.addEventListener('error', function() {
            // this.style.display = 'none'; // Optional: hide if missing
            console.warn('Image not found:', this.src);
        });
    });

    // Add parallax effect on scroll (subtle)
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const scrolled = window.pageYOffset;
                const parallaxElements = document.querySelectorAll('.showcase-item');

                parallaxElements.forEach((element, index) => {
                    const speed = 0.02;
                    const yPos = -(scrolled * speed);
                    element.style.transform = `translateY(${yPos}px)`;
                });

                ticking = false;
            });
            ticking = true;
        }
    });

    // Scroll-based slideshow for images
    const scrollSlideshow = document.querySelector('.scroll-slideshow');
    const slides = document.querySelectorAll('.scroll-slide');

    if (scrollSlideshow && slides.length > 0) {
        let ticking = false;

        function updateSlide() {
            const rect = scrollSlideshow.getBoundingClientRect();
            // Calculate progress based on container's position relative to viewport
            // When top of container hits top of viewport -> start (0)
            // When bottom of container hits bottom of viewport -> end (1) roughly
            const scrollProgress = -rect.top / (rect.height - window.innerHeight);
            const clampedProgress = Math.max(0, Math.min(1, scrollProgress));

            // Calculate which slide should be active
            const slideIndex = Math.floor(clampedProgress * (slides.length - 0.01));
            const finalIndex = Math.min(slideIndex, slides.length - 1);

            slides.forEach((slide, index) => {
                if (index === finalIndex) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });

            ticking = false;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(updateSlide);
                ticking = true;
            }
        });

        updateSlide();
    }

    // Side Navigation Logic
    const navItems = document.querySelectorAll('.nav-item');
    const sections = {
        research: document.getElementById('research'),
        design: document.getElementById('design'),
        prototyping: document.getElementById('prototyping'),
        'design-pilot': document.getElementById('design-pilot'),
        'feedback': document.getElementById('feedback'),
        'future-developments': document.getElementById('future-developments')
    };

    function updateNav() {
        const scrollPosition = window.scrollY + window.innerHeight * 0.4;
        let current = ''; // No default active section
        
        // Find the current section
        if (sections.research && scrollPosition >= sections.research.offsetTop) current = 'research';
        if (sections.design && scrollPosition >= sections.design.offsetTop) current = 'design';
        if (sections.prototyping && scrollPosition >= sections.prototyping.offsetTop) current = 'prototyping';
        if (sections['design-pilot'] && scrollPosition >= sections['design-pilot'].offsetTop) current = 'design-pilot';
        if (sections['feedback'] && scrollPosition >= sections['feedback'].offsetTop) current = 'feedback';
        if (sections['future-developments'] && scrollPosition >= sections['future-developments'].offsetTop) current = 'future-developments';

        // Update classes
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-target') === current) {
                item.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateNav);
    // Click to scroll
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            const targetSection = sections[targetId];
            if (targetSection) {
                const headerOffset = 100;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
    
    // Initial call
    updateNav();

});
