let store = [];

// Session start - Sign In
export async function POST(request) {
    let data = await request.json();
    
    const users = store.filter(
        (obj) => obj.user.username !== data.user.username
    );
    store = [...users, data];

    return new Response(null, {
        status: 200,
        headers: { "Set-Cookie": `token=${data.jwt};httponly;secure` },
        statusText: "success",
    });
}

// Session Stop - Sign Out
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
