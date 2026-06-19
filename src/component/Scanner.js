'use client';

import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

export default function Scanner() {
    const { user } = useAuth();

    const scannerRef = useRef(null);

    const isRunningRef = useRef(false);
    const isStoppingRef = useRef(false);
    const isProcessingRef = useRef(false);
    const lastScanRef = useRef("");

    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        const scanner = new Html5Qrcode("reader");
        scannerRef.current = scanner;

        return () => {
            safeStop();
            scanner.clear?.();
        };
    }, []);

    const startScanner = async () => {
        const scanner = scannerRef.current;

        if (!scanner || isRunningRef.current || isStoppingRef.current) return;

        try {
            const devices = await Html5Qrcode.getCameras();
            if (!devices?.length) return;

            const cameraId = devices[0].id;

            isRunningRef.current = true;
            setIsRunning(true);

            await scanner.start(
                cameraId,
                {
                    fps: 10,
                    qrbox: 300,
                    facingMode: "environment"
                },
                async (decodedText) => {

                    if (isProcessingRef.current) return;
                    if (lastScanRef.current === decodedText) return;

                    isProcessingRef.current = true;
                    lastScanRef.current = decodedText;

                    try {
                        const event = await getDataEvents(decodedText);
                        if (!event) {
                            alert('Acara tidak ditemukan');
                            return;
                        }

                        await sendData(event.nama_acara);

                        alert("Absen Berhasil!");

                        await safeStop();
                    } catch (err) {
                        console.error("SCAN ERROR:", err);
                    } finally {
                        setTimeout(() => {
                            isProcessingRef.current = false;
                        }, 1200);
                    }
                }
            );

        } catch (err) {
            console.error("START ERROR:", err);

            isRunningRef.current = false;
            setIsRunning(false);
        }
    };

    const safeStop = async () => {
        const scanner = scannerRef.current;

        if (!scanner || isStoppingRef.current) return;

        try {
            isStoppingRef.current = true;

            const state = scanner.getState?.();

            if (state === 2) {
                await scanner.stop();
            }

        } catch (err) {
            console.log("STOP IGNORED:", err?.message);
        } finally {
            isStoppingRef.current = false;
            isRunningRef.current = false;
            setIsRunning(false);
        }
    };

    async function getDataEvents(data) {
        try {
            const res = await fetch(`/api/whereEvents?uuid=${data}`);
            const result = await res.json();

            if (!res.ok) {
                console.log('Kode Qr salah');
            }

            return result[0];
        } catch (error) {
            console.error("GET DATA ERROR:", error);
        }
    }

    async function sendData(data) {
        try {
            const res = await fetch('/api/insertAttendance', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: user?.id,
                    status_absen: "Hadir",
                    keterangan: `Hadir di acara ${data}`,
                    acara: data,
                })
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`HTTP ${res.status}: ${errText}`);
            }

            const result = await res.json();
            console.log("SUCCESS:", result);

        } catch (error) {
            console.error("SEND DATA ERROR:", error);
        }
    }

    return (
        <div className="flex flex-col items-center md:w-1/2 w-full md:my-0">
            <div className="flex md:flex-row flex-col items-center justify-between md:w-3/4 w-full">
                <h2 className="text-xl font-bold">
                    Scan Kehadiran
                </h2>
                <div className="flex gap-2">
                    {isRunning ? (
                        <button
                            onClick={safeStop}
                            className="px-4 py-2 bg-red-500 text-white rounded"
                        >
                            Tutup Kamera
                        </button>
                    ) : (
                        <button
                            onClick={startScanner}
                            className="px-4 py-2 bg-blue-600/80 text-white rounded"
                        >
                            Buka Kamera
                        </button>
                    )}
                </div>
            </div>
            <div
                id="reader"
                className="w-full md:w-full my-5 rounded overflow-hidden"
            />
        </div>
    );
}