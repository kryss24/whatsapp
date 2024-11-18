<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = ['name', 'phone', 'email', 'password', 'avatar', 'status'];
    protected $hidden = ['password'];

    public function chats()
    {
        return $this->belongsToMany(Chat::class)
            ->withPivot('last_read_at')
            ->withTimestamps();
    }
}
