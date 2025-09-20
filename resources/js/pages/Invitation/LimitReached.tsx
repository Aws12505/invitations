import { InvitationLink } from '@/types/invitation';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Users, Calendar, Heart } from 'lucide-react';

interface Props {
    invitationLink: InvitationLink;
}

export default function InvitationLimitReached({ invitationLink }: Props) {
    return (
        <>
            <Head title="تم الوصول لحد الدعوة - أصداء السويداء" />
            <div className="min-h-screen bg-gray-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4" dir="rtl">
                <div className="w-full max-w-2xl space-y-6">
                    {/* Logo and Header */}
                    <div className="text-center space-y-4">
                        <div className="flex justify-center mb-6">
                            <img 
                                src="/logo.svg" 
                                alt="أصداء السويداء" 
                                className="h-50 w-auto opacity-70"
                            />
                        </div>
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full shadow-lg">
                            <AlertTriangle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                        </div>
                        <h1 className="text-4xl font-bold text-orange-600">
                            التسجيل مغلق
                        </h1>
                        <p className="text-xl text-gray-700 dark:text-gray-300">
                            هذه الدعوة لأصداء السويداء وصلت إلى الحد الأقصى للسعة
                        </p>
                    </div>

                    {/* Event Info Card */}
                    <Card className="shadow-lg border-l-4 border-l-green-500">
                        <CardHeader className="bg-green-50">
                            <CardTitle className="flex items-center gap-2 text-green-800">
                                <Calendar className="h-5 w-5" />
                                عن الفعالية
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="text-center space-y-3">
                                <h3 className="text-2xl font-bold text-gray-900">
                                    أصداء السويداء
                                </h3>
                                <p className="text-lg text-gray-600 font-medium">Echoes of Swaida</p>
                                <p className="text-gray-700 font-medium">فعالية فنية - ثقافية - مدنية - خيرية</p>
                                <div className="bg-green-50 p-3 rounded-lg">
                                    <p className="text-green-800 font-medium">يوم السبت 27 أيلول 2025</p>
                                    <p className="text-green-700">3:30 PM - 7:00 PM</p>
                                    <p className="text-green-600 text-sm">المركز الثقافي بالسويداء</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Invitation Details */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-800">
                                <Users className="h-5 w-5" />
                                تفاصيل الدعوة
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <p className="text-sm font-medium text-blue-700 mb-1">مدعو من قبل</p>
                                    <p className="font-bold text-blue-900">{invitationLink.full_name}</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <p className="text-sm font-medium text-green-700 mb-1">السعة الإجمالية</p>
                                    <p className="font-bold text-green-900 flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        {invitationLink.limit} شخص
                                    </p>
                                </div>
                                <div className="bg-orange-50 p-4 rounded-lg">
                                    <p className="text-sm font-medium text-orange-700 mb-1">المسجلين</p>
                                    <p className="font-bold text-orange-900">
                                        {invitationLink.usage} / {invitationLink.limit}
                                    </p>
                                </div>
                                <div className="bg-red-50 p-4 rounded-lg">
                                    <p className="text-sm font-medium text-red-700 mb-1">الحالة</p>
                                    <span className="inline-flex items-center gap-1 text-red-600 font-bold">
                                        <AlertTriangle className="h-4 w-4" />
                                        السعة ممتلئة
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* What Now */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-green-800">ماذا يمكنك أن تفعل؟</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium mt-1">
                                        1
                                    </div>
                                    <div>
                                        <p className="font-medium text-green-800">تواصل مع الداعي</p>
                                        <p className="text-sm text-gray-600">
                                            تواصل مع {invitationLink.full_name} لمعرفة إذا كانت هناك ترتيبات بديلة للفعالية
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium mt-1">
                                        2
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">تحقق مرة أخرى لاحقاً</p>
                                        <p className="text-sm text-gray-600">
                                            أحياناً يغير الناس رأيهم وتصبح الأماكن متاحة في أصداء السويداء
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mt-1">
                                        3
                                    </div>
                                    <div>
                                        <p className="font-medium text-blue-800">انتظر تحديثات الفعالية</p>
                                        <p className="text-sm text-gray-600">
                                            قد يزيد المنظمون السعة أو ينشئون روابط دعوة إضافية لفعالية أصداء السويداء
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Message Card */}
                    <Card className="border-2 border-orange-200 bg-orange-50 shadow-lg">
                        <CardContent className="pt-6">
                            <div className="text-center space-y-4">
                                <Heart className="h-12 w-12 text-orange-600 mx-auto" />
                                <div>
                                    <p className="font-bold text-lg text-orange-900 mb-2">
                                        نأسف لعدم تمكنك من التسجيل في أصداء السويداء
                                    </p>
                                    <p className="text-orange-800 mb-3">
                                        "من قلب الجراح تولد الألوان، ومن بين الصمت تعلو الأصوات"
                                    </p>
                                    <p className="text-sm text-orange-700">
                                        نأمل أن تتمكن من الانضمام إلينا في الفعاليات المستقبلية لنحوّل الألم إلى إبداع معاً!
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Footer Message */}
                    <Card className="bg-gray-100 shadow-lg">
                        <CardContent className="pt-6 text-center">
                            <p className="text-gray-800 font-medium italic">
                                كن جزءاً من هذا الصدى معنا، وساعدنا بإيصال ثقافتنا للعالم أجمع
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
