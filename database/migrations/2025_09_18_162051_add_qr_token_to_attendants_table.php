<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use App\Models\Attendant;

return new class extends Migration
{
    public function up(): void
    {
        // Step 1: Add the column without unique constraint first
        Schema::table('attendants', function (Blueprint $table) {
            $table->string('qr_token', 64)->nullable()->after('status_token');
        });

        // Step 2: Populate existing records with unique tokens
        $attendants = Attendant::whereNull('qr_token')->orWhere('qr_token', '')->get();
        
        foreach ($attendants as $attendant) {
            $attendant->qr_token = Str::random(64);
            $attendant->save();
        }

        // Step 3: Add unique constraint after all records have values
        Schema::table('attendants', function (Blueprint $table) {
            $table->string('qr_token', 64)->unique()->change();
        });
    }

    public function down(): void
    {
        Schema::table('attendants', function (Blueprint $table) {
            $table->dropColumn('qr_token');
        });
    }
};
