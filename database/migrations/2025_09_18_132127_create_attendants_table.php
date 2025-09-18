<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\VipStatus;
use App\Enums\AttendanceStatus;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendants', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('father_name');
            $table->string('last_name');
            $table->string('phone_number', 20);
            $table->foreignId('invitation_link_id')->constrained()->onDelete('cascade');
            $table->enum('vip_status', array_column(VipStatus::cases(), 'value'))
                  ->default(VipStatus::REGULAR->value);
            $table->boolean('attended')->default(false);
            $table->enum('attendance_status', array_column(AttendanceStatus::cases(), 'value'))
                  ->nullable();
            $table->string('status_token', 32)->unique();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendants');
    }
};
