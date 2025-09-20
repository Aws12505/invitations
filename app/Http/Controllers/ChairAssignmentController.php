<?php

namespace App\Http\Controllers;

use App\Models\Attendant;
use App\Services\ChairAssignmentService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChairAssignmentController extends Controller
{
    public function __construct(
        private ChairAssignmentService $chairService
    ) {}

    /**
     * Show chair assignment management page
     */
    public function index()
    {
        $attendants = Attendant::with('invitationLink')
            ->orderBy('chair_number')
            ->get();

        $statistics = $this->chairService->getChairStatistics();

        // Pre-load available chairs for better UX
        $availableVipChairs = $this->chairService->getAvailableChairs('vip')->values()->toArray();
        $availableRegularChairs = $this->chairService->getAvailableChairs('regular')->values()->toArray();

        return Inertia::render('ChairAssignment/Index', [
            'attendants' => $attendants,
            'statistics' => $statistics,
            'availableChairs' => [
                'vip' => $availableVipChairs,
                'regular' => $availableRegularChairs,
            ]
        ]);
    }

    /**
     * Show chair selection modal for specific attendant
     */
    public function showAssignModal(Attendant $attendant)
    {
        $vipStatusString = $attendant->vip_status->value;
        $availableChairs = $this->chairService->getAvailableChairs($vipStatusString);

        // Include current chair if attendant has one (for chair changes)
        $allChairs = $availableChairs->values()->toArray();
        if ($attendant->chair_number && !in_array($attendant->chair_number, $allChairs)) {
            $allChairs[] = $attendant->chair_number;
            sort($allChairs);
        }

        return Inertia::render('ChairAssignment/AssignModal', [
            'attendant' => $attendant->load('invitationLink'),
            'availableChairs' => $allChairs,
            'attendantSection' => ($vipStatusString === 'vip' || $vipStatusString === 'premium') 
                ? 'VIP (Chairs 1-50)' 
                : 'Regular (Chairs 51-360)',
            'modalType' => $attendant->chair_number ? 'change' : 'assign'
        ]);
    }

    /**
     * Show switch chairs modal
     */
    public function showSwitchModal(Attendant $attendant1)
    {
        if (!$attendant1->chair_number) {
            return back()->withErrors(['chair' => 'This attendant does not have a chair to switch']);
        }

        $otherAttendants = Attendant::with('invitationLink')
            ->where('id', '!=', $attendant1->id)
            ->whereNotNull('chair_number')
            ->orderBy('chair_number')
            ->get();

        return Inertia::render('ChairAssignment/SwitchModal', [
            'attendant1' => $attendant1->load('invitationLink'),
            'otherAttendants' => $otherAttendants
        ]);
    }

    /**
     * Assign specific chair to attendant
     */
    public function assignChair(Request $request, Attendant $attendant)
    {
        $request->validate([
            'chair_number' => 'required|integer|min:1|max:360',
        ]);

        try {
            $this->chairService->assignSpecificChair($attendant, $request->chair_number);
            
            return redirect()->route('attendants.index')
                ->with('success', "Chair #{$request->chair_number} assigned to {$attendant->full_name} successfully");
        } catch (\InvalidArgumentException $e) {
            return back()->withErrors(['chair_number' => $e->getMessage()]);
        }
    }

    /**
     * Switch chairs between two attendants
     */
    public function switchChairs(Request $request)
    {
        $request->validate([
            'attendant1_id' => 'required|exists:attendants,id',
            'attendant2_id' => 'required|exists:attendants,id|different:attendant1_id',
        ]);

        $attendant1 = Attendant::findOrFail($request->attendant1_id);
        $attendant2 = Attendant::findOrFail($request->attendant2_id);

        $chair1 = $attendant1->chair_number;
        $chair2 = $attendant2->chair_number;

        $this->chairService->switchChairs($attendant1, $attendant2);

        return redirect()->route('attendants.index')
            ->with('success', "Chairs switched: {$attendant1->full_name} (#{$chair2}) ↔ {$attendant2->full_name} (#{$chair1})");
    }

    /**
     * Remove chair assignment
     */
    public function removeChair(Attendant $attendant)
    {
        $chairNumber = $attendant->chair_number;
        $this->chairService->removeChairAssignment($attendant);

        return back()->with('success', "Chair #{$chairNumber} removed from {$attendant->full_name}");
    }

    /**
     * Auto-assign chair to attendant
     */
    public function autoAssign(Attendant $attendant)
    {
        $chairNumber = $this->chairService->autoAssignChair($attendant);

        if ($chairNumber) {
            return back()->with('success', "Chair #{$chairNumber} auto-assigned to {$attendant->full_name}");
        } else {
            return back()->withErrors(['chair' => 'No available chairs for this attendant type']);
        }
    }
}
