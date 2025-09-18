import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Attendant, VipStatus } from '@/types/invitation';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import ChairDisplay from '@/components/ChairDisplay';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Attendants',
        href: '/attendants',
    },
    {
        title: 'Edit',
        href: '#',
    },
];

interface Props {
    attendant: Attendant;
}

interface AttendantFormData extends Record<string, string | boolean> {
    first_name: string;
    father_name: string;
    last_name: string;
    phone_number: string;
    vip_status: VipStatus;
    attended: boolean;
}

interface FormErrors {
    first_name?: string;
    father_name?: string;
    last_name?: string;
    phone_number?: string;
    vip_status?: string;
    attended?: string;
}

export default function EditAttendant({ attendant }: Props) {
    const [formData, setFormData] = useState<AttendantFormData>({
        first_name: attendant.first_name,
        father_name: attendant.father_name,
        last_name: attendant.last_name,
        phone_number: attendant.phone_number,
        vip_status: attendant.vip_status,
        attended: attendant.attended,
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        router.patch(`/attendants/${attendant.id}`, {
            ...formData,
        }, {
            onSuccess: () => {
                toast.success('Attendant updated successfully!');
            },
            onError: (errors: FormErrors) => {
                setErrors(errors);
                toast.error('Please check the form for errors');
            },
            onFinish: () => setProcessing(false),
        });
    };

    const updateFormData = <K extends keyof AttendantFormData>(
        field: K, 
        value: AttendantFormData[K]
    ) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${attendant.full_name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Attendant</h1>
                    <p className="text-muted-foreground">
                        Update attendant information and status
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Attendant Information</CardTitle>
                                <CardDescription>
                                    Update the attendant's personal details and status
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
                                        />
                                        <FormField
                                            id="father_name"
                                            name="father_name"
                                            label="Father's Name"
                                            value={formData.father_name}
                                            onChange={(e) => updateFormData('father_name', e.target.value)}
                                            error={errors.father_name}
                                            required
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
                                        description="Please include country code (e.g., +963 for Syria)"
                                    />

                                    <div className="space-y-2">
                                        <Label htmlFor="vip_status" className="text-sm font-medium">
                                            VIP Status
                                            <span className="text-destructive ml-1">*</span>
                                        </Label>
                                        <Select
                                            value={formData.vip_status}
                                            onValueChange={(value: VipStatus) => updateFormData('vip_status', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select VIP status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="regular">Regular</SelectItem>
                                                <SelectItem value="vip">VIP</SelectItem>
                                                <SelectItem value="premium">Premium</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.vip_status && (
                                            <p className="text-xs text-destructive">{errors.vip_status}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="attended"
                                            checked={formData.attended}
                                            onCheckedChange={(checked) => updateFormData('attended', checked)}
                                        />
                                        <Label htmlFor="attended">Actually attended the event</Label>
                                    </div>

                                    <div className="flex gap-4">
                                        <Button type="submit" disabled={processing}>
                                            {processing ? 'Updating...' : 'Update Attendant'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => router.visit('/attendants')}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Additional Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Registration Date
                                    </Label>
                                    <p className="text-sm">
                                        {new Date(attendant.created_at).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Last Updated
                                    </Label>
                                    <p className="text-sm">
                                        {new Date(attendant.updated_at).toLocaleString()}
                                    </p>
                                </div>
                                <div>
    <Label className="text-sm font-medium text-muted-foreground">
        Chair Assignment
    </Label>
    <div className="mt-1">
        <ChairDisplay 
            chairNumber={attendant.chair_number} 
            size="md" 
            showSection={true} 
        />
    </div>
</div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Invited By
                                    </Label>
                                    <p className="text-sm">
                                        {attendant.invitation_link?.full_name || 'Unknown'}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Current Response
                                    </Label>
                                    <p className="text-sm">
                                        {attendant.attendance_status ? 
                                            attendant.attendance_status.charAt(0).toUpperCase() + 
                                            attendant.attendance_status.slice(1).replace('_', ' ')
                                            : 'No response yet'
                                        }
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
