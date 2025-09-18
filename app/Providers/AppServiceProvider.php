<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Attendant;
use App\Observers\AttendantObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Attendant::observe(AttendantObserver::class);
    }
}
