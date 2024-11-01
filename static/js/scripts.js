// scripts.js

// Ensure the DOM is fully loaded before executing scripts
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all functionalities
    SmoothScrolling.init();
    NavbarBehavior.init();
    SectionObserver.init();
    PortfolioLightbox.init();
    FormHandler.init();
    CarouselEnhancements.init();
    LazyLoading.init();
});

/**
 * Smooth Scrolling Module
 * Enables smooth scrolling behavior for internal anchor links.
 */
const SmoothScrolling = (() => {
    const init = () => {
        const links = document.querySelectorAll('a.nav-link, a.btn');

        links.forEach(link => {
            link.addEventListener('click', function (e) {
                // Only handle internal links
                if (this.hash !== '') {
                    e.preventDefault();
                    const hash = this.hash;

                    document.querySelector(hash).scrollIntoView({
                        behavior: 'smooth'
                    });

                    // Collapse navbar on mobile after click
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarToggler.offsetParent !== null && navbarCollapse.classList.contains('show')) {
                        navbarToggler.click();
                    }
                }
            });
        });
    };

    return { init };
})();

/**
 * Navbar Behavior Module
 * Handles dynamic styling and active link highlighting based on scroll position.
 */
const NavbarBehavior = (() => {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const sections = document.querySelectorAll('section');

    const init = () => {
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
    };

    const handleScroll = () => {
        // Dynamic Navbar Styling
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }

        // Active Link Highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    };

    return { init };
})();

/**
 * Section Observer Module
 * Observes sections entering the viewport to trigger animations.
 */
const SectionObserver = (() => {
    const init = () => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver(handleIntersect, options);

        const elementsToObserve = document.querySelectorAll('.service-item, .portfolio-img, .contact-info, .carousel-caption');

        elementsToObserve.forEach(el => {
            el.classList.add('opacity-0', 'transform-translate-y-20'); // Initial hidden state
            observer.observe(el);
        });
    };

    const handleIntersect = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'transform-translate-y-0', 'transition-all', 'duration-700', 'ease-out');
                observer.unobserve(entry.target);
            }
        });
    };

    return { init };
})();

/**
 * Portfolio Lightbox Module
 * Initializes the lightbox functionality for portfolio images.
 */
const PortfolioLightbox = (() => {
    let lightboxInstance;

    const init = () => {
        lightboxInstance = GLightbox({
            selector: '.portfolio-img a',
            touchNavigation: true,
            loop: true,
            autoplayVideos: true
        });

        // Wrap portfolio images with anchor tags for lightbox
        const portfolioImages = document.querySelectorAll('.portfolio-img img');
        portfolioImages.forEach(img => {
            const parent = img.parentElement;
            if (!parent.tagName.toLowerCase() === 'a') {
                const href = img.getAttribute('src');
                const a = document.createElement('a');
                a.href = href;
                a.classList.add('portfolio-link');
                a.setAttribute('data-gallery', 'portfolio');
                a.setAttribute('aria-label', 'View Project');
                parent.appendChild(a);
                a.appendChild(img);
            }
        });
    };

    return { init };
})();

/**
 * Form Handler Module
 * Manages form validation and AJAX submission with CSRF protection.
 */
const FormHandler = (() => {
    const form = document.querySelector('form.needs-validation');

    const init = () => {
        if (form) {
            form.addEventListener('submit', handleSubmit);
            setupValidation();
        }
    };

    const setupValidation = () => {
        // Bootstrap custom validation
        const inputs = form.querySelectorAll('.form-control, .form-select');

        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.checkValidity()) {
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');
                } else {
                    input.classList.remove('is-valid');
                    input.classList.add('is-invalid');
                }
            });
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        // Collect form data
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => { data[key] = value });

        try {
            const response = await fetch(form.action || window.location.href, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken(),
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                handleErrors(errorData);
                return;
            }

            const result = await response.json();
            handleSuccess(result);
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An unexpected error occurred. Please try again later.');
        }
    };

    const handleErrors = (errors) => {
        // Iterate through errors and display feedback
        for (const [field, messages] of Object.entries(errors)) {
            const input = form.querySelector(`[name="${field}"]`);
            if (input) {
                input.classList.add('is-invalid');
                const feedback = input.nextElementSibling;
                if (feedback) {
                    feedback.textContent = messages.join(' ');
                }
            }
        }
    };

    const handleSuccess = (result) => {
        // Reset form and display success message
        form.reset();
        form.classList.remove('was-validated');
        const inputs = form.querySelectorAll('.form-control, .form-select');
        inputs.forEach(input => {
            input.classList.remove('is-valid');
        });

        // Display success alert
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success';
        alertDiv.textContent = 'Your request has been submitted successfully!';
        form.parentElement.prepend(alertDiv);

        // Remove alert after 5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    };

    const getCSRFToken = () => {
        const cookieValue = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
        return cookieValue ? decodeURIComponent(cookieValue.split('=')[1]) : '';
    };

    return { init };
})();

/**
 * Carousel Enhancements Module
 * Customizes Bootstrap carousel behavior.
 */
const CarouselEnhancements = (() => {
    const carouselElement = document.querySelector('#carouselIndicators');
    let carousel;

    const init = () => {
        if (carouselElement) {
            carousel = new bootstrap.Carousel(carouselElement, {
                interval: 5000, // 5 seconds
                ride: 'carousel',
                pause: 'hover',
                wrap: true
            });

            // Custom Controls or Event Listeners can be added here
            // Example: Pause carousel on certain conditions
        }
    };

    return { init };
})();

/**
 * Lazy Loading Module
 * Implements lazy loading for images using Intersection Observer.
 */
const LazyLoading = (() => {
    const init = () => {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.onload = () => img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            }, {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            });

            lazyImages.forEach(img => {
                if (img.dataset.src) {
                    img.src = ''; // Clear the src to defer loading
                    imageObserver.observe(img);
                } else {
                    imageObserver.observe(img);
                }
            });
        } else {
            // Fallback for browsers without Intersection Observer
            lazyImages.forEach(img => {
                img.src = img.dataset.src || img.src;
            });
        }
    };

    return { init };
})();
// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.service-number');
    const speed = 400; // The lower the slower

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;

                // Calculate the increment
                const increment = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + increment);
                    setTimeout(updateCount, 10);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };

    // Intersection Observer to trigger animation when in view
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target); // Stop observing after animation
            }
        });
    }, { threshold: 0.5 });

    observer.observe(document.querySelector('#services'));
});

