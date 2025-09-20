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
    Star
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
                    <div className="w-20 h-20 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Armchair className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                        لم يتم تعيين كرسي
                    </h3>
                    <p className="text-gray-500">
                        سيتم تعيين مقعدك عند الوصول إلى الفعالية
                    </p>
                </div>
            );
        }

        const isVip = false;
        return (
            <div className="flex flex-col items-center justify-center p-6">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg ${
                    isVip 
                        ? 'bg-gray-800' 
                        : 'bg-green-600'
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
                        className="text-xl px-6 py-3 mb-3 font-bold bg-green-600 text-white"
                    >
                        كرسي {attendant.chair_number}
                    </Badge>
                    <p className="text-sm text-gray-600">
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
            <Head title={`${attendant.full_name} - أصداء السويداء`} />
            <div className="min-h-screen bg-gray-50 dark:from-gray-900 dark:to-gray-800" dir="rtl">
                {/* Header */}
                <div className="bg-white dark:bg-gray-900 border-b shadow-sm">
                    <div className="max-w-4xl mx-auto px-4 py-6">
                        <div className="text-center space-y-4">
                            <div className="flex justify-center mb-4">
                                <img 
                                    src="/logo.svg" 
                                    alt="أصداء السويداء" 
                                    className="h-35 w-auto"
                                />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                أصداء السويداء
                            </h1>
                            <p className="text-xl text-gray-600">
                                معلومات الضيف
                            </p>
                            <div className="inline-flex items-center gap-2 bg-green-50 text-green-800 px-4 py-2 rounded-full border">
                                <Calendar className="h-4 w-4" />
                                <span className="text-sm font-medium">يوم السبت 27 أيلول 2025 • 3:30 - 7:00 PM</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Main Profile Information */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Guest Details */}
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-2xl text-gray-800">
                                        <div className="p-2 bg-green-600 rounded-lg">
                                            <User className="h-6 w-6 text-white" />
                                        </div>
                                        معلومات الضيف
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="text-center">
                                        <div className="w-28 h-28 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                            <User className="h-12 w-12 text-white" />
                                        </div>
                                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                            {attendant.full_name}
                                        </h2>
                                        <p className="text-gray-600 mt-2">ضيف مميز في أصداء السويداء</p>
                                    </div>

                                    <Separator className="my-6" />

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                                                <Phone className="h-4 w-4" />
                                                رقم الهاتف
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-lg text-gray-900">
                                                    {attendant.phone_number}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                                                <Calendar className="h-4 w-4" />
                                                تاريخ التسجيل
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-lg text-gray-900">
                                                    {new Date(attendant.created_at).toLocaleDateString('en-US')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {attendant.invitation_link && (
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <label className="text-sm font-medium text-blue-700 flex items-center gap-2 mb-2">
                                                <Users className="h-4 w-4" />
                                                مدعو من قبل
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-lg text-blue-900">
                                                    {attendant.invitation_link.full_name}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Event Details */}
                            <Card className="shadow-lg">
                                <CardHeader className="bg-green-50">
                                    <CardTitle className="flex items-center gap-2 text-green-800">
                                        <MapPin className="h-5 w-5" />
                                        تفاصيل الفعالية
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="grid gap-4">
                                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                            <Calendar className="h-5 w-5 text-green-600" />
                                            <div>
                                                <p className="font-bold text-green-900">يوم السبت 27 أيلول 2025</p>
                                                <p className="text-sm text-green-700">3:30 PM - 7:00 PM</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <MapPin className="h-5 w-5 text-gray-600" />
                                            <div>
                                                <p className="font-bold text-gray-900">المركز الثقافي بالسويداء</p>
                                                <p className="text-sm text-gray-700">فعالية فنية ثقافية مدنية خيرية</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Chair Assignment */}
                            <Card className="shadow-lg">
                                <CardHeader className="bg-blue-50">
                                    <CardTitle className="flex items-center gap-2 text-xl text-blue-800">
                                        <div className="p-2 bg-blue-600 rounded-lg">
                                            <Armchair className="h-5 w-5 text-white" />
                                        </div>
                                        ترتيب الجلوس
                                    </CardTitle>
                                    <CardDescription>
                                        الموقع المخصص للضيف في القاعة
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {getChairDisplay()}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Status Sidebar */}
                        <div className="space-y-6">
                            {/* RSVP Status */}
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-green-800">
                                        <div className="p-2 bg-green-600 rounded-lg">
                                            <CheckCircle className="h-5 w-5 text-white" />
                                        </div>
                                        حالة الرد
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className={`p-6 rounded-xl shadow-sm border ${statusInfo.className}`}>
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="p-3 rounded-full bg-white/80">
                                                <StatusIcon className="h-8 w-8" />
                                            </div>
                                            <span className="text-xl font-bold">{statusInfo.label}</span>
                                        </div>
                                        {attendant.attendance_status && (
                                            <p className="text-sm opacity-90 flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                آخر تحديث: {new Date(attendant.updated_at).toLocaleDateString('en-US')}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actual Attendance */}
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-blue-800">
                                        <div className="p-2 bg-blue-600 rounded-lg">
                                            <UserCheck className="h-5 w-5 text-white" />
                                        </div>
                                        حضور الفعالية
                                    </CardTitle>
                                    <CardDescription>
                                        حالة الحضور الفعلية
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className={`p-6 rounded-xl shadow-sm border ${
                                        attendant.attended 
                                            ? 'text-green-700 bg-green-50 border-green-200'
                                            : 'text-gray-700 bg-gray-50 border-gray-200'
                                    }`}>
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
                                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                                            size="lg"
                                        >
                                            {processing ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2" />
                                                    جاري التحديث...
                                                </>
                                            ) : (
                                                <>
                                                    <Shield className="h-5 w-5 ml-2" />
                                                    تسجيل كـ {attendant.attended ? 'غير حاضر' : 'حاضر'}
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-100 border-t mt-12">
                    <div className="max-w-4xl mx-auto px-4 py-8 text-center">
                        <p className="text-lg font-semibold text-gray-800 mb-2">
                            لا نطيق الصبر للاحتفال معك في أصداء السويداء!
                        </p>
                        <p className="text-gray-700 italic">
                            كن جزءاً من هذا الصدى معنا، وساعدنا بإيصال ثقافتنا للعالم أجمع
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
