let store = [];

export async function POST(request) {
    let data = await request.json();
    const found = store.some(
        (obj) =>
            obj.jwt === data.jwt || obj.user.username === data.user.username
    );

    if (!found) store.push(data);

    return new Response(null, {
        status: 200,
        headers: { "Set-Cookie": `token=${data.jwt};httponly;secure` },
        statusText: "success",
    });
}

export async function DELETE(request) {
    const token = request.cookies.get("token");
    store = store.filter((user) => user.jwt !== token);

    return new Response(null, {
        status: 200,
        headers: { "Set-Cookie": "token= " },
        statusText: "success",
    });
}

export async function GET(request) {
    const token = request.cookies.get("token")?.value;
    const data = store.filter((user) => user.jwt === token);

    return data.length === 1
        ? Response.json(data[0])
        : new Response(null, {
              status: 404,
              statusText: "not found",
          });
}
