# IceCul · Heladería

Web de la heladería IceCul (Barranquilla). Angular 22 + Firebase.

- Producción: https://heladeria-1735d.web.app
- Plan de trabajo y decisiones: [`docs/PLAN.md`](docs/PLAN.md)

## Requisitos

- Node.js 24 o superior
- Java 21 o superior (lo necesitan los emuladores de Firebase)
- Firebase CLI: `npx firebase-tools` (no hace falta instalarla de forma global)

## Entornos

| Alias | Proyecto de Firebase | Uso |
|---|---|---|
| `dev` (por defecto) | `heladeria-dev` | Desarrollo y pruebas. Nunca contiene datos reales |
| `prod` | `heladeria-1735d` | Producción |

El alias por defecto es `dev`, así que un `firebase deploy` sin `--project` **nunca** toca producción.

## Comandos

```bash
npm ci                          # instalar dependencias (web)
npm --prefix functions ci       # instalar dependencias (Cloud Functions)

npm start                       # servidor de desarrollo en http://localhost:4200
npx ng test --watch=false       # pruebas unitarias (Vitest)
npx ng build                    # build de producción en dist/ProyectoP/browser

npm --prefix functions run build                 # compilar las funciones
npx firebase-tools emulators:start               # emuladores: Auth, Firestore, Functions, Storage, Hosting
                                                 # interfaz en http://localhost:4000
```

## Publicar

Se publica solo desde `main`, con el CI en verde:

```bash
npx ng build
npx firebase-tools deploy --project prod --only hosting
npx firebase-tools deploy --project prod --only firestore:rules,firestore:indexes,storage
```

## Estructura

```
src/            web (Angular)
functions/      Cloud Functions (TypeScript, Node 24, región us-east1)
firestore.rules storage.rules firestore.indexes.json   reglas de seguridad (niegan todo por defecto)
.github/        CI (build, pruebas, auditoría de dependencias) y Dependabot
docs/PLAN.md    plan por fases
```
