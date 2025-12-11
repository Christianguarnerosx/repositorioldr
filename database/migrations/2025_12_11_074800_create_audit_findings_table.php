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
        Schema::create('audit_findings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('audit_document_review_id')->constrained()->cascadeOnDelete();
            $table->foreignId('finding_type_id')->constrained();
            $table->string('title');
            $table->text('description');
            $table->enum('severity', ['minor', 'major', 'critical']);
            $table->text('action_required')->nullable();
            $table->enum('status', ['pending', 'resolved', 'not_applicable'])->default('pending');
            $table->date('due_date')->nullable();
            $table->timestamp('corrected_at')->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_findings');
    }
};
