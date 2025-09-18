import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Armchair, Crown, User, Users } from 'lucide-react';
import { ChairStatistics } from '@/types/invitation';

interface Props {
    statistics: ChairStatistics;
}

export default function ChairStatusSummary({ statistics }: Props) {
    const totalOccupancyPercentage = (statistics.total_occupied / statistics.total_chairs) * 100;
    const vipOccupancyPercentage = (statistics.vip_occupied / statistics.vip_total) * 100;
    const regularOccupancyPercentage = (statistics.regular_occupied / statistics.regular_total) * 100;

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Occupancy</CardTitle>
                    <Armchair className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{statistics.total_occupied}/{statistics.total_chairs}</div>
                    <Progress value={totalOccupancyPercentage} className="mt-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                        {Math.round(totalOccupancyPercentage)}% occupied
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">VIP Section</CardTitle>
                    <Crown className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-purple-600">
                        {statistics.vip_occupied}/{statistics.vip_total}
                    </div>
                    <Progress value={vipOccupancyPercentage} className="mt-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                        Chairs 1-250 • {Math.round(vipOccupancyPercentage)}% occupied
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Regular Section</CardTitle>
                    <User className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                        {statistics.regular_occupied}/{statistics.regular_total}
                    </div>
                    <Progress value={regularOccupancyPercentage} className="mt-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                        Chairs 251-360 • {Math.round(regularOccupancyPercentage)}% occupied
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
