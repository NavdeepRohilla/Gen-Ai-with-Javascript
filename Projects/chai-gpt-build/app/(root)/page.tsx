"use client";

import { ModeToggle } from "@/components/ui/mode-toggle";
import { UserButton } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {

  // ************ ********* 1. useState() ************
  // const [data, setData] = useState(null);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       setIsLoading(true);

  //       const res = await fetch(
  //         "https://jsonplaceholder.typicode.com/todos"
  //       );

  //       const data = await res.json();
  //       setData(data);
  //     } catch (error) {
  //       setError(error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }

  //   fetchData();
  // }, []);


  //  ************ 2 Tanstack ***************


  const {data , isLoading , error} = useQuery({
    queryKey:["data"],
    queryFn:async()=>{
      const res = await fetch("https://jsonplaceholder.typicode.com/todos");
      const data = await res.json();
      return data
    }
  })
  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Something went wrong</h1>;
  }

  return (
    <div>
      {JSON.stringify(data)}
    </div>
  );
}