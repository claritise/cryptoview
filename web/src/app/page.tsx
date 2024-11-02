"use client";
import { useEffect, useRef } from "react";
import { SwaggerUIBundle } from "swagger-ui-dist";
import "swagger-ui-dist/swagger-ui.css";

export default function Home() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    SwaggerUIBundle({
      domNode: ref.current!,
      url: "/api/docs",
    });
  }, []);

  return <div ref={ref} />;
}
