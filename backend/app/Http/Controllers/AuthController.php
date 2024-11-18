<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;


class AuthController
{
    public function login(Request $request)
    {
        // Validation des données
        $request->validate([
            'phone' => 'required|string',
            'password' => 'required|string',
        ]);

        // Trouver l'utilisateur par le numéro de téléphone
        $user = User::where('phone', $request->phone)->first();

        if ($user && $request->password == $user->password) {
            // Authentifier l'utilisateur
            $token = $user->createToken('AppToken')->plainTextToken;
            $userCredential = $user;

            return response()->json([
                'user' => $userCredential,
                'token' => $token
            ]);
        }

        return response()->json(['message' => 'Invalid credentials'], status: 401);
    }
    public function register(Request $request)
    {
        // Validation des données d'inscription
        $request->validate([
            'phone' => 'required|string|unique:users,phone',
            'password' => 'required|string|min:6',
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
        ]);

        // Création de l'utilisateur
        $user = User::create([
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'name' => $request->name,
            'email' => $request->email,
        ]);

        // Création du token d'authentification
        $token = $user->createToken('AppToken')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }
    public function logout(Request $request)
    {
        // Supprimer tous les tokens de l'utilisateur actuellement authentifié
        Auth::user()->tokens->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }
}
