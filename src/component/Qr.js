'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { useAuth } from "@/app/context/AuthContext";

export default function QRGenerator({ uuid }) {
    const [qr, setQr] = useState("");
    const { user } = useAuth();

    useEffect(() => {
        if (!uuid) return;

        let isMounted = true;
        async function generateQR() {
            try {
                const url = await QRCode.toDataURL(uuid, {
                    width: 200,
                    margin: 2,
                    color: {
                        dark: "#000000",
                        light: "#ffffff",
                    },
                });
                if (isMounted) {
                    setQr(url);
                }
            } catch (err) {
                console.error("Gagal membuat QR Code:", err);
            }
        }

        generateQR();
        return () => {
            isMounted = false;
        };
    }, [uuid]);

    const canView =
        user?.user_role === "developer" ||
        user?.user_role === "sekretaris" ||
        user?.user_role === "superadmin";

    return (
        <div className="flex items-center justify-center p-2">
            {canView && qr && (
                <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200">
                    <Image
                        src={qr}
                        alt="QR Code"
                        className="w-auto h-auto"
                        width={200}
                        height={200}
                        unoptimized
                    />
                </div>
            )}
        </div>
    );
}