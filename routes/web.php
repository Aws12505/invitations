<?php

use App\Http\Controllers\InvitationLinkController;
use App\Http\Controllers\AttendantController;
use App\Http\Controllers\PublicInvitationController;
use App\Http\Controllers\AttendanceStatusController;
use App\Http\Controllers\ChairAssignmentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AttendantProfileController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Auth;

// Protected routes (require authentication)
Route::middleware(['auth'])->group(function () {
    Route::resource('invitation-links', InvitationLinkController::class);
    Route::resource('attendants', AttendantController::class)->except(['create', 'store']);
    Route::patch('/attendants/{attendant}/toggle-attended', [AttendantController::class, 'toggleAttended'])->name('attendants.toggle-attended');
    Route::get('/chair-assignment', [ChairAssignmentController::class, 'index'])->name('chair-assignment.index');
    Route::get('/chair-assignment/{attendant}/assign', [ChairAssignmentController::class, 'showAssignModal'])->name('chair-assignment.assign-modal');
    Route::get('/chair-assignment/{attendant}/switch', [ChairAssignmentController::class, 'showSwitchModal'])->name('chair-assignment.switch-modal');
    Route::patch('/chair-assignment/{attendant}/assign', [ChairAssignmentController::class, 'assignChair']);
    Route::post('/chair-assignment/switch', [ChairAssignmentController::class, 'switchChairs']);
    Route::delete('/chair-assignment/{attendant}/remove', [ChairAssignmentController::class, 'removeChair']);
    Route::post('/chair-assignment/{attendant}/auto-assign', [ChairAssignmentController::class, 'autoAssign']);
    Route::get('/attendants/{attendant}/qr-code', [AttendantProfileController::class, 'generateQrCode'])->name('attendant.qr-code');
Route::patch('/profile/{qr_token}/toggle-attended', [AttendantProfileController::class, 'toggleAttended'])->name('attendant.toggle-attended');
});


Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->action([InvitationLinkController::class, 'index']);
    }

    return app(AuthenticatedSessionController::class)->create(request());
})->name('home');
// Public routes (no authentication required)
Route::get('/invitation/{token}', [PublicInvitationController::class, 'show'])
     ->name('invitation.show');
Route::post('/invitation/{token}', [PublicInvitationController::class, 'store'])
     ->name('invitation.store');

Route::get('/status/{token}', [AttendanceStatusController::class, 'show'])
     ->name('attendance.status');
Route::patch('/status/{token}', [AttendanceStatusController::class, 'update'])
     ->name('attendance.update');
Route::get('/profile/{qr_token}', [AttendantProfileController::class, 'show'])->name('attendant.profile');


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
