document.addEventListener('DOMContentLoaded', () => {

    // --- Typing Animation ---
    const typingText = document.querySelector('.typing-text');
    const words = ["Web Developer", "Creator", "Problem Solver"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        if (!typingText) return; // Exit if element doesn't exist

        const currentWord = words[wordIndex];
        if (isDeleting) {
            typingText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        const typeSpeed = isDeleting ? 100 : 200; // Speed of typing/deleting

        if (!isDeleting && charIndex === currentWord.length) {
            setTimeout(() => isDeleting = true, 2000); // Pause before deleting
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(() => requestAnimationFrame(type), 500); // Pause before next word starts
            return;
        }
        setTimeout(type, typeSpeed);
    }
    // Check if typingText element exists before calling type()
    if (typingText) {
        type(); // Start the typing animation
    }

    // --- Scroll Animations (Intersection Observer) ---
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after it becomes visible if you only want it to animate once.
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Start animation a bit before reaching the bottom
    });

    // Elements for scroll-on-reveal animation
    const elementsToAnimate = document.querySelectorAll(
        '.section-title, .section-title-about, .about-image.fade-left, .about-content.fade-right, ' +
        '.skill-card.bounce-up, .project-card.fade-up, .achievement-card.fade-up, ' +
        '.experience-timeline .timeline-item.fade-up, .education-timeline .timeline-item.fade-up, ' + // Target timeline items
        '.contact-wrapper.fade-up, footer .container.fade-up, #resume .resume-options.fade-up' // Added .resume-options
    );
    elementsToAnimate.forEach(el => observer.observe(el));

    // Special handling for initial load animations (header, hero)
    const onLoadElements = document.querySelectorAll('.animate-on-load');
    onLoadElements.forEach(el => {
        // Use a slight delay for staggered appearance
        if (el.classList.contains('logo')) {
            setTimeout(() => el.classList.add('visible'), 300);
        } else if (el.classList.contains('nav-links')) {
            el.querySelectorAll('li a').forEach((link, index) => {
                setTimeout(() => link.classList.add('visible'), 500 + index * 100);
            });
        } else if (el.id === 'hero') {
             setTimeout(() => el.classList.add('visible'), 100); // Hero section itself (if needed)
             el.querySelector('.hero-text').classList.add('visible'); // Hero text
             el.querySelector('.hero-image').classList.add('visible'); // Hero image
        } else {
            setTimeout(() => el.classList.add('visible'), 100);
        }
    });


    // --- Contact Form Handling ---
    const form = document.getElementById('contact-form');
    const formResult = document.getElementById('form-result');

    const accessKey = "15fed34b-85c8-45f2-9219-cf6881d73e19"; // Your Web3Forms access key

    if (form) { // Check if form exists before attaching event listener
        if (accessKey === "YOUR_ACCESS_KEY_HERE" || accessKey === "") { // Check for placeholder or empty
            console.warn("Web3Forms access key is not set or is a placeholder. Please update it in script.js.");
            if (formResult) {
                formResult.innerHTML = "Contact form is not configured. Please set your Web3Forms access key.";
                formResult.style.color = "#f44336"; // Red for error
            }
        }

        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission

            if (accessKey === "YOUR_ACCESS_KEY_HERE" || accessKey === "") {
                 if (formResult) {
                    formResult.innerHTML = "Error: Web3Forms access key is missing.";
                    formResult.style.color = "#f44336";
                 }
                 return; // Stop submission if key is missing
            }

            if (formResult) {
                formResult.innerHTML = "Sending...";
                formResult.style.color = "#ffd700"; // Gold for pending
            }

            const formData = new FormData(form);
            formData.append("access_key", accessKey); // Add access key to form data

            fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                })
                .then(async (response) => {
                    let jsonResponse = await response.json();
                    if (response.ok) { // Check for successful HTTP status code (200-299)
                        if (formResult) {
                            formResult.innerHTML = "Message sent successfully! 🎉";
                            formResult.style.color = "#4caf50"; // Green for success
                        }
                        form.reset(); // Clear the form
                    } else {
                        // Handle specific Web3Forms errors or general errors
                        console.error("Form submission error:", jsonResponse);
                        if (formResult) {
                            formResult.innerHTML = jsonResponse.message || "An error occurred. Please try again.";
                            formResult.style.color = "#f44336"; // Red for error
                        }
                    }
                })
                .catch(error => {
                    console.error("Network or fetch error:", error);
                    if (formResult) {
                        formResult.innerHTML = "A network error occurred. Please check your connection.";
                        formResult.style.color = "#f44336"; // Red for error
                    }
                })
                .finally(() => {
                    // Clear the message after a few seconds
                    setTimeout(() => {
                        if (formResult) {
                            formResult.innerHTML = '';
                        }
                    }, 7000); // Message displayed for 7 seconds
                });
        });
    }


    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Prevent default anchor click behavior
            e.preventDefault();

            // Get the target element ID from the href attribute
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Calculate the offset: header height + some extra padding
                const headerOffset = document.querySelector('header').offsetHeight; // Get dynamic header height
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // --- Achievement Image Modal Functionality ---
    function openModal(imageSrc, captionText) {
        const modal = document.getElementById("imageModal");
        const modalImage = document.getElementById("modalImage");
        const modalCaption = document.getElementById("modalCaption");

        modal.style.display = "block";
        modalImage.src = imageSrc;
        modalCaption.textContent = captionText;
    }

    function closeModal() {
        const modal = document.getElementById("imageModal");
        modal.style.display = "none";
    }

    // Add click event listeners to all achievement images
    const achievementImages = document.querySelectorAll('#achievements .achievement-card img');
    achievementImages.forEach(img => {
        img.addEventListener('click', function() {
            const imageSrc = this.src;
            // Get the caption from the sibling .achievement-content's h4 and p
            const captionText = this.nextElementSibling.querySelector('h4').textContent + ': ' + this.nextElementSibling.querySelector('p').textContent;
            openModal(imageSrc, captionText);
        });
    });
    
    // Add click event listener to the close button
    const closeButton = document.querySelector('.modal .close');
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
    
    // Make modal close when clicking outside the image
    window.onclick = function(event) {
        const modal = document.getElementById("imageModal");
        if (event.target == modal) {
            closeModal();
        }
    }

  
});