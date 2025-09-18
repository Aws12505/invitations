import { Attendant } from '@/types/invitation';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Calendar, Phone, User, ExternalLink } from 'lucide-react';

interface Props {
    attendant: Attendant;
    statusUrl: string;
}

export default function InvitationSuccess({ attendant, statusUrl }: Props) {
    const copyStatusUrl = () => {
        navigator.clipboard.writeText(statusUrl);
    };

    return (
        <>
            <Head title="Registration Successful" />
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
                <div className="w-full max-w-2xl space-y-6">
                    {/* Success Header */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full">
                            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-green-900 dark:text-green-100">
                            Registration Successful!
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Welcome to the celebration, {attendant.full_name}
                        </p>
                    </div>

                    {/* Registration Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Your Registration Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                                    <p className="font-medium">{attendant.full_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                                    <p className="font-medium flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        {attendant.phone_number}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">VIP Status</p>
                                    <Badge variant={attendant.vip_status === 'vip' ? 'default' : 'secondary'}>
                                        {attendant.vip_status.toUpperCase()}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Registration Date</p>
                                    <p className="font-medium flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        {new Date(attendant.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status Management */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Manage Your Attendance Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">
                                Use the link below to update your attendance status anytime before the event.
                            </p>
                            <div className="flex gap-3">
                                <Button asChild className="flex-1">
                                    <a href={statusUrl} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        Update Attendance Status
                                    </a>
                                </Button>
                                <Button variant="outline" onClick={copyStatusUrl}>
                                    Copy Link
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Save this link - you'll need it to change your attendance status later.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Next Steps */}
                    <Card>
                        <CardHeader>
                            <CardTitle>What's Next?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium">
                                        1
                                    </div>
                                    <div>
                                        <p className="font-medium">Save Your Status Link</p>
                                        <p className="text-sm text-muted-foreground">
                                            Bookmark or save the attendance status link for future use
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium">
                                        2
                                    </div>
                                    <div>
                                        <p className="font-medium">Update Your Status</p>
                                        <p className="text-sm text-muted-foreground">
                                            Let us know if you're coming, maybe, or not coming
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium">
                                        3
                                    </div>
                                    <div>
                                        <p className="font-medium">Enjoy the Celebration</p>
                                        <p className="text-sm text-muted-foreground">
                                            We can't wait to celebrate with you!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
