<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Enums\VipStatus;
use Illuminate\Validation\Rules\Enum;

class UpdateInvitationLinkRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name' => 'sometimes|string|max:255',
            'father_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'limit' => 'sometimes|integer|min:1|max:1000',
            'default_vip_status' => ['sometimes', new Enum(VipStatus::class)],
            'is_active' => 'sometimes|boolean',
        ];
    }
}
