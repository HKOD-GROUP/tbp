import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { diffParts } from '../../../core/util/countdown';
import { parisDateParts } from '../../../core/util/event-status';

@Component({
  selector: 'tbp-countdown',
  standalone: true,
  templateUrl: './tbp-countdown.component.html',
})
export class TbpCountdownComponent implements OnInit, OnDestroy {
  readonly target = input.required<Date>();
  readonly compact = input(false);

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly now = signal(new Date());
  private intervalId: ReturnType<typeof setInterval> | undefined;

  protected readonly isToday = computed(() => {
    const t = parisDateParts(this.target());
    const n = parisDateParts(this.now());
    return (
      t.year === n.year &&
      t.month === n.month &&
      t.day === n.day &&
      this.target().getTime() >= this.now().getTime()
    );
  });

  protected readonly parts = computed(() => diffParts(this.target(), this.now()));

  ngOnInit(): void {
    if (this.isBrowser) {
      this.intervalId = setInterval(() => this.now.set(new Date()), 1000);
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  protected pad(value: number): string {
    return value.toString().padStart(2, '0');
  }
}
