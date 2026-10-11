import { setWorkerUrl } from 'maplibre-gl'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'

// MapLibre 6 resolves its module worker relative to its own file, which breaks once Vite pre-bundles it.
setWorkerUrl(workerUrl)
