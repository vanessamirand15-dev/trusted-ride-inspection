import { useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { Loader2, Sparkles, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { explainFindingsFn } from '@/lib/ai/explain-findings.functions';

interface ExplainerFinding {
  title: string;
  note: string;
  action?: string;
  cost?: string;
}

export function FindingsExplainer({ vehicle, findings }: { vehicle: string; findings: ExplainerFinding[] }) {
  const explain = useServerFn(explainFindingsFn);
  const [state, setState] = useState<{ status: 'idle' } | { status: 'loading' } | { status: 'done'; text: string } | { status: 'error'; message: string }>({ status: 'idle' });

  const run = async () => {
    setState({ status: 'loading' });
    const result = await explain({ data: { vehicle, findings } });
    if ('explanation' in result && result.explanation) {
      setState({ status: 'done', text: result.explanation });
    } else {
      setState({ status: 'error', message: ('error' in result && result.error) || 'The explanation could not be generated. Please try again.' });
    }
  };

  return (
    <div className="mt-6 rounded-2xl border bg-background p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-base font-semibold"><Sparkles className="h-4 w-4 text-accent" />Plain-English explanation</h3>
          <p className="mt-1 text-sm text-muted-foreground">AI-powered summary of the findings above, written for buyers.</p>
        </div>
        {state.status !== 'done' && (
          <Button type="button" variant="outline" onClick={run} disabled={state.status === 'loading'}>
            {state.status === 'loading' ? <Loader2 className="animate-spin" /> : <Sparkles />}
            {state.status === 'loading' ? 'Explaining…' : 'Explain in plain English'}
          </Button>
        )}
      </div>
      {state.status === 'error' && (
        <p role="alert" className="mt-4 flex items-center gap-2 text-sm text-warning"><TriangleAlert className="h-4 w-4 shrink-0" />{state.message}</p>
      )}
      {state.status === 'done' && (
        <div className="mt-4 border-t pt-4">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-teal-soft px-3 py-1 text-xs font-semibold text-accent">
            <TriangleAlert className="h-3.5 w-3.5" />Draft · pending inspector confirmation
          </p>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-foreground">
            {state.text.split(/\n{2,}/).map((paragraph, i) => <p key={i}>{paragraph}</p>)}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">This explanation is an unverified draft. An inspector must confirm it before buyers rely on it.</p>
        </div>
      )}
    </div>
  );
}
