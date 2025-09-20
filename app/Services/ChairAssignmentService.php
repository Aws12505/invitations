<?php

namespace App\Services;

use App\Models\Attendant;
use App\Models\InvitationLink;
use Illuminate\Database\Eloquent\Collection;

class ChairAssignmentService
{
    // Chair configuration
    const TOTAL_CHAIRS = 360;
    const VIP_CHAIRS_START = 1;
    const VIP_CHAIRS_END = 50;
    const REGULAR_CHAIRS_START = 51;
    const REGULAR_CHAIRS_END = 360;

    /**
     * Auto-assign chair to attendant based on their VIP status and invitation
     */
    public function autoAssignChair(Attendant $attendant)
    {
        if ($attendant->chair_number) {
            return $attendant->chair_number; // Already has a chair
        }

        // Fix: Convert enum to string
        $vipStatus = $attendant->vip_status->value;
        
        if ($vipStatus === 'vip' || $vipStatus === 'premium') {
            return $this->assignVipChair($attendant);
        } else {
            return $this->assignRegularChair($attendant);
        }
    }

    /**
     * Assign chair to VIP attendant (try to group with same invitation)
     */
    private function assignVipChair(Attendant $attendant)
    {
        // First, try to find chairs next to people from the same invitation
        $invitationAttendants = Attendant::where('invitation_link_id', $attendant->invitation_link_id)
            ->whereNotNull('chair_number')
            ->whereBetween('chair_number', [self::VIP_CHAIRS_START, self::VIP_CHAIRS_END])
            ->orderBy('chair_number')
            ->get();

        if ($invitationAttendants->isNotEmpty()) {
            // Try to find an adjacent chair
            foreach ($invitationAttendants as $inviteeMate) {
                $adjacentChairs = [
                    $inviteeMate->chair_number - 1,
                    $inviteeMate->chair_number + 1
                ];

                foreach ($adjacentChairs as $chairNumber) {
                    if ($this->isChairAvailable($chairNumber, self::VIP_CHAIRS_START, self::VIP_CHAIRS_END)) {
                        return $this->assignChairToAttendant($attendant, $chairNumber);
                    }
                }
            }
        }

        // If no adjacent chairs available, assign next available VIP chair
        return $this->getNextAvailableChair(self::VIP_CHAIRS_START, self::VIP_CHAIRS_END, $attendant);
    }

    /**
     * Assign chair to regular attendant
     */
    private function assignRegularChair(Attendant $attendant)
    {
        return $this->getNextAvailableChair(self::REGULAR_CHAIRS_START, self::REGULAR_CHAIRS_END, $attendant);
    }

    /**
     * Get next available chair in range
     */
    private function getNextAvailableChair(int $start, int $end, Attendant $attendant): ?int
    {
        for ($chairNumber = $start; $chairNumber <= $end; $chairNumber++) {
            if ($this->isChairAvailable($chairNumber, $start, $end)) {
                return $this->assignChairToAttendant($attendant, $chairNumber);
            }
        }

        return null; // No chairs available
    }

    /**
     * Check if chair is available
     */
    private function isChairAvailable(int $chairNumber, int $start, int $end)
    {
        if ($chairNumber < $start || $chairNumber > $end) {
            return false;
        }

        return !Attendant::where('chair_number', $chairNumber)->exists();
    }

    /**
     * Assign specific chair to attendant
     */
    private function assignChairToAttendant(Attendant $attendant, int $chairNumber): int
    {
        $attendant->update(['chair_number' => $chairNumber]);
        return $chairNumber;
    }

    /**
     * Switch chairs between two attendants
     */
    public function switchChairs(Attendant $attendant1, Attendant $attendant2)
    {
        $chair1 = $attendant1->chair_number;
        $chair2 = $attendant2->chair_number;

        // Temporarily set to null to avoid unique constraint issues
        $attendant1->update(['chair_number' => null]);
        $attendant2->update(['chair_number' => $chair1]);
        $attendant1->update(['chair_number' => $chair2]);

        return true;
    }

    /**
     * Assign specific chair to attendant (for manual assignment)
     */
    public function assignSpecificChair(Attendant $attendant, int $chairNumber)
    {
        if (!$this->isValidChairNumber($chairNumber)) {
            throw new \InvalidArgumentException('Invalid chair number');
        }

        // Check if chair is already occupied by someone else
        $existingAttendant = Attendant::where('chair_number', $chairNumber)
            ->where('id', '!=', $attendant->id)
            ->first();
            
        if ($existingAttendant) {
            throw new \InvalidArgumentException('Chair is already occupied');
        }

        // Validate VIP/Regular chair assignment rules
        if (!$this->canAttendantSitInChair($attendant, $chairNumber)) {
            throw new \InvalidArgumentException('Attendant cannot sit in this chair section');
        }

        $attendant->update(['chair_number' => $chairNumber]);
        return true;
    }

    /**
     * Remove chair assignment
     */
    public function removeChairAssignment(Attendant $attendant)
    {
        $attendant->update(['chair_number' => null]);
        return true;
    }

    /**
     * Get available chairs for a specific attendant type
     */
    public function getAvailableChairs(string $vipStatus)
    {
        if ($vipStatus === 'vip' || $vipStatus === 'premium') {
            $start = self::VIP_CHAIRS_START;
            $end = self::VIP_CHAIRS_END;
        } else {
            $start = self::REGULAR_CHAIRS_START;
            $end = self::REGULAR_CHAIRS_END;
        }

        $occupiedChairs = Attendant::whereBetween('chair_number', [$start, $end])
            ->whereNotNull('chair_number')
            ->pluck('chair_number')
            ->toArray();

        $availableChairs = collect();
        for ($i = $start; $i <= $end; $i++) {
            if (!in_array($i, $occupiedChairs)) {
                $availableChairs->push($i);
            }
        }

        return $availableChairs;
    }

    /**
     * Get chair statistics
     */
    public function getChairStatistics()
    {
        $vipOccupied = Attendant::whereBetween('chair_number', [self::VIP_CHAIRS_START, self::VIP_CHAIRS_END])
            ->whereNotNull('chair_number')
            ->count();

        $regularOccupied = Attendant::whereBetween('chair_number', [self::REGULAR_CHAIRS_START, self::REGULAR_CHAIRS_END])
            ->whereNotNull('chair_number')
            ->count();

        $totalOccupied = Attendant::whereNotNull('chair_number')->count();

        return [
            'total_chairs' => self::TOTAL_CHAIRS,
            'total_occupied' => $totalOccupied,
            'total_available' => self::TOTAL_CHAIRS - $totalOccupied,
            'vip_total' => self::VIP_CHAIRS_END - self::VIP_CHAIRS_START + 1,
            'vip_occupied' => $vipOccupied,
            'vip_available' => (self::VIP_CHAIRS_END - self::VIP_CHAIRS_START + 1) - $vipOccupied,
            'regular_total' => self::REGULAR_CHAIRS_END - self::REGULAR_CHAIRS_START + 1,
            'regular_occupied' => $regularOccupied,
            'regular_available' => (self::REGULAR_CHAIRS_END - self::REGULAR_CHAIRS_START + 1) - $regularOccupied,
        ];
    }

    /**
     * Check if attendant can sit in specific chair
     */
    private function canAttendantSitInChair(Attendant $attendant, int $chairNumber)
    {
        $isVipChair = $chairNumber >= self::VIP_CHAIRS_START && $chairNumber <= self::VIP_CHAIRS_END;
        $isRegularChair = $chairNumber >= self::REGULAR_CHAIRS_START && $chairNumber <= self::REGULAR_CHAIRS_END;

        // Fix: Convert enum to string value for comparison
        $vipStatus = $attendant->vip_status->value;

        if ($vipStatus === 'vip' || $vipStatus === 'premium') {
            return $isVipChair; // VIPs can only sit in VIP section
        } else {
            return $isRegularChair; // Regular attendants can only sit in regular section
        }
    }

    /**
     * Validate chair number
     */
    private function isValidChairNumber(int $chairNumber)
    {
        return $chairNumber >= 1 && $chairNumber <= self::TOTAL_CHAIRS;
    }

    /**
     * Get free chairs that could be assigned due to unused invitation spots
     */
    public function getFreeChairoInVipSection(): Collection
    {
        // Get all invitation links and their expected vs actual usage
        $invitationLinks = InvitationLink::with('attendants')->get();
        
        $expectedVipChairs = 0;
        $actualVipAttendants = 0;

        foreach ($invitationLinks as $link) {
            // Fix: Convert enum to string for comparison
            $defaultVipStatus = $link->default_vip_status->value;
            
            if ($defaultVipStatus === 'vip' || $defaultVipStatus === 'premium') {
                $expectedVipChairs += $link->limit;
                $actualVipAttendants += $link->attendants->filter(function($attendant) {
                    $status = $attendant->vip_status->value;
                    return $status === 'vip' || $status === 'premium';
                })->count();
            }
        }

        $unusedVipSlots = $expectedVipChairs - $actualVipAttendants;
        
        return $this->getAvailableChairs('vip')->take($unusedVipSlots);
    }
}
