<?php

use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\Api\ChatController;
// use App\Http\Controllers\AuthController;
// use Illuminate\Http\Request;

// // Routes d'authentification accessibles sans être authentifié
// Route::post('/api/login', [ChatController::class, 'index']);
// Route::post('/api/register', [AuthController::class, 'register']);
// Route::post('/api/logout', [AuthController::class, 'logout']);

// // Routes protégées par le middleware auth:sanctum
// Route::middleware('auth:sanctum')->group(function () {
//     Route::get('/user', function (Request $request) {
//         return $request->user();
//     });

//     Route::get('/chats', [ChatController::class, 'index']);
//     Route::post('/chats/{chat}/messages', [ChatController::class, 'sendMessage']);
//     Route::put('/chats/{chat}/read', [ChatController::class, 'markAsRead']);
// });
Route::get('/test', function () {
    return response()->json(['message' => 'Route API fonctionnelle']);
});
