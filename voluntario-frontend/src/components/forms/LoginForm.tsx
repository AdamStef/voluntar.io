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
import { FaSpinner } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';

const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type LoginFormValues = z.infer<typeof LoginFormSchema>;

export const LoginForm = () => {
  const { login } = useAuth();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    console.log('Login user: ' + JSON.stringify(data));
    const err = await login(data);
    if (err) {
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
        className="mx-auto mt-10 max-w-sm space-y-3"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          {isSubmitting && <FaSpinner className="mr-1 animate-spin" />}
          Login
        </Button>
        {errors.root?.serverError && (
          <p className="text-destructive text-center text-sm">
            {errors.root.serverError.message}
          </p>
        )}
      </form>
    </Form>
  );
};
