<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\VipStatus;
use App\Enums\AttendanceStatus;
use Illuminate\Support\Str;

class Attendant extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'father_name',
        'last_name',
        'phone_number',
        'invitation_link_id',
        'vip_status',
        'attended',
        'attendance_status',
        'status_token',
        'chair_number', // Add this
        'qr_token', // Add this

    ];

    protected $casts = [
        'vip_status' => VipStatus::class,
        'attendance_status' => AttendanceStatus::class,
        'attended' => 'boolean',
        'chair_number' => 'integer', // Add this
    ];

protected $appends = ['full_name', 'chair_section', 'qr_code_url'];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            if (!$model->status_token) {
                $model->status_token = Str::random(32);
            }
            if (!$model->qr_token) {
                $model->qr_token = Str::random(64);
            }
        });
    }

    public function invitationLink()
    {
        return $this->belongsTo(InvitationLink::class);
    }

    public function getFullNameAttribute()
    {
        return trim("{$this->first_name} {$this->father_name} {$this->last_name}");
    }

    /**
     * Get chair section (VIP or Regular)
     */
    public function getChairSectionAttribute(): string
    {
        if (!$this->chair_number) return 'No Chair';
        
        return $this->chair_number <= 250 ? 'VIP Section' : 'Regular Section';
    }

        /**
     * Get QR code URL for this attendant
     */
    public function getQrCodeUrlAttribute(): string
    {
        return route('attendant.profile', $this->qr_token);
    }
}
