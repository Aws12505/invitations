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
    Calendar,
    ExternalLink
} from 'lucide-react';

export default function InvitationNotFound() {
    return (
        <>
            <Head title="الدعوة غير موجودة" />
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4" dir="rtl">
                <div className="w-full max-w-2xl space-y-6">
                    {/* Error Header */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full">
                            <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold tracking-tight text-red-900 dark:text-red-100">
                                الدعوة غير موجودة
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                لم نتمكن من العثور على الدعوة التي تبحث عنها
                            </p>
                        </div>
                    </div>

                    {/* Main Error Card */}
                    <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-900 dark:text-red-100">
                                <Search className="h-5 w-5" />
                                ما الذي حدث خطأ؟
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-red-800 dark:text-red-200">
                                <p className="mb-3">قد لا يعمل رابط الدعوة هذا بسبب:</p>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 shrink-0"></span>
                                        تم إلغاء رابط الدعوة من قبل المنظمين
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
                                        انتهت فترة التسجيل للحدث
                                    </li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Illustration Card */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center space-y-4">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full">
                                    <Calendar className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">تبحث عن دعوة حدث؟</h3>
                                    <p className="text-sm text-muted-foreground">
                                        دعوات الأحداث هي روابط خاصة يرسلها المنظمون لأشخاص محددين
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* What to do next */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <HelpCircle className="h-5 w-5" />
                                كيفية الحصول على دعوة
                            </CardTitle>
                            <CardDescription>
                                اتبع هذه الخطوات للانضمام إلى الحدث
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium mt-1">
                                        1
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium mb-1">تحقق من رسائلك</p>
                                        <p className="text-sm text-muted-foreground">
                                            ابحث عن الدعوة الأصلية في بريدك الإلكتروني أو الرسائل أو وسائل التواصل الاجتماعي
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium mt-1">
                                        2
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium mb-1">تواصل مع المضيف</p>
                                        <p className="text-sm text-muted-foreground">
                                            اطلب من الشخص الذي دعاك إرسال الرابط مرة أخرى
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium mt-1">
                                        3
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium mb-1">اطلب دعوة</p>
                                        <p className="text-sm text-muted-foreground">
                                            إذا كنت تعرف عن الحدث، اطلب من المنظمين رابط دعوة
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium mt-1">
                                        4
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium mb-1">تحقق من الرابط مرة أخرى</p>
                                        <p className="text-sm text-muted-foreground">
                                            تأكد من نسخ الرابط كاملاً بشكل صحيح، بما في ذلك أي رموز خاصة
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tips Card */}
                    <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                                <Users className="h-5 w-5" />
                                نصيحة مهمة
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                روابط الدعوة فريدة وشخصية. لا يمكن تخمينها أو العثور عليها بالبحث. 
                                تحتاج إلى تلقي واحدة مباشرة من شخص لديه إذن لدعوة الضيوف.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                        <Button 
                            onClick={() => window.history.back()}
                            variant="outline"
                            className="flex-1"
                        >
                            <ArrowLeft className="h-4 w-4 ml-2" />
                            العودة
                        </Button>
                        <Button 
                            onClick={() => window.location.reload()}
                            variant="outline"
                            className="flex-1"
                        >
                            <Clock className="h-4 w-4 ml-2" />
                            حاول مرة أخرى
                        </Button>
                    </div>

                    {/* Help footer */}
                    <Card className="bg-muted/30">
                        <CardContent className="pt-6">
                            <div className="text-center space-y-3">
                                <Mail className="h-6 w-6 text-muted-foreground mx-auto" />
                                <div>
                                    <p className="text-sm font-medium">تحتاج مساعدة؟</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        تواصل مع منظمين الحدث إذا كنت تظن أنه يجب أن يكون لديك حق الوصول إلى هذا الرابط
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
