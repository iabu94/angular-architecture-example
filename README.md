# Commands breakdown

- ## Create an empty workspace

```sh
ng new angular-architecture-example --create-application false --strict
```

- ## Create an application in the workspace

```sh
ng g application my-epic-app --prefix my-org --style scss --routing
```

- ## Install Angular Material package

```sh
ng add @angular/material
```

- ## Web pack bundle analyzer

```json
{
  "scripts": {
    ...
    "build:stats": "ng build --stats-json",
    ...
    "analyze": "webpack-bundle-analyzer dist/angular-bundle-analyzer-example/stats.json"
  }
}
```

- ## Core Module

```sh
ng g m core
```

```sh
ng g c core/layout/main-layout
```

- ## Lazy Feature Module

```sh
ng g m features/home --route home --module app.module.ts
```

<br/><br/><br/>

# Documentation

In this article we are going to learn how to scaffold new Angular application with clean, maintainable and extendable architecture in almost no time and what are the benefits of doing so. Besides many actionable tips, we’ll also discuss guidelines about where we should implement most common things like reusable services, feature specific components and others…

## The Creation

> In the beginning there was CLI and not just any CLI, it was an Angular CLI and it was good.

As of now (February 2021) the current Angular version is 12 and I would strongly recommenced to create new apps using that version (or any later versions) and start using goodies like IVY or --strict flag right from the beginning!

> <b>TIP:</b> Check your currently installed `@angular/cli` version by running `ng --version` in your command line and update it using `npm i -g @angular/cli@latest` if necessary!

First of all, we have to generate fresh new Angular workspace and this can be achieved by running

```sh
ng new angular-architecture-example --create-application false --strict
```

- `--create-application false` will create an empty workspace
- `--strict` will adjust the values of some Typescript compiler flags to nudge us to do the right things

Once the dependencies were installed we can enter the workspace folder using `cd angular-architecture-example` and start with exploring list of all available schematics by running `ng g`.

## The Application

The list of available schematics contains one called application and we will use it to create our first application in the workspace by running

```sh
ng g application my-epic-app --prefix my-org --style scss --routing
```

- The `my-epic-app` will be created in the projects folder. It will have Angular Router and will be using Sass styles (with .scss file extension)
- The `--prefix` will be used in the name of every component tag and directive selector so we will get `<my-org-user-list>` which is great because we can easily differentiate between our and 3rd party components!

Let’s make our life easy by using already existing component framework. We can use Angular Material which comes with many high quality and beautiful components!

We will add it using Angular Schematics by running `ng add @angular/material`. This will install the lib using `npm` and we will be prompted about couple of initial options:

- custom theme will enable us to use our own branding colors with ease
- Material typography will make our app look consistent
  animations will make Angular Material look fabulous

Once finished we can start importing and using Angular Material components in our app but more on that later…

## The Tooling

The prettier is one of the most epic things that happened to frontend development. It enables us to get PERFECTLY and CONSISTENTLY formatted code just by pressing couple of keys in our editor. We can even format whole project with help of a short npm script!

Let’s add it using `npm i -D prettier`. Once done, we will create a `.prettierrc` file which allows us to customize couple of formatting options.

My personal preferred Prettier config. Config can also use other than JSON formats…
Once done, we have to make Prettier play nicely with `tslint` which is provided by the Angular CLI, to do that we can install `npm i -D tslint-config-prettier` and add it as a last item in the `"extends": []` array field of the root `tslint.json` file…

Also we can add two useful npm scripts into the main package.json file that help us format whole code base (and test if it’s properly formatted)…

There is one more extremely useful tool called Webpack Bundle Analyzer. It can help us understand content of the Javascript bundles produced during the prod build which is very useful when debugging correct structure and hence architecture of our app!

> Tip: It can help us catch problems like incorrect imports between lazy features or even importing of lazy things in the eagerly loaded part of our application. <br><br>
> In these cases, the resulting bundles will contain code which does NOT belong there. This can be debugged with the built in search tool which highlights location of the code we searched for…

First, we install `npm i -D webpack-bundle-analyzer` and once finished we will add new npm script into the root `package.json` file…

The script builds our application for production because we’re using `--prod` flag.

Besides that we will be collecting statistics about all the modules processed by the build because we are using `--stats-json` flag.

The end result of that will be `stats.json` file next to all the other Javascript bundles. (This changed in the recent Angular version which uses default .browserslistrc configuration that builds only for modern browsers and has to be adjusted manually to enable building and differential loading for older browsers)

Last step is to call `webpack-bundle-analyzer` and pass in the path to the generated file.

> ▶TIP: The && operator will not work on Window when using cmd so you might need to split the analyze script into two separate scripts and use something like npm-run-all package to call them one after the other. Or just use WSL / CygWin / GitBash 😉 Fun fact, I develop on Macbook Pro with Windows 10 and CygWin 🤦, yes I know…
> Running npm run analyze will open new page which will look like this…

Our bundle chart contains mostly vendor code which is understandable as we have just generated and analyzed new (empty) Angular application. As we implement more an more lazy features, the amount of surface covered by the eager (brown) part will reduce and give way to colorful lazy bundles!

## The Cleanup

Let’s run our up using npm start or `ng serve -o`. The `-o` flag stands for “open” which will open browser with the correct URL autocratically once the app is ready…

Initial placeholder layout generated by the Angular CLI
As we can see Angular CLI generated some initial content with useful tips and links to documentation.

> 🔖 TIP: I highly recommend to add these links into your bookmarks. I still keep checking official Angular Docs for APIs and guides to this day even though I have been developing with Angular.js since version 1.1.

Now, we can delete whole initial layout from a single place in the app.component.html file where it was all inlined so it can be removed with ease 👍

Cool our initial setup is done! We have a workspace with an empty Angular application and we have added some some cool tooling to improve our developer experience!

## The Architecture

Before we start generating and writing code, let’s take a step back and see the bigger picture, literally 😬😹

Psst, this diagram is from my 3 day Angular Mastery workshop so let me know if you and your team would like to learn some Angular in a bit more efficient way 😉

Our application will have 2 main parts…

- The eager part which will be loaded from start (the main.js bundle). It will contain the AppModule with top-level routes and CoreModule with basic layout and all the core singleton services which will be used throughout the whole application.

- The lazy loaded features which will be loaded as a result of user navigation to these features. The lazy modules will also import SharedModule. This will be a result of carefully evaluated trade-off between smallest possible bundle size and reasonable developer experience!

## The Core

We’re going to use amazing Angular Schematics to scaffold basic structure with couple of commands, first of them being `ng g m core` which will generate new `CoreModule` in the `core/` folder.

> TIP: I strongly recommend having 2 terminal (or 2 tabs / panes in a single terminal) so that we can run our app using ng serve while being able to run additional commands like Angular Schematics next to it… <br><br>
> ⚠️ Also, sometimes when generating new files, Angular CLI might not pick them up immediately. In case you’re getting strange errors, try to restart serving with ng serve …

Let’s add `BrowserModule` and `BrowserAnimationsModule` to the `imports: []` array of the `CoreModule` while removing them from the `AppModule` and replacing them with the `CoreModule` itself. The final result will look something like this…

The `CoreModule` will be importing most of things needed from start to keep our AppModule almost empty

> TIP: We can also remove `CommonModule` from the imports of the `CoreModule` because of the fact that all built-in Angular declarables (like `*ngIf` or `ngClass`) which are provided by the `CommonModule` are also provided by the `BrowserModule` so having both would be a harmless but unnecessary duplication…

…while the `AppModule` will stay virtually empty for the whole life-time of the project, everything that needs to be available from start will be added to the `CoreModule`

Great, let’s create some basic layout with `toolbar` and navigation buttons…

Navigation toolbar implemented using components provided by <b>Angular Material</b> component library.

We will implement it inside of core module, inside of the nested `core/layout/` folder. The good thing is that we do NOT have to create these folders manually because it will be taken care of by the Angular Schematics.

Let’s create a “`main-layout`” component using `ng g c core/layout/main-layout`. It will automatically be added to the `declarations: []` of the `CodeModule` but we also have to add it to the `exports: []` (manually) and then use it in the `app.component.html` by using its `html` tag `<my-org-main-layout></my-org-main-layout>`.

Now we need to implement that layout itself inside of the `main-layout.component.html` template file…

Yes, I am aware that this code can NOT be copied as is just an image. On the other hand, typing, or even better, using amazing code completion capabilities of your IDE should get you there in no time while building that skill simultaneously, win win!

As we can see, we’re using quite some new components and directives which we have NOT yet imported in the `CoreModule` so we have to add them else our build will fail…

> Tip: Angular module is basically a “context” for the components it implements. This means that every component that we want to use in the template of our component ( like `<mat-toolbar>` ) must be a part of the module which declares our component. <br><br>
> What does it mean to be part of? It either has to be in the `declarations: [ ]` of our module OR it has to be in the `exports: [ ]` of the module we import.

In our example, we want to use `<mat-toolbar>` which is in the `exports: [ ]` inside of `MatToolbarModule` so we have to add that module into the `imports: [ ]` of our `CoreModule` as in the example below…

Please notice helpful import grouping and comments like `// vendor` and `// material` … They are NOT mandatory but nice to have because they let your colleagues (or even you in the future) get a quick overview of the module structure compared to long randomly sorted list of imports!

Let’s add a bit of styling in the `main-layout.component.scss` to make it look more like our previous example…

Great, we imported modules that export all the components and directives we used inside of our component template and the application should be up and running again!

## The Lazy Features

We have created the main layout and now is time to generate lazy loaded features!

> Tip: We will generate lazy feature for every top level route of our application. This is a reasonable starting point but don’t forget that it is possible to lazy load nested routes if the feature gets too big!

First, we will generate module for our home feature using `ng g m features/home --route home --module app.module.ts` which will do two things:

- generate module, routing module and component files in `/features/home`
- add lazy route to the main `app-routing.module.ts` file

Let’s have a look in the `app-routing.module.ts` file. We can see our generated home route.

Let’s add first “empty” route which will redirect to home (to show something from the start).

> Tip: We can also add last “catch all” (`**`) route. This route will redirect to home in case we’re navigating to a route which does NOT exist! It is also possible to implemented dedicated “not found” route instead of redirecting to home…

Angular routing config example with generated “home” lazy route, initial redirect and catch all route

Now we can do the same for our admin route using `ng g m features/admin --route admin --module app.module.ts`. Notice that it was correctly added before “catch all” route, else it would never trigger!

## Highlight active route

Now we have implemented both the navigation and the routes so we can run our application and see it in action. It will correctly switch routes as we keep clicking on the buttons is the top toolbar.

It is good UX to show user which route is currently active

Let’s open `main-layout.component.html` file and add `routerLinkActive="active"` directive on both navigation buttons.

Then we can implement `.active` class in the `main-layout.component.scss` file for example using `filter: brightness(<amount>);` rule which is cool because it does not force use to chose color so it can work for any theme !

Great our application now has two lazy loaded features and we could easily add more by repeating the steps above!

## The Benefits (why is lazy loading so great)

Most people are aware that lazy loading decreases the size of initial Javascript bundle and hence speeds up application startup time. This is definitely great BUT lazy loading comes with MANY MORE benefits than that!

- developer feedback loop ( aka faster rebuilds in DEV mode )- — with lazy loading, when we make a change to some file, Angular CLI has to only rebuild MUCH smaller lazy bundle to which that file belongs (hundreds of KBs) compared to single huge main bundle (couple of MBs), this can make a difference from some to many seconds on every re-build based on application size!
- isolation — with lazy loading we’re guaranteed that feature A can NOT access and use code implemented in feature B because that code is physically not present in the browser yet so it will fail at runtime! This means we can easily extract features to libraries or even delete them altogether without breaking the rest of our application.
- guarantees — based on what we discussed in isolation, we can also assume that making changes to a code in feature A can NOT have influence and hence break other features which gives us more confidence when evolving our code base.
- faster application start up time — most people put this as THE first thing and it is in fact very important but don’t forget its not the only benefit of lazy loading!

## What to implement in lazy features

Lazy features will contain implementation of declarables (components, directives and pipes) that are specific to that feature. For example the views or some specific component which can NOT really be re-used by other features.

> <b>Tip:</b> When we generate services using `ng g s <path>/<service-name>` the resulting service will be `providedIn: ‘root’` by default which is not the best solution for feature specific service. Such a solution would NOT prevent importing of that service by other features and hence breaking feature isolation! <br> <br>
> Feature specific services can be scoped to that feature by removing the `providedIn: 'root'` from their `@Injectable()` decorators and adding them to the `providers: [ ]` array of the lazy feature module instead!

## The Shared Module

Our application now has core and two lazy-loaded feature modules (home and admin). As we start adding functionality to our lazy features we may realize that some of them need to use same component, directive or pipe…

This is the perfect use case for the `SharedModule` ! Let’s create it using `ng g m shared`. Now what should we put into it?
declarables (components, directives and pipes) which we want to use in multiple lazy features
components from libraries (vendor / material / your component framework)
re-export CommonModule (it implements stuff like *ngFor, *ngIf, … )

## Example of the SharedModule structure

Once we have `SharedModule` ready we can use it in our lazy loaded feature modules and remove `CommonModule` as it is now exported by the shared module itself.

> ⚠️ TIP: Shared module will be imported by many lazy loaded features and because of that it should NEVER implement any services (`providers: [ ]`) and only contain declarables (components, directives and pipes) and modules (which only contain declarables).

The reason for that is that every lazy loaded module would get its own service instance which is almost never what we want because in most cases we expect services to be global singletons!

If we want create `“shared”` services used in many parts of our application we should implement them in the `/core` folder and use `providedIn: 'root'` syntax without putting them in `providers: [ ]` of any module…

Great our architecture is finished, now we are able to focus purely on delivering features for our users!

## Trade offs

It is important to acknowledge there is no silver bullet. The presented solution comes with it’s own set of pros and cons. Presented architecture strives to strike a nice balance between bundle size and developer experience (DX) based on real life observations from many projects…

That being said, feel free to adjust it based on your personal preferences and particular use case of your project which should always be the main criterion when making decisions

It can look different based on the composition, size and tree-shake-ability (wow these frontend words 😅) of the libraries you will be using in your particular project!

## Application size vs Developer experience (DX)

smallest bundle possible —no `SharedModule` module at all, every module (`CoreModule` and lazy features) imports EXACTLY what they need. We get the smallest possible bundles with most optimization but the developers will have to maintain HUGE lists of imports which will hurt the most when implementing tests as every component test has to build appropriate context by importing what is necessary into the `TestBed`

simplest possible DX — there is only one module, the `AppModule` and everything is imported there, developers don’t have to think about contexts, everything is available everywhere, the application bundle is huge and we get “big ball of mud”

small bundles, reasonable DX — using architecture and SharedModule as we described above. It will import and re-export components from 3rd party component libraries together with re-usable local components. We will import it in every lazy feature and in the component tests.

That way we have reasonable bundle size together with nice DX where we don’t have to add 50 lines of imports in every feature module and component test file which is good!

Great, we have done it!

We have created an Angular application with amazing clean extensible architecture in a very short time! Check out the repository with application built based on this guide!

We did it with the help of Angular CLI where we generated project and basic structure using Angular Schematics.

Our application has `CoreModule` for application wide singleton services, base layout and any other stuff which we will need from straight from application startup.

We’ve also built `SharedModule` for reusable components, pipes and directives (declarables) that will be used by lazy features (BUT NOT the core!)

Lastly we have created couple of lazy loaded modules (with respective routes) that will implement the feature business logic (services) and views (components) that are specific to that feature…

From here, we will proceed by following that architecture and adding more features for our users!

Good luck with your projects!
