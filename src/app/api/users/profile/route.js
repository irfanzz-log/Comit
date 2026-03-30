import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';

export async function PUT(req) {
    const token = req.cookies.get('token')?.value;
    const { name, email, phone, prodi } = await req.json();

    if (!token) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const decoded = verifyToken(token);

    // Ambil data user terbaru dari DB
    const res = await query(
        'SELECT u.id, u.user_npm, u.password, u.user_role, ui.nama, ui.email, ui.phone, ui.jurusan FROM users u JOIN users_info ui ON u.id = ui.user_id WHERE u.id = $1',
        [decoded.id]
    );
    const currentUser = res.rows[0];
    

    const newName = name ?? currentUser.nama;
    const newEmail = email ?? currentUser.email;
    const newPhone = phone ?? currentUser.phone;
    const newProdi = prodi ?? currentUser.jurusan;
    
    try {

        await query(
            'UPDATE users_info SET nama = $1, email = $2, phone = $3, jurusan = $4 WHERE user_id = $5',
            [newName, newEmail, newPhone, newProdi, decoded.id]
        );
        
        
        return NextResponse.json(
            {
                success: true,
                message: "Profile updated successfully",
                user: {
                    id: decoded.id,
                    name: newName,
                    email: newEmail,
                    phone: newPhone,
                    prodi: newProdi
                }
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
    {
        success: false,
        error: "Failed to update profile"
    },
    { status: 500 }
);
    }
}