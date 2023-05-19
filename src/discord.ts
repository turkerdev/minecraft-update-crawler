export async function alert(token: string, message: string) {
    await fetch("https://discord.com/api/v10/channels/799923575959846912/messages", {
        method: 'POST',
        headers: {
            "Authorization": `Bot ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "content": message,
        })
    })
}