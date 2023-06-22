import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

// import 'node_modules/stream-browserify';
// import 'node_modules/buffer';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
