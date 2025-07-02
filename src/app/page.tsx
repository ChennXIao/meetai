"use client";
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { authClient } from "@/lib/auth-client";
export default function Home() {
  const { data: session } = authClient.useSession()
  const [name, setName] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const onSubmit = () => {
    authClient.signUp.email({
      email,
      name,
      password,

    }, {
      onError: () => {
        window.alert('fail');
      },
      onSuccess: () => {
        window.alert('success');
      }
    });
  };

  const onLogin = () => {
    authClient.signIn.email({
      email,
      password,

    }, {
      onError: () => {
        window.alert('fail');
      },
      onSuccess: () => {
        window.alert('success');
      }
    });
  };
  if (session) {
    return (
      <div className='p-4 flex flex-col gap-y-4'>
        <p>Loggin as {session.user.name}</p>
        <Button onClick={() => { authClient.signOut() }}>Sign out</Button>
      </div>
    );
  }
  return (
    <div className='flex flex-col gap-y-10'>
      <div className='p-4 flex flex-col gap-y-4'>
        <input
          type="name"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={onSubmit}>
          Sign up
        </Button>
      </div>
      <div className='p-4 flex flex-col gap-y-4'>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={onLogin}>
          Login
        </Button>
      </div>
    </div>
  );
};



