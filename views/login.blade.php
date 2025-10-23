<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - East Out Hotel</title>
    <link rel="stylesheet" href="{{ asset('style.css') }}">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
    <link rel="icon" type="image/png" href="{{ asset('logo.png') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body class="page-no-scroll">

    {{-- SIDE MENU --}}
    <div id="menu-overlay"></div>
    <nav id="side-menu">
        <button id="menu-close" aria-label="Close menu"><i class="fas fa-times"></i></button>
        <div class="side-menu-content">
            <a href="{{ route('home') }}">
                <img src="{{ asset('logohd.png') }}" alt="East Out Hotel Logo" class="side-menu-logo">
            </a>
            <ul class="side-menu-nav">
                <li><a href="{{ route('home') }}">Home</a></li>
                <li><a href="{{ route('rooms') }}">Rooms</a></li>
                <li><a href="#">Gallery</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
            <a href="{{ route('booking') }}" class="btn btn-book">Book Now</a>
        </div>
    </nav>

    {{-- HEADER --}}
    <header class="minimal-header">
        <div class="container-fluid">
            <button class="menu-toggle" aria-label="Toggle Navigation">
                <i class="fas fa-bars"></i>
            </button>
            <div class="hotel-name-center">
                <a href="{{ route('home') }}">
                    <img src="{{ asset('logohd.png') }}" alt="East Out Hotel Logo" class="header-logo">
                </a>
            </div>
            <div class="header-right-nav">
                <div class="lang-selector">EN <i class="fas fa-chevron-down"></i></div>
                <button id="dark-mode-toggle" aria-label="Toggle dark mode">
                    <i class="fas fa-moon"></i> <i class="fas fa-sun"></i>
                </button>
                <a href="/profile" id="profile-icon-link" class="header-icon" aria-label="Login or Profile">
                    <i class="fas fa-user-circle"></i>
                </a>
            </div>
        </div>
    </header>

    {{-- MAIN CONTENT --}}
    <main class="page-content">
        <section class="discover-section auth-panel">
            <h2 class="room-page-title">Login</h2>

            {{-- Pesan sukses dari register --}}
            @if(session('success'))
                <div class="alert alert-success">{{ session('success') }}</div>
            @endif

            {{-- Pesan error umum --}}
            @if(session('error'))
                <div class="alert alert-danger">{{ session('error') }}</div>
            @endif

            {{-- Pesan error validasi --}}
            @if($errors->any())
                <div class="alert alert-danger">
                    <ul>
                        @foreach($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            {{-- FORM LOGIN --}}
            <form method="POST" action="{{ route('login.submit') }}">
                @csrf

                <div class="form-group">
                    <label for="username">Username</label>
                    <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        value="{{ old('username') }}" 
                        required>
                </div>

                <div class="form-group">
                    <label for="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        required>
                </div>

                <button type="submit" class="btn btn-book btn-full-width">Login</button>
            </form>

            <p class="auth-switch">
                Don't have an account? 
                <a href="{{ route('register') }}">Register here</a>
            </p>
        </section>
    </main>

    {{-- FOOTER --}}
    <footer class="main-footer" id="main-footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-column">
                    <h4>Reservations</h4>
                    <ul>
                        <li><a href="#">Book online</a></li>
                        <li><a href="#">Enquire</a></li>
                        <li><a href="#">Email us</a></li>
                        <li><a href="#">Modify reservation</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h4>About us</h4>
                    <ul>
                        <li><a href="#">Our commitment</a></li>
                        <li><a href="#">FAQs</a></li>
                        <li><a href="#">Careers</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h4>Legal</h4>
                    <ul>
                        <li><a href="#">Terms</a></li>
                        <li><a href="#">Privacy</a></li>
                        <li><a href="#">Cookies</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h4>Follow us</h4>
                    <div class="social-icons">
                        <a href="#"><i class="fab fa-twitter"></i></a>
                        <a href="#"><i class="fab fa-facebook-f"></i></a>
                        <a href="#"><i class="fab fa-instagram"></i></a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2025 East Out Hotel. All Rights Reserved.</p>
            </div>
        </div>
    </footer>

    <script src="{{ asset('script.js') }}"></script>
</body>
</html>
