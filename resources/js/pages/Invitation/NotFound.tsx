import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
    AlertTriangle, 
    Home, 
    Search, 
    Clock,
    HelpCircle,
    ArrowLeft,
    Mail,
    Users,
    Calendar,
    ExternalLink
} from 'lucide-react';

export default function InvitationNotFound() {
    return (
        <>
            <Head title="Invitation Not Found" />
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
                <div className="w-full max-w-2xl space-y-6">
                    {/* Error Header */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full">
                            <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold tracking-tight text-red-900 dark:text-red-100">
                                Invitation Not Found
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                We couldn't find the invitation you're looking for
                            </p>
                        </div>
                    </div>

                    {/* Main Error Card */}
                    <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-900 dark:text-red-100">
                                <Search className="h-5 w-5" />
                                What went wrong?
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-red-800 dark:text-red-200">
                                <p className="mb-3">This invitation link may not be working because:</p>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 shrink-0"></span>
                                        The invitation link has been deactivated by the organizers
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 shrink-0"></span>
                                        The link was copied or typed incorrectly
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 shrink-0"></span>
                                        The invitation has expired or reached its limit
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 shrink-0"></span>
                                        The event registration period has ended
                                    </li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Illustration Card */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center space-y-4">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full">
                                    <Calendar className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Looking for an event invitation?</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Event invitations are private links sent by organizers to specific people
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* What to do next */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <HelpCircle className="h-5 w-5" />
                                How to get invited
                            </CardTitle>
                            <CardDescription>
                                Follow these steps to join the event
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium mt-1">
                                        1
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium mb-1">Check your messages</p>
                                        <p className="text-sm text-muted-foreground">
                                            Look for the original invitation in your email, messages, or social media
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium mt-1">
                                        2
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium mb-1">Contact the host</p>
                                        <p className="text-sm text-muted-foreground">
                                            Ask the person who invited you to send the link again
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium mt-1">
                                        3
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium mb-1">Request an invitation</p>
                                        <p className="text-sm text-muted-foreground">
                                            If you know about the event, ask the organizers for an invitation link
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium mt-1">
                                        4
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium mb-1">Double-check the link</p>
                                        <p className="text-sm text-muted-foreground">
                                            Make sure the entire link was copied correctly, including any special characters
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tips Card */}
                    <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                                <Users className="h-5 w-5" />
                                Pro Tip
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                Invitation links are unique and personal. They can't be guessed or found by searching. 
                                You need to receive one directly from someone who has permission to invite guests.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                        <Button 
                            onClick={() => window.history.back()}
                            variant="outline"
                            className="flex-1"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Go Back
                        </Button>
                        <Button 
                            onClick={() => window.location.reload()}
                            variant="outline"
                            className="flex-1"
                        >
                            <Clock className="h-4 w-4 mr-2" />
                            Try Again
                        </Button>
                    </div>

                    {/* Help footer */}
                    <Card className="bg-muted/30">
                        <CardContent className="pt-6">
                            <div className="text-center space-y-3">
                                <Mail className="h-6 w-6 text-muted-foreground mx-auto" />
                                <div>
                                    <p className="text-sm font-medium">Need Help?</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Contact the event organizers if you believe you should have access to this invitation
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
