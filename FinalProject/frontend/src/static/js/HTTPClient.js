export default class HTTPClient {
    static async get(url) {
      const res = await fetch(url);
        if (!res.ok) {
            throw new Error("error in get request + ", res);
        }
        return await res.json();
    }

    static async post(url, data) {
        const res = await fetch(url, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if(!res.ok) {
            throw new Error("error in post request");
        }
        return await res.json();
    }

    static async put(url, data) {
        const res = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if(!res.ok) {
            throw new Error("error in put request");
        }
        return await res.json();
    }

    static async delete(url, data) {
        const res = await fetch(url, {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if(!res.ok) {
            throw new Error("error in delete request");
        }
        return await res.json();
    }
  }