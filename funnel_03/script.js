// ===== Quiz & Form Functionality =====

// Track current step for progress bar
let currentStep = 1;
const totalSteps = 3;

// Update progress bar
function updateProgress(step) {
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        const progress = (step / totalSteps) * 100;
        progressFill.style.width = progress + '%';
    }
}

// Navigate to next step
function nextStep(stepNum, button) {
    // Mark selected option
    const currentOptions = button.parentElement.querySelectorAll('.option-btn');
    currentOptions.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');

    // Small delay for visual feedback
    setTimeout(() => {
        const current = document.querySelector('.step.active');
        if (current) {
            current.classList.remove('active');
        }

        const nextStepEl = document.getElementById('step-' + stepNum);
        if (nextStepEl) {
            nextStepEl.classList.add('active');
        }

        currentStep = stepNum;
        updateProgress(currentStep);
    }, 300);
}

// Show contract/form section
function showContract(button) {
    // Mark selected option
    const currentOptions = button.parentElement.querySelectorAll('.option-btn');
    currentOptions.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');

    // Small delay for visual feedback
    setTimeout(() => {
        const quiz = document.getElementById('quiz');
        if (quiz) {
            quiz.style.display = 'none';
        }

        const finalStep = document.getElementById('final-step');
        if (finalStep) {
            finalStep.classList.add('visible');
            updateProgress(totalSteps);

            // Smooth scroll to form
            finalStep.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 300);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    // Initialize progress bar
    updateProgress(1);

    // Live counter simulation (creates urgency)
    const liveCountEl = document.getElementById('live-count');
    if (liveCountEl) {
        let count = parseInt(liveCountEl.textContent) || 12;

        setInterval(() => {
            // Sesgo ligero a la baja (más realista)
            const change = Math.random() > 0.6 ? 1 : -1;
            count = Math.max(8, Math.min(18, count + change));

            liveCountEl.style.transition = 'transform 0.2s ease';
            liveCountEl.style.transform = 'scale(1.08)';

            setTimeout(() => {
                liveCountEl.textContent = count;
                liveCountEl.style.transform = 'scale(1)';
            }, 100);
        }, 4000 + Math.random() * 3000);
    }


    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards and testimonial cards
    document.querySelectorAll('.feature-card, .testimonial-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(10, 14, 20, 0.95)';
            } else {
                navbar.style.background = 'rgba(10, 14, 20, 0.8)';
            }
        });
    }
});

// Form submission handling with Formspree feedback
const leadForm = document.getElementById('lead-form');
if (leadForm) {
    // Initialize spots counter from localStorage or default
    const spotsEl = document.getElementById('spots-left');
    const SPOTS_KEY = 'webinar_spots_left';
    const DEFAULT_SPOTS = 23;

    // Get current spots from localStorage or use default
    let spotsLeft = parseInt(localStorage.getItem(SPOTS_KEY)) || DEFAULT_SPOTS;

    // Update display on load
    if (spotsEl) {
        spotsEl.textContent = spotsLeft;
    }

    leadForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const submitBtn = this.querySelector('.submit-btn');
        const originalContent = submitBtn.innerHTML;

        // Show loading state
        submitBtn.innerHTML = `
            <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
                <circle cx="12" cy="12" r="10" opacity="0.3"></circle>
                <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
            </svg>
            <span>Enviando...</span>
        `;
        submitBtn.disabled = true;

        try {
            const formData = new FormData(this);
            const response = await fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Decrease spots counter on successful submission
                if (spotsLeft > 1) {
                    spotsLeft--;
                    localStorage.setItem(SPOTS_KEY, spotsLeft);
                }

                // Success state
                submitBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span>¡Registro Exitoso!</span>
                `;
                submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';

                // Show success message
                const formContainer = document.querySelector('.form-container');
                if (formContainer) {
                    formContainer.innerHTML = `
                        <div style="text-align: center; padding: 2rem;">
                            <div style="width: 80px; height: 80px; background: rgba(34, 197, 94, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                            </div>
                            <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.75rem;">¡Registro Exitoso!</h2>
                            <p style="color: #94a3b8; font-size: 1rem; margin-bottom: 1rem;">Tu solicitud ha sido recibida correctamente.</p>
                            <p style="color: #64748b; font-size: 0.9rem;">Revisa tu correo electrónico para recibir las instrucciones de acceso al webinar.</p>
                            <div style="margin-top: 2rem; padding: 1rem; background: rgba(0, 112, 243, 0.1); border-radius: 8px; border: 1px solid rgba(0, 112, 243, 0.2);">
                                <p style="color: #0070f3; font-size: 0.85rem; font-weight: 500;">
                                    📩 El acceso será enviado en los próximos minutos
                                </p>
                            </div>
                        </div>
                    `;
                }
            } else {
                throw new Error('Error en el envío');
            }
        } catch (error) {
            // Error state
            submitBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                <span>Error - Intenta de nuevo</span>
            `;
            submitBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            submitBtn.disabled = false;

            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.innerHTML = originalContent;
                submitBtn.style.background = '';
            }, 3000);
        }
    });
}

// Add spinner animation style
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);