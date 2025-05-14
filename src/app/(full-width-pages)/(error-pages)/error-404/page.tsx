import GridShape from "components/common/GridShape";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "404 Error | Keepass ",
  description: "This is 404 Error page for Keepass ",
};

export default function Error404Page() {
  return (
    <div>
      <GridShape />
      <div className="text-center">
        <Image
          src="/images/error/404.svg"
          alt="404 Error"
          width={400}
          height={300}
          priority
        />
        <h1 className="text-4xl font-bold mt-4">Page Not Found</h1>
        <p className="mt-2 text-gray-600">
          Sorry, the page you are looking for does not exist.
        </p>
        <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
          Go back home
        </Link>
      </div>
    </div>
  );
}
