<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('prescriptions', function (Blueprint $table) {
        $table->id();
        $table->foreignId('doctor_id')->constrained('doctors');
        $table->foreignId('patient_id')->constrained('patients');
        $table->string('diagnosis');
        $table->text('notes')->nullable();
        $table->date('prescription_date');
        $table->timestamps();
    });
}
};
