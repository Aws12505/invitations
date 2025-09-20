import { Attendant } from '@/types/invitation';
import { Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Armchair, Crown, User, Plus, Trash2, RotateCcw, ArrowLeftRight } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

interface Props {
    attendant: Attendant;
    showActions?: boolean; // Control whether to show action buttons
}

export default function ChairAssignmentWidget({ attendant, showActions = true }: Props) {
    const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

    const handleAutoAssign = () => {
        router.post(`/chair-assignment/${attendant.id}/auto-assign`, {}, {
            onSuccess: () => {
                toast.success('Chair auto-assigned successfully');
            },
            onError: (errors) => {
                toast.error(errors.chair || 'Failed to auto-assign chair');
            },
        });
    };

    const handleRemoveChair = () => {
        router.delete(`/chair-assignment/${attendant.id}/remove`, {
            onSuccess: () => {
                toast.success('Chair assignment removed');
                setRemoveDialogOpen(false);
            },
            onError: () => {
                toast.error('Failed to remove chair assignment');
            },
        });
    };

    const getChairDisplay = () => {
        if (!attendant.chair_number) {
            return (
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Armchair className="h-5 w-5" />
                    <div>
                        <p className="font-medium">No chair assigned</p>
                        <p className="text-sm">This attendant doesn't have a seat yet</p>
                    </div>
                </div>
            );
        }

        const isVipSection = attendant.chair_number <= 50;
        
        return (
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                    {isVipSection ? (
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <Crown className="h-6 w-6 text-purple-600" />
                        </div>
                    ) : (
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-blue-600" />
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <Badge 
                            variant={isVipSection ? 'default' : 'secondary'}
                            className="text-lg px-3 py-1"
                        >
                            Chair {attendant.chair_number}
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {isVipSection ? 'Section (Chairs 1-50)' : 'Section (Chairs 51-360)'}
                    </p>
                    {attendant.invitation_link && (
                        <p className="text-xs text-muted-foreground mt-1">
                            Grouped with {attendant.invitation_link.full_name}'s invitation
                        </p>
                    )}
                </div>
            </div>
        );
    };

    const getActionButtons = () => {
        if (!showActions) return null;

        if (!attendant.chair_number) {
            return (
                <div className="space-y-2">
                    <Button
                        onClick={handleAutoAssign}
                        className="w-full"
                        size="sm"
                    >
                        <RotateCcw className="h-3 w-3 mr-2" />
                        Auto Assign Chair
                    </Button>
                    <Button
                        variant="outline"
                        asChild
                        className="w-full"
                        size="sm"
                    >
                        <Link href={`/chair-assignment/${attendant.id}/assign`}>
                            <Plus className="h-3 w-3 mr-2" />
                            Choose Specific Chair
                        </Link>
                    </Button>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-3 gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    asChild
                    title="Change chair assignment"
                >
                    <Link href={`/chair-assignment/${attendant.id}/assign`}>
                        <Plus className="h-3 w-3" />
                    </Link>
                </Button>
                {/* <Button
                    variant="outline"
                    size="sm"
                    asChild
                    title="Switch with another attendant"
                >
                    <Link href={`/chair-assignment/${attendant.id}/switch`}>
                        <ArrowLeftRight className="h-3 w-3" />
                    </Link>
                </Button> */}
                <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            title="Remove chair assignment"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Remove Chair Assignment?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will remove Chair #{attendant.chair_number} from {attendant.full_name}. 
                                The chair will become available for other attendants.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={handleRemoveChair}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Remove Chair
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Armchair className="h-5 w-5" />
                    Chair Assignment
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {getChairDisplay()}
                
                {showActions && (
                    <div className="pt-2 border-t">
                        {getActionButtons()}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
