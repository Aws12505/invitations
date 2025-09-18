import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { InvitationLink } from '@/types/invitation';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
import { Plus, Eye, Edit, Trash2, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import InvitationPagination from '@/components/InvitationPagination';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Invitation Links',
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

interface InvitationLinksData {
    data: InvitationLink[];
    pagination: PaginationData;
}

interface Statistics {
    total: number;
    active: number;
    totalAttendants: number;
    avgUsage: number;
}

interface Props {
    invitationLinks: InvitationLinksData;
    statistics: Statistics;
}

export default function InvitationLinksIndex({ invitationLinks, statistics }: Props) {
    const [deleteModal, setDeleteModal] = useState<{
        open: boolean;
        linkId: number | null;
        linkName: string;
    }>({
        open: false,
        linkId: null,
        linkName: '',
    });

    const copyToClipboard = (token: string) => {
        const url = `${window.location.origin}/invitation/${token}`;
        navigator.clipboard.writeText(url).then(() => {
            toast.success('Invitation link copied to clipboard!');
        }).catch(() => {
            toast.error('Failed to copy link to clipboard');
        });
    };

    const openDeleteModal = (id: number, name: string) => {
        setDeleteModal({
            open: true,
            linkId: id,
            linkName: name,
        });
    };

    const closeDeleteModal = () => {
        setDeleteModal({
            open: false,
            linkId: null,
            linkName: '',
        });
    };

    const handleConfirmDelete = () => {
        if (deleteModal.linkId) {
            router.delete(`/invitation-links/${deleteModal.linkId}`, {
                onSuccess: () => {
                    toast.success('Invitation link deleted successfully');
                    closeDeleteModal();
                },
                onError: () => {
                    toast.error('Failed to delete invitation link');
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Invitation Links" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Invitation Links</h1>
                        <p className="text-muted-foreground">
                            Manage invitation links and track their usage
                        </p>
                    </div>
                    <Link href="/invitation-links/create">
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Link
                        </Button>
                    </Link>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Links</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Links</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.active}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Attendants</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.totalAttendants}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg Usage</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{statistics.avgUsage}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Table Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Invitation Links</CardTitle>
                        <CardDescription>
                            A list of all invitation links and their current usage
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Usage</TableHead>
                                    <TableHead>VIP Status</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invitationLinks.data.length > 0 ? (
                                    invitationLinks.data.map((link) => (
                                        <TableRow key={link.id}>
                                            <TableCell className="font-medium">
                                                {link.full_name}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span>{link.usage} / {link.limit}</span>
                                                    <div className="w-20 bg-secondary rounded-full h-2">
                                                        <div 
                                                            className="bg-primary h-2 rounded-full" 
                                                            style={{ width: `${Math.min((link.usage / link.limit) * 100, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={link.default_vip_status === 'vip' ? 'default' : 'secondary'}>
                                                    {link.default_vip_status.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={link.is_active ? 'default' : 'destructive'}>
                                                    {link.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(link.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => copyToClipboard(link.token)}
                                                        title="Copy invitation link"
                                                    >
                                                        <Copy className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                        title="Preview invitation"
                                                    >
                                                        <a 
                                                            href={`/invitation/${link.token}`}
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
                                                        <Link href={`/invitation-links/${link.id}`}>
                                                            <Eye className="h-3 w-3" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        asChild
                                                        title="Edit invitation"
                                                    >
                                                        <Link href={`/invitation-links/${link.id}/edit`}>
                                                            <Edit className="h-3 w-3" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openDeleteModal(link.id, link.full_name)}
                                                        title="Delete invitation"
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">
                                            <div className="text-muted-foreground">
                                                <Plus className="h-8 w-8 mx-auto mb-2" />
                                                <p>No invitation links found</p>
                                                <p className="text-sm">Create your first invitation link to get started</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        
                        {/* Pagination */}
                        <InvitationPagination data={invitationLinks.pagination} />
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Modal */}
            <AlertDialog open={deleteModal.open} onOpenChange={closeDeleteModal}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete this invitation?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the invitation link for <strong>{deleteModal.linkName}</strong> and 
                            all associated attendant registrations. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={closeDeleteModal}>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleConfirmDelete}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                        >
                            Delete Invitation
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
