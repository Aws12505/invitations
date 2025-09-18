import { Badge } from '@/components/ui/badge';
import { Crown, User, Armchair } from 'lucide-react';

interface Props {
    chairNumber: number | null;
    size?: 'sm' | 'md' | 'lg';
    showSection?: boolean;
}

export default function ChairDisplay({ chairNumber, size = 'md', showSection = false }: Props) {
    if (!chairNumber) {
        return (
            <div className="flex items-center gap-1 text-muted-foreground">
                <Armchair className="h-3 w-3" />
                <Badge variant="outline" className="text-xs">
                    No Chair
                </Badge>
            </div>
        );
    }

    const isVip = chairNumber <= 250;
    const iconSize = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';
    const badgeSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-sm' : 'text-xs';

    return (
        <div className="flex items-center gap-1">
            {isVip ? (
                <Crown className={`${iconSize} text-purple-600`} />
            ) : (
                <User className={`${iconSize} text-blue-600`} />
            )}
            <Badge 
                variant={isVip ? 'default' : 'secondary'}
                className={badgeSize}
            >
                #{chairNumber}
            </Badge>
            {showSection && (
                <span className="text-xs text-muted-foreground ml-1">
                    ({isVip ? 'VIP' : 'Regular'})
                </span>
            )}
        </div>
    );
}
