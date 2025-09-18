<?php

namespace App\Services;

use App\Models\InvitationLink;
use Illuminate\Database\Eloquent\Collection;

class InvitationLinkService
{
    public function getAllInvitationLinks(): Collection
    {
        return InvitationLink::with('attendants')->get();
    }
    
public function getPaginatedInvitationLinks(int $perPage = 10)
    {
        return InvitationLink::with('attendants')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function createInvitationLink(array $data): InvitationLink
    {
        return InvitationLink::create($data);
    }

    public function getInvitationLinkById(int $id): InvitationLink
    {
        return InvitationLink::with('attendants')->findOrFail($id);
    }

    public function updateInvitationLink(InvitationLink $invitationLink, array $data): InvitationLink
    {
        $invitationLink->update($data);
        return $invitationLink->fresh();
    }

    public function deleteInvitationLink(InvitationLink $invitationLink): bool
    {
        return $invitationLink->delete();
    }

    public function getInvitationLinkByToken(string $token): ?InvitationLink
    {
        return InvitationLink::where('token', $token)
                            ->where('is_active', true)
                            ->first();
    }
        public function getInvitationLinksStatistics(): array
    {
        return [
            'total' => InvitationLink::count(),
            'active' => InvitationLink::where('is_active', true)->count(),
            'totalAttendants' => InvitationLink::sum('usage'),
            'avgUsage' => round(InvitationLink::avg('usage') ?? 0, 1),
        ];
    }
}
