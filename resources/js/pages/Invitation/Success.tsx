import { Attendant } from '@/types/invitation';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Calendar, Phone, User, MessageCircle, Crown, Sparkles } from 'lucide-react';

interface Props {
    attendant: Attendant;
    whatsappGroupVip: string;
    whatsappGroupRegular: string;
    isVip?: boolean;
}

export default function InvitationSuccess({ attendant, whatsappGroupVip, whatsappGroupRegular, isVip = false }: Props) {
    const whatsappUrl = isVip ? whatsappGroupVip : whatsappGroupRegular;

    return (
        <>
            <Head title="تم التسجيل بنجاح - أصداء السويداء" />
            <div className="min-h-screen bg-gray-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4" dir="rtl">
                <div className="w-full max-w-3xl space-y-6">
                    {/* Logo and Event Header */}
                    <div className="text-center space-y-6">
                        <div className="flex justify-center mb-8">
                            <img 
                                src="/logo.svg" 
                                alt="أصداء السويداء" 
                                className="h-50 w-auto"
                            />
                        </div>
                        
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full shadow-lg mb-6">
                            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        
                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                                تم التسجيل بنجاح!
                            </h1>
                            <p className="text-xl text-gray-700 dark:text-gray-300">
                                مرحباً بك، {attendant.full_name}
                            </p>
                        </div>
                    </div>

                    {/* Main Event Description Card */}
                    <Card className="border shadow-lg">
                        <CardContent className="pt-8 pb-8">
                            <div className="text-center space-y-6 leading-relaxed">
                                <div className="space-y-2">
                                    <p className="text-lg font-semibold text-gray-800">
                                        دعوة لحضور فعالية <span className="font-bold text-gray-900">أصداء السويداء – Echoes of Swaida</span>
                                    </p>
                                </div>
                                
                                <div className="space-y-4 text-gray-700 max-w-4xl mx-auto">
                                    <p className="text-lg font-medium italic text-gray-800 leading-relaxed">
                                        "من قلب الجراح تولد الألوان، ومن بين الصمت تعلو الأصوات."
                                    </p>
                                    
                                    <p className="text-base leading-relaxed">
                                        بعد الأحداث الأليمة التي عصفت بالسويداء، نلتقي لنحوّل الألم إلى إبداع، والدمعة إلى لحن، والرماد إلى فسحة أمل.
                                    </p>
                                    
                                    <p className="text-base leading-relaxed">
                                        ندعوكم للمشاركة في فعالية <span className="font-semibold">أصداء السويداء الفنية – الثقافية – المدنية – الخيرية</span>، 
                                        يوم <span className="font-semibold">السبت 27 أيلول 2025</span>، من الساعة 
                                        <span className="font-semibold"> الثالثة والنصف عصرًا حتى السابعة مساءً</span>، 
                                        في <span className="font-semibold">المركز الثقافي بالسويداء</span>.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Artists Section */}
                    <Card className="border shadow-lg">
                        <CardContent className="pt-6 pb-6">
                            <div className="text-center space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    بمشاركة فنانين ومبدعين يضيئون فضاء السويداء:
                                </h3>
                                <div className="space-y-2 text-gray-700">
                                    <p>- الفنان الأصيل إيهاب بلان</p>
                                    <p>- الفنان التشكيلي القدير عصام الشاطر</p>
                                    <p>- كورال مدى بقيادة الأستاذ معين نفاع</p>
                                    <p>- فرقة سماعي الغنائية</p>
                                    <p>- الفنانة الموهوبة هديل الريشاني</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Final Message */}
                    <Card className="border shadow-lg">
                        <CardContent className="pt-6 pb-6">
                            <div className="text-center space-y-4 text-gray-700 leading-relaxed">
                                <p className="text-base">
                                    إلى جانب معارض فنية ومشاركة واسعة من عدد من الفنانين، 
                                    <span className="font-semibold"> حضوركم معنا ليس مجرد مشاهدة، بل هو رسالة أمل لأهل السويداء</span>، 
                                    ودافعنا لنستمر ونبدع للأفضل.
                                </p>
                                <p className="text-base font-medium">
                                    <span className="font-semibold">كن جزءاً من هذا الصدى معنا، وساعدنا بإيصال ثقافتنا للعالم أجمع</span>
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Guest Information */}
                    <Card className="border shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-800">
                                <User className="h-5 w-5" />
                                معلومات المدعو
                                {/* {isVip && (
                                    <Badge className="bg-gray-800 text-white ml-2">
                                        <Crown className="h-3 w-3 ml-1" />
                                        ضيف مميز
                                    </Badge>
                                )} */}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">الاسم الكامل</p>
                                    <p className="font-bold text-lg text-gray-900">{attendant.full_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">رقم الهاتف</p>
                                    <p className="font-medium flex items-center gap-2 text-gray-900">
                                        <Phone className="h-4 w-4 text-gray-600" />
                                        {attendant.phone_number}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* WhatsApp Group Invitation */}
                    <Card className="border-2 border-green-200 shadow-lg">
                        <CardHeader className="bg-green-50">
                            <CardTitle className="flex items-center gap-2 text-green-800">
                                <MessageCircle className="h-5 w-5" />
                                انضم لمجموعة واتساب الفعالية
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <p className="text-gray-700 text-center">
                                انضم إلى مجموعة واتساب {isVip ? 'المدعوين' : 'المدعوين'} للحصول على آخر التحديثات والتفاصيل
                            </p>
                            <Button 
                                asChild 
                                className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg"
                                size="lg"
                            >
                                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                                    <MessageCircle className="h-5 w-5 ml-2" />
                                    انضم للمجموعة
                                </a>
                            </Button>
                            {/* {isVip && (
                                <div className="text-center">
                                    <Badge className="bg-gray-800 text-white">
                                        <Sparkles className="h-3 w-3 ml-1" />
                                        مجموعة الضيوف المميزين
                                    </Badge>
                                </div>
                            )} */}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
