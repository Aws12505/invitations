<?php

namespace App\Services;

use App\Models\Attendant;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Facades\Storage;

class QrCodeService
{
    /**
     * Generate QR code for attendant
     */
    public function generateQrCode(Attendant $attendant, int $size = 300): string
    {
        $url = route('attendant.profile', $attendant->qr_token);
        
        return QrCode::format('svg')
            ->size($size)
            ->eye('square')
            ->style('round')
            ->margin(2)
            ->generate($url);
    }

    /**
     * Generate and save QR code as file
     */
    public function generateAndSaveQrCode(Attendant $attendant, int $size = 300): string
    {
        $url = route('attendant.profile', $attendant->qr_token);
        $filename = "qr_codes/attendant_{$attendant->id}_{$attendant->qr_token}.svg";
        
        // Check if file already exists
        if (Storage::disk('public')->exists($filename)) {
            return Storage::disk('public')->url($filename);
        }

        $qrCode = QrCode::format('svg')
            ->size($size)
            ->eye('square')
            ->style('round')
            ->margin(2)
            ->generate($url);

        Storage::disk('public')->put($filename, $qrCode);
        
        return Storage::disk('public')->url($filename);
    }

    /**
     * Generate QR code with custom styling
     */
    public function generateStyledQrCode(Attendant $attendant, array $options = []): string
    {
        $url = route('attendant.profile', $attendant->qr_token);
        
        $qrCode = QrCode::format($options['format'] ?? 'svg')
            ->size($options['size'] ?? 300)
            ->eye($options['eye'] ?? 'square')
            ->style($options['style'] ?? 'round')
            ->margin($options['margin'] ?? 2);

        // Add colors if specified
        if (isset($options['color'])) {
            $qrCode->color($options['color'][0], $options['color'][1], $options['color'][2]);
        }

        if (isset($options['backgroundColor'])) {
            $qrCode->backgroundColor($options['backgroundColor'][0], $options['backgroundColor'][1], $options['backgroundColor'][2]);
        }

        // Add logo if specified
        if (isset($options['logo'])) {
            $qrCode->merge($options['logo'], 0.3, true);
        }

        return $qrCode->generate($url);
    }
}
