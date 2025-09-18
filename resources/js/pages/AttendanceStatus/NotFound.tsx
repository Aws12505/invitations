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
    Mail
} from 'lucide-react';

export default function AttendanceStatusNotFound() {
    return (
        <>
            <Head title="Status Link Not Found" />
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
                <div className="w-full max-w-2xl space-y-6">
                    {/* Error Header */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full">
                            <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold tracking-tight text-red-900 dark:text-red-100">
                                Status Link Not Found
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                We couldn't find the attendance status page you're looking for
                            </p>
                        </div>
                    </div>

                    {/* Main Error Card */}
                    <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-900 dark:text-red-100">
                                <Search className="h-5 w-5" />
                                What happened?
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-red-800 dark:text-red-200">
                                <p className="mb-3">This could happen for several reasons:</p>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 shrink-0"></span>
                                        The status link may have expired or been deactivated
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 shrink-0"></span>
                                        The link might have been copied incorrectly
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 shrink-0"></span>
                                        The attendant registration may have been removed
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 shrink-0"></span>
                                        The event may have already concluded
                                    </li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    {/* What to do next */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <HelpCircle className="h-5 w-5" />
                                What can you do?
                            </CardTitle>
                            <CardDescription>
                                Here are some steps you can take to resolve this issue
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mt-1">
                                        1
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium mb-1">Check your original invitation</p>
                                        <p className="text-sm text-muted-foreground">
                                            Look for the original invitation email or message that contained your status link
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mt-1">
                                        2
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium mb-1">Contact the event organizer</p>
                                        <p className="text-sm text-muted-foreground">
                                            Reach out to the person who invited you for a new status link
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mt-1">
                                        3
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium mb-1">Try again later</p>
                                        <p className="text-sm text-muted-foreground">
                                            If this is a temporary issue, the link might work again soon
                                        </p>
                                    </div>
                                </div>
                            </div>
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
                            <div className="text-center space-y-2">
                                <Mail className="h-6 w-6 text-muted-foreground mx-auto" />
                                <p className="text-sm font-medium">Need Help?</p>
                                <p className="text-xs text-muted-foreground">
                                    Contact the event organizers if you continue to experience issues with your status link
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
