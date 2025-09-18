<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('attendants', function (Blueprint $table) {
            $table->integer('chair_number')->nullable()->unique()->after('status_token');
        });
    }

    public function down(): void
    {
        Schema::table('attendants', function (Blueprint $table) {
            $table->dropColumn('chair_number');
        });
    }
};
