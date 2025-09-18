import { useState } from 'react';
import { Attendant } from '@/types/invitation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QrCode, Download, ExternalLink, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    attendant: Attendant;
    size?: 'sm' | 'md' | 'lg';
}

export default function QrCodeDisplay({ attendant, size = 'md' }: Props) {
    const [qrCode, setQrCode] = useState<string>('');
    const [loading, setLoading] = useState(false);

    // Generate the profile URL
    const profileUrl = `/profile/${attendant.qr_token}`;
    const fullProfileUrl = `${window.location.origin}${profileUrl}`;

    const generateQrCode = async () => {
        if (qrCode) return; // Already generated

        setLoading(true);
        try {
            const response = await fetch(`/attendants/${attendant.id}/qr-code`);
            const svgContent = await response.text();
            setQrCode(svgContent);
        } catch (error) {
            toast.error('Failed to generate QR code');
            console.error('QR code generation error:', error);
        } finally {
            setLoading(false);
        }
    };

    const copyProfileUrl = async () => {
        try {
            await navigator.clipboard.writeText(fullProfileUrl);
            toast.success('Profile URL copied to clipboard!');
        } catch (error) {
            // Fallback for browsers that don't support clipboard API
            const textArea = document.createElement('textarea');
            textArea.value = fullProfileUrl;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                toast.success('Profile URL copied to clipboard!');
            } catch (err) {
                toast.error('Failed to copy URL');
            }
            document.body.removeChild(textArea);
        }
    };

    const downloadQrCode = async (format: 'jpg') => {
    if (!qrCode) {
        toast.error('QR code not generated yet');
        return;
    }

    try {
        // Create canvas with high resolution
        const canvas = document.createElement('canvas');
        const scale = 2; // Higher resolution
        const size = 400 * scale;
        
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('Could not get canvas context');
        }

        // Scale for high quality
        ctx.scale(scale, scale);

        const img = new Image();
        
        img.onload = function() {
            // White background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, 400, 400);
            
            // Draw QR code
            ctx.drawImage(img, 0, 0, 400, 400);
            
            // Convert to desired format
            const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
            const quality = format === 'jpg' ? 0.95 : 1.0;
            const dataUrl = canvas.toDataURL(mimeType, quality);
            
            // Download
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `${attendant.full_name.replace(/\s+/g, '_')}_QR_Code.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            toast.success(`QR code downloaded as ${format.toUpperCase()}`);
        };

        img.onerror = function() {
            toast.error('Failed to process QR code');
        };

        // Convert SVG to data URL
        const svgBlob = new Blob([qrCode], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        img.src = svgUrl;

        // Clean up
        setTimeout(() => URL.revokeObjectURL(svgUrl), 1000);
        
    } catch (error) {
        toast.error('Failed to download QR code');
        console.error('Download error:', error);
    }
};
    const buttonSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default';
    const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button 
                    variant="outline" 
                    size={buttonSize}
                    onClick={generateQrCode}
                    disabled={loading}
                >
                    <QrCode className={`${iconSize} mr-2`} />
                    {loading ? 'Generating...' : 'QR Code'}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>QR Code - {attendant.full_name}</DialogTitle>
                    <DialogDescription>
                        Scan this QR code to view the attendant's profile
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                    {/* Profile URL Display */}
                    <div className="p-3 bg-muted rounded-lg">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Profile URL:</p>
                        <p className="text-sm break-all">{fullProfileUrl}</p>
                    </div>

                    {/* QR Code Display */}
                    <div className="flex flex-col items-center space-y-4">
                        {qrCode ? (
                            <div 
                                className="p-4 bg-white rounded-lg border shadow-sm"
                                dangerouslySetInnerHTML={{ __html: qrCode }}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-64 w-full border-2 border-dashed border-muted-foreground/25 rounded-lg">
                                <div className="text-center text-muted-foreground">
                                    <QrCode className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    {loading ? (
                                        <p>Generating QR code...</p>
                                    ) : (
                                        <p>Click "QR Code" to generate</p>
                                    )}
                                </div>
                            </div>
                        )}
                        
                        {/* Action Buttons */}
                        <div className="grid grid-cols-3 gap-2 w-full">
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => downloadQrCode('jpg')}
                                disabled={!qrCode}
                            >
                                <Download className="h-3 w-3 mr-1" />
                                Download
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={copyProfileUrl}
                            >
                                <Copy className="h-3 w-3 mr-1" />
                                Copy URL
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm"
                                asChild
                            >
                                <a 
                                    href={profileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    View
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
