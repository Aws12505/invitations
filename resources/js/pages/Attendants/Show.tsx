import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Attendant } from '@/types/invitation';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import QrCodeDisplay from '@/components/QrCodeDisplay';
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
    UserX,
    Users
} from 'lucide-react';
import ChairAssignmentWidget from '@/components/ChairAssignmentWidget';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [

    {
        title: 'Attendants',
        href: '/attendants',
    },
    {
        title: 'Details',
        href: '#',
    },
];

interface Props {
    attendant: Attendant;
}

export default function AttendantShow({ attendant }: Props) {
    const copyStatusUrl = () => {
        const url = `${window.location.origin}/status/${attendant.status_token}`;
        navigator.clipboard.writeText(url).then(() => {
            toast.success('Status link copied to clipboard!');
        });
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

    const getStatusInfo = (status: string | null) => {
        switch (status) {
            case 'coming':
                return {
                    label: 'Coming',
                    icon: CheckCircle,
                    className: 'text-green-600 bg-green-50 border-green-200',
                    description: 'Confirmed attendance'
                };
            case 'maybe':
                return {
                    label: 'Maybe',
                    icon: Clock,
                    className: 'text-yellow-600 bg-yellow-50 border-yellow-200',
                    description: 'Uncertain about attendance'
                };
            case 'not_coming':
                return {
                    label: 'Not Coming',
                    icon: XCircle,
                    className: 'text-red-600 bg-red-50 border-red-200',
                    description: 'Declined attendance'
                };
            default:
                return {
                    label: 'No Response',
                    icon: Clock,
                    className: 'text-gray-600 bg-gray-50 border-gray-200',
                    description: 'No response received yet'
                };
        }
    };

    const statusInfo = getStatusInfo(attendant.attendance_status);
    const StatusIcon = statusInfo.icon;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${attendant.full_name} - Attendant Details`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{attendant.full_name}</h1>
                        <p className="text-muted-foreground">
                            Attendant ID: {attendant.id}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/attendants/${attendant.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </Link>
                        </Button>
                        <Button variant="outline" onClick={copyStatusUrl}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Status Link
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Main Information */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Personal Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Personal Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">First Name</label>
                                        <p className="text-lg font-medium">{attendant.first_name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Father's Name</label>
                                        <p className="text-lg font-medium">{attendant.father_name}</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                                    <p className="text-lg font-medium">{attendant.last_name}</p>
                                </div>
                                <Separator />
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <a 
                                            href={`tel:${attendant.phone_number}`}
                                            className="text-lg font-medium text-blue-600 hover:underline"
                                        >
                                            {attendant.phone_number}
                                        </a>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Invitation Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Invitation Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Invited By</label>
                                    <p className="text-lg font-medium">
                                        {attendant.invitation_link?.full_name || 'Unknown'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">VIP Status</label>
                                    <div className="mt-1">
                                        <Badge 
                                            variant={attendant.vip_status === 'vip' ? 'default' : 'secondary'}
                                            className="text-sm"
                                        >
                                            {attendant.vip_status.toUpperCase()}
                                        </Badge>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Registration Date</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-lg font-medium">
                                            {new Date(attendant.created_at).toLocaleDateString()}
                                        </span>
                                        <span className="text-muted-foreground">
                                            at {new Date(attendant.created_at).toLocaleTimeString()}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Status Information */}
                    <div className="space-y-6">
                        {/* Attendance Response */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Response Status</CardTitle>
                                <CardDescription>Current attendance response</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className={`p-4 rounded-lg border ${statusInfo.className}`}>
                                    <div className="flex items-center gap-3 mb-2">
                                        <StatusIcon className="h-6 w-6" />
                                        <span className="text-lg font-semibold">{statusInfo.label}</span>
                                    </div>
                                    <p className="text-sm opacity-80">{statusInfo.description}</p>
                                </div>
                                {attendant.attendance_status && (
                                    <div className="mt-4 text-sm text-muted-foreground">
                                        <p>Last updated: {new Date(attendant.updated_at).toLocaleString()}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Actual Attendance */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Actual Attendance</CardTitle>
                                <CardDescription>Did they actually attend the event?</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className={`p-4 rounded-lg border ${
                                    attendant.attended 
                                        ? 'text-green-600 bg-green-50 border-green-200'
                                        : 'text-gray-600 bg-gray-50 border-gray-200'
                                }`}>
                                    <div className="flex items-center gap-3">
                                        {attendant.attended ? (
                                            <UserCheck className="h-6 w-6" />
                                        ) : (
                                            <UserX className="h-6 w-6" />
                                        )}
                                        <span className="text-lg font-semibold">
                                            {attendant.attended ? 'Attended' : 'Not Attended'}
                                        </span>
                                    </div>
                                </div>
                                <Button 
                                    onClick={() => toggleAttended(attendant.id, attendant.attended)}
                                    variant={attendant.attended ? "outline" : "default"}
                                    className="w-full"
                                >
                                    Mark as {attendant.attended ? 'Not Attended' : 'Attended'}
                                </Button>
                            </CardContent>
                        </Card>

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
                                        href={`/status/${attendant.status_token}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        View Status Page
                                    </a>
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="w-full justify-start"
                                    onClick={copyStatusUrl}
                                >
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copy Status Link
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="w-full justify-start"
                                    asChild
                                >
                                    <a href={`tel:${attendant.phone_number}`}>
                                        <Phone className="h-4 w-4 mr-2" />
                                        Call Attendant
                                    </a>
                                </Button>
                                <Button 
    variant="outline" 
    className="w-full justify-start"
    asChild
>
    <a 
        href={attendant.qr_code_url}
        target="_blank"
        rel="noopener noreferrer"
    >
        <ExternalLink className="h-4 w-4 mr-2" />
        View Public Profile
    </a>
</Button>
                            </CardContent>
                        </Card>
                        <Card>
    <CardHeader>
        <CardTitle>QR Code</CardTitle>
    </CardHeader>
    <CardContent>
        <QrCodeDisplay attendant={attendant} size="md" />
        <p className="text-xs text-muted-foreground mt-2">
            Share this QR code for easy profile access
        </p>
    </CardContent>
</Card>
                        <ChairAssignmentWidget attendant={attendant} />

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
