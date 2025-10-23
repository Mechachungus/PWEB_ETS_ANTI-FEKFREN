<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class eastout extends Model
{
    use HasFactory;
	
	// Nama tabel di database
    protected $table = 'account';

    // Kolom-kolom yang dapat diisi secara massal
    protected $fillable = ['Username', 'Password'];

}