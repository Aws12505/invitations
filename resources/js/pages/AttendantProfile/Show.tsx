import { Attendant } from '@/types/invitation';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
    User, 
    Phone, 
    Calendar, 
    Crown, 
    Users,
    MapPin,
    CheckCircle,
    XCircle,
    Clock,
    UserCheck,
    UserX,
    Armchair,
    Shield,
    Sparkles,
    Star,
    Award,
    TrendingUp,
    Heart
} from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

interface Props {
    attendant: Attendant;
    isAuthenticated: boolean;
}

export default function AttendantProfileShow({ attendant, isAuthenticated }: Props) {
    const [processing, setProcessing] = useState(false);

    const handleToggleAttended = () => {
        if (!isAuthenticated) {
            toast.error('المصادقة مطلوبة');
            return;
        }

        setProcessing(true);

        router.patch(`/profile/${attendant.qr_token}/toggle-attended`, {}, {
            onSuccess: () => {
                const message = !attendant.attended 
                    ? `تم تسجيل ${attendant.full_name} كحاضر` 
                    : `تم تسجيل ${attendant.full_name} كغير حاضر`;
                toast.success(message);
            },
            onError: (errors) => {
                toast.error(errors.auth || 'فشل في تحديث حالة الحضور');
            },
            onFinish: () => setProcessing(false),
        });
    };

    const getStatusInfo = (status: string | null) => {
        switch (status) {
            case 'coming':
                return {
                    label: 'سأحضر',
                    icon: CheckCircle,
                    className: 'text-green-600 bg-green-50 border-green-200',
                };
            case 'maybe':
                return {
                    label: 'ربما',
                    icon: Clock,
                    className: 'text-yellow-600 bg-yellow-50 border-yellow-200',
                };
            case 'not_coming':
                return {
                    label: 'لن أحضر',
                    icon: XCircle,
                    className: 'text-red-600 bg-red-50 border-red-200',
                };
            default:
                return {
                    label: 'لا يوجد رد',
                    icon: Clock,
                    className: 'text-gray-600 bg-gray-50 border-gray-200',
                };
        }
    };

    const statusInfo = getStatusInfo(attendant.attendance_status);
    const StatusIcon = statusInfo.icon;

    const getChairDisplay = () => {
        if (!attendant.chair_number) {
            return (
                <div className="text-center py-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Armchair className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                        لم يتم تعيين كرسي
                    </h3>
                    <p className="text-muted-foreground">
                        سيتم تعيين مقعدك عند الوصول إلى الحدث
                    </p>
                </div>
            );
        }

        const isVip = false;
        return (
            <div className="flex flex-col items-center justify-center p-6">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg ring-4 ring-white/50 dark:ring-gray-800/50 ${
                    isVip 
                        ? 'bg-gradient-to-br from-purple-500 to-pink-600' 
                        : 'bg-gradient-to-br from-blue-500 to-cyan-600'
                }`}>
                    {isVip ? (
                        <Crown className="h-10 w-10 text-white" />
                    ) : (
                        <User className="h-10 w-10 text-white" />
                    )}
                </div>
                
                <div className="text-center">
                    <Badge 
                        variant={isVip ? 'default' : 'secondary'}
                        className="text-xl px-6 py-3 mb-3 font-bold animate-pulse"
                    >
                        كرسي {attendant.chair_number}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                        {isVip ? 'مقعد VIP مميز' : 'مقعدك المخصص'}
                    </p>
                </div>
                
                {isVip && (
                    <div className="mt-4 flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 rounded-full">
                        <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                        <span className="text-sm text-yellow-700 dark:text-yellow-300">ضيف مميز</span>
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <Head title={`${attendant.full_name} - دعوة زفاف`} />
            <div className="min-h-screen  from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:to-gray-800" dir="rtl">
                {/* Header */}
                <div className="bg-white dark:bg-gray-900 border-b shadow-sm">
                    <div className="max-w-4xl mx-auto px-4 py-6">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                                حدث السويداء
                            </h1>
                            <p className="text-xl text-muted-foreground mt-2">
                                معلومات الضيف
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Profile Information */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Guest Details */}
                            <Card className="relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full -translate-y-16 translate-x-16" />
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full translate-y-12 -translate-x-12" />
                                
                                <CardHeader className="relative z-10">
                                    <CardTitle className="flex items-center gap-2 text-2xl">
                                        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                                            <User className="h-6 w-6 text-white" />
                                        </div>
                                        معلومات الضيف
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6 relative z-10">
                                    <div className="text-center">
                                        <div className="w-28 h-28 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg ring-4 ring-white/50 dark:ring-gray-800/50">
                                            <User className="h-12 w-12 text-white" />
                                        </div>
                                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                            {attendant.full_name}
                                        </h2>
                                        <p className="text-muted-foreground mt-2">ضيف مميز في حدث السويداء</p>
                                    </div>

                                    <Separator className="my-6" />

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 p-4 rounded-lg">
                                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                                                <Phone className="h-4 w-4" />
                                                رقم الهاتف
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-lg text-gray-900 dark:text-white">
                                                    {attendant.phone_number}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 p-4 rounded-lg">
                                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                                                <Calendar className="h-4 w-4" />
                                                تاريخ التسجيل
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-lg text-gray-900 dark:text-white">
                                                    {new Date(attendant.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {attendant.invitation_link && (
                                        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 p-4 rounded-lg">
                                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                                                <Users className="h-4 w-4" />
                                                مدعو من قبل
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-lg text-gray-900 dark:text-white">
                                                    {attendant.invitation_link.full_name}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Chair Assignment */}
                            <Card className="relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full -translate-x-8 -translate-y-8" />
                                <CardHeader className="relative z-10">
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
                                            <Armchair className="h-5 w-5 text-white" />
                                        </div>
                                        ترتيب الجلوس
                                    </CardTitle>
                                    <CardDescription>
                                        الموقع المخصص للضيف في القاعة
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="relative z-10">
                                    {getChairDisplay()}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Status Sidebar */}
                        <div className="space-y-6">
                            {/* RSVP Status */}
                            <Card className="relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full -translate-y-8 translate-x-8" />
                                <CardHeader className="relative z-10">
                                    <CardTitle className="flex items-center gap-2">
                                        <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                                            <TrendingUp className="h-5 w-5 text-white" />
                                        </div>
                                        حالة الرد
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="relative z-10">
                                    <div className={`p-6 rounded-xl shadow-sm transition-all duration-300 hover:scale-105 ${
                                        statusInfo.className.includes('green') 
                                            ? 'hover:shadow-green-200/50' 
                                            : statusInfo.className.includes('yellow')
                                            ? 'hover:shadow-yellow-200/50'
                                            : statusInfo.className.includes('red')
                                            ? 'hover:shadow-red-200/50'
                                            : 'hover:shadow-gray-200/50'
                                    } ${statusInfo.className}`}>
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="p-3 rounded-full bg-white/80">
                                                <StatusIcon className="h-8 w-8" />
                                            </div>
                                            <span className="text-xl font-bold">{statusInfo.label}</span>
                                        </div>
                                        {attendant.attendance_status && (
                                            <p className="text-sm opacity-90 flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                آخر تحديث: {new Date(attendant.updated_at).toLocaleDateString('ar-SA')}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actual Attendance */}
                            <Card className="relative overflow-hidden">
                                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full translate-y-8 -translate-x-8" />
                                <CardHeader className="relative z-10">
                                    <CardTitle className="flex items-center gap-2">
                                        <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
                                            <UserCheck className="h-5 w-5 text-white" />
                                        </div>
                                        حضور الحدث
                                    </CardTitle>
                                    <CardDescription>
                                        حالة الحضور الفعلية
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 relative z-10">
                                    <div className={`p-6 rounded-xl shadow-sm transition-all duration-300 ${
                                        attendant.attended 
                                            ? 'text-green-700 bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 hover:shadow-green-200/50 hover:scale-105'
                                            : 'text-gray-700 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 hover:shadow-gray-200/50'
                                    } border`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-full ${
                                                attendant.attended 
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-700'
                                            }`}>
                                                {attendant.attended ? (
                                                    <UserCheck className="h-8 w-8" />
                                                ) : (
                                                    <UserX className="h-8 w-8" />
                                                )}
                                            </div>
                                            <div>
                                                <span className="text-xl font-bold block">
                                                    {attendant.attended ? 'حضر' : 'لم يحضر'}
                                                </span>
                                                <span className="text-sm opacity-80">
                                                    {attendant.attended ? 'تم تسجيل الحضور' : 'في انتظار الحضور'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Admin Toggle Button */}
                                    {isAuthenticated && (
                                        <Button 
                                            onClick={handleToggleAttended}
                                            disabled={processing}
                                            variant={attendant.attended ? "outline" : "default"}
                                            className="w-full transition-all duration-300 hover:scale-105 relative overflow-hidden group"
                                            size="lg"
                                        >
                                            <div className={`absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ${
                                                processing ? 'animate-pulse' : ''
                                            }`} />
                                            
                                            <div className="relative z-10 flex items-center justify-center">
                                                {processing ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2" />
                                                        جاري التحديث...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Shield className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:scale-110" />
                                                        تسجيل كـ {attendant.attended ? 'غير حاضر' : 'حاضر'}
                                                    </>
                                                )}
                                            </div>
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-white dark:bg-gray-900 border-t mt-12">
                    <div className="max-w-4xl mx-auto px-4 py-8 text-center">
                        <p className="text-muted-foreground">
                            لا نطيق الصبر للاحتفال معك!
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
