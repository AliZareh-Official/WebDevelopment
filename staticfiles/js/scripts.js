// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    // Navbar background change on scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Carousel Functionality
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');
    let currentSlide = 0;
    let slideInterval = setInterval(nextSlide, 5000); // Auto-slide every 5 seconds

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlideFunc() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetInterval();
    });

    prevBtn.addEventListener('click', () => {
        prevSlideFunc();
        resetInterval();
    });

    // Reset interval on manual navigation
    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    }

    // Pause carousel on hover
    const carousel = document.querySelector('.carousel');
    carousel.addEventListener('mouseenter', () => clearInterval(slideInterval));
    carousel.addEventListener('mouseleave', () => slideInterval = setInterval(nextSlide, 5000));

    // Modal Functionality
    const modal = document.getElementById('modal');
    const openModalButtons = document.querySelectorAll('.btn-quote');
    const closeModalButton = document.getElementById('closeModal');

    openModalButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'block';
        });
    });

    closeModalButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside the modal content
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    });

    // Handle Quote Form Submission
    const quoteForm = document.getElementById('quoteForm');
    quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Simple form validation
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();

        if (name === '' || email === '') {
            alert('Please fill in all fields.');
            return;
        }

        // TODO: Implement actual form submission logic (e.g., AJAX request)

        alert('Thank you for your request! We will get back to you soon.');
        quoteForm.reset();
        modal.style.display = 'none';
    });

    // Smooth Scrolling for Older Browsers (Fallback)
    // Since CSS 'scroll-behavior: smooth;' is used, this is optional
    /*
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - navbar.offsetHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
    */

    // Optional: Keyboard Navigation for Carousel
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlideFunc();
            resetInterval();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetInterval();
        }
    });

    // Optional: Touch Support for Carousel (Swipe Gestures)
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleGesture();
    });

    function handleGesture() {
        if (touchEndX < touchStartX - 50) {
            nextSlide();
            resetInterval();
        }
        if (touchEndX > touchStartX + 50) {
            prevSlideFunc();
            resetInterval();
        }
    }
});
