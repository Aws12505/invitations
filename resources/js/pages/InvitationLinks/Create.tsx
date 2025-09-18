import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { VipStatus } from '@/types/invitation';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [

    {
        title: 'Invitation Links',
        href: '/invitation-links',
    },
    {
        title: 'Create',
        href: '#',
    },
];

// Fix: Define proper interface for form data
interface InvitationFormData {
    first_name: string;
    father_name: string;
    last_name: string;
    limit: number;
    default_vip_status: VipStatus;
}

interface FormErrors {
    first_name?: string;
    father_name?: string;
    last_name?: string;
    limit?: string;
    default_vip_status?: string;
}

export default function CreateInvitationLink() {
    const [formData, setFormData] = useState<InvitationFormData>({
        first_name: '',
        father_name: '',
        last_name: '',
        limit: 20,
        default_vip_status: 'regular',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        // Fix: Cast formData to proper Record type for Inertia
        const payload: Record<string, string | number> = {
            first_name: formData.first_name,
            father_name: formData.father_name,
            last_name: formData.last_name,
            limit: formData.limit,
            default_vip_status: formData.default_vip_status,
        };

        router.post('/invitation-links', payload, {
            onSuccess: () => {
                toast.success('Invitation link created successfully!');
            },
            onError: (errors: FormErrors) => {
                setErrors(errors);
                toast.error('Please check the form for errors');
            },
            onFinish: () => setProcessing(false),
        });
    };

    const updateFormData = <K extends keyof InvitationFormData>(field: K, value: InvitationFormData[K]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Invitation Link" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Create Invitation Link</h1>
                    <p className="text-muted-foreground">
                        Generate a new invitation link for event attendants
                    </p>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Invitation Details</CardTitle>
                        <CardDescription>
                            Fill in the details for the primary invitee and link configuration
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
                                id="limit"
                                name="limit"
                                type="number"
                                label="Invitation Limit"
                                value={formData.limit}
                                onChange={(e) => updateFormData('limit', parseInt(e.target.value) || 0)}
                                error={errors.limit}
                                description="Maximum number of people who can register using this link"
                                min={1}
                                max={1000}
                                required
                            />

                            <div className="space-y-2">
                                <Label htmlFor="default_vip_status" className="text-sm font-medium">
                                    Default VIP Status
                                    <span className="text-destructive ml-1">*</span>
                                </Label>
                                <Select
                                    value={formData.default_vip_status}
                                    onValueChange={(value: VipStatus) => updateFormData('default_vip_status', value)}
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
                                {errors.default_vip_status && (
                                    <p className="text-xs text-destructive">{errors.default_vip_status}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    All attendants registering through this link will have this VIP status
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Invitation Link'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.visit('/invitation-links')}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
