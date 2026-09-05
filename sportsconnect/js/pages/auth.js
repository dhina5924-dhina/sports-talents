window.SportsConnect = window.SportsConnect || {};
SportsConnect.pages = SportsConnect.pages || {};

SportsConnect.pages.auth = {
    render() {
        const hash = window.location.hash || '#login';
        
        if (hash === '#register') {
            return this.renderRegister();
        } else if (hash === '#forgot-password') {
            return this.renderForgotPassword();
        } else {
            return this.renderLogin();
        }
    },
    
    renderLogin() {
        return `
            <div class="auth-page">
                <div class="auth-container">
                    <div class="auth-form-side">
                        <div class="auth-header">
                            <h2 class="auth-logo">SportsConnect</h2>
                            <h1>Welcome Back</h1>
                            <p>Log in to continue your sports journey.</p>
                        </div>
                        <form id="login-form" class="auth-form">
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" id="email" class="form-control" placeholder="Enter your email" required>
                            </div>
                            <div class="form-group">
                                <label for="password">Password</label>
                                <div class="password-input-wrap">
                                    <input type="password" id="password" class="form-control" placeholder="Enter your password" required>
                                    <button type="button" class="toggle-password"><i class="fas fa-eye"></i></button>
                                </div>
                            </div>
                            <div class="form-row form-row--between">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="remember"> Remember me
                                </label>
                                <a href="#forgot-password" class="auth-link">Forgot Password?</a>
                            </div>
                            <button type="submit" class="btn btn--primary btn--full">Log In</button>
                        </form>
                        
                        <div class="auth-divider"><span>or continue with</span></div>
                        
                        <button class="btn btn--outline btn--full social-btn">
                            <i class="fab fa-google"></i> Google
                        </button>
                        
                        <p class="auth-footer-text">
                            Don't have an account? <a href="#register" class="auth-link">Sign Up</a>
                        </p>
                    </div>
                    <div class="auth-illustration-side login-illustration">
                        <div class="illustration-content">
                            <h3>"Hard work beats talent when talent doesn't work hard."</h3>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderRegister() {
        return `
            <div class="auth-page">
                <div class="auth-container">
                    <div class="auth-form-side">
                        <div class="auth-header">
                            <h2 class="auth-logo">SportsConnect</h2>
                            <h1>Join SportsConnect</h1>
                            <p>Create your account and showcase your talent.</p>
                        </div>
                        
                        <div id="register-step-1" class="register-step active">
                            <h3 class="step-title">Select your role</h3>
                            <div class="role-grid">
                                <div class="role-card" data-role="athlete">
                                    <div class="role-icon">🏃</div>
                                    <h4>Athlete</h4>
                                    <p>I want to showcase my skills</p>
                                </div>
                                <div class="role-card" data-role="coach">
                                    <div class="role-icon">🎓</div>
                                    <h4>Coach</h4>
                                    <p>I want to train athletes</p>
                                </div>
                                <div class="role-card" data-role="team">
                                    <div class="role-icon">👥</div>
                                    <h4>Team</h4>
                                    <p>Manage a sports club/team</p>
                                </div>
                                <div class="role-card" data-role="organizer">
                                    <div class="role-icon">📋</div>
                                    <h4>Organizer</h4>
                                    <p>Host tournaments & events</p>
                                </div>
                                <div class="role-card" data-role="scout">
                                    <div class="role-icon">🔍</div>
                                    <h4>Scout</h4>
                                    <p>Discover new talent</p>
                                </div>
                                <div class="role-card" data-role="supporter">
                                    <div class="role-icon">📣</div>
                                    <h4>Supporter</h4>
                                    <p>Follow sports and athletes</p>
                                </div>
                            </div>
                            <button type="button" id="continue-register" class="btn btn--primary btn--full" disabled>Continue</button>
                            <p class="auth-footer-text mt-4">
                                Already have an account? <a href="#login" class="auth-link">Log In</a>
                            </p>
                        </div>

                        <div id="register-step-2" class="register-step hidden">
                            <h3 class="step-title">Basic Information</h3>
                            <form id="register-form" class="auth-form">
                                <div class="form-group">
                                    <label for="reg-name">Full Name</label>
                                    <input type="text" id="reg-name" class="form-control" placeholder="John Doe" required>
                                </div>
                                <div class="form-group">
                                    <label for="reg-email">Email</label>
                                    <input type="email" id="reg-email" class="form-control" placeholder="Enter your email" required>
                                </div>
                                <div class="form-row">
                                    <div class="form-group half">
                                        <label for="reg-password">Password</label>
                                        <input type="password" id="reg-password" class="form-control" required>
                                    </div>
                                    <div class="form-group half">
                                        <label for="reg-confirm">Confirm Password</label>
                                        <input type="password" id="reg-confirm" class="form-control" required>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group third">
                                        <label for="reg-state">State</label>
                                        <select id="reg-state" class="form-control" required>
                                            <option value="">Select State</option>
                                            <option value="Tamil Nadu">Tamil Nadu</option>
                                            <option value="Kerala">Kerala</option>
                                            <option value="Karnataka">Karnataka</option>
                                            <option value="Maharashtra">Maharashtra</option>
                                            <!-- Add more states as needed -->
                                        </select>
                                    </div>
                                    <div class="form-group third">
                                        <label for="reg-district">District</label>
                                        <input type="text" id="reg-district" class="form-control" required>
                                    </div>
                                    <div class="form-group third">
                                        <label for="reg-village">Village/Town</label>
                                        <input type="text" id="reg-village" class="form-control" required>
                                    </div>
                                </div>
                                <div class="form-actions row-between mt-4">
                                    <button type="button" id="back-register" class="btn btn--outline">Back</button>
                                    <button type="submit" class="btn btn--primary">Create Account</button>
                                </div>
                            </form>
                        </div>

                    </div>
                    <div class="auth-illustration-side register-illustration">
                        <div class="illustration-content">
                            <h3>"The future belongs to those who prepare for it today."</h3>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderForgotPassword() {
        return `
            <div class="auth-page auth-page--centered">
                <div class="auth-card">
                    <div class="auth-header text-center">
                        <h2 class="auth-logo">SportsConnect</h2>
                        <h1>Reset Password</h1>
                        <p>Enter your email and we'll send you a reset link.</p>
                    </div>
                    <form id="forgot-form" class="auth-form">
                        <div class="form-group">
                            <label for="reset-email">Email</label>
                            <input type="email" id="reset-email" class="form-control" placeholder="Enter your email" required>
                        </div>
                        <button type="submit" class="btn btn--primary btn--full mt-4">Send Reset Link</button>
                        <div class="text-center mt-4">
                            <a href="#login" class="auth-link"><i class="fas fa-arrow-left"></i> Back to Login</a>
                        </div>
                    </form>
                </div>
            </div>
        `;
    },
    
    init() {
        const hash = window.location.hash || '#login';
        
        // Password Toggle
        const toggleBtn = document.querySelector('.toggle-password');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const input = toggleBtn.previousElementSibling;
                if (input.type === 'password') {
                    input.type = 'text';
                    toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
                } else {
                    input.type = 'password';
                    toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
                }
            });
        }

        // Login Submit
        if (hash === '#login' || hash === '') {
            const loginForm = document.getElementById('login-form');
            if (loginForm) {
                loginForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    // Simulate login
                    if (SportsConnect.store) {
                        // Just set a dummy user for now
                        SportsConnect.store.currentUser = SportsConnect.data.users[0]; 
                    }
                    window.location.hash = '#feed';
                });
            }
        }

        // Register Logic
        if (hash === '#register') {
            let selectedRole = null;
            const roleCards = document.querySelectorAll('.role-card');
            const continueBtn = document.getElementById('continue-register');
            const backBtn = document.getElementById('back-register');
            const step1 = document.getElementById('register-step-1');
            const step2 = document.getElementById('register-step-2');

            roleCards.forEach(card => {
                card.addEventListener('click', () => {
                    roleCards.forEach(c => c.classList.remove('selected'));
                    card.classList.add('selected');
                    selectedRole = card.dataset.role;
                    continueBtn.disabled = false;
                });
            });

            continueBtn.addEventListener('click', () => {
                step1.classList.remove('active');
                step1.classList.add('hidden');
                step2.classList.remove('hidden');
                step2.classList.add('active');
            });

            backBtn.addEventListener('click', () => {
                step2.classList.remove('active');
                step2.classList.add('hidden');
                step1.classList.remove('hidden');
                step1.classList.add('active');
            });

            const registerForm = document.getElementById('register-form');
            if (registerForm) {
                registerForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    // Simulate register
                    if (SportsConnect.store) {
                        SportsConnect.store.currentUser = SportsConnect.data.users[0];
                    }
                    alert('Registration successful!'); // simple toast simulation
                    window.location.hash = '#feed';
                });
            }
        }

        // Forgot Password
        if (hash === '#forgot-password') {
            const forgotForm = document.getElementById('forgot-form');
            if (forgotForm) {
                forgotForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    alert('Reset link sent to your email.');
                    window.location.hash = '#login';
                });
            }
        }
    }
};
