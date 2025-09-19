import { Attendant } from '@/types/invitation';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Calendar, User, Clock, XCircle } from 'lucide-react';

interface Props {
    attendant: Attendant;
}

export default function AttendanceStatusSuccess({ attendant }: Props) {
    const statusConfig = {
        coming: {
            label: 'سأحضر',
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            message: 'رائع! نحن متحمسون لرؤيتك في الاحتفال.',
        },
        maybe: {
            label: 'ربما',
            icon: Clock,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            message: 'شكراً لإعلامنا. لا تتردد في التحديث عندما تكون متأكداً.',
        },
        not_coming: {
            label: 'لن أحضر',
            icon: XCircle,
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            message: 'سنفتقدك! شكراً لإعلامنا.',
        },
    };

    const currentStatus = attendant.attendance_status;
    const config = currentStatus ? statusConfig[currentStatus] : null;

    if (!config) return null;

    const IconComponent = config.icon;

    return (
        <>
            <Head title="تم تحديث الحالة بنجاح" />
            <div className={`min-h-screen ${config.bgColor} flex items-center justify-center p-4`} dir="rtl">
                <div className="w-full max-w-2xl space-y-6">
                    {/* Success Header */}
                    <div className="text-center space-y-4">
                        <div className={`inline-flex items-center justify-center w-16 h-16 ${config.bgColor} rounded-full border-2 border-current`}>
                            <IconComponent className={`h-8 w-8 ${config.color}`} />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight">
                            تم تحديث الحالة!
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            {config.message}
                        </p>
                    </div>

                    {/* Updated Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                المعلومات المحدثة
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">الاسم</p>
                                    <p className="font-medium">{attendant.full_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">حالة الحضور</p>
                                    <div className="flex items-center gap-2">
                                        <IconComponent className={`h-4 w-4 ${config.color}`} />
                                        <Badge 
                                            variant={
                                                currentStatus === 'coming' ? 'default' :
                                                currentStatus === 'maybe' ? 'secondary' : 'destructive'
                                            }
                                        >
                                            {config.label}
                                        </Badge>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">تاريخ التحديث</p>
                                    <p className="font-medium flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        {new Date().toLocaleDateString('ar-SA')}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status Message */}
                    <Card className={config.bgColor}>
                        <CardContent className="pt-6">
                            <div className="text-center space-y-2">
                                <IconComponent className={`h-8 w-8 ${config.color} mx-auto`} />
                                <p className="font-medium text-lg">{config.message}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Additional Information */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <h3 className="font-medium">معلومات مهمة:</h3>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0"></span>
                                        يمكنك تغيير حالة حضورك في أي وقت قبل الحدث
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0"></span>
                                        احتفظ برابط الحالة للرجوع إليه لاحقاً
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0"></span>
                                        سيتم إرسال تذكير قبل الحدث
                                    </li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Button */}
                    <div className="text-center">
                        <Button 
                            onClick={() => window.close()}
                            variant="outline"
                            size="lg"
                        >
                            إغلاق النافذة
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
