import WeekDatePicker from '../components/WeekPicker';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import FormCard from '@/components/ui/form-card';
import { ArrowRightIcon } from 'lucide-react';

const NOTES_MAX_LENGTH = 500;

export default function Step1_SetUpWeek({ weekOf, setWeekOf, notes, setNotes, goNext }) {
  return (
    <div className="decanting-form">
      <div className="decanting-step__intro">
        <h2 className="decanting-step__title">Set up the week</h2>
        <p className="decanting-step__subtitle">
          Choose the week you're preparing this decanting plan for.
        </p>
      </div>

      <div className="setup-week-grid">
        <FormCard
          title="Week Details"
          description="Choose the dispatch week this decanting plan is for."
        >
          <WeekDatePicker
            id="week-picker"
            label="Week of"
            value={weekOf}
            onChange={(e) => setWeekOf(e.target.value)}
          />
        </FormCard>

        <FormCard
          title="Operational Notes"
          description="Add anything the team needs to know about this week's decanting."
        >
          <div className="login-form__field">
            <Label htmlFor="notes">
              Notes <span className="text-field__optional">(optional)</span>
            </Label>
            <Textarea
              id="notes"
              placeholder="Add operational notes here..."
              rows={5}
              maxLength={NOTES_MAX_LENGTH}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <span className="setup-card__char-count">
            {notes.length} / {NOTES_MAX_LENGTH} characters
          </span>
        </FormCard>
      </div>

      <div className="decanting-actions decanting-actions--end">
        <Button onClick={goNext}>
          Next Step <ArrowRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}