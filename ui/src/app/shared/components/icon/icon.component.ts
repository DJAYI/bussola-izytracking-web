import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IconName, ICON_PATHS } from './icon-registry';

/**
 * A reusable icon component that renders SVG icons from a centralized registry.
 * 
 * @example
 * ```html
 * <app-icon name="home" />
 * <app-icon name="user" size="lg" class="text-red-500" />
 * <app-icon name="settings" [size]="24" />
 * ```
 */
@Component({
    selector: 'app-icon',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class]': 'hostClass()',
    },
    template: `
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            [attr.width]="sizeValue()"
            [attr.height]="sizeValue()"
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="1.5" 
            stroke-linecap="round" 
            stroke-linejoin="round"
            aria-hidden="true"
        >
            <path [attr.d]="iconPath()" />
        </svg>
    `,
})
export class IconComponent {
    /**
     * The name of the icon to display.
     * Must be a valid key from IconName.
     */
    name = input.required<IconName>();

    /**
     * The size of the icon.
     * Can be a preset ('sm', 'md', 'lg', 'xl') or a number in pixels.
     * @default 'md'
     */
    size = input<'sm' | 'md' | 'lg' | 'xl' | number>('md');

    /**
     * Additional CSS classes for the host element.
     */
    class = input<string>('');

    protected readonly iconPath = computed(() => {
        const iconName = this.name();
        return ICON_PATHS[iconName] ?? '';
    });

    protected readonly sizeValue = computed(() => {
        const size = this.size();

        if (typeof size === 'number') {
            return size;
        }

        const sizeMap: Record<string, number> = {
            sm: 16,
            md: 20,
            lg: 24,
            xl: 32,
        };

        return sizeMap[size] ?? 20;
    });

    protected readonly hostClass = computed(() => {
        return `inline-flex items-center justify-center shrink-0 ${this.class()}`.trim();
    });
}
