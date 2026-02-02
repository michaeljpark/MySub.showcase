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

    const navIndicator = document.querySelector('.nav-indicator');
    const navList = document.querySelector('.pill-nav-list');

    function updateIndicator(activeItem) {
        if (!activeItem || !navIndicator) return;
        
        // Calculate position relative to the ul container
        // We need the offsetLeft and width of the active item relative to the navList
        // Since navList is relative, activeItem.offsetLeft works if they are direct children
        // The structure is navList > li > a.nav-item. So activeItem is the <a>.
        // We need the LI's position + padding?, or just the A's position relative to navList?
        // Actually, navList is flex, LI is flex item. 
        // Let's get bounding rects to be safe.
        
        const listRect = navList.getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect(); // This is the <a> tag usually if we add class to a
        // Wait, the structure is <li><a class="nav-item"></a></li>. 
        // The .active class is added to the <a> tag in updateNav logic.
        // The indicator is inside navList (absolute).
        
        // However, the indicator is a sibling of LI elements in my new HTML struct?
        // No, HTML I wrote: <ul class="pill-nav-list"><div class="nav-indicator"></div><li>...</li></ul>
        // So indicator is child of UL. LIs are children of UL.
        // The 'activeItem' passed here is likely the <a> tag inside the <li>.
        
        // We want the indicator to cover the <a> tag (pill shape).
        // Since <a> has padding, we match its size.
        // The <a> is inside <li>.
        // offset relative to UL:
        // left = itemRect.left - listRect.left
        
        // But <a> might have margin/padding from LI?
        // LIs usually have no margin in my CSS, just gap on UL.
        
        const offsetLeft = itemRect.left - listRect.left;
        const width = itemRect.width;
        
        navIndicator.style.width = `${width}px`;
        navIndicator.style.transform = `translateX(${offsetLeft}px)`;
        navIndicator.style.opacity = '1';
    }

    function updateNav() {
        const scrollPosition = window.scrollY + window.innerHeight * 0.4;
        let current = ''; 
        
        // Find the current section
        if (sections.research && scrollPosition >= sections.research.offsetTop) current = 'research';
        if (sections.design && scrollPosition >= sections.design.offsetTop) current = 'design';
        if (sections.prototyping && scrollPosition >= sections.prototyping.offsetTop) current = 'prototyping';
        if (sections['design-pilot'] && scrollPosition >= sections['design-pilot'].offsetTop) current = 'design-pilot';
        if (sections['feedback'] && scrollPosition >= sections['feedback'].offsetTop) current = 'feedback';
        if (sections['future-developments'] && scrollPosition >= sections['future-developments'].offsetTop) current = 'future-developments';

        // Update classes
        let activeFound = false;
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-target') === current) {
                item.classList.add('active');
                updateIndicator(item);
                activeFound = true;
            }
        });

        if (!activeFound) {
            navIndicator.style.opacity = '0';
        }
    }

    window.addEventListener('scroll', updateNav);
    
    // Initial call
    updateNav();

    // Modal Logic
    const reportBtn = document.querySelector('.nav-btn-report');
    const modal = document.getElementById('reportModal');

    if (reportBtn && modal) {
        reportBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
            // Trigger reflow or use timeout to allow transition
            requestAnimationFrame(() => {
                modal.classList.add('show');
            });
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });

        // Close when clicking outside content
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.style.display = 'none';
                    document.body.style.overflow = '';
                }, 300); // Wait for transition
            }
        });
    }

});
