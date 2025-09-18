<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAttendantRequest;
use App\Models\Attendant;
use App\Services\AttendantService;
use Inertia\Inertia;

class AttendantController extends Controller
{
    public function __construct(
        private AttendantService $attendantService
    ) {}

    public function index()
    {
        // Get paginated attendants
        $paginatedAttendants = $this->attendantService->getPaginatedAttendants(15);
        
        // Get statistics with efficient queries
        $statistics = $this->attendantService->getAttendantsStatistics();
        
        return Inertia::render('Attendants/Index', [
            'attendants' => [
                'data' => $paginatedAttendants->items(),
                'pagination' => [
                    'current_page' => $paginatedAttendants->currentPage(),
                    'total' => $paginatedAttendants->total(),
                    'per_page' => $paginatedAttendants->perPage(),
                    'last_page' => $paginatedAttendants->lastPage(),
                    'from' => $paginatedAttendants->firstItem(),
                    'to' => $paginatedAttendants->lastItem(),
                    'prev_page_url' => $paginatedAttendants->previousPageUrl(),
                    'next_page_url' => $paginatedAttendants->nextPageUrl(),
                    'links' => $paginatedAttendants->linkCollection()->toArray(),
                ],
            ],
            'statistics' => $statistics
        ]);
    }

    public function show(Attendant $attendant)
    {
        $attendant = $this->attendantService->getAttendantById($attendant->id);
        
        return Inertia::render('Attendants/Show', [
            'attendant' => $attendant
        ]);
    }

    public function edit(Attendant $attendant)
    {
        return Inertia::render('Attendants/Edit', [
            'attendant' => $attendant
        ]);
    }

    public function update(StoreAttendantRequest $request, Attendant $attendant)
    {
        $this->attendantService->updateAttendant(
            $attendant, 
            $request->validated()
        );

        return redirect()->route('attendants.index')
                        ->with('success', 'Attendant updated successfully.');
    }

    public function destroy(Attendant $attendant)
    {
        $this->attendantService->deleteAttendant($attendant);

        return redirect()->route('attendants.index')
                        ->with('success', 'Attendant deleted successfully.');
    }

     public function toggleAttended(Attendant $attendant)
    {
        try {
            $newStatus = !$attendant->attended;
            
            $attendant->update(['attended' => $newStatus]);
            
            $message = $newStatus 
                ? "{$attendant->full_name} marked as attended" 
                : "{$attendant->full_name} marked as not attended";
            
            return back()->with('success', $message);
            
        } catch (\Exception $e) {
            return back()->withErrors([
                'attended' => 'Failed to update attendance status'
            ]);
        }
    }
}
