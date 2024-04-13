import axiosClient from '@/utils/api/axios';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { RadioGroup } from '@radix-ui/react-radio-group';
import { useForm } from 'react-hook-form';
import { FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { RadioGroupItem } from '../ui/radio-group';
import React, { HTMLProps } from 'react';
import { cn } from '@/lib/utils';

const validationSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    passwordConfirmation: z.string().min(8),
    roles: z.enum(['volunteer', 'organization']),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  });

type RegisterFormSchema = z.infer<typeof validationSchema>;

type RegisterFormReq = {
  email: string;
  password: string;
  roles: string[];
};

type Props = {
  className?: HTMLProps<HTMLElement>['className'];
};

const RegisterPage: React.FC<Props> = ({ className }) => {
  const form = useForm<RegisterFormSchema>({
    resolver: zodResolver(validationSchema),
  });
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormSchema) => {
    const req: RegisterFormReq = { ...data, roles: [data.roles] };
    console.log('Register user: ' + JSON.stringify(req));
    try {
      await axiosClient.post('/auth/register', req);
      navigate('/login');
    } catch (error) {
      console.error(error);
      form.setError('root.serverError', {
        type: 'manual',
        message: 'Something went wrong',
      });
    }
  };

  const {
    formState: { errors, isSubmitting },
  } = form;

  return (
    <Form {...form}>
      <form
        className={cn('mx-auto mt-10 max-w-sm space-y-3', className)}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" type="email" {...field} />
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
                <Input
                  placeholder="Enter your password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="passwordConfirmation"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="roles"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Choose account type:</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="volunteer" />
                    </FormControl>
                    <FormLabel className="font-normal">Volunteer</FormLabel>
                  </FormItem>

                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="organization" />
                    </FormControl>
                    <FormLabel className="font-normal">Organization</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          {isSubmitting && <FaSpinner className="mr-1 animate-spin" />}
          Register
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

export default RegisterPage;
