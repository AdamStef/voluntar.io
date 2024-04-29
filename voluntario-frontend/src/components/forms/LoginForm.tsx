import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { HTMLProps, useEffect, useRef } from 'react';
import { Spinner } from '../ui/Spinner';
import { postLoginUser } from '@/utils/api/api';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { useAuthContext } from '@/hooks/useAuthContext';

const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type LoginFormValues = z.infer<typeof LoginFormSchema>;

type Props = {
  className?: HTMLProps<HTMLElement>['className'];
};

export const LoginForm: React.FC<Props> = ({ className }) => {
  const { setUser } = useAuthContext();
  const navigate = useNavigate();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
  });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onSubmit = async (data: LoginFormValues) => {
    console.log('Login user: ' + JSON.stringify(data));

    try {
      const res = await postLoginUser(data);
      setUser(res.data);
      navigate('/home');
    } catch (error) {
      console.error('Error logging in user: ' + error);
      const err = error as AxiosError;
      if (err.response?.status == 401) {
        form.reset({ password: '' });
        form.setError('root.serverError', {
          type: 'manual',
          message: 'Wrong credentials.',
        });
      } else {
        console.error(err);
        form.resetField('password', { keepDirty: true });
        form.setError('root.serverError', {
          type: 'manual',
          message: 'Something has gone wrong. Try again.',
        });
      }
    }
  };

  const {
    formState: { errors, isSubmitting },
  } = form;

  return (
    <Form {...form}>
      <form
        className={cn('space-y-3', className)}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl ref={inputRef}>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hasło</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          {isSubmitting && <Spinner className="mr-1 text-white" />}
          Login
        </Button>
        {errors.root?.serverError && (
          <p className="text-center text-sm text-destructive">
            {errors.root.serverError.message}
          </p>
        )}
      </form>
    </Form>
  );
};
