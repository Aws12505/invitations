import { InvitationLink } from '@/types/invitation';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Users, Calendar } from 'lucide-react';

interface Props {
    invitationLink: InvitationLink;
}

export default function InvitationLimitReached({ invitationLink }: Props) {
    return (
        <>
            <Head title="Invitation Limit Reached" />
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
                <div className="w-full max-w-2xl space-y-6">
                    {/* Warning Header */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full">
                            <AlertTriangle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-orange-900 dark:text-orange-100">
                            Registration Closed
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            This invitation has reached its maximum capacity
                        </p>
                    </div>

                    {/* Invitation Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Invitation Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Invited By</p>
                                    <p className="font-medium">{invitationLink.full_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Capacity</p>
                                    <p className="font-medium flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        {invitationLink.limit} people
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Registered</p>
                                    <p className="font-medium text-orange-600">
                                        {invitationLink.usage} / {invitationLink.limit}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                                    <span className="inline-flex items-center gap-1 text-orange-600 font-medium">
                                        <AlertTriangle className="h-4 w-4" />
                                        Full Capacity
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* What Now */}
                    <Card>
                        <CardHeader>
                            <CardTitle>What Can You Do?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium mt-1">
                                        1
                                    </div>
                                    <div>
                                        <p className="font-medium">Contact the Inviter</p>
                                        <p className="text-sm text-muted-foreground">
                                            Reach out to {invitationLink.full_name} to see if there are alternative arrangements
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium mt-1">
                                        2
                                    </div>
                                    <div>
                                        <p className="font-medium">Check Back Later</p>
                                        <p className="text-sm text-muted-foreground">
                                            Sometimes people change their minds and spots become available
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium mt-1">
                                        3
                                    </div>
                                    <div>
                                        <p className="font-medium">Wait for Event Updates</p>
                                        <p className="text-sm text-muted-foreground">
                                            The organizers might increase capacity or create additional invitation links
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sorry Message */}
                    <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
                        <CardContent className="pt-6">
                            <div className="text-center space-y-2">
                                <Calendar className="h-8 w-8 text-orange-600 mx-auto" />
                                <p className="font-medium text-orange-900 dark:text-orange-100">
                                    We're sorry you couldn't register at this time
                                </p>
                                <p className="text-sm text-orange-700 dark:text-orange-300">
                                    We hope you can join us for future celebrations!
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
