"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          {/* Top Image */}
          <div className="mb-4">
            <Image
              src="/placeholder-image.jpg" // Replace with actual image path
              alt="Form Header Image"
              width={800}
              height={300}
              className="w-full h-48 object-cover rounded-t-lg"
            />
          </div>
          {/* Title */}
          <CardTitle className="text-3xl font-bold text-gray-800">
            Form Title
          </CardTitle>
          {/* Subtitle */}
          <p className="text-lg text-gray-600 mt-2">Form Subtitle</p>
          {/* Description */}
          <p className="text-sm text-gray-500 mt-4">
            This is a description of the form. Provide details about what the form
            is for and any instructions.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Placeholder for Form Inputs */}
          {/* Add your input questions here */}
          <div className="text-center text-gray-400">
            [Form inputs will go here]
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
