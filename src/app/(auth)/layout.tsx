import React, { ReactNode, Suspense } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Suspense fallback={<div />}>{children}</Suspense>
    </>
  );
}
