<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateAttendanceStatusRequest;
use App\Services\AttendantService;
use App\Enums\AttendanceStatus;
use Inertia\Inertia;

class AttendanceStatusController extends Controller
{
    public function __construct(
        private AttendantService $attendantService
    ) {}

    public function show(string $token)
    {
        $attendant = $this->attendantService->getAttendantByStatusToken($token);

        if (!$attendant) {
            return Inertia::render('AttendanceStatus/NotFound');
        }

        return Inertia::render('AttendanceStatus/Form', [
            'attendant' => $attendant,
            'statusOptions' => AttendanceStatus::cases()
        ]);
    }

    public function update(UpdateAttendanceStatusRequest $request, string $token)
    {
        $attendant = $this->attendantService->getAttendantByStatusToken($token);

        if (!$attendant) {
            return redirect()->route('attendance.status', $token)
                           ->with('error', 'Invalid status link.');
        }
        
        $validated = $request->validated();

        $this->attendantService->updateAttendanceStatus(
            $attendant,
            AttendanceStatus::from($validated['attendance_status']) // Access from validated array
        );

        return Inertia::render('AttendanceStatus/Success', [
            'attendant' => $attendant->fresh()
        ]);
    }
}
