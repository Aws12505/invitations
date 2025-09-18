<?php

namespace App\Http\Controllers;

use App\Models\Attendant;
use App\Services\QrCodeService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
class AttendantProfileController extends Controller
{
    public function __construct(
        private QrCodeService $qrCodeService
    ) {}

    /**
     * Show public attendant profile
     */
    public function show(string $qrToken)
    {
        $attendant = Attendant::where('qr_token', $qrToken)
            ->with('invitationLink')
            ->firstOrFail();

        return Inertia::render('AttendantProfile/Show', [
            'attendant' => $attendant,
            'isAuthenticated' => Auth::check(),
        ]);
    }

    /**
     * Toggle attended status (authenticated users only)
     */
    public function toggleAttended(string $qrToken)
    {

        $attendant = Attendant::where('qr_token', $qrToken)->firstOrFail();
        
        $newStatus = !$attendant->attended;
        $attendant->update(['attended' => $newStatus]);

        $message = $newStatus 
            ? "{$attendant->full_name} marked as attended" 
            : "{$attendant->full_name} marked as not attended";

        return back()->with('success', $message);
    }

    /**
     * Generate QR code for attendant
     */
    public function generateQrCode(Attendant $attendant)
    {
        $qrCode = $this->qrCodeService->generateQrCode($attendant);
        
        return response($qrCode, 200)
            ->header('Content-Type', 'image/svg+xml');
    }
}
