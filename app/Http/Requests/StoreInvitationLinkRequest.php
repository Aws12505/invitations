<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\VipStatus;
use Illuminate\Validation\Rules\Enum;

class StoreInvitationLinkRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Add your authorization logic
    }

    public function rules(): array
    {
        return [
            'first_name' => 'required|string|max:255',
            'father_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'limit' => 'required|integer|min:1|max:1000',
            'default_vip_status' => ['required', new Enum(VipStatus::class)],
        ];
    }
}
