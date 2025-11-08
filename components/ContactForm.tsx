'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import { z, type ZodIssue } from 'zod';

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(12)
});

type FormStatus = 'idle' | 'success' | 'error';

type FormValues = z.infer<typeof formSchema>;

type ValidationDictionary = Record<keyof FormValues, string>;

type ContactDictionary = {
  nameLabel: string;
  emailLabel: string;
  messageLabel: string;
  submitLabel: string;
  successHeading: string;
  successBody: string;
  errorHeading: string;
  errorBody: string;
  validation: ValidationDictionary;
};

type Errors = Partial<Record<keyof FormValues, string>>;

type ContactFormProps = {
  dictionary: ContactDictionary;
};

export default function ContactForm({ dictionary }: ContactFormProps) {
  const [formStatus, setFormStatus] = useState<FormStatus>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [formData, setFormData] = useState<FormValues>({
    name: '',
    email: '',
    message: ''
  });

  const updateField = (field: keyof FormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setFormStatus('idle');
      setFormData((prev: FormValues) => ({ ...prev, [field]: value }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = formSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors: Errors = {};
      validation.error.issues.forEach((issue: ZodIssue) => {
        const fieldName = issue.path[0] as keyof FormValues | undefined;
        if (!fieldName) return;

        fieldErrors[fieldName] = dictionary.validation[fieldName];
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setFormStatus('idle');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('request_failed');
      }

      setFormStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error(error);
      setFormStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      data-contact-form="true"
      className="space-y-6 rounded-3xl border border-border/50 bg-surface/80 p-8 backdrop-blur supports-[backdrop-filter]:backdrop-blur"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm">
          <span className="uppercase tracking-[0.3em] text-subtle">{dictionary.nameLabel}</span>
          <input
            type="text"
            value={formData.name}
            onChange={updateField('name')}
            className={clsx(
              'rounded-2xl border border-border/60 bg-surface px-4 py-3 text-foreground transition focus:border-accent-2 focus:outline-none',
              errors.name && 'border-danger/60'
            )}
            autoComplete="name"
            disabled={isSubmitting}
            required
          />
          {errors.name ? <span className="text-xs text-danger">{errors.name}</span> : null}
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span className="uppercase tracking-[0.3em] text-subtle">{dictionary.emailLabel}</span>
          <input
            type="email"
            value={formData.email}
            onChange={updateField('email')}
            className={clsx(
              'rounded-2xl border border-border/60 bg-surface px-4 py-3 text-foreground transition focus:border-accent-2 focus:outline-none',
              errors.email && 'border-danger/60'
            )}
            autoComplete="email"
            disabled={isSubmitting}
            required
          />
          {errors.email ? <span className="text-xs text-danger">{errors.email}</span> : null}
        </label>
      </div>

      <label className="flex flex-col gap-2 text-sm">
        <span className="uppercase tracking-[0.3em] text-subtle">{dictionary.messageLabel}</span>
        <textarea
          value={formData.message}
          onChange={updateField('message')}
          className={clsx(
            'min-h-[180px] rounded-2xl border border-border/60 bg-surface px-4 py-3 text-foreground transition focus:border-accent-2 focus:outline-none',
            errors.message && 'border-danger/60'
          )}
          disabled={isSubmitting}
          required
        />
        {errors.message ? <span className="text-xs text-danger">{errors.message}</span> : null}
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-accent-2/60 bg-accent-2/15 px-7 py-2.5 text-xs font-semibold uppercase tracking-[0.32em] text-accent-2 transition hover:border-accent-2 hover:bg-accent-2/30 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isSubmitting ? <span className="animate-pulse">...</span> : dictionary.submitLabel}
      </button>

      <AnimatePresence mode="wait">
        {formStatus === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="rounded-2xl border border-accent-2/50 bg-accent-2/10 p-4 text-sm text-accent-2"
            role="status"
            aria-live="polite"
          >
            <p className="font-semibold uppercase tracking-[0.3em]">{dictionary.successHeading}</p>
            <p className="mt-1 text-foreground">{dictionary.successBody}</p>
          </motion.div>
        ) : null}

        {formStatus === 'error' ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="rounded-2xl border border-danger/50 bg-danger/10 p-4 text-sm text-danger"
            role="alert"
            aria-live="assertive"
          >
            <p className="font-semibold uppercase tracking-[0.3em]">{dictionary.errorHeading}</p>
            <p className="mt-1 text-foreground">{dictionary.errorBody}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </form>
  );
}
