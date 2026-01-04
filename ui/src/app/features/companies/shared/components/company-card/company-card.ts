import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconComponent } from '../../../../../shared/components/icon/icon.component';
import { IconName, type IconName as IconNameType } from '../../../../../shared/components/icon/icon-registry';

/** Company card variant configuration */
export const CompanyCardVariant = {
    AGENCY: 'agency',
    TRANSPORT_PROVIDER: 'transport-provider'
} as const;

export type CompanyCardVariantType = typeof CompanyCardVariant[keyof typeof CompanyCardVariant];

/**
 * Reusable component for displaying a company card with avatar, name, email, and badge.
 * Used in modify-client-form and modify-transport-provider-form.
 */
@Component({
    selector: 'app-company-card',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [IconComponent],
    template: `
        <div class="bg-surface-light rounded-xl shadow-sm border border-gray-200 p-6 text-center h-full">
            <div class="relative inline-block">
                <div 
                    class="w-32 h-32 rounded-full mx-auto border-4 border-white shadow-lg flex items-center justify-center"
                    [class]="avatarBgClass()">
                    <app-icon [name]="iconName()" [size]="64" [class]="iconColorClass()" />
                </div>
            </div>
            <h2 class="mt-4 text-xl font-bold text-gray-900">{{ displayName() }}</h2>
            <p class="text-sm text-gray-500">{{ email() }}</p>
            <div 
                class="mt-4 inline-flex px-3 py-1 rounded-full text-xs font-medium border"
                [class]="badgeClass()">
                {{ badgeLabel() }}
            </div>
        </div>
    `
})
export class CompanyCardComponent {
    /** The company display name */
    readonly displayName = input.required<string>();

    /** The company email */
    readonly email = input.required<string>();

    /** The card variant (agency or transport-provider) */
    readonly variant = input<CompanyCardVariantType>(CompanyCardVariant.AGENCY);

    /** Custom badge label (optional, defaults based on variant) */
    readonly customBadgeLabel = input<string | undefined>(undefined);

    protected readonly IconName = IconName;

    protected iconName(): IconNameType {
        return this.variant() === CompanyCardVariant.TRANSPORT_PROVIDER
            ? IconName.TRUCK
            : IconName.BUILDING;
    }

    protected avatarBgClass(): string {
        return this.variant() === CompanyCardVariant.TRANSPORT_PROVIDER
            ? 'bg-blue-100'
            : 'bg-green-100';
    }

    protected iconColorClass(): string {
        return this.variant() === CompanyCardVariant.TRANSPORT_PROVIDER
            ? 'text-blue-600'
            : 'text-green-600';
    }

    protected badgeClass(): string {
        return this.variant() === CompanyCardVariant.TRANSPORT_PROVIDER
            ? 'bg-blue-100 text-blue-800 border-blue-200'
            : 'bg-green-100 text-green-800 border-green-200';
    }

    protected badgeLabel(): string {
        const custom = this.customBadgeLabel();
        if (custom) return custom;

        return this.variant() === CompanyCardVariant.TRANSPORT_PROVIDER
            ? 'Proveedor de Transporte'
            : 'Cliente / Agencia';
    }
}
