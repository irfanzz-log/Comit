'use client';

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { useAuth } from "@/app/context/AuthContext";

export default function QRGenerator({ uuid }) {

    const [qr, setQr] = useState("");
    const { user } = useAuth()

    useEffect(() => {

        if (!uuid) return;

        async function generateQR() {
            const url = await QRCode.toDataURL(uuid);
            if (!url.ok) {
                console.log('Tidak ada data');
            }

            setQr(url);
        }

        generateQR();

    }, [uuid]);


    return (
        <div>
            {(user?.user_role === 'developer' || user?.role === 'sekretaris') && qr && (
                <img
                    src={qr}
                    alt="QR Code"
                    className="w-full h-full"
                />
            )}
        </div>
    );
}