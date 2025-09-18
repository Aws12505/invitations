import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Attendant } from '@/types/invitation';
import { Head, Link, router } from '@inertiajs/react';
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

interface Props {
    attendants: AttendantsData;
    statistics: Statistics;
}

export default function AttendantsIndex({ attendants, statistics }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [vipFilter, setVipFilter] = useState<string>('all');
    const [attendedFilter, setAttendedFilter] = useState<string>('all');
    
    const [deleteModal, setDeleteModal] = useState<{
        open: boolean;
        attendantId: number | null;
        attendantName: string;
    }>({
        open: false,
        attendantId: null,
        attendantName: '',
    });

    // Apply filters to the current page data
    const filteredAttendants = attendants.data.filter(attendant => {
        const matchesSearch = 
            attendant.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            attendant.phone_number.includes(searchTerm) ||
            (attendant.invitation_link?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || attendant.attendance_status === statusFilter;
        const matchesVip = vipFilter === 'all' || attendant.vip_status === vipFilter;
        const matchesAttended = attendedFilter === 'all' || 
            (attendedFilter === 'attended' && attendant.attended) ||
            (attendedFilter === 'not_attended' && !attendant.attended);

        return matchesSearch && matchesStatus && matchesVip && matchesAttended;
    });

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
        // Basic CSV export functionality for filtered data
        const csvContent = [
            ['Name', 'Phone', 'VIP Status','Chair Assignments', 'Attendance Status', 'Attended', 'Invited By'].join(','),
            ...filteredAttendants.map(attendant => [
                attendant.full_name,
                attendant.phone_number,
                attendant.vip_status,
                attendant.chair_number || 'No Chair Assigned',
                attendant.attendance_status || 'No Response',
                attendant.attended ? 'Yes' : 'No',
                attendant.invitation_link?.full_name || ''
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'attendants.csv';
        a.click();
        window.URL.revokeObjectURL(url);
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
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-4">
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
                        </div>
                        <div className="mt-4 text-sm text-muted-foreground">
                            Showing {filteredAttendants.length} of {attendants.pagination.total} attendants (filtered from current page)
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
                                    {filteredAttendants.length > 0 ? (
                                        filteredAttendants.map((attendant) => (
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
                                            <TableCell colSpan={8} className="text-center py-8">
                                                <div className="text-muted-foreground">
                                                    <Users className="h-8 w-8 mx-auto mb-2" />
                                                    <p>No attendants found</p>
                                                    <p className="text-sm">
                                                        {searchTerm || statusFilter !== 'all' || vipFilter !== 'all' || attendedFilter !== 'all'
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
