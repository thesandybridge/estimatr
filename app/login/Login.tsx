"use client";

import { login } from "./actions";

export default function Login() {
    return (
        <button onClick={() => login()}>Sign in with Google</button>
    );
}
