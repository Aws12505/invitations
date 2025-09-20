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
    Mail,
    Users,
    Calendar
} from 'lucide-react';

export default function InvitationNotFound() {
    return (
        <>
            <Head title="الدعوة غير موجودة - أصداء السويداء" />
            <div className="min-h-screen bg-gray-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4" dir="rtl">
                <div className="w-full max-w-2xl space-y-6">
                    {/* Logo and Header */}
                    <div className="text-center space-y-4">
                        <div className="flex justify-center mb-6">
                            <img 
                                src="/logo.svg" 
                                alt="أصداء السويداء" 
                                className="h-50 w-auto opacity-60"
                            />
                        </div>
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full shadow-lg">
                            <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold text-red-600">
                                الدعوة غير موجودة
                            </h1>
                            <p className="text-xl text-gray-700 dark:text-gray-300">
                                لم نتمكن من العثور على دعوة أصداء السويداء
                            </p>
                        </div>
                    </div>

                    {/* Main Error Card */}
                    <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-900 dark:text-red-100">
                                <Search className="h-5 w-5" />
                                ما الذي حدث خطأ؟
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-red-800 dark:text-red-200">
                                <p className="mb-3">قد لا تعمل دعوة أصداء السويداء هذه بسبب:</p>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 shrink-0"></span>
                                        تم إلغاء رابط الدعوة من قبل منظمي الفعالية
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 shrink-0"></span>
                                        تم نسخ الرابط أو كتابته بشكل خاطئ
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 shrink-0"></span>
                                        انتهت صلاحية الدعوة أو وصلت إلى حدها
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 shrink-0"></span>
                                        انتهت فترة التسجيل للفعالية
                                    </li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Event Info Card */}
                    <Card className="shadow-lg">
                        <CardContent className="pt-6">
                            <div className="text-center space-y-4">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                                    <Calendar className="h-8 w-8 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-green-800">أصداء السويداء</h3>
                                    <p className="text-sm text-gray-600 mb-2">Echoes of Swaida</p>
                                    <p className="text-sm text-gray-700 font-medium">
                                        فعالية فنية - ثقافية - مدنية - خيرية
                                    </p>
                                    <p className="text-xs text-gray-600 mt-2">
                                        يوم السبت 27 أيلول 2025 • 3:30 - 7:00 PM • المركز الثقافي بالسويداء
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* What to do next */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-800">
                                <HelpCircle className="h-5 w-5" />
                                كيفية الحصول على دعوة صحيحة
                            </CardTitle>
                            <CardDescription>
                                اتبع هذه الخطوات للانضمام إلى فعالية أصداء السويداء
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium mt-1">
                                        1
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium mb-1 text-green-800">تحقق من رسائلك</p>
                                        <p className="text-sm text-gray-600">
                                            ابحث عن الدعوة الأصلية في بريدك الإلكتروني أو الرسائل أو وسائل التواصل الاجتماعي
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium mt-1">
                                        2
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium mb-1 text-gray-800">تواصل مع من دعاك</p>
                                        <p className="text-sm text-gray-600">
                                            اطلب من الشخص الذي دعاك إرسال رابط الدعوة مرة أخرى
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mt-1">
                                        3
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium mb-1 text-blue-800">اطلب دعوة جديدة</p>
                                        <p className="text-sm text-gray-600">
                                            إذا كنت تعرف عن الفعالية، اطلب من المنظمين رابط دعوة جديد
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-sm font-medium mt-1">
                                        4
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium mb-1 text-yellow-800">تحقق من الرابط مرة أخرى</p>
                                        <p className="text-sm text-gray-600">
                                            تأكد من نسخ الرابط كاملاً بشكل صحيح، بما في ذلك أي رموز خاصة
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tips Card */}
                    <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                                <Users className="h-5 w-5" />
                                نصيحة مهمة
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                دعوات أصداء السويداء فريدة وشخصية. لا يمكن تخمينها أو العثور عليها بالبحث. 
                                تحتاج إلى تلقي واحدة مباشرة من شخص لديه إذن لدعوة الضيوف للفعالية.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                        <Button 
                            onClick={() => window.history.back()}
                            variant="outline"
                            className="flex-1 border-green-200 text-green-700 hover:bg-green-50"
                        >
                            <ArrowLeft className="h-4 w-4 ml-2" />
                            العودة
                        </Button>
                        <Button 
                            onClick={() => window.location.reload()}
                            variant="outline"
                            className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50"
                        >
                            <Clock className="h-4 w-4 ml-2" />
                            حاول مرة أخرى
                        </Button>
                    </div>

                    {/* Help footer */}
                    <Card className="bg-gray-100 shadow-lg">
                        <CardContent className="pt-6">
                            <div className="text-center space-y-3">
                                <Mail className="h-6 w-6 text-gray-600 mx-auto" />
                                <div>
                                    <p className="text-sm font-medium text-gray-800">تحتاج مساعدة؟</p>
                                    <p className="text-xs text-gray-600 mt-1">
                                        تواصل مع منظمي فعالية أصداء السويداء إذا كنت تظن أنه يجب أن يكون لديك حق الوصول إلى هذا الرابط
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
