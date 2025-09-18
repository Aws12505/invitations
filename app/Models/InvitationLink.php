<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\VipStatus;
use Illuminate\Support\Str;

class InvitationLink extends Model
{
    use HasFactory;

    protected $fillable = [
        'token',
        'first_name',
        'father_name',
        'last_name',
        'limit',
        'usage',
        'default_vip_status',
        'is_active'
    ];

    protected $casts = [
        'default_vip_status' => VipStatus::class,
        'is_active' => 'boolean'
    ];

    protected $appends = ['full_name'];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            if (!$model->token) {
                $model->token = Str::random(32);
            }
        });
    }

    public function attendants()
    {
        return $this->hasMany(Attendant::class);
    }

    public function getFullNameAttribute()
    {
        return trim("{$this->first_name} {$this->father_name} {$this->last_name}");
    }

    public function hasReachedLimit()
    {
        return $this->usage >= $this->limit;
    }

    public function incrementUsage()
    {
        $this->increment('usage');
    }
}
