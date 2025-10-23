<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class RegisterController extends Controller
{
    // Tampilkan form register
    public function showRegisterForm()
    {
        return view('register'); // resources/views/register.blade.php
    }

    // Proses register
    public function register(Request $request)
    {
        // Validasi input
        $request->validate([
            'username' => 'required|string|max:20|unique:Account,Username',
            'password' => 'required|string|min:6|confirmed',
            'type'     => 'required|string',
        ]);

        // Ambil ID terakhir
        $lastID = DB::table('Account')
                    ->select('ID')
                    ->orderBy('ID', 'desc')
                    ->first();

        if ($lastID) {
            // Ambil angka terakhir, misal 'ACC005' -> 5
            $num = (int)substr($lastID->ID, 3) + 1;
            $newID = "ACC" . str_pad($num, 3, "0", STR_PAD_LEFT);
        } else {
            $newID = "ACC001";
        }

        // Simpan ke database
        DB::table('Account')->insert([
            'ID'       => $newID,
            'Username' => $request->username,
            'Password' => Hash::make($request->password),
            'Type'     => $request->type,
        ]);

        return redirect('/login')->with('success', 'Register berhasil! Silakan login.');
    }
}
