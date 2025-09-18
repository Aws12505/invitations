import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { InvitationLink, VipStatus } from '@/types/invitation';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [

    {
        title: 'Invitation Links',
        href: '/invitation-links',
    },
    {
        title: 'Edit',
        href: '#',
    },
];

interface Props {
    invitationLink: InvitationLink;
}

interface InvitationFormData extends Record<string, string | number | boolean> {
    first_name: string;
    father_name: string;
    last_name: string;
    limit: number;
    default_vip_status: VipStatus;
    is_active: boolean;
}

interface FormErrors {
    first_name?: string;
    father_name?: string;
    last_name?: string;
    limit?: string;
    default_vip_status?: string;
    is_active?: string;
}

export default function EditInvitationLink({ invitationLink }: Props) {
    const [formData, setFormData] = useState<InvitationFormData>({
        first_name: invitationLink.first_name,
        father_name: invitationLink.father_name,
        last_name: invitationLink.last_name,
        limit: invitationLink.limit,
        default_vip_status: invitationLink.default_vip_status,
        is_active: invitationLink.is_active,
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        router.patch(`/invitation-links/${invitationLink.id}`, {
            ...formData,
        }, {
            onSuccess: () => {
                toast.success('Invitation link updated successfully!');
            },
            onError: (errors: FormErrors) => {
                setErrors(errors);
                toast.error('Please check the form for errors');
            },
            onFinish: () => setProcessing(false),
        });
    };

    const updateFormData = <K extends keyof InvitationFormData>(
        field: K, 
        value: InvitationFormData[K]
    ) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const copyInvitationUrl = () => {
        const url = `${window.location.origin}/invitation/${invitationLink.token}`;
        navigator.clipboard.writeText(url).then(() => {
            toast.success('Invitation link copied to clipboard!');
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${invitationLink.full_name} - Invitation Link`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Invitation Link</h1>
                    <p className="text-muted-foreground">
                        Update invitation link details and configuration
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Invitation Link Information</CardTitle>
                                <CardDescription>
                                    Update the primary invitee details and link settings
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

                                    <Separator />

                                    <FormField
                                        id="limit"
                                        name="limit"
                                        type="number"
                                        label="Invitation Limit"
                                        value={formData.limit}
                                        onChange={(e) => updateFormData('limit', parseInt(e.target.value) || 0)}
                                        error={errors.limit}
                                        description={`Currently ${invitationLink.usage} people have registered. You cannot set the limit below this number.`}
                                        min={invitationLink.usage}
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
                                            New attendants registering through this link will have this VIP status
                                        </p>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="is_active"
                                            checked={formData.is_active}
                                            onCheckedChange={(checked) => updateFormData('is_active', checked)}
                                        />
                                        <Label htmlFor="is_active">Active invitation link</Label>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        When inactive, people cannot register using this invitation link
                                    </p>

                                    <div className="flex gap-4">
                                        <Button type="submit" disabled={processing}>
                                            {processing ? 'Updating...' : 'Update Invitation Link'}
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

                    <div className="space-y-6">
                        {/* Link Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Link Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Token
                                    </Label>
                                    <p className="text-xs font-mono mt-1 p-2 bg-muted rounded border">
                                        {invitationLink.token}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Invitation URL
                                    </Label>
                                    <div className="mt-1 p-2 bg-muted rounded border">
                                        <p className="text-xs break-all">
                                            {`${window.location.origin}/invitation/${invitationLink.token}`}
                                        </p>
                                    </div>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="w-full mt-2"
                                        onClick={copyInvitationUrl}
                                    >
                                        Copy Link
                                    </Button>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Created Date
                                    </Label>
                                    <p className="text-sm mt-1">
                                        {new Date(invitationLink.created_at).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Last Updated
                                    </Label>
                                    <p className="text-sm mt-1">
                                        {new Date(invitationLink.updated_at).toLocaleString()}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Usage Statistics */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Usage Statistics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">Registrations</span>
                                        <span className="text-sm text-muted-foreground">
                                            {invitationLink.usage} / {invitationLink.limit}
                                        </span>
                                    </div>
                                    <div className="w-full bg-secondary rounded-full h-2">
                                        <div 
                                            className="bg-primary h-2 rounded-full transition-all" 
                                            style={{ 
                                                width: `${Math.min((invitationLink.usage / invitationLink.limit) * 100, 100)}%` 
                                            }}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {Math.round((invitationLink.usage / invitationLink.limit) * 100)}% capacity used
                                    </p>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Available slots:</span>
                                        <span className="font-medium">
                                            {Math.max(0, invitationLink.limit - invitationLink.usage)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Total registered:</span>
                                        <span className="font-medium">{invitationLink.usage}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Warning for Active Changes */}
                        {!formData.is_active && invitationLink.is_active && (
                            <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mt-0.5">
                                            <span className="text-orange-600 text-sm">!</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-orange-900 dark:text-orange-100 text-sm">
                                                Deactivating this link
                                            </p>
                                            <p className="text-xs text-orange-700 dark:text-orange-300">
                                                People will no longer be able to register through this link
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
