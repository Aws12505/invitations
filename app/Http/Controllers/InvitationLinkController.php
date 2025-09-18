<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInvitationLinkRequest;
use App\Http\Requests\UpdateInvitationLinkRequest;
use App\Models\InvitationLink;
use App\Services\InvitationLinkService;
use Inertia\Inertia;

class InvitationLinkController extends Controller
{
    public function __construct(
        private InvitationLinkService $invitationLinkService
    ) {}

    public function index()
    {
        // Get paginated invitation links
        $paginatedLinks = $this->invitationLinkService->getPaginatedInvitationLinks(10);
        
        // Get statistics with efficient queries
        $statistics = $this->invitationLinkService->getInvitationLinksStatistics();
        
        return Inertia::render('InvitationLinks/Index', [
            'invitationLinks' => [
                'data' => $paginatedLinks->items(),
                'pagination' => [
                    'current_page' => $paginatedLinks->currentPage(),
                    'total' => $paginatedLinks->total(),
                    'per_page' => $paginatedLinks->perPage(),
                    'last_page' => $paginatedLinks->lastPage(),
                    'from' => $paginatedLinks->firstItem(),
                    'to' => $paginatedLinks->lastItem(),
                    'prev_page_url' => $paginatedLinks->previousPageUrl(),
                    'next_page_url' => $paginatedLinks->nextPageUrl(),
                    'links' => $paginatedLinks->linkCollection()->toArray(),
                ],
            ],
            'statistics' => $statistics
        ]);
    }

    public function create()
    {
        return Inertia::render('InvitationLinks/Create');
    }

    public function store(StoreInvitationLinkRequest $request)
    {
        $invitationLink = $this->invitationLinkService->createInvitationLink(
            $request->validated()
        );

        return redirect()->route('invitation-links.index')
                        ->with('success', 'Invitation link created successfully.');
    }

    public function show(InvitationLink $invitationLink)
    {
        $invitationLink = $this->invitationLinkService->getInvitationLinkById($invitationLink->id);
        
        return Inertia::render('InvitationLinks/Show', [
            'invitationLink' => $invitationLink
        ]);
    }

    public function edit(InvitationLink $invitationLink)
    {
        return Inertia::render('InvitationLinks/Edit', [
            'invitationLink' => $invitationLink
        ]);
    }

    public function update(UpdateInvitationLinkRequest $request, InvitationLink $invitationLink)
    {
        $this->invitationLinkService->updateInvitationLink(
            $invitationLink, 
            $request->validated()
        );

        return redirect()->route('invitation-links.index')
                        ->with('success', 'Invitation link updated successfully.');
    }

    public function destroy(InvitationLink $invitationLink)
    {
        $this->invitationLinkService->deleteInvitationLink($invitationLink);

        return redirect()->route('invitation-links.index')
                        ->with('success', 'Invitation link deleted successfully.');
    }
}
