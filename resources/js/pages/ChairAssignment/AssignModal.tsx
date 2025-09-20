import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Attendant } from '@/types/invitation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Armchair, Crown, User } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    attendant: Attendant;
    availableChairs: number[];
    attendantSection: string;
    modalType: 'assign' | 'change';
}

export default function AssignModal({ attendant, availableChairs, attendantSection, modalType }: Props) {
    const [chairNumber, setChairNumber] = useState<string>(attendant.chair_number?.toString() || '');
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!chairNumber) {
            toast.error('Please select a chair number');
            return;
        }

        setProcessing(true);

        router.patch(`/chair-assignment/${attendant.id}/assign`, {
            chair_number: parseInt(chairNumber),
        }, {
            onSuccess: () => {
                toast.success(`Chair ${modalType === 'assign' ? 'assigned' : 'changed'} successfully`);
            },
            onError: (errors) => {
                toast.error(errors.chair_number || 'Failed to assign chair');
            },
            onFinish: () => setProcessing(false),
        });
    };

    const handleCancel = () => {
        router.get('/attendants');
    };

    const getChairBadge = (chair: number) => {
        const isVip = chair <= 50;
        return (
            <div className="flex items-center gap-2">
                {isVip ? (
                    <Crown className="h-3 w-3 text-purple-600" />
                ) : (
                    <User className="h-3 w-3 text-blue-600" />
                )}
                <span>Chair {chair}</span>
                <Badge variant={isVip ? 'default' : 'secondary'} className="text-xs">
                    {isVip ? 'VIP' : 'Regular'}
                </Badge>
            </div>
        );
    };

    return (
        <>
            <Head title={`${modalType === 'assign' ? 'Assign' : 'Change'} Chair - ${attendant.full_name}`} />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
                <div className="w-full max-w-2xl">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={handleCancel}
                                    className="p-1"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                                <div className="flex-1">
                                    <CardTitle className="flex items-center gap-2">
                                        <Armchair className="h-5 w-5" />
                                        {modalType === 'assign' ? 'Assign Chair' : 'Change Chair'}
                                    </CardTitle>
                                    <CardDescription>
                                        {modalType === 'assign' 
                                            ? `Assign a chair to ${attendant.full_name}`
                                            : `Change chair for ${attendant.full_name} (Currently: Chair #${attendant.chair_number})`
                                        }
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Attendant Info */}
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Attendant</label>
                                    <p className="font-medium">{attendant.full_name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">VIP Status</label>
                                    <Badge variant={
                                        attendant.vip_status === 'vip' || attendant.vip_status === 'premium' 
                                            ? 'default' : 'secondary'
                                    }>
                                        {attendant.vip_status.toUpperCase()}
                                    </Badge>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Invited By</label>
                                    <p className="text-sm">{attendant.invitation_link?.full_name || 'Unknown'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Section</label>
                                    <p className="text-sm">{attendantSection}</p>
                                </div>
                            </div>

                            {/* Chair Selection Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Select Chair
                                        <span className="text-destructive ml-1">*</span>
                                    </label>
                                    <Select value={chairNumber} onValueChange={setChairNumber}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose an available chair" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableChairs.map((chair) => (
                                                <SelectItem key={chair} value={chair.toString()}>
                                                    <div className="flex items-center gap-2">
                                                        {chair <= 50 ? (
                                                            <Crown className="h-3 w-3 text-purple-600" />
                                                        ) : (
                                                            <User className="h-3 w-3 text-blue-600" />
                                                        )}
                                                        Chair {chair} ({chair <= 50 ? 'VIP' : 'Regular'} Section)
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground">
                                        {availableChairs.length} chairs available in your section
                                    </p>
                                </div>

                                {/* Preview Selected Chair */}
                                {chairNumber && (
                                    <div className="p-4 bg-muted rounded-lg">
                                        <label className="text-sm font-medium text-muted-foreground">Selected:</label>
                                        <div className="mt-1">
                                            {getChairBadge(parseInt(chairNumber))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleCancel}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing || !chairNumber}
                                        className="flex-1"
                                    >
                                        {processing 
                                            ? (modalType === 'assign' ? 'Assigning...' : 'Changing...')
                                            : (modalType === 'assign' ? 'Assign Chair' : 'Change Chair')
                                        }
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
