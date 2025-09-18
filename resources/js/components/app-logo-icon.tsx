import { ImgHTMLAttributes } from 'react';

interface Props extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
    className?: string;
}

export default function AppLogoIcon({ className, alt = "App Logo", ...props }: Props) {
    return (
        <img 
            src="/logo.svg" 
            alt={alt}
            className={className}
            {...props}
        />
    );
}
