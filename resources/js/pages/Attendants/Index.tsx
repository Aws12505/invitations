import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Attendant, InvitationLink } from '@/types/invitation';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import QrCodeDisplay from '@/components/QrCodeDisplay';
import ChairDisplay from '@/components/ChairDisplay';
import { 
    Plus, 
    Eye, 
    Edit, 
    Trash2, 
    Phone, 
    Search, 
    Filter,
    Users,
    UserCheck,
    UserX,
    Copy,
    ExternalLink,
    Download,
    ShieldQuestion as UserQuestion,
    Crown,
    Armchair,
    User
} from 'lucide-react';
import { toast } from 'sonner';
import AttendantPagination from '@/components/AttendantPagination';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Attendants',
        href: '#',
    },
];

interface PaginationData {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    to: number;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface AttendantsData {
    data: Attendant[];
    pagination: PaginationData;
}

interface Statistics {
    total: number;
    coming: number;
    maybe: number;
    not_coming: number;
    no_response: number;
    attended: number;
    vip: number;
}

interface Filters {
    search?: string;
    attendance_status?: string;
    vip_status?: string;
    attended?: string;
    invitation_link_id?: number;
}

interface Props {
    attendants: AttendantsData;
    statistics: Statistics;
    filters: Filters;
    invitationLinks: InvitationLink[];
}

export default function AttendantsIndex({ attendants, statistics, filters, invitationLinks }: Props) {
    // Initialize state with current filters from server
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.attendance_status || 'all');
    const [vipFilter, setVipFilter] = useState(filters.vip_status || 'all');
    const [attendedFilter, setAttendedFilter] = useState(filters.attended || 'all');
    const [invitationLinkFilter, setInvitationLinkFilter] = useState(filters.invitation_link_id?.toString() || 'all');
    
    const [deleteModal, setDeleteModal] = useState<{
        open: boolean;
        attendantId: number | null;
        attendantName: string;
    }>({
        open: false,
        attendantId: null,
        attendantName: '',
    });

    // Debounce search to avoid too many requests
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            handleFilterChange();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    // Handle filter changes immediately for dropdowns
    useEffect(() => {
        handleFilterChange();
    }, [statusFilter, vipFilter, attendedFilter, invitationLinkFilter]);

    const handleFilterChange = () => {
        const params = new URLSearchParams(window.location.search);
        
        // Update search params
        if (searchTerm && searchTerm.trim()) {
            params.set('search', searchTerm);
        } else {
            params.delete('search');
        }
        
        if (statusFilter !== 'all') {
            params.set('attendance_status', statusFilter);
        } else {
            params.delete('attendance_status');
        }
        
        if (vipFilter !== 'all') {
            params.set('vip_status', vipFilter);
        } else {
            params.delete('vip_status');
        }
        
        if (attendedFilter !== 'all') {
            params.set('attended', attendedFilter);
        } else {
            params.delete('attended');
        }

        if (invitationLinkFilter !== 'all') {
            params.set('invitation_link_id', invitationLinkFilter);
        } else {
            params.delete('invitation_link_id');
        }
        
        // Reset to page 1 when filters change
        params.delete('page');
        
        // Navigate with new filters
        router.get('/attendants', Object.fromEntries(params), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const copyStatusUrl = (statusToken: string) => {
        const url = `${window.location.origin}/status/${statusToken}`;
        navigator.clipboard.writeText(url).then(() => {
            toast.success('Status link copied to clipboard!');
        }).catch(() => {
            toast.error('Failed to copy status link');
        });
    };

    const openDeleteModal = (id: number, name: string) => {
        setDeleteModal({
            open: true,
            attendantId: id,
            attendantName: name,
        });
    };

    const closeDeleteModal = () => {
        setDeleteModal({
            open: false,
            attendantId: null,
            attendantName: '',
        });
    };

    const handleConfirmDelete = () => {
        if (deleteModal.attendantId) {
            router.delete(`/attendants/${deleteModal.attendantId}`, {
                onSuccess: () => {
                    toast.success('Attendant deleted successfully');
                    closeDeleteModal();
                },
                onError: () => {
                    toast.error('Failed to delete attendant');
                },
            });
        }
    };

    const toggleAttended = (id: number, currentStatus: boolean) => {
        router.patch(`/attendants/${id}/toggle-attended`, {}, {
            onSuccess: () => {
                const newStatus = !currentStatus;
                const message = newStatus 
                    ? 'Attendant marked as attended' 
                    : 'Attendant marked as not attended';
                toast.success(message);
            },
            onError: (errors) => {
                toast.error(errors.attended || 'Failed to update attendance status');
            },
        });
    };

    const getStatusBadge = (status: string | null) => {
        switch (status) {
            case 'coming':
                return <Badge className="bg-green-100 text-green-800 border-green-200">Coming</Badge>;
            case 'maybe':
                return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Maybe</Badge>;
            case 'not_coming':
                return <Badge className="bg-red-100 text-red-800 border-red-200">Not Coming</Badge>;
            default:
                return <Badge variant="outline">No Response</Badge>;
        }
    };

    const exportData = () => {
        // Export filtered data from server
        const params = new URLSearchParams(window.location.search);
        params.set('export', 'csv');
        window.location.href = `/attendants?${params.toString()}`;
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setVipFilter('all');
        setAttendedFilter('all');
        setInvitationLinkFilter('all');
        
        router.get('/attendants', {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Attendants" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Attendants</h1>
                        <p className="text-muted-foreground">
                            Manage event attendants and track their status
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={exportData}>
                            <Download className="h-4 w-4 mr-2" />
                            Export CSV
                        </Button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Attendants</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Coming</CardTitle>
                            <UserCheck className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{statistics.coming}</div>
                            <p className="text-xs text-muted-foreground">
                                {statistics.total > 0 ? Math.round((statistics.coming / statistics.total) * 100) : 0}% of total
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Maybe/No Response</CardTitle>
                            <UserQuestion className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{statistics.maybe + statistics.no_response}</div>
                            <p className="text-xs text-muted-foreground">
                                {statistics.maybe} maybe, {statistics.no_response} no response
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Actually Attended</CardTitle>
                            <UserCheck className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{statistics.attended}</div>
                            <p className="text-xs text-muted-foreground">
                                {statistics.total > 0 ? Math.round((statistics.attended / statistics.total) * 100) : 0}% attendance rate
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="h-5 w-5" />
                                Filters
                            </CardTitle>
                            <Button variant="outline" size="sm" onClick={clearFilters}>
                                Clear All
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Search</label>
                                <div className="relative">
                                    <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by name, phone, or inviter..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Attendance Status</label>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="coming">Coming</SelectItem>
                                        <SelectItem value="maybe">Maybe</SelectItem>
                                        <SelectItem value="not_coming">Not Coming</SelectItem>
                                        <SelectItem value="no_response">No Response</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">VIP Status</label>
                                <Select value={vipFilter} onValueChange={setVipFilter}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All VIP</SelectItem>
                                        <SelectItem value="regular">Regular</SelectItem>
                                        <SelectItem value="vip">VIP</SelectItem>
                                        <SelectItem value="premium">Premium</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Actually Attended</label>
                                <Select value={attendedFilter} onValueChange={setAttendedFilter}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="attended">Attended</SelectItem>
                                        <SelectItem value="not_attended">Not Attended</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Invited By</label>
                                <Select value={invitationLinkFilter} onValueChange={setInvitationLinkFilter}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Inviters</SelectItem>
                                        {invitationLinks.map((link) => (
                                            <SelectItem key={link.id} value={link.id.toString()}>
                                                {link.full_name} ({link.usage} attendants)
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-muted-foreground">
                            Showing {attendants.pagination.from || 0} to {attendants.pagination.to || 0} of {attendants.pagination.total} attendants
                            {Object.keys(filters).length > 0 && ' (filtered)'}
                        </div>
                    </CardContent>
                </Card>

                {/* Attendants Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Attendants List</CardTitle>
                        <CardDescription>
                            Complete list of event attendants with their status and details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Invited By</TableHead>
                                        <TableHead>VIP Status</TableHead>
                                        <TableHead>Chair</TableHead>
                                        <TableHead>Response</TableHead>
                                        <TableHead>Attended</TableHead>
                                        <TableHead>Registered</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                        <TableHead className="text-center">QR Code</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {attendants.data.length > 0 ? (
                                        attendants.data.map((attendant) => (
                                            <TableRow key={attendant.id}>
                                                <TableCell className="font-medium">
                                                    <div>
                                                        <p className="font-medium">{attendant.full_name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            ID: {attendant.id}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                                        <a 
                                                            href={`tel:${attendant.phone_number}`}
                                                            className="text-blue-600 hover:underline"
                                                        >
                                                            {attendant.phone_number}
                                                        </a>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {attendant.invitation_link?.full_name || 'Unknown'}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge 
                                                        variant={attendant.vip_status === 'vip' ? 'default' : 'secondary'}
                                                    >
                                                        {attendant.vip_status.toUpperCase()}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <ChairDisplay 
                                                        chairNumber={attendant.chair_number} 
                                                        size="sm" 
                                                        showSection={true} 
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(attendant.attendance_status)}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant={attendant.attended ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => toggleAttended(attendant.id, attendant.attended)}
                                                        className="min-w-[80px]"
                                                    >
                                                        {attendant.attended ? (
                                                            <><UserCheck className="h-3 w-3 mr-1" /> Yes</>
                                                        ) : (
                                                            <><UserX className="h-3 w-3 mr-1" /> No</>
                                                        )}
                                                    </Button>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        <p>{new Date(attendant.created_at).toLocaleDateString()}</p>
                                                        <p className="text-muted-foreground">
                                                            {new Date(attendant.created_at).toLocaleTimeString()}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => copyStatusUrl(attendant.status_token)}
                                                            title="Copy status link"
                                                        >
                                                            <Copy className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            asChild
                                                            title="Open status page"
                                                        >
                                                            <a 
                                                                href={`/status/${attendant.status_token}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <ExternalLink className="h-3 w-3" />
                                                            </a>
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            asChild
                                                            title="View details"
                                                        >
                                                            <Link href={`/attendants/${attendant.id}`}>
                                                                <Eye className="h-3 w-3" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            asChild
                                                            title="Edit attendant"
                                                        >
                                                            <Link href={`/attendants/${attendant.id}/edit`}>
                                                                <Edit className="h-3 w-3" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => openDeleteModal(attendant.id, attendant.full_name)}
                                                            title="Delete attendant"
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <QrCodeDisplay attendant={attendant} size="sm" />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={10} className="text-center py-8">
                                                <div className="text-muted-foreground">
                                                    <Users className="h-8 w-8 mx-auto mb-2" />
                                                    <p>No attendants found</p>
                                                    <p className="text-sm">
                                                        {Object.keys(filters).length > 0
                                                            ? 'Try adjusting your filters'
                                                            : 'No attendants have registered yet'
                                                        }
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        
                        {/* Pagination */}
                        <AttendantPagination data={attendants.pagination} />
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Modal */}
            <AlertDialog open={deleteModal.open} onOpenChange={closeDeleteModal}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete this attendant?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete <strong>{deleteModal.attendantName}</strong>'s registration. 
                            This action cannot be undone and will also decrease the invitation link's usage count.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={closeDeleteModal}>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleConfirmDelete}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                        >
                            Delete Attendant
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
