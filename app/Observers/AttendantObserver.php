<?php

namespace App\Observers;

use App\Models\Attendant;
use App\Services\ChairAssignmentService;

class AttendantObserver
{
    public function __construct(
        private ChairAssignmentService $chairService
    ) {}

    /**
     * Handle the Attendant "created" event.
     */
    public function created(Attendant $attendant): void
    {
        // Auto-assign chair after attendant is created
        $this->chairService->autoAssignChair($attendant);
    }

    /**
     * Handle the Attendant "updated" event.
     */
    public function updated(Attendant $attendant): void
    {
        // If VIP status changed, reassign chair if needed
        if ($attendant->wasChanged('vip_status') && !$attendant->chair_number) {
            $this->chairService->autoAssignChair($attendant);
        }
    }

    /**
     * Handle the Attendant "deleted" event.
     */
    public function deleted(Attendant $attendant): void
    {
        // Chair is automatically freed when attendant is deleted
        // due to the chair_number being on the attendant record
    }
}
