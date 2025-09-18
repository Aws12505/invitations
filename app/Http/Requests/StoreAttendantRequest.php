<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAttendantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name' => 'required|string|max:255',
            'father_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone_number' => 'required|string|regex:/^\+[1-9]\d{1,14}$/',
        ];
    }

    public function messages(): array
    {
        return [
            'phone_number.regex' => 'Phone number must be in international format (e.g., +963959862220)',
        ];
    }
}
