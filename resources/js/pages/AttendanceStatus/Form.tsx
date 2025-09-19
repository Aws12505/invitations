import { useState } from 'react';
import { Attendant, AttendanceStatus } from '@/types/invitation';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { User, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    attendant: Attendant;
    statusOptions: { name: string; value: string }[];
}

export default function AttendanceStatusForm({ attendant }: Props) {
    const [selectedStatus, setSelectedStatus] = useState<AttendanceStatus | ''>('');
    const [processing, setProcessing] = useState(false);

    const statusConfig = {
        coming: {
            label: 'سأحضر',
            description: 'سأحضر الحدث بالتأكيد',
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-50 border-green-200',
        },
        maybe: {
            label: 'ربما',
            description: 'قد أحضر، لست متأكداً بعد',
            icon: Clock,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50 border-yellow-200',
        },
        not_coming: {
            label: 'لن أحضر',
            description: 'لن أتمكن من الحضور',
            icon: XCircle,
            color: 'text-red-600',
            bgColor: 'bg-red-50 border-red-200',
        },
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStatus) {
            toast.error('يرجى اختيار حالة الحضور');
            return;
        }

        setProcessing(true);

        router.patch(`/status/${attendant.status_token}`, {
            attendance_status: selectedStatus,
        }, {
            onSuccess: () => {
                toast.success('تم تحديث حالة الحضور بنجاح!');
            },
            onError: () => {
                toast.error('فشل في تحديث الحالة. يرجى المحاولة مرة أخرى.');
                setProcessing(false);
            },
        });
    };

    return (
        <>
            <Head title={`تحديث الحضور - ${attendant.full_name}`} />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4" dir="rtl">
                <div className="w-full max-w-2xl space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
                            <User className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight">تحديث الحضور</h1>
                        <p className="text-xl text-muted-foreground">
                            مرحباً {attendant.full_name}، يرجى إعلامنا بحالة حضورك
                        </p>
                    </div>

                    {/* Current Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                تفاصيل التسجيل
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">الاسم</p>
                                    <p className="font-medium">{attendant.full_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">الحالة الحالية</p>
                                    {attendant.attendance_status ? (
                                        <Badge 
                                            variant={
                                                attendant.attendance_status === 'coming' ? 'default' :
                                                attendant.attendance_status === 'maybe' ? 'secondary' : 'destructive'
                                            }
                                        >
                                            {statusConfig[attendant.attendance_status].label}
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline">غير محدد</Badge>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status Selection */}
                    <Card>
                        <CardHeader>
                            <CardTitle>اختر حالة حضورك</CardTitle>
                            <CardDescription>
                                اختر الخيار الذي يصف خططك للحضور بشكل أفضل
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <RadioGroup 
                                    value={selectedStatus} 
                                    onValueChange={(value: AttendanceStatus) => setSelectedStatus(value)}
                                    className="space-y-4"
                                >
                                    {Object.entries(statusConfig).map(([value, config]) => {
                                        const IconComponent = config.icon;
                                        return (
                                            <div key={value} className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                                                selectedStatus === value 
                                                    ? `${config.bgColor} border-current` 
                                                    : 'border-border hover:border-primary/20'
                                            }`}>
                                                <Label 
                                                    htmlFor={value} 
                                                    className="flex items-center gap-4 cursor-pointer"
                                                >
                                                    <RadioGroupItem value={value} id={value} />
                                                    <IconComponent className={`h-6 w-6 ${config.color}`} />
                                                    <div className="flex-1">
                                                        <p className="font-medium">{config.label}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {config.description}
                                                        </p>
                                                    </div>
                                                </Label>
                                            </div>
                                        );
                                    })}
                                </RadioGroup>

                                <Button 
                                    type="submit" 
                                    disabled={processing || !selectedStatus}
                                    className="w-full"
                                    size="lg"
                                >
                                    {processing ? 'جاري التحديث...' : 'تحديث حالة الحضور'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Help Text */}
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-sm text-muted-foreground text-center">
                                يمكنك تغيير حالة حضورك في أي وقت قبل الحدث. 
                                هذا يساعدنا على التخطيط بشكل أفضل للاحتفال.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
