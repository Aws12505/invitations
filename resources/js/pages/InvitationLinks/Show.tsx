import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { InvitationLink } from '@/types/invitation';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { 
    User, 
    Phone, 
    Calendar, 
    Clock, 
    ExternalLink, 
    Edit, 
    Copy,
    CheckCircle,
    XCircle,
    UserCheck,
    Users,
    TrendingUp,
    Activity,
    Globe,
    Link as LinkIcon,
    Mail,
    MessageCircle
} from 'lucide-react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Invitation Links',
        href: '/invitation-links',
    },
    {
        title: 'Details',
        href: '#',
    },
];

interface Props {
    invitationLink: InvitationLink;
}

export default function InvitationLinkShow({ invitationLink }: Props) {
    const copyInvitationUrl = () => {
        const url = `${window.location.origin}/invitation/${invitationLink.token}`;
        navigator.clipboard.writeText(url).then(() => {
            toast.success('Invitation link copied to clipboard!');
        });
    };

    const toggleActive = () => {
        router.patch(`/invitation-links/${invitationLink.id}`, {
            is_active: !invitationLink.is_active
        }, {
            onSuccess: () => toast.success(`Invitation link ${invitationLink.is_active ? 'deactivated' : 'activated'} successfully`),
        });
    };

    const getStatusStats = () => {
        if (!invitationLink.attendants) return { coming: 0, maybe: 0, not_coming: 0, no_response: 0, attended: 0 };
        
        return {
            coming: invitationLink.attendants.filter(a => a.attendance_status === 'coming').length,
            maybe: invitationLink.attendants.filter(a => a.attendance_status === 'maybe').length,
            not_coming: invitationLink.attendants.filter(a => a.attendance_status === 'not_coming').length,
            no_response: invitationLink.attendants.filter(a => !a.attendance_status).length,
            attended: invitationLink.attendants.filter(a => a.attended).length,
        };
    };

    const stats = getStatusStats();
    const usagePercentage = (invitationLink.usage / invitationLink.limit) * 100;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${invitationLink.full_name} - Invitation Link`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{invitationLink.full_name}</h1>
                        <p className="text-muted-foreground flex items-center gap-2">
                            <LinkIcon className="h-4 w-4" />
                            Invitation Link Details
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/invitation-links/${invitationLink.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </Link>
                        </Button>
                        <Button variant="outline" onClick={copyInvitationUrl}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Link
                        </Button>
                        <Button 
                            variant="outline" 
                            onClick={toggleActive}
                            className={invitationLink.is_active ? "text-red-600 border-red-200" : "text-green-600 border-green-200"}
                        >
                            {invitationLink.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                    </div>
                </div>

                {/* Status Banner */}
                {!invitationLink.is_active && (
                    <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
                        <CardContent className="flex items-center gap-3 pt-6">
                            <XCircle className="h-5 w-5 text-orange-600" />
                            <div>
                                <p className="font-medium text-orange-900 dark:text-orange-100">
                                    This invitation link is currently inactive
                                </p>
                                <p className="text-sm text-orange-700 dark:text-orange-300">
                                    People cannot register using this link until it's activated
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {invitationLink.usage >= invitationLink.limit && (
                    <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                        <CardContent className="flex items-center gap-3 pt-6">
                            <XCircle className="h-5 w-5 text-red-600" />
                            <div>
                                <p className="font-medium text-red-900 dark:text-red-100">
                                    This invitation link has reached its limit
                                </p>
                                <p className="text-sm text-red-700 dark:text-red-300">
                                    No more registrations can be accepted through this link
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Main Information */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Personal Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Primary Invitee Information
                                </CardTitle>
                                <CardDescription>
                                    Details of the person this invitation link was created for
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">First Name</label>
                                        <p className="text-lg font-medium">{invitationLink.first_name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Father's Name</label>
                                        <p className="text-lg font-medium">{invitationLink.father_name}</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                                    <p className="text-lg font-medium">{invitationLink.last_name}</p>
                                </div>
                                <Separator />
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Default VIP Status</label>
                                        <div className="mt-1">
                                            <Badge 
                                                variant={invitationLink.default_vip_status === 'vip' ? 'default' : 'secondary'}
                                                className="text-sm"
                                            >
                                                {invitationLink.default_vip_status.toUpperCase()}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Status</label>
                                        <div className="mt-1">
                                            <Badge variant={invitationLink.is_active ? 'default' : 'destructive'}>
                                                {invitationLink.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Link Configuration */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Globe className="h-5 w-5" />
                                    Link Configuration
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Invitation URL</label>
                                    <div className="flex items-center gap-2 mt-1 p-3 bg-muted rounded-md">
                                        <code className="text-sm flex-1 break-all">
                                            {`${window.location.origin}/invitation/${invitationLink.token}`}
                                        </code>
                                        <Button variant="ghost" size="sm" onClick={copyInvitationUrl}>
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                        <Button variant="ghost" size="sm" asChild>
                                            <a 
                                                href={`/invitation/${invitationLink.token}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Token</label>
                                        <p className="text-sm font-mono mt-1">{invitationLink.token}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Created</label>
                                        <p className="text-sm mt-1">
                                            {new Date(invitationLink.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                                        <p className="text-sm mt-1">
                                            {new Date(invitationLink.updated_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Attendants Table */}
                        {invitationLink.attendants && invitationLink.attendants.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Registered Attendants
                                    </CardTitle>
                                    <CardDescription>
                                        People who have registered through this invitation link
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Phone</TableHead>
                                                <TableHead>Response</TableHead>
                                                <TableHead>Attended</TableHead>
                                                <TableHead>Registered</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {invitationLink.attendants.map((attendant) => (
                                                <TableRow key={attendant.id}>
                                                    <TableCell className="font-medium">
                                                        <Link 
                                                            href={`/attendants/${attendant.id}`}
                                                            className="text-blue-600 hover:underline"
                                                        >
                                                            {attendant.full_name}
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="h-3 w-3 text-muted-foreground" />
                                                            <a 
                                                                href={`tel:${attendant.phone_number}`}
                                                                className="text-blue-600 hover:underline text-sm"
                                                            >
                                                                {attendant.phone_number}
                                                            </a>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {attendant.attendance_status ? (
                                                            <Badge 
                                                                variant={
                                                                    attendant.attendance_status === 'coming' ? 'default' :
                                                                    attendant.attendance_status === 'maybe' ? 'secondary' : 'destructive'
                                                                }
                                                                className="text-xs"
                                                            >
                                                                {attendant.attendance_status.replace('_', ' ').toUpperCase()}
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="text-xs">No Response</Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={attendant.attended ? 'default' : 'outline'} className="text-xs">
                                                            {attendant.attended ? 'Yes' : 'No'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">
                                                        {new Date(attendant.created_at).toLocaleDateString()}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Statistics Sidebar */}
                    <div className="space-y-6">
                        {/* Usage Statistics */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5" />
                                    Usage Statistics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">Capacity</span>
                                        <span className="text-sm text-muted-foreground">
                                            {invitationLink.usage} / {invitationLink.limit}
                                        </span>
                                    </div>
                                    <div className="w-full bg-secondary rounded-full h-2">
                                        <div 
                                            className="bg-primary h-2 rounded-full transition-all" 
                                            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {Math.round(usagePercentage)}% capacity used
                                    </p>
                                </div>
                                <Separator />
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Available Slots</span>
                                        <Badge variant="secondary">
                                            {Math.max(0, invitationLink.limit - invitationLink.usage)}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Total Registered</span>
                                        <Badge variant="default">{invitationLink.usage}</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Response Statistics */}
                        {invitationLink.attendants && invitationLink.attendants.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Activity className="h-5 w-5" />
                                        Response Statistics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-3 w-3 text-green-600" />
                                            <span className="text-sm">Coming</span>
                                        </div>
                                        <Badge className="bg-green-100 text-green-800 border-green-200">
                                            {stats.coming}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-3 w-3 text-yellow-600" />
                                            <span className="text-sm">Maybe</span>
                                        </div>
                                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                            {stats.maybe}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <XCircle className="h-3 w-3 text-red-600" />
                                            <span className="text-sm">Not Coming</span>
                                        </div>
                                        <Badge className="bg-red-100 text-red-800 border-red-200">
                                            {stats.not_coming}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <MessageCircle className="h-3 w-3 text-gray-600" />
                                            <span className="text-sm">No Response</span>
                                        </div>
                                        <Badge variant="outline">{stats.no_response}</Badge>
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <UserCheck className="h-3 w-3 text-blue-600" />
                                            <span className="text-sm">Actually Attended</span>
                                        </div>
                                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                            {stats.attended}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button 
                                    variant="outline" 
                                    className="w-full justify-start"
                                    asChild
                                >
                                    <a 
                                        href={`/invitation/${invitationLink.token}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        Preview Invitation
                                    </a>
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="w-full justify-start"
                                    onClick={copyInvitationUrl}
                                >
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copy Invitation Link
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="w-full justify-start"
                                    asChild
                                >
                                    <Link href={`/invitation-links/${invitationLink.id}/edit`}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Details
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
