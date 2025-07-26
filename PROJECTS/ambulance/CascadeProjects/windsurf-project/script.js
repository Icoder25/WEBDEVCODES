// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Live Stats Animation
function animateStats() {
    const stats = [
        { id: 'ambulances-active', target: 247, suffix: '' },
        { id: 'hospitals-connected', target: 156, suffix: '' },
        { id: 'avg-response', target: 2.3, suffix: '', decimal: true }
    ];

    stats.forEach(stat => {
        const element = document.getElementById(stat.id);
        if (element) {
            let current = 0;
            const increment = stat.target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= stat.target) {
                    current = stat.target;
                    clearInterval(timer);
                }
                element.textContent = stat.decimal ? current.toFixed(1) : Math.floor(current);
            }, 40);
        }
    });
}

// Response Timer Update
function updateResponseTimer() {
    const timer = document.getElementById('response-time');
    if (timer) {
        const times = ['2.1 min', '2.3 min', '1.9 min', '2.5 min', '2.0 min'];
        let index = 0;
        setInterval(() => {
            timer.textContent = `Avg Response: ${times[index]}`;
            index = (index + 1) % times.length;
        }, 5000);
    }
}

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Enhanced Button Handlers for AI-Powered Features
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations
    animateStats();
    updateResponseTimer();
    
    // Emergency Button Handler
    const emergencyBtn = document.getElementById('emergency-btn');
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', () => {
            showEmergencyBookingFlow();
        });
    }

    // Voice Booking Handler
    const voiceBtn = document.getElementById('voice-booking');
    if (voiceBtn) {
        voiceBtn.addEventListener('click', () => {
            startVoiceBooking();
        });
    }

    // Wallet Connection Handlers
    document.querySelectorAll('.wallet-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const walletType = btn.dataset.wallet;
            connectWallet(walletType);
        });
    });

    // Partnership Form Handler
    const partnershipForm = document.getElementById('partnership-form');
    if (partnershipForm) {
        partnershipForm.addEventListener('submit', handlePartnershipSubmission);
    }

    // Secondary buttons
    document.querySelectorAll('.btn-secondary').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.textContent.includes('See Demo') || btn.textContent.includes('See How It Works') || btn.textContent.includes('Learn More')) {
                e.preventDefault();
                const target = document.querySelector('#how-it-works');
                if (target) {
                    const offsetTop = target.offsetTop - 120;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});

// Emergency Booking Flow Simulation
function showEmergencyBookingFlow() {
    const modal = createEmergencyModal();
    document.body.appendChild(modal);
    
    // Simulate AI triage process
    setTimeout(() => {
        updateModalStep(modal, 'AI Triage', 'Analyzing emergency details and prioritizing response...');
    }, 1000);
    
    setTimeout(() => {
        updateModalStep(modal, 'Finding Ambulance', 'Locating nearest available ambulance with required equipment...');
    }, 3000);
    
    setTimeout(() => {
        updateModalStep(modal, 'Hospital Matching', 'Finding hospital with available beds and specialist care...');
    }, 5000);
    
    setTimeout(() => {
        updateModalStep(modal, 'Blockchain Consent', 'Preparing medical records for secure sharing...');
    }, 7000);
    
    setTimeout(() => {
        updateModalStep(modal, 'Dispatch Complete', '🚑 Ambulance dispatched! ETA: 4 minutes\n📍 Destination: AIIMS Delhi\n🏥 ICU bed reserved');
        addCloseButton(modal);
    }, 9000);
}

function createEmergencyModal() {
    const modal = document.createElement('div');
    modal.className = 'emergency-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>🚨 Emergency Response Active</h3>
                <div class="loading-spinner"></div>
            </div>
            <div class="modal-body">
                <div class="step-indicator">
                    <div class="step active">1</div>
                    <div class="step">2</div>
                    <div class="step">3</div>
                    <div class="step">4</div>
                    <div class="step">5</div>
                </div>
                <div class="current-step">
                    <h4>Initializing Emergency Response</h4>
                    <p>Connecting to ZenoCare AI system...</p>
                </div>
            </div>
        </div>
    `;
    return modal;
}

function updateModalStep(modal, title, description) {
    const stepTitle = modal.querySelector('.current-step h4');
    const stepDesc = modal.querySelector('.current-step p');
    const steps = modal.querySelectorAll('.step');
    
    if (stepTitle) stepTitle.textContent = title;
    if (stepDesc) stepDesc.textContent = description;
    
    // Update step indicator
    const currentStepIndex = Array.from(steps).findIndex(step => !step.classList.contains('completed'));
    if (currentStepIndex >= 0 && currentStepIndex < steps.length) {
        steps[currentStepIndex].classList.add('completed');
        if (currentStepIndex + 1 < steps.length) {
            steps[currentStepIndex + 1].classList.add('active');
        }
    }
}

function addCloseButton(modal) {
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.className = 'btn btn-secondary';
    closeBtn.style.marginTop = '1rem';
    closeBtn.onclick = () => modal.remove();
    modal.querySelector('.modal-body').appendChild(closeBtn);
}

// Voice Booking Simulation
function startVoiceBooking() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-IN';
        
        recognition.onstart = () => {
            showVoiceModal('🎤 Listening...', 'Say "ZenoCare, emergency!" or describe your emergency');
        };
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            showVoiceModal('🎤 Voice Recognized', `"${transcript}"\n\nProcessing emergency request...`);
            
            setTimeout(() => {
                showEmergencyBookingFlow();
                closeVoiceModal();
            }, 2000);
        };
        
        recognition.onerror = () => {
            showVoiceModal('❌ Voice Recognition Error', 'Please try again or use the emergency button');
        };
        
        recognition.start();
    } else {
        alert('🎤 Voice recognition not supported in this browser.\n\nIn the real ZenoCare app, this would work on mobile devices and supported browsers with advanced voice AI.');
    }
}

function showVoiceModal(title, message) {
    let modal = document.querySelector('.voice-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'voice-modal';
        document.body.appendChild(modal);
    }
    
    modal.innerHTML = `
        <div class="modal-content">
            <h3>${title}</h3>
            <p>${message}</p>
        </div>
    `;
}

function closeVoiceModal() {
    const modal = document.querySelector('.voice-modal');
    if (modal) modal.remove();
}

// Wallet Connection Simulation
function connectWallet(walletType) {
    const walletNames = {
        metamask: 'MetaMask',
        walletconnect: 'WalletConnect'
    };
    
    const walletName = walletNames[walletType] || 'Wallet';
    
    alert(`🔗 Connecting to ${walletName}...\n\nIn the real app, this would:\n• Connect to your crypto wallet\n• Access your blockchain medical records\n• Enable smart contract consent management\n• Provide instant medical history to hospitals`);
}

// Partnership Form Handler
function handlePartnershipSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Simulate form submission
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        alert(`✅ Partnership request submitted successfully!\n\nThank you, ${data.contactPerson}!\n\nOur team will review your ${data.organizationType} partnership request and contact you within 24-48 hours at ${data.email}.\n\nWe're excited to potentially add ${data.orgName} to our healthcare network!`);
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        e.target.reset();
    }, 2000);
}

// Add loading animation for buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function() {
        if (this.classList.contains('btn-primary')) {
            const originalText = this.textContent;
            this.textContent = 'Connecting...';
            this.style.opacity = '0.8';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.opacity = '1';
            }, 2000);
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

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .testimonial-card, .trust-item, .timeline-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Voice command simulation (for demo purposes)
let isListening = false;

function simulateVoiceCommand() {
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-IN';

        recognition.onstart = function() {
            isListening = true;
            console.log('Voice recognition started. Say "ZenoCare help" to test.');
        };

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript.toLowerCase();
            if (transcript.includes('zenocare') && transcript.includes('help')) {
                alert('🎤 Voice command detected!\n\n"' + transcript + '"\n\nEmergency services would be dispatched immediately!');
            }
        };

        recognition.onerror = function(event) {
            console.log('Voice recognition error:', event.error);
        };

        recognition.onend = function() {
            isListening = false;
        };

        return recognition;
    }
    return null;
}

// Add voice command button (hidden, for demo)
document.addEventListener('DOMContentLoaded', () => {
    const voiceBtn = document.createElement('button');
    voiceBtn.innerHTML = '🎤 Test Voice Command';
    voiceBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #dc2626;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 25px;
        cursor: pointer;
        font-size: 12px;
        z-index: 1000;
        opacity: 0.8;
    `;
    
    voiceBtn.addEventListener('click', () => {
        const recognition = simulateVoiceCommand();
        if (recognition) {
            recognition.start();
        } else {
            alert('🎤 Voice recognition not supported in this browser.\n\nIn the real app, this would work on mobile devices and supported browsers.');
        }
    });
    
    document.body.appendChild(voiceBtn);
});

// Emergency contact simulation
function showEmergencyContacts() {
    const contacts = [
        { name: 'Emergency Services', number: '108' },
        { name: 'Police', number: '100' },
        { name: 'Fire Department', number: '101' },
        { name: 'ZenoCare Support', number: '1800-ZENO-CARE' }
    ];
    
    let contactList = 'Emergency Contacts:\n\n';
    contacts.forEach(contact => {
        contactList += `${contact.name}: ${contact.number}\n`;
    });
    
    alert(contactList);
}

// Add emergency contacts to footer links
document.addEventListener('DOMContentLoaded', () => {
    const emergencyLink = document.querySelector('a[href="#"]:contains("Emergency Contacts")');
    if (emergencyLink) {
        emergencyLink.addEventListener('click', (e) => {
            e.preventDefault();
            showEmergencyContacts();
        });
    }
});

// Performance optimization: Lazy load animations
const lazyAnimations = () => {
    const elements = document.querySelectorAll('.wave, .pulse-animation');
    elements.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight) {
            el.style.animationPlayState = 'running';
        } else {
            el.style.animationPlayState = 'paused';
        }
    });
};

window.addEventListener('scroll', lazyAnimations);
document.addEventListener('DOMContentLoaded', lazyAnimations);
