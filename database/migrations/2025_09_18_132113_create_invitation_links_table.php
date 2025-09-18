<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\VipStatus;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invitation_links', function (Blueprint $table) {
            $table->id();
            $table->string('token', 32)->unique();
            $table->string('first_name');
            $table->string('father_name');
            $table->string('last_name');
            $table->integer('limit')->default(20);
            $table->integer('usage')->default(0);
            $table->enum('default_vip_status', array_column(VipStatus::cases(), 'value'))
                  ->default(VipStatus::REGULAR->value);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invitation_links');
    }
};
