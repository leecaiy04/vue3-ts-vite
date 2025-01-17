/// <reference types="vite/client" />

interface ImportMeta {
	readonly env: ImportMetaEnv
}

declare module '*.vue' {
	import type { DefineComponent } from 'vue'
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
	const component: DefineComponent<{}, {}, any>
	export default component
}

/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_API_BASE_URL: string
	readonly VITE_PORT: number
	readonly VITE_APP_TITLE: string
}
