<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;

class LoginController extends Controller
{
    public function showLoginForm()
    {
        return view('login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $account = DB::table('account')->where('Username', $request->username)->first();

        if (!$account) {
            return back()->with('error', 'Username tidak ditemukan.');
        }

        if (!Hash::check($request->password, $account->Password)) {
            return back()->with('error', 'Password salah.');
        }

        // Simpan session user
        Session::put('user_id', $account->ID);
        Session::put('username', $account->Username);
        Session::put('type', $account->Type);
        Session::save();

        return redirect()->route('profile')->with('success', 'Login berhasil!');
    }

    public function logout()
    {
        Session::flush();
        Session::save();
        return redirect()->route('login')->with('success', 'Anda telah logout.');
    }
}
