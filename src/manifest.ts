import { z } from "zod"

export async function crawlManifest() {
    const url = "https://launchermeta.mojang.com/mc/game/version_manifest.json"
    const req = await fetch(url)
    const data = await req.json()
    const manifest = await manifestSchema.parseAsync(data)
    return manifest
}

export async function crawlClientJar(versionManifest: string) {
    const req = await fetch(versionManifest)
    const data = await req.json()
    const version = await versionSchema.parseAsync(data)
    return version.downloads.client.url
}

const manifestSchema = z.object({
    latest: z.object({
        release: z.string(),
        snapshot: z.string()
    }),
    versions: z.array(z.object({
        id: z.string(),
        type: z.string(),
        url: z.string()
    }))
})

const versionSchema = z.object({
    downloads: z.object({
        client: z.object({
            url: z.string().url()
        })
    })
})