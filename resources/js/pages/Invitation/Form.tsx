import { useState } from 'react';
import { InvitationLink } from '@/types/invitation';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, MapPin, Heart } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    invitationLink: InvitationLink;
}

interface AttendantFormData extends Record<string, string> {
    first_name: string;
    father_name: string;
    last_name: string;
    phone_number: string;
}

interface FormErrors {
    first_name?: string;
    father_name?: string;
    last_name?: string;
    phone_number?: string;
}

export default function InvitationForm({ invitationLink }: Props) {
    const [formData, setFormData] = useState<AttendantFormData>({
        first_name: '',
        father_name: '',
        last_name: '',
        phone_number: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate phone number format
        const phoneRegex = /^09\d{8}$/;
        if (!phoneRegex.test(formData.phone_number)) {
            setErrors({ phone_number: 'رقم الهاتف يجب أن يكون 10 أرقام ويبدأ بـ 09' });
            toast.error('يرجى التحقق من تنسيق رقم الهاتف');
            return;
        }

        setProcessing(true);
        setErrors({});

        router.post(`/invitation/${invitationLink.token}`, formData, {
            onError: (errors: FormErrors) => {
                setErrors(errors);
                toast.error('يرجى التحقق من النموذج للأخطاء');
                setProcessing(false);
            },
        });
    };

    const updateFormData = (field: keyof AttendantFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const remainingSlots = invitationLink.limit - invitationLink.usage;

    return (
        <>
            <Head title={`دعوة من ${invitationLink.full_name} - أصداء السويداء`} />
            <div className="min-h-screen bg-gray-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4" dir="rtl">
                <div className="w-full max-w-4xl space-y-8">
                    {/* Logo and Event Header */}
                    <div className="text-center space-y-6">
                        <div className="flex justify-center mb-8">
                            <img 
                                src="/logo.svg" 
                                alt="أصداء السويداء" 
                                className="h-50 w-auto"
                            />
                        </div>
                        
                        <div className="inline-flex items-center gap-2 bg-green-50 text-green-800 px-4 py-2 rounded-full border">
                            <Heart className="h-4 w-4" />
                            <span className="font-medium text-sm">أنت مدعو لحضور فعالية</span>
                        </div>
                    </div>

                    {/* Main Event Description */}
                    <Card className="border shadow-lg">
                        <CardContent className="pt-8 pb-8">
                            <div className="text-center space-y-6 leading-relaxed">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                        أصداء السويداء – Echoes of Swaida
                                    </h1>
                                </div>
                                
                                <div className="space-y-5 text-gray-700 max-w-5xl mx-auto text-base leading-relaxed">
                                    <p className="text-lg font-medium italic text-gray-800">
                                        "من قلب الجراح تولد الألوان، ومن بين الصمت تعلو الأصوات."
                                    </p>
                                    
                                    <p>
                                        بعد الأحداث الأليمة التي عصفت بالسويداء، نلتقي لنحوّل الألم إلى إبداع، والدمعة إلى لحن، والرماد إلى فسحة أمل.
                                    </p>
                                    
                                    <p>
                                        ندعوكم للمشاركة في فعالية <span className="font-semibold">أصداء السويداء الفنية – الثقافية – المدنية – الخيرية</span>، 
                                        يوم <span className="font-semibold">السبت 27 أيلول 2025</span>، من الساعة 
                                        <span className="font-semibold"> الثالثة والنصف عصرًا حتى السابعة مساءً</span>، 
                                        في <span className="font-semibold">المركز الثقافي بالسويداء</span>.
                                    </p>
                                    
                                    <div className="py-2">
                                        <p className="font-medium text-gray-800 mb-3">
                                            بمشاركة فنانين ومبدعين يضيئون فضاء السويداء:
                                        </p>
                                        <div className="space-y-1">
                                            <p>- الفنان الأصيل إيهاب بلان</p>
                                            <p>- الفنان التشكيلي القدير عصام الشاطر</p>
                                            <p>- كورال مدى بقيادة الأستاذ معين نفاع</p>
                                            <p>- فرقة سماعي الغنائية</p>
                                            <p>- الفنانة الموهوبة هديل الريشاني</p>
                                        </div>
                                    </div>
                                    
                                    <p>
                                        إلى جانب معارض فنية ومشاركة واسعة من عدد من الفنانين، 
                                        <span className="font-semibold"> حضوركم معنا ليس مجرد مشاهدة، بل هو رسالة أمل لأهل السويداء</span>، 
                                        ودافعنا لنستمر ونبدع للأفضل.
                                    </p>
                                    
                                    <p className="font-medium text-gray-800">
                                        <span className="font-semibold">كن جزءاً من هذا الصدى معنا، وساعدنا بإيصال ثقافتنا للعالم أجمع</span>
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Event Quick Info */}
                    <Card className="border shadow-lg">
                        <CardContent className="pt-6">
                            <div className="grid gap-4 md:grid-cols-3 text-center">
                                <div className="space-y-2">
                                    <Calendar className="h-6 w-6 text-gray-600 mx-auto" />
                                    <div>
                                        <p className="font-semibold text-gray-900">يوم السبت 27 أيلول 2025</p>
                                        <p className="text-sm text-gray-600">3:30 PM - 7:00 PM</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <MapPin className="h-6 w-6 text-gray-600 mx-auto" />
                                    <div>
                                        <p className="font-semibold text-gray-900">المركز الثقافي</p>
                                        <p className="text-sm text-gray-600">السويداء</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Users className="h-6 w-6 text-gray-600 mx-auto" />
                                    <div>
                                        <p className="font-semibold text-gray-900">{remainingSlots} مقعد متاح</p>
                                        <p className="text-sm text-gray-600">مدعو من {invitationLink.full_name}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Registration Form */}
                    <Card className="border-2 border-green-200 shadow-lg">
                        <CardHeader className="bg-green-50">
                            <CardTitle className="text-green-800">أكمل تسجيلك</CardTitle>
                            <CardDescription className="text-green-700">
                                يرجى ملء بياناتك لتأكيد حضورك لهذه الفعالية المميزة
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField
                                        id="first_name"
                                        name="first_name"
                                        label="الاسم الأول"
                                        value={formData.first_name}
                                        onChange={(e) => updateFormData('first_name', e.target.value)}
                                        error={errors.first_name}
                                        required
                                        placeholder="أدخل اسمك الأول"
                                    />
                                    <FormField
                                        id="father_name"
                                        name="father_name"
                                        label="اسم الأب"
                                        value={formData.father_name}
                                        onChange={(e) => updateFormData('father_name', e.target.value)}
                                        error={errors.father_name}
                                        required
                                        placeholder="أدخل اسم والدك"
                                    />
                                </div>

                                <FormField
                                    id="last_name"
                                    name="last_name"
                                    label="اسم العائلة"
                                    value={formData.last_name}
                                    onChange={(e) => updateFormData('last_name', e.target.value)}
                                    error={errors.last_name}
                                    required
                                    placeholder="أدخل اسم عائلتك"
                                />

                                <FormField
                                    id="phone_number"
                                    name="phone_number"
                                    type="tel"
                                    label="رقم الهاتف"
                                    value={formData.phone_number}
                                    onChange={(e) => updateFormData('phone_number', e.target.value)}
                                    error={errors.phone_number}
                                    required
                                    placeholder="0912345678"
                                    description="رقم الهاتف يجب أن يكون 10 أرقام ويبدأ بـ 09"
                                />

                                <Button 
                                    type="submit" 
                                    disabled={processing || remainingSlots === 0}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg"
                                    size="lg"
                                >
                                    {processing ? 'جاري التسجيل...' : 'إكمال التسجيل'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
