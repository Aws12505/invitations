<?php

namespace App\Services;

use App\Models\Attendant;
use App\Models\InvitationLink;
use App\Enums\AttendanceStatus;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AttendantService
{
    public function getAllAttendants(): Collection
    {
        return Attendant::with('invitationLink')->get();
    }

    public function getAttendantsStatistics(array $filters = []): array
    {
        $query = Attendant::query();
        
        // Apply the same filters to statistics as well
        $this->applyFilters($query, $filters);
        
        $totalAttendants = $query->count();
        
        return [
            'total' => $totalAttendants,
            'coming' => (clone $query)->where('attendance_status', 'coming')->count(),
            'maybe' => (clone $query)->where('attendance_status', 'maybe')->count(),
            'not_coming' => (clone $query)->where('attendance_status', 'not_coming')->count(),
            'no_response' => (clone $query)->whereNull('attendance_status')->count(),
            'attended' => (clone $query)->where('attended', true)->count(),
            'vip' => (clone $query)->where('vip_status', 'vip')->count(),
        ];
    }
    
    public function getPaginatedAttendants(int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        $query = Attendant::with('invitationLink');
        
        // Apply filters before pagination
        $this->applyFilters($query, $filters);
        
        return $query->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString(); // Preserve query parameters in pagination links
    }
    
    private function applyFilters($query, array $filters)
    {
        // Search filter - searches across individual name fields, phone, and inviter name
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                // Search in attendant's name fields
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('father_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('phone_number', 'like', "%{$search}%")
                  // Search for full name combination using CONCAT
                  ->orWhere(DB::raw("CONCAT(first_name, ' ', COALESCE(father_name, ''), ' ', last_name)"), 'like', "%{$search}%")
                  // Search in invitation link owner's name
                  ->orWhereHas('invitationLink', function ($inviteQuery) use ($search) {
                      $inviteQuery->where('first_name', 'like', "%{$search}%")
                                  ->orWhere('father_name', 'like', "%{$search}%")
                                  ->orWhere('last_name', 'like', "%{$search}%")
                                  ->orWhere(DB::raw("CONCAT(first_name, ' ', COALESCE(father_name, ''), ' ', last_name)"), 'like', "%{$search}%");
                  });
            });
        }
        
        // Attendance status filter
        if (!empty($filters['attendance_status']) && $filters['attendance_status'] !== 'all') {
            if ($filters['attendance_status'] === 'no_response') {
                $query->whereNull('attendance_status');
            } else {
                $query->where('attendance_status', $filters['attendance_status']);
            }
        }
        
        // VIP status filter
        if (!empty($filters['vip_status']) && $filters['vip_status'] !== 'all') {
            $query->where('vip_status', $filters['vip_status']);
        }
        
        // Attended filter
        if (!empty($filters['attended']) && $filters['attended'] !== 'all') {
            $attended = $filters['attended'] === 'attended';
            $query->where('attended', $attended);
        }
        
        // Invitation link filter
        if (!empty($filters['invitation_link_id'])) {
            $query->where('invitation_link_id', $filters['invitation_link_id']);
        }
        
        return $query;
    }

    public function createAttendant(array $data, InvitationLink $invitationLink): Attendant
    {
        $attendant = new Attendant($data);
        $attendant->invitation_link_id = $invitationLink->id;
        $attendant->vip_status = $invitationLink->default_vip_status;
        $attendant->save();

        $invitationLink->incrementUsage();

        return $attendant;
    }

    public function getAttendantById(int $id): Attendant
    {
        return Attendant::with('invitationLink')->findOrFail($id);
    }

    public function updateAttendant(Attendant $attendant, array $data): Attendant
    {
        $attendant->update($data);
        return $attendant->fresh();
    }

    public function deleteAttendant(Attendant $attendant): bool
    {
        $invitationLink = $attendant->invitationLink;
        $result = $attendant->delete();
        
        if ($result) {
            $invitationLink->decrement('usage');
        }
        
        return $result;
    }

    public function getAttendantByStatusToken(string $token): ?Attendant
    {
        return Attendant::where('status_token', $token)->first();
    }

    public function updateAttendanceStatus(Attendant $attendant, AttendanceStatus $status): Attendant
    {
        $attendant->update(['attendance_status' => $status]);
        return $attendant->fresh();
    }
}
