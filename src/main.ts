import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { NG_EVENT_PLUGINS } from '@taiga-ui/event-plugins';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
    providers: [
        provideAnimations(),
        NG_EVENT_PLUGINS,
    ]
}).catch(err => console.error(err));
