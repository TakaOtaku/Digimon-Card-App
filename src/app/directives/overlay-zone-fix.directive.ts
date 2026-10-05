import { ApplicationRef, Directive, inject, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { Drawer } from 'primeng/drawer';
import { Subscription } from 'rxjs';

/**
 * PrimeNG 21 closes dialogs/drawers from mask clicks outside the Angular zone,
 * so the [(visible)] update would not be rendered until the next unrelated change.
 */
@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector -- must attach to every PrimeNG overlay automatically
    selector: 'p-dialog, p-drawer',
    standalone: true,
})
export class OverlayZoneFixDirective implements OnInit, OnDestroy {
    private readonly dialog = inject(Dialog, { self: true, optional: true });
    private readonly drawer = inject(Drawer, { self: true, optional: true });
    private readonly zone = inject(NgZone);
    private readonly appRef = inject(ApplicationRef);
    private subscription?: Subscription;

    ngOnInit(): void {
        const overlay = this.dialog ?? this.drawer;
        this.subscription = overlay?.visibleChange.subscribe(() => {
            if (!NgZone.isInAngularZone()) {
                // After the parent's [(visible)] handler has stored the new value.
                queueMicrotask(() => this.zone.run(() => this.appRef.tick()));
            }
        });
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }
}
