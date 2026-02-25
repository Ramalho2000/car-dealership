import Image from 'next/image';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function Logo({
  className,
  width = 120,
  height = 40,
}: LogoProps) {
  return (
    <Image
      src="/logo.svg"
      alt="Car Dealership"
      width={width}
      height={height}
      className={className || 'h-10 w-auto object-contain'}
      style={{ width: 'auto' }}
      priority
    />
  );
}
