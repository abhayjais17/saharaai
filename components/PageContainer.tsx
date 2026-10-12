import { cn } from '@/lib/utils'

export function PageContainer({ children, className, variant = 'default', ...props }: React.ComponentProps<'div'> & { variant?: 'default' | 'reading' }) {
  return <div className={cn('mx-auto w-full px-4 md:px-8 lg:px-12', variant === 'reading' ? 'max-w-[720px]' : 'max-w-[1200px]', className)} {...props}>{children}</div>
}
