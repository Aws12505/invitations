import { useState } from 'react';
import { InvitationLink } from '@/types/invitation';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    invitationLink: InvitationLink;
}

// Fix: Use a proper interface that extends Record for type safety
interface AttendantFormData extends Record<string, string> {
    first_name: string;
    father_name: string;
    last_name: string;
    phone_number: string;
}

interface FormErrors {
    first_name?: string;
    father_name?: string;
    last_name?: string;
    phone_number?: string;
}

export default function InvitationForm({ invitationLink }: Props) {
    const [formData, setFormData] = useState<AttendantFormData>({
        first_name: '',
        father_name: '',
        last_name: '',
        phone_number: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        // Fix: Now formData is already properly typed as Record<string, string>
        // No casting needed since AttendantFormData extends Record<string, string>
        router.post(`/invitation/${invitationLink.token}`, formData, {
            onError: (errors: FormErrors) => {
                setErrors(errors);
                toast.error('Please check the form for errors');
                setProcessing(false);
            },
        });
    };

    const updateFormData = (field: keyof AttendantFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const remainingSlots = invitationLink.limit - invitationLink.usage;

    return (
        <>
            <Head title={`Invitation from ${invitationLink.full_name}`} />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
                <div className="w-full max-w-2xl space-y-6">
                    {/* Event Header */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm font-medium">You're Invited!</span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight">Wedding Celebration</h1>
                        <p className="text-xl text-muted-foreground">
                            You have been invited by <strong>{invitationLink.full_name}</strong>
                        </p>
                    </div>

                    {/* Event Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Event Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="flex items-center gap-3">
                                    <Users className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Available Slots</p>
                                        <p className="text-2xl font-bold text-primary">{remainingSlots}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">VIP Status</p>
                                    <Badge variant={invitationLink.default_vip_status === 'vip' ? 'default' : 'secondary'}>
                                        {invitationLink.default_vip_status.toUpperCase()}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Invited By</p>
                                    <p className="font-medium">{invitationLink.full_name}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Registration Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Complete Your Registration</CardTitle>
                            <CardDescription>
                                Please fill in your details to confirm your attendance
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField
                                        id="first_name"
                                        name="first_name"
                                        label="First Name"
                                        value={formData.first_name}
                                        onChange={(e) => updateFormData('first_name', e.target.value)}
                                        error={errors.first_name}
                                        required
                                        placeholder="Enter your first name"
                                    />
                                    <FormField
                                        id="father_name"
                                        name="father_name"
                                        label="Father's Name"
                                        value={formData.father_name}
                                        onChange={(e) => updateFormData('father_name', e.target.value)}
                                        error={errors.father_name}
                                        required
                                        placeholder="Enter your father's name"
                                    />
                                </div>

                                <FormField
                                    id="last_name"
                                    name="last_name"
                                    label="Last Name"
                                    value={formData.last_name}
                                    onChange={(e) => updateFormData('last_name', e.target.value)}
                                    error={errors.last_name}
                                    required
                                    placeholder="Enter your last name"
                                />

                                <FormField
                                    id="phone_number"
                                    name="phone_number"
                                    type="tel"
                                    label="Phone Number"
                                    value={formData.phone_number}
                                    onChange={(e) => updateFormData('phone_number', e.target.value)}
                                    error={errors.phone_number}
                                    required
                                    placeholder="+963 95986220"
                                    description="Please include your country code (e.g., +963 for Syria)"
                                />

                                <Button 
                                    type="submit" 
                                    disabled={processing || remainingSlots === 0}
                                    className="w-full"
                                    size="lg"
                                >
                                    {processing ? 'Registering...' : 'Complete Registration'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Footer */}
                    <div className="text-center text-sm text-muted-foreground">
                        <p>Need help? Contact the event organizers</p>
                    </div>
                </div>
            </div>
        </>
    );
}
