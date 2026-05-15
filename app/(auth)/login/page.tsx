'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { login } from '@/app/actions/auth-actions';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Force render when component mounts
    if ((window as any).turnstile) {
      setTimeout(() => {
        try {
          (window as any).turnstile.render('.cf-turnstile')
        } catch (e) {
          // Already rendered or other minor error
        }
      }, 300)
    }
  }, []);

  // Determine logo source
  const logoSrc = mounted && (theme === 'dark' || resolvedTheme === 'dark')
    ? "/Logo/File-Slogan SME NEWS-Dark Mode.png"
    : "/Logo/File-Slogan SME NEWS-01.png";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await login(formData);

    if (result.success) {
      toast.success('ចូលប្រព័ន្ធបានជោគជ័យ');
      router.push('/admin');
      router.refresh();
    } else {
      toast.error('ឈ្មោះអ្នកប្រើប្រាស់ ឬលេខសម្ងាត់មិនត្រឹមត្រូវ');
      setLoading(false);
    }
  }

  return (
    <div className="bg-background relative min-h-screen overflow-hidden">
      <div className="from-background absolute -top-10 left-0 h-1/2 w-full rounded-b-full bg-gradient-to-b to-transparent blur"></div>
      <div className="from-primary/10 absolute -top-64 left-0 h-1/2 w-full rounded-full bg-gradient-to-b to-transparent blur-3xl"></div>
      
      <div className="relative z-10 grid min-h-screen grid-cols-1 md:grid-cols-2">
        {/* Left Side - Branding */}
        <motion.div
          className="hidden flex-1 flex-col items-center justify-center space-y-8 p-8 text-center md:flex"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            >
              <Image
                src={logoSrc}
                alt="SME NEWS Logo"
                width={400}
                height={150}
                className="mx-auto h-auto w-full max-w-sm object-contain"
              />
            </motion.div>
            <motion.h1
              className="text-2xl md:text-3xl font-medium leading-tight tracking-tight text-foreground/80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              ចូលរួមចំណែកក្នុងការផ្តល់ព័ត៌មាន <br /> អាជីវកម្ម និងបច្ចេកវិទ្យា
            </motion.h1>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          className="flex flex-1 items-center justify-center p-8"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          >
            <Card className="border-border/70 bg-card/40 w-full shadow-xl backdrop-blur-lg dark:shadow-none rounded-md">
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6 p-8">

                {/* Header */}
                <motion.div
                  className="space-y-2 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
                >
                  <h2 className="text-3xl font-bold tracking-tight">ចូលប្រើប្រាស់</h2>
                  <p className="text-muted-foreground text-sm">
                    សូមបញ្ចូលព័ត៌មានរបស់អ្នកដើម្បីបន្តទៅកាន់ប្រព័ន្ធគ្រប់គ្រងព័ត៌មាន។
                  </p>
                </motion.div>

                {/* Email Input */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
                >
                  <Label htmlFor="username">ឈ្មោះអ្នកប្រើប្រាស់</Label>
                  <Input id="username" name="username" type="text" placeholder="admin" className="rounded-md" required />
                </motion.div>


                {/* Password Input */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6, ease: 'easeOut' }}
                >
                  <Label htmlFor="password">លេខសម្ងាត់</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    className="border-border border rounded-md"
                    required
                  />
                </motion.div>

                {/* Turnstile Widget */}
                <motion.div
                  className="flex justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.65, ease: 'easeOut' }}
                >
                  <div 
                    className="cf-turnstile" 
                    data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} 
                  />
                </motion.div>

                {/* Continue Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7, ease: 'easeOut' }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Button type="submit" className="w-full rounded-md font-medium" disabled={loading}>
                    {loading ? 'កំពុងចូល...' : 'ចូលប្រព័ន្ធ'}
                  </Button>
                </motion.div>


                {/* Divider */}
                <motion.div
                  className="relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8, ease: 'easeOut' }}
                >
                  <div className="absolute inset-0 flex items-center">
                    <div className="border-border w-full border-t"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-card/50 px-2 text-muted-foreground">
                      ឬ
                    </span>
                  </div>
                </motion.div>

                {/* Google Sign In */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9, ease: 'easeOut' }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Button
                    variant="outline"
                    className="w-full rounded-md shadow-sm border-border/60 hover:bg-accent flex items-center justify-center gap-2"
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span>ចូលតាមរយៈ Google</span>
                  </Button>
                </motion.div>

                {/* Footer Links */}
                <motion.div
                  className="text-center text-xs space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.0, ease: 'easeOut' }}
                >
                  <p className="text-muted-foreground">
                    តាមរយៈការចូលប្រើប្រាស់ អ្នកយល់ព្រមតាម{' '}
                    <Link href="#" className="underline hover:text-primary transition-colors">លក្ខខណ្ឌប្រើប្រាស់</Link> និង <Link href="#" className="underline hover:text-primary transition-colors">គោលការណ៍ឯកជនភាព</Link> របស់យើង។
                  </p>
                </motion.div>
                </CardContent>
              </form>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
