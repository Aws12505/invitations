import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Attendant } from '@/types/invitation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowLeftRight, Crown, User } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    attendant1: Attendant;
    otherAttendants: Attendant[];
}

export default function SwitchModal({ attendant1, otherAttendants }: Props) {
    const [attendant2Id, setAttendant2Id] = useState<string>('');
    const [processing, setProcessing] = useState(false);

    const selectedAttendant2 = otherAttendants.find(a => a.id.toString() === attendant2Id);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!attendant2Id) {
            toast.error('Please select an attendant to switch with');
            return;
        }

        setProcessing(true);

        router.post('/chair-assignment/switch', {
            attendant1_id: attendant1.id,
            attendant2_id: parseInt(attendant2Id),
        }, {
            onSuccess: () => {
                toast.success('Chairs switched successfully');
            },
            onError: () => {
                toast.error('Failed to switch chairs');
            },
            onFinish: () => setProcessing(false),
        });
    };

    const handleCancel = () => {
        router.get('/chair-assignment');
    };

    const getChairDisplay = (attendant: Attendant) => {
        if (!attendant.chair_number) return null;
        
        const isVip = attendant.chair_number <= 250;
        return (
            <div className="flex items-center gap-2">
                {isVip ? (
                    <Crown className="h-4 w-4 text-purple-600" />
                ) : (
                    <User className="h-4 w-4 text-blue-600" />
                )}
                <Badge variant={isVip ? 'default' : 'secondary'}>
                    Chair {attendant.chair_number}
                </Badge>
            </div>
        );
    };

    return (
        <>
            <Head title={`Switch Chairs - ${attendant1.full_name}`} />
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
                                        <ArrowLeftRight className="h-5 w-5" />
                                        Switch Chairs
                                    </CardTitle>
                                    <CardDescription>
                                        Switch chair assignments between two attendants
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Current Attendant Info */}
                            <div className="p-4 bg-muted rounded-lg">
                                <h3 className="font-medium mb-3">Current Selection:</h3>
                                <div className="grid gap-3 md:grid-cols-3">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Name</label>
                                        <p className="font-medium">{attendant1.full_name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Current Chair</label>
                                        {getChairDisplay(attendant1)}
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">VIP Status</label>
                                        <Badge variant={
                                            attendant1.vip_status === 'vip' || attendant1.vip_status === 'premium' 
                                                ? 'default' : 'secondary'
                                        }>
                                            {attendant1.vip_status.toUpperCase()}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Switch With Selection */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Switch with
                                        <span className="text-destructive ml-1">*</span>
                                    </label>
                                    <Select value={attendant2Id} onValueChange={setAttendant2Id}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select attendant to switch chairs with" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {otherAttendants.map((attendant) => (
                                                <SelectItem key={attendant.id} value={attendant.id.toString()}>
                                                    <div className="flex items-center justify-between w-full">
                                                        <span>{attendant.full_name}</span>
                                                        <div className="ml-2">
                                                            {getChairDisplay(attendant)}
                                                        </div>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground">
                                        {otherAttendants.length} attendants with chairs available
                                    </p>
                                </div>

                                {/* Preview Switch */}
                                {selectedAttendant2 && (
                                    <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                                        <h4 className="font-medium mb-3 text-blue-900 dark:text-blue-100">Switch Preview:</h4>
                                        <div className="grid gap-3 md:grid-cols-2">
                                            <div className="text-center">
                                                <p className="text-sm font-medium">{attendant1.full_name}</p>
                                                <p className="text-xs text-muted-foreground">will get</p>
                                                {getChairDisplay(selectedAttendant2)}
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm font-medium">{selectedAttendant2.full_name}</p>
                                                <p className="text-xs text-muted-foreground">will get</p>
                                                {getChairDisplay(attendant1)}
                                            </div>
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
                                        disabled={processing || !attendant2Id}
                                        className="flex-1"
                                    >
                                        {processing ? 'Switching...' : 'Switch Chairs'}
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
