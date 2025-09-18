<?php

namespace App\Enums;

enum VipStatus: string
{
    case REGULAR = 'regular';
    case VIP = 'vip';
    case PREMIUM = 'premium'; // Future extension
}
