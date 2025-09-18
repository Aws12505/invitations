<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\AttendanceStatus;
use Illuminate\Validation\Rules\Enum;

class UpdateAttendanceStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'attendance_status' => ['required', new Enum(AttendanceStatus::class)],
        ];
    }
}
