<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * Les URI pour lesquelles la vérification CSRF sera désactivée.
     *
     * @var array
     */
    protected $except = [
        '/api/*',
    ];
}
