interface uidProps{
    searchParams : {uid?: string}
}

export async function Post({ searchParams } : uidProps ) {
    return new Response(`${searchParams}`)
}