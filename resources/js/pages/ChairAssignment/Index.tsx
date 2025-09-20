import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Attendant, ChairStatistics } from '@/types/invitation';
import { Head, router, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription as AlertDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
    Users, 
    Armchair, 
    UserCheck, 
    Search, 
    ArrowLeftRight,
    Plus,
    Trash2,
    RotateCcw,
    Crown,
    User
} from 'lucide-react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [

    {
        title: 'Chair Assignment',
        href: '#',
    },
];

interface Props {
    attendants: Attendant[];
    statistics: ChairStatistics;
}

export default function ChairAssignmentIndex({ attendants, statistics }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sectionFilter, setSectionFilter] = useState<string>('all');
    const [assignedFilter, setAssignedFilter] = useState<string>('all');
    
    const [assignChairModal, setAssignChairModal] = useState<{
        open: boolean;
        attendant: Attendant | null;
        chairNumber: string;
        availableChairs: number[];
    }>({
        open: false,
        attendant: null,
        chairNumber: '',
        availableChairs: [],
    });

    const [switchChairsModal, setSwitchChairsModal] = useState<{
        open: boolean;
        attendant1: Attendant | null;
        attendant2Id: string;
    }>({
        open: false,
        attendant1: null,
        attendant2Id: '',
    });

    const [removeChairModal, setRemoveChairModal] = useState<{
        open: boolean;
        attendant: Attendant | null;
    }>({
        open: false,
        attendant: null,
    });

    // Filter attendants
    const filteredAttendants = attendants.filter(attendant => {
        const matchesSearch = 
            attendant.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            attendant.phone_number.includes(searchTerm) ||
            (attendant.chair_number?.toString() || '').includes(searchTerm);

        const matchesSection = sectionFilter === 'all' || 
            (sectionFilter === 'vip' && (attendant.vip_status === 'vip' || attendant.vip_status === 'premium')) ||
            (sectionFilter === 'regular' && attendant.vip_status === 'regular');

        const matchesAssigned = assignedFilter === 'all' ||
            (assignedFilter === 'assigned' && attendant.chair_number) ||
            (assignedFilter === 'unassigned' && !attendant.chair_number);

        return matchesSearch && matchesSection && matchesAssigned;
    });

    const openAssignChairModal = async (attendant: Attendant) => {
        try {
            const response = await fetch(`/chair-assignment/available/${attendant.id}`);
            const data = await response.json();
            
            setAssignChairModal({
                open: true,
                attendant,
                chairNumber: '',
                availableChairs: data.available_chairs,
            });
        } catch (error) {
            toast.error('Failed to load available chairs');
        }
    };

    const handleAssignChair = () => {
        if (!assignChairModal.attendant || !assignChairModal.chairNumber) {
            toast.error('Please select a chair number');
            return;
        }

        router.patch(`/chair-assignment/${assignChairModal.attendant.id}/assign`, {
            chair_number: parseInt(assignChairModal.chairNumber),
        }, {
            onSuccess: () => {
                toast.success('Chair assigned successfully');
                setAssignChairModal({ open: false, attendant: null, chairNumber: '', availableChairs: [] });
            },
            onError: (errors) => {
                toast.error(errors.chair_number || 'Failed to assign chair');
            },
        });
    };

    const handleSwitchChairs = () => {
        if (!switchChairsModal.attendant1 || !switchChairsModal.attendant2Id) {
            toast.error('Please select both attendants');
            return;
        }

        router.post('/chair-assignment/switch', {
            attendant1_id: switchChairsModal.attendant1.id,
            attendant2_id: parseInt(switchChairsModal.attendant2Id),
        }, {
            onSuccess: () => {
                toast.success('Chairs switched successfully');
                setSwitchChairsModal({ open: false, attendant1: null, attendant2Id: '' });
            },
            onError: () => {
                toast.error('Failed to switch chairs');
            },
        });
    };

    const handleRemoveChair = () => {
        if (!removeChairModal.attendant) return;

        router.delete(`/chair-assignment/${removeChairModal.attendant.id}/remove`, {
            onSuccess: () => {
                toast.success('Chair assignment removed');
                setRemoveChairModal({ open: false, attendant: null });
            },
            onError: () => {
                toast.error('Failed to remove chair assignment');
            },
        });
    };

    const handleAutoAssign = (attendant: Attendant) => {
        router.post(`/chair-assignment/${attendant.id}/auto-assign`, {}, {
            onSuccess: () => {
                toast.success('Chair auto-assigned successfully');
            },
            onError: (errors) => {
                toast.error(errors.chair || 'Failed to auto-assign chair');
            },
        });
    };

    const getChairBadge = (chairNumber: number | null, vipStatus: string) => {
        if (!chairNumber) {
            return <Badge variant="outline">No Chair</Badge>;
        }

        const isVipSection = chairNumber <= 50;
        const isVipPerson = vipStatus === 'vip' || vipStatus === 'premium';

        return (
            <Badge 
                variant={isVipSection ? 'default' : 'secondary'}
                className={isVipSection ? 'bg-purple-100 text-purple-800 border-purple-200' : ''}
            >
                {isVipSection ? <Crown className="h-3 w-3 mr-1" /> : <User className="h-3 w-3 mr-1" />}
                Chair {chairNumber}
            </Badge>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chair Assignment" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Chair Assignment</h1>
                        <p className="text-muted-foreground">
                            Manage seating arrangements for all attendants
                        </p>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Chairs</CardTitle>
                            <Armchair className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.total_chairs}</div>
                            <p className="text-xs text-muted-foreground">
                                {statistics.total_occupied} occupied, {statistics.total_available} available
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">VIP Section</CardTitle>
                            <Crown className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">
                                {statistics.vip_occupied}/{statistics.vip_total}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {Math.round((statistics.vip_occupied / statistics.vip_total) * 100)}% occupied
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Regular Section</CardTitle>
                            <User className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">
                                {statistics.regular_occupied}/{statistics.regular_total}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {Math.round((statistics.regular_occupied / statistics.regular_total) * 100)}% occupied
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Unassigned</CardTitle>
                            <Users className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">
                                {attendants.filter(a => !a.chair_number).length}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Attendants without chairs
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5" />
                            Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Search</label>
                                <div className="relative">
                                    <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by name, phone, or chair..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Section</label>
                                <Select value={sectionFilter} onValueChange={setSectionFilter}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Sections</SelectItem>
                                        <SelectItem value="vip">VIP Section (1-50)</SelectItem>
                                        <SelectItem value="regular">Regular Section (51-360)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Chair Status</label>
                                <Select value={assignedFilter} onValueChange={setAssignedFilter}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="assigned">Assigned</SelectItem>
                                        <SelectItem value="unassigned">Unassigned</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-muted-foreground">
                            Showing {filteredAttendants.length} of {attendants.length} attendants
                        </div>
                    </CardContent>
                </Card>

                {/* Attendants Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Chair Assignments</CardTitle>
                        <CardDescription>
                            Manage chair assignments for all attendants
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>VIP Status</TableHead>
                                        <TableHead>Chair Assignment</TableHead>
                                        <TableHead>Invited By</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredAttendants.length > 0 ? (
                                        filteredAttendants.map((attendant) => (
                                            <TableRow key={attendant.id}>
                                                <TableCell className="font-medium">
                                                    <div>
                                                        <p className="font-medium">{attendant.full_name}</p>
                                                        <p className="text-sm text-muted-foreground">ID: {attendant.id}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={
                                                        attendant.vip_status === 'vip' || attendant.vip_status === 'premium' 
                                                            ? 'default' : 'secondary'
                                                    }>
                                                        {attendant.vip_status.toUpperCase()}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {getChairBadge(attendant.chair_number, attendant.vip_status)}
                                                </TableCell>
                                                <TableCell>
                                                    {attendant.invitation_link?.full_name || 'Unknown'}
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {attendant.phone_number}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
    {!attendant.chair_number ? (
        <>
            <Button
                variant="outline"
                size="sm"
                onClick={() => handleAutoAssign(attendant)}
                title="Auto assign chair"
            >
                <RotateCcw className="h-3 w-3" />
            </Button>
            <Button
                variant="outline"
                size="sm"
                asChild
                title="Manually assign chair"
            >
                <Link href={`/chair-assignment/${attendant.id}/assign`}>
                    <Plus className="h-3 w-3" />
                </Link>
            </Button>
        </>
    ) : (
        <>
            <Button
                variant="outline"
                size="sm"
                asChild
                title="Change chair"
            >
                <Link href={`/chair-assignment/${attendant.id}/assign`}>
                    <Plus className="h-3 w-3" />
                </Link>
            </Button>
            <Button
                variant="outline"
                size="sm"
                asChild
                title="Switch chairs"
            >
                <Link href={`/chair-assignment/${attendant.id}/switch`}>
                    <ArrowLeftRight className="h-3 w-3" />
                </Link>
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setRemoveChairModal({ open: true, attendant })}
                title="Remove chair"
                className="text-red-600 hover:text-red-700"
            >
                <Trash2 className="h-3 w-3" />
            </Button>
        </>
    )}
</div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8">
                                                <div className="text-muted-foreground">
                                                    <Armchair className="h-8 w-8 mx-auto mb-2" />
                                                    <p>No attendants found</p>
                                                    <p className="text-sm">
                                                        {searchTerm || sectionFilter !== 'all' || assignedFilter !== 'all'
                                                            ? 'Try adjusting your filters'
                                                            : 'No attendants registered yet'
                                                        }
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Assign Chair Modal */}
            <Dialog open={assignChairModal.open} onOpenChange={(open) => 
                setAssignChairModal({ ...assignChairModal, open })
            }>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {assignChairModal.attendant?.chair_number ? 'Change Chair' : 'Assign Chair'}
                        </DialogTitle>
                        <DialogDescription>
                            {assignChairModal.attendant && (
                                <>
                                    Assigning chair for: <strong>{assignChairModal.attendant.full_name}</strong>
                                    <br />
                                    VIP Status: <strong>{assignChairModal.attendant.vip_status.toUpperCase()}</strong>
                                    {assignChairModal.attendant.chair_number && (
                                        <>
                                            <br />
                                            Current Chair: <strong>#{assignChairModal.attendant.chair_number}</strong>
                                        </>
                                    )}
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Chair Number</label>
                            <Select 
                                value={assignChairModal.chairNumber} 
                                onValueChange={(value) => setAssignChairModal({ ...assignChairModal, chairNumber: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a chair" />
                                </SelectTrigger>
                                <SelectContent>
                                    {assignChairModal.availableChairs.map((chairNumber) => (
                                        <SelectItem key={chairNumber} value={chairNumber.toString()}>
                                            Chair {chairNumber} ({chairNumber <= 50 ? 'VIP' : 'Regular'} Section)
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Available chairs: {assignChairModal.availableChairs.length}
                        </p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAssignChairModal({ ...assignChairModal, open: false })}>
                            Cancel
                        </Button>
                        <Button onClick={handleAssignChair}>
                            {assignChairModal.attendant?.chair_number ? 'Change Chair' : 'Assign Chair'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Switch Chairs Modal */}
            <Dialog open={switchChairsModal.open} onOpenChange={(open) => 
                setSwitchChairsModal({ ...switchChairsModal, open })
            }>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Switch Chairs</DialogTitle>
                        <DialogDescription>
                            {switchChairsModal.attendant1 && (
                                <>
                                    Switching chair for: <strong>{switchChairsModal.attendant1.full_name}</strong> 
                                    (Currently: Chair #{switchChairsModal.attendant1.chair_number})
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Switch with</label>
                            <Select 
                                value={switchChairsModal.attendant2Id} 
                                onValueChange={(value) => setSwitchChairsModal({ ...switchChairsModal, attendant2Id: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select attendant to switch with" />
                                </SelectTrigger>
                                <SelectContent>
                                    {attendants
                                        .filter(a => a.id !== switchChairsModal.attendant1?.id && a.chair_number)
                                        .map((attendant) => (
                                            <SelectItem key={attendant.id} value={attendant.id.toString()}>
                                                {attendant.full_name} - Chair #{attendant.chair_number}
                                            </SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSwitchChairsModal({ ...switchChairsModal, open: false })}>
                            Cancel
                        </Button>
                        <Button onClick={handleSwitchChairs}>
                            Switch Chairs
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Remove Chair Modal */}
            <AlertDialog open={removeChairModal.open} onOpenChange={(open) => 
                setRemoveChairModal({ ...removeChairModal, open })
            }>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove Chair Assignment?</AlertDialogTitle>
                        <AlertDescription>
                            This will remove the chair assignment for{' '}
                            <strong>{removeChairModal.attendant?.full_name}</strong>
                            {removeChairModal.attendant?.chair_number && (
                                <> (Chair #{removeChairModal.attendant.chair_number})</>
                            )}. 
                            The chair will become available for other attendants.
                        </AlertDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setRemoveChairModal({ open: false, attendant: null })}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleRemoveChair}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Remove Chair
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
