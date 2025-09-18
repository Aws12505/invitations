<?php

namespace App\Services;

use App\Models\Attendant;
use App\Models\InvitationLink;
use App\Enums\AttendanceStatus;
use Illuminate\Database\Eloquent\Collection;

class AttendantService
{
    public function getAllAttendants(): Collection
    {
        return Attendant::with('invitationLink')->get();
    }

    public function getAttendantsStatistics(): array
    {
        $totalAttendants = Attendant::count();
        
        return [
            'total' => $totalAttendants,
            'coming' => Attendant::where('attendance_status', 'coming')->count(),
            'maybe' => Attendant::where('attendance_status', 'maybe')->count(),
            'not_coming' => Attendant::where('attendance_status', 'not_coming')->count(),
            'no_response' => Attendant::whereNull('attendance_status')->count(),
            'attended' => Attendant::where('attended', true)->count(),
            'vip' => Attendant::where('vip_status', 'vip')->count(),
        ];
    }
    
    public function getPaginatedAttendants(int $perPage = 15)
    {
        return Attendant::with('invitationLink')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
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
