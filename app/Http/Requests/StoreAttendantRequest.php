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
            'phone_number' => 'required|string|regex:/^09\d{8}$/',
            'vip_status' => 'nullable|in:regular,vip',
        ];
    }

    public function messages(): array
    {
        return [
            'first_name.required' => 'الاسم الأول مطلوب',
            'first_name.string' => 'الاسم الأول يجب أن يكون نصاً',
            'first_name.max' => 'الاسم الأول لا يجب أن يتجاوز 255 حرفاً',
            
            'father_name.required' => 'اسم الأب مطلوب',
            'father_name.string' => 'اسم الأب يجب أن يكون نصاً',
            'father_name.max' => 'اسم الأب لا يجب أن يتجاوز 255 حرفاً',
            
            'last_name.required' => 'اسم العائلة مطلوب',
            'last_name.string' => 'اسم العائلة يجب أن يكون نصاً',
            'last_name.max' => 'اسم العائلة لا يجب أن يتجاوز 255 حرفاً',
            
            'phone_number.required' => 'رقم الهاتف مطلوب',
            'phone_number.string' => 'رقم الهاتف يجب أن يكون نصاً',
            'phone_number.regex' => 'رقم الهاتف يجب أن يكون 10 أرقام ويبدأ بـ 09 (مثال: 0912345678)',
        ];
    }

    public function attributes(): array
    {
        return [
            'first_name' => 'الاسم الأول',
            'father_name' => 'اسم الأب', 
            'last_name' => 'اسم العائلة',
            'phone_number' => 'رقم الهاتف',
        ];
    }
}
