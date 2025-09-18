<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAttendantRequest;
use App\Services\InvitationLinkService;
use App\Services\AttendantService;
use Inertia\Inertia;

class PublicInvitationController extends Controller
{
    public function __construct(
        private InvitationLinkService $invitationLinkService,
        private AttendantService $attendantService
    ) {}

    public function show(string $token)
    {
        $invitationLink = $this->invitationLinkService->getInvitationLinkByToken($token);

        if (!$invitationLink) {
            return Inertia::render('Invitation/NotFound');
        }

        if ($invitationLink->hasReachedLimit()) {
            return Inertia::render('Invitation/LimitReached', [
                'invitationLink' => $invitationLink
            ]);
        }

        return Inertia::render('Invitation/Form', [
            'invitationLink' => $invitationLink
        ]);
    }

    public function store(StoreAttendantRequest $request, string $token)
    {
        $invitationLink = $this->invitationLinkService->getInvitationLinkByToken($token);

        if (!$invitationLink || $invitationLink->hasReachedLimit()) {
            return redirect()->route('invitation.show', $token)
                           ->with('error', 'Invitation is no longer valid.');
        }

        $attendant = $this->attendantService->createAttendant(
            $request->validated(),
            $invitationLink
        );

        return Inertia::render('Invitation/Success', [
            'attendant' => $attendant,
            'statusUrl' => route('attendance.status', $attendant->status_token)
        ]);
    }
}
