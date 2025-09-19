import { InvitationLink } from '@/types/invitation';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Users, Calendar } from 'lucide-react';

interface Props {
    invitationLink: InvitationLink;
}

export default function InvitationLimitReached({ invitationLink }: Props) {
    return (
        <>
            <Head title="تم الوصول لحد الدعوة" />
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4" dir="rtl">
                <div className="w-full max-w-2xl space-y-6">
                    {/* Warning Header */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full">
                            <AlertTriangle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-orange-900 dark:text-orange-100">
                            التسجيل مغلق
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            هذه الدعوة وصلت إلى الحد الأقصى للسعة
                        </p>
                    </div>

                    {/* Invitation Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                تفاصيل الدعوة
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">مدعو من قبل</p>
                                    <p className="font-medium">{invitationLink.full_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">السعة الإجمالية</p>
                                    <p className="font-medium flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        {invitationLink.limit} شخص
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">المسجلين</p>
                                    <p className="font-medium text-orange-600">
                                        {invitationLink.usage} / {invitationLink.limit}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">الحالة</p>
                                    <span className="inline-flex items-center gap-1 text-orange-600 font-medium">
                                        <AlertTriangle className="h-4 w-4" />
                                        السعة ممتلئة
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* What Now */}
                    <Card>
                        <CardHeader>
                            <CardTitle>ماذا يمكنك أن تفعل؟</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium mt-1">
                                        1
                                    </div>
                                    <div>
                                        <p className="font-medium">تواصل مع الداعي</p>
                                        <p className="text-sm text-muted-foreground">
                                            تواصل مع {invitationLink.full_name} لمعرفة إذا كانت هناك ترتيبات بديلة
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium mt-1">
                                        2
                                    </div>
                                    <div>
                                        <p className="font-medium">تحقق مرة أخرى لاحقاً</p>
                                        <p className="text-sm text-muted-foreground">
                                            أحياناً يغير الناس رأيهم وتصبح الأماكن متاحة
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium mt-1">
                                        3
                                    </div>
                                    <div>
                                        <p className="font-medium">انتظر تحديثات الحدث</p>
                                        <p className="text-sm text-muted-foreground">
                                            قد يزيد المنظمون السعة أو ينشئون روابط دعوة إضافية
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sorry Message */}
                    <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
                        <CardContent className="pt-6">
                            <div className="text-center space-y-2">
                                <Calendar className="h-8 w-8 text-orange-600 mx-auto" />
                                <p className="font-medium text-orange-900 dark:text-orange-100">
                                    نأسف لعدم تمكنك من التسجيل في هذا الوقت
                                </p>
                                <p className="text-sm text-orange-700 dark:text-orange-300">
                                    نأمل أن تتمكن من الانضمام إلينا في الاحتفالات المستقبلية!
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
