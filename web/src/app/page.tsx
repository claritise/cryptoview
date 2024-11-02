"use client";
import { useEffect, useRef } from "react";
import { SwaggerUIBundle } from "swagger-ui-dist";
import "swagger-ui-dist/swagger-ui.css";
import { env } from "~/env";

export default function Home() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    SwaggerUIBundle({
      domNode: ref.current!,
      url: env.NEXT_PUBLIC_SWAGGER_URL + "/api/docs",
    });
  }, []);

  return <div ref={ref} />;
}
