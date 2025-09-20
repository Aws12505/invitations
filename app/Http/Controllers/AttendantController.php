<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAttendantRequest;
use App\Models\Attendant;
use App\Models\InvitationLink;
use App\Services\AttendantService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendantController extends Controller
{
    public function __construct(
        private AttendantService $attendantService
    ) {}

    public function index(Request $request)
    {
        // Get filter parameters from request
        $filters = $request->only([
            'search',
            'attendance_status', 
            'vip_status',
            'attended',
            'invitation_link_id'
        ]);
        
        // Remove empty filters
        $filters = array_filter($filters, function($value) {
            return $value !== null && $value !== '';
        });

        // Handle export request
        if ($request->has('export') && $request->export === 'csv') {
            return $this->exportCsv($filters);
        }

        // Get paginated attendants with filters applied
        $paginatedAttendants = $this->attendantService->getPaginatedAttendants(15, $filters);
        
        // Get statistics with the same filters applied
        $statistics = $this->attendantService->getAttendantsStatistics($filters);
        
        // Get all invitation links for the filter dropdown with their full names
        $invitationLinks = InvitationLink::select('id', 'first_name', 'father_name', 'last_name', 'usage')
            ->orderBy('first_name')
            ->get();

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
            'statistics' => $statistics,
            'filters' => $filters, // Pass current filters back to frontend
            'invitationLinks' => $invitationLinks
        ]);
    }

    private function exportCsv(array $filters)
    {
        // Get all filtered attendants for export
        $attendants = Attendant::with('invitationLink');
        
        // Apply the same filters as in the service
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $attendants->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('father_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('phone_number', 'like', "%{$search}%");
            });
        }
        
        if (!empty($filters['attendance_status']) && $filters['attendance_status'] !== 'all') {
            if ($filters['attendance_status'] === 'no_response') {
                $attendants->whereNull('attendance_status');
            } else {
                $attendants->where('attendance_status', $filters['attendance_status']);
            }
        }
        
        if (!empty($filters['vip_status']) && $filters['vip_status'] !== 'all') {
            $attendants->where('vip_status', $filters['vip_status']);
        }
        
        if (!empty($filters['attended']) && $filters['attended'] !== 'all') {
            $attended = $filters['attended'] === 'attended';
            $attendants->where('attended', $attended);
        }
        
        if (!empty($filters['invitation_link_id'])) {
            $attendants->where('invitation_link_id', $filters['invitation_link_id']);
        }
        
        $attendants = $attendants->orderBy('created_at', 'desc')->get();
        
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="attendants_' . date('Y-m-d_H-i-s') . '.csv"',
        ];
        
        $callback = function() use ($attendants) {
            $file = fopen('php://output', 'w');
            
            // CSV headers
            fputcsv($file, [
                'ID',
                'First Name',
                'Father Name', 
                'Last Name',
                'Phone Number',
                'VIP Status',
                'Chair Number',
                'Chair Section',
                'Attendance Status',
                'Actually Attended',
                'Invited By',
                'Registration Date'
            ]);
            
            // CSV data
            foreach ($attendants as $attendant) {
                fputcsv($file, [
                    $attendant->id,
                    $attendant->first_name,
                    $attendant->father_name,
                    $attendant->last_name,
                    $attendant->phone_number,
                    $attendant->vip_status?->value ?? 'N/A',
                    $attendant->chair_number ?? 'No Chair Assigned',
                    $attendant->chair_section,
                    $attendant->attendance_status?->value ?? 'No Response',
                    $attendant->attended ? 'Yes' : 'No',
                    $attendant->invitationLink ? $attendant->invitationLink->full_name : 'Unknown',
                    $attendant->created_at->format('Y-m-d H:i:s')
                ]);
            }
            
            fclose($file);
        };
        
        return response()->stream($callback, 200, $headers);
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
