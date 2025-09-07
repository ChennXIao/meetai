"use client";
 
import {useTRPC}  from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export const HomeView = () => {
  const trpc = useTRPC();
  const {data} = useQuery(trpc.hello.queryOptions({text: 'from tRPC'}));

  return (<div>
      <h1 className="text-2xl font-bold">Home</h1>
      <p>{data?.greeting}</p>
    </div>
  );

}