'use client';

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function QRGenerator({ uuid }) {

    const [qr, setQr] = useState("");

    useEffect(() => {

        if(!uuid) return;

        async function generateQR() {
            const url = await QRCode.toDataURL(uuid);
            if(!url.ok) {
                console.log('Tidak ada data');   
            }

            setQr(url);
        }

        generateQR();

    }, [uuid]);


    return (
        <div>
            {qr && (
                <img 
                    src={qr}
                    alt="QR Code"
                    className="w-full h-full"
                />
            )}
        </div>
    );
}