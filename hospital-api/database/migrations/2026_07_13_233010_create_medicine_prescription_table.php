<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create(
            'medicine_prescription',
            function (Blueprint $table)
        {
            $table->id();

            $table->foreignId(
                'medicine_id'
            )->constrained()->cascadeOnDelete();

            $table->foreignId(
                'prescription_id'
            )->constrained()->cascadeOnDelete();

            $table->integer(
                'quantity'
            )->default(1);

            $table->string(
                'dosage'
            )->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists(
            'medicine_prescription'
        );
    }
};