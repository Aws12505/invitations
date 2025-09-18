import { Attendant } from '@/types/invitation';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
    User, 
    Phone, 
    Calendar, 
    Crown, 
    Users,
    MapPin,
    CheckCircle,
    XCircle,
    Clock,
    UserCheck,
    UserX,
    Armchair,
    Shield
} from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

interface Props {
    attendant: Attendant;
    isAuthenticated: boolean;
}

export default function AttendantProfileShow({ attendant, isAuthenticated }: Props) {
    const [processing, setProcessing] = useState(false);

    const handleToggleAttended = () => {
        if (!isAuthenticated) {
            toast.error('Authentication required');
            return;
        }

        setProcessing(true);

        router.patch(`/profile/${attendant.qr_token}/toggle-attended`, {}, {
            onSuccess: () => {
                const message = !attendant.attended 
                    ? `${attendant.full_name} marked as attended` 
                    : `${attendant.full_name} marked as not attended`;
                toast.success(message);
            },
            onError: (errors) => {
                toast.error(errors.auth || 'Failed to update attendance status');
            },
            onFinish: () => setProcessing(false),
        });
    };

    const getStatusInfo = (status: string | null) => {
        switch (status) {
            case 'coming':
                return {
                    label: 'Coming',
                    icon: CheckCircle,
                    className: 'text-green-600 bg-green-50 border-green-200',
                };
            case 'maybe':
                return {
                    label: 'Maybe',
                    icon: Clock,
                    className: 'text-yellow-600 bg-yellow-50 border-yellow-200',
                };
            case 'not_coming':
                return {
                    label: 'Not Coming',
                    icon: XCircle,
                    className: 'text-red-600 bg-red-50 border-red-200',
                };
            default:
                return {
                    label: 'No Response',
                    icon: Clock,
                    className: 'text-gray-600 bg-gray-50 border-gray-200',
                };
        }
    };

    const statusInfo = getStatusInfo(attendant.attendance_status);
    const StatusIcon = statusInfo.icon;

    const getChairDisplay = () => {
        if (!attendant.chair_number) {
            return (
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Armchair className="h-5 w-5" />
                    <span>No chair assigned</span>
                </div>
            );
        }

        const isVip = attendant.chair_number <= 250;
        return (
            <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isVip ? 'bg-purple-100' : 'bg-blue-100'
                }`}>
                    {isVip ? (
                        <Crown className="h-6 w-6 text-purple-600" />
                    ) : (
                        <User className="h-6 w-6 text-blue-600" />
                    )}
                </div>
                <div>
                    <Badge 
                        variant={isVip ? 'default' : 'secondary'}
                        className="text-lg px-3 py-1"
                    >
                        Chair {attendant.chair_number}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                        {isVip ? 'VIP Section (Chairs 1-250)' : 'Regular Section (Chairs 251-360)'}
                    </p>
                </div>
            </div>
        );
    };

    return (
        <>
            <Head title={`${attendant.full_name} - Wedding Invitation`} />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:to-gray-800">
                {/* Header */}
                <div className="bg-white dark:bg-gray-900 border-b shadow-sm">
                    <div className="max-w-4xl mx-auto px-4 py-6">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Wedding Celebration
                            </h1>
                            <p className="text-xl text-muted-foreground mt-2">
                                Guest Information
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Main Profile Information */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Guest Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Guest Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="text-center">
                                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <User className="h-12 w-12 text-white" />
                                        </div>
                                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                            {attendant.full_name}
                                        </h2>
                                        <div className="flex items-center justify-center gap-2 mt-2">
                                            <Badge 
                                                variant={
                                                    attendant.vip_status === 'vip' || attendant.vip_status === 'premium' 
                                                        ? 'default' : 'secondary'
                                                }
                                                className="text-sm"
                                            >
                                                {attendant.vip_status === 'vip' && <Crown className="h-3 w-3 mr-1" />}
                                                {attendant.vip_status.toUpperCase()} GUEST
                                            </Badge>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Phone className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">{attendant.phone_number}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Registration Date</label>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">
                                                    {new Date(attendant.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {attendant.invitation_link && (
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">Invited By</label>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Users className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">{attendant.invitation_link.full_name}</span>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Chair Assignment */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Armchair className="h-5 w-5" />
                                        Seating Assignment
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {getChairDisplay()}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Status Sidebar */}
                        <div className="space-y-6">
                            {/* RSVP Status */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>RSVP Status</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className={`p-4 rounded-lg border ${statusInfo.className}`}>
                                        <div className="flex items-center gap-3 mb-2">
                                            <StatusIcon className="h-6 w-6" />
                                            <span className="text-lg font-semibold">{statusInfo.label}</span>
                                        </div>
                                        {attendant.attendance_status && (
                                            <p className="text-sm opacity-80">
                                                Last updated: {new Date(attendant.updated_at).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actual Attendance */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Event Attendance</CardTitle>
                                    <CardDescription>
                                        Actual attendance status
                                    </CardDescription>
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

                                    {/* Admin Toggle Button */}
                                    {isAuthenticated && (
                                        <Button 
                                            onClick={handleToggleAttended}
                                            disabled={processing}
                                            variant={attendant.attended ? "outline" : "default"}
                                            className="w-full"
                                        >
                                            <Shield className="h-4 w-4 mr-2" />
                                            {processing 
                                                ? 'Updating...'
                                                : `Mark as ${attendant.attended ? 'Not Attended' : 'Attended'}`
                                            }
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>


                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-white dark:bg-gray-900 border-t mt-12">
                    <div className="max-w-4xl mx-auto px-4 py-8 text-center">
                        <p className="text-muted-foreground">
                            We can't wait to celebrate with you!
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
