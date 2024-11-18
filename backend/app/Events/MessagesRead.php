<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Support\Facades\Auth;

class MessagesRead implements ShouldBroadcast
{
    public $chatId;

    public function __construct($chatId)
    {
        $this->chatId = $chatId;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('App.Models.User.' . Auth::id());
    }
}
