<?php

namespace App\Enums;

enum AttendanceStatus: string
{
    case COMING = 'coming';
    case MAYBE = 'maybe';
    case NOT_COMING = 'not_coming';
}
