import { Attendant } from '@/types/invitation';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Calendar, User, Clock, XCircle } from 'lucide-react';

interface Props {
    attendant: Attendant;
}

export default function AttendanceStatusSuccess({ attendant }: Props) {
    const statusConfig = {
        coming: {
            label: 'Coming',
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            message: 'Great! We\'re excited to see you at the celebration.',
        },
        maybe: {
            label: 'Maybe',
            icon: Clock,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            message: 'Thanks for letting us know. Feel free to update when you\'re sure.',
        },
        not_coming: {
            label: 'Not Coming',
            icon: XCircle,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            message: 'We\'ll miss you! Thank you for letting us know.',
        },
    };

    const currentStatus = attendant.attendance_status;
    const config = currentStatus ? statusConfig[currentStatus] : null;

    if (!config) return null;

    const IconComponent = config.icon;

    return (
        <>
            <Head title="Status Updated Successfully" />
            <div className={`min-h-screen ${config.bgColor} flex items-center justify-center p-4`}>
                <div className="w-full max-w-2xl space-y-6">
                    {/* Success Header */}
                    <div className="text-center space-y-4">
                        <div className={`inline-flex items-center justify-center w-16 h-16 ${config.bgColor} rounded-full border-2 border-current`}>
                            <IconComponent className={`h-8 w-8 ${config.color}`} />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight">
                            Status Updated!
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            {config.message}
                        </p>
                    </div>

                    {/* Updated Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Updated Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                                    <p className="font-medium">{attendant.full_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Attendance Status</p>
                                    <div className="flex items-center gap-2">
                                        <IconComponent className={`h-4 w-4 ${config.color}`} />
                                        <Badge 
                                            variant={
                                                currentStatus === 'coming' ? 'default' :
                                                currentStatus === 'maybe' ? 'secondary' : 'destructive'
                                            }
                                        >
                                            {config.label}
                                        </Badge>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Updated On</p>
                                    <p className="font-medium flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        {new Date().toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">VIP Status</p>
                                    <Badge variant={attendant.vip_status === 'vip' ? 'default' : 'secondary'}>
                                        {attendant.vip_status.toUpperCase()}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Change Status Again */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Need to Change Your Status?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">
                                You can update your attendance status anytime before the event.
                            </p>
                            <Button 
                                onClick={() => window.location.reload()}
                                variant="outline"
                                className="w-full"
                            >
                                Update Status Again
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Footer */}
                    <div className="text-center text-sm text-muted-foreground">
                        <p>Thank you for keeping us updated!</p>
                    </div>
                </div>
            </div>
        </>
    );
}
