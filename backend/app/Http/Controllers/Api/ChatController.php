<?php
// app/Http/Controllers/Api/ChatController.php

namespace App\Http\Controllers\Api;

use App\Models\Chat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Routing\Controller;
use App\Events\NewMessage;
use App\Events\MessagesRead;
use App\Models\User;

class ChatController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        return $user->chats()
            ->with(['lastMessage', 'users'])
            ->withCount(['messages as unread_count' => function ($query) {
                $query->where('created_at', '>', DB::raw('chat_user.last_read_at'));
            }])
            ->get();
    }

    public function messages(Chat $chat)
    {
        return $chat->messages()
            ->with('user')
            ->orderBy('created_at', 'asc')
            ->get();
    }

    public function sendMessage(Request $request, Chat $chat)
    {
        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $message = $chat->messages()->create([
            'content' => $validated['content'],
            'user_id' => Auth::id(),
        ]);

        broadcast(new NewMessage($message))->toOthers();

        return $message->load('user');
    }

    public function markAsRead(Chat $chat)
    {
        Auth::user()->chats()
            ->updateExistingPivot($chat->id, [
                'last_read_at' => now(),
            ]);

        broadcast(new MessagesRead($chat->id))->toOthers();

        return response()->json(['success' => true]);
    }
}
