<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\LoginController;

/*
|--------------------------------------------------------------------------
| Registration Routes
|--------------------------------------------------------------------------
*/
Route::get('/register', [RegisterController::class, 'showRegisterForm'])->name('register');
Route::post('/register', [RegisterController::class, 'register'])->name('register.submit');

/*
|--------------------------------------------------------------------------
| Static / Public Pages
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return view('welcome');
})->name('home');

Route::get('/rooms', function () {
    return view('rooms');
})->name('rooms');

Route::get('/booking', function () {
    return view('booking');
})->name('booking');

/*
|--------------------------------------------------------------------------
| Login & Logout Routes
|--------------------------------------------------------------------------
*/

// ✅ Show login form (GET)
Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
Route::post('/login', [LoginController::class, 'login'])->name('login.submit');
// Ubah dari GET ke POST untuk logout
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');


/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/
Route::get('/profile', function () {
    if (!session()->has('user_id')) {
        return redirect('/login');
    }
    return view('profile');
})->name('profile');