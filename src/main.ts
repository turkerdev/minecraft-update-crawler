import { alert } from './discord';
import { crawlClientJar, crawlManifest } from './manifest';

export default <ExportedHandler<Bindings>>{
	scheduled: async (controller, env, ctx) => {
		const manifest = await crawlManifest()

		const latestSnapshot = await env.MC_KV.get('mc-update:latest_snapshot')
		const latestRelease = await env.MC_KV.get('mc-update:latest_release')

		const newRelease = manifest.latest.release !== latestRelease
		const newSnapshot = manifest.latest.snapshot !== latestSnapshot

		if (newRelease) {
			const version = manifest.latest.release
			const { url } = manifest.versions.find(v => v.id === version) ?? {}
			if (!url) return;

			const jarUrl = await crawlClientJar(url)
			await alert(env.DISCORD_TOKEN, `MC-[RELEASE] ${version}:\n${jarUrl}\n<@358230933620391936>`)
			await env.MC_KV.put('mc-update:latest_release', version)
		}

		if (newSnapshot) {
			const version = manifest.latest.snapshot
			const { url } = manifest.versions.find(v => v.id === version) ?? {}
			if (!url) return;

			const jarUrl = await crawlClientJar(url)
			await alert(env.DISCORD_TOKEN, `MC-[SNAPSHOT] ${version}:\n${jarUrl}\n<@358230933620391936>`)
			await env.MC_KV.put('mc-update:latest_snapshot', version)
		}
	}
};

