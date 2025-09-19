import { Attendant } from '@/types/invitation';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Calendar, Phone, User, ExternalLink } from 'lucide-react';

interface Props {
    attendant: Attendant;
    statusUrl: string;
}

export default function InvitationSuccess({ attendant, statusUrl }: Props) {
    const copyStatusUrl = () => {
        navigator.clipboard.writeText(statusUrl);
    };

    return (
        <>
            <Head title="تم التسجيل بنجاح" />
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4" dir="rtl">
                <div className="w-full max-w-2xl space-y-6">
                    {/* Success Header */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full">
                            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-green-900 dark:text-green-100">
                            تم التسجيل بنجاح!
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            مرحباً بك في حدث السويداء، {attendant.full_name}
                        </p>
                    </div>

                    {/* Registration Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                تفاصيل التسجيل
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">الاسم الكامل</p>
                                    <p className="font-medium">{attendant.full_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">رقم الهاتف</p>
                                    <p className="font-medium flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        {attendant.phone_number}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">تاريخ التسجيل</p>
                                    <p className="font-medium flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        {new Date(attendant.created_at).toLocaleDateString('ar-SA')}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status Management */}
                    <Card>
                        <CardHeader>
                            <CardTitle>إدارة حالة الحضور</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">
                                استخدم الرابط أدناه لتحديث حالة حضورك في أي وقت قبل الحدث.
                            </p>
                            <div className="flex gap-3">
                                <Button asChild className="flex-1">
                                    <a href={statusUrl} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-4 w-4 ml-2" />
                                        تحديث حالة الحضور
                                    </a>
                                </Button>
                                <Button variant="outline" onClick={copyStatusUrl}>
                                    نسخ الرابط
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                احفظ هذا الرابط - ستحتاجه لتغيير حالة حضورك لاحقاً.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Next Steps */}
                    <Card>
                        <CardHeader>
                            <CardTitle>ما التالي؟</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium">
                                        1
                                    </div>
                                    <div>
                                        <p className="font-medium">احفظ رابط الحالة</p>
                                        <p className="text-sm text-muted-foreground">
                                            ضع إشارة مرجعية أو احفظ رابط حالة الحضور للاستخدام المستقبلي
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium">
                                        2
                                    </div>
                                    <div>
                                        <p className="font-medium">حدث حالتك</p>
                                        <p className="text-sm text-muted-foreground">
                                            أعلمنا إذا كنت ستحضر، أو ربما، أو لن تحضر
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium">
                                        3
                                    </div>
                                    <div>
                                        <p className="font-medium">استمتع بالحدث</p>
                                        <p className="text-sm text-muted-foreground">
                                            لا نطيق الصبر لرؤيتك في حدث السويداء!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
