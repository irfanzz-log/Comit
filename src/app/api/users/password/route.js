import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword, comparePassword } from '@/lib/hash';
import { verifyToken } from '@/lib/jwt';

export async function PUT(req) {
    const { old_password, new_password } = await req.json();
    const token = req.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }

    const decoded = verifyToken(token);

    if (!decoded?.npm) {
        return NextResponse.json(
            { error: "Invalid token" },
            { status: 401 }
        );
    }

    if (typeof new_password !== 'string' || new_password.length < 8) {
        return NextResponse.json(
            { success: false, error: "Password baru minimal 8 karakter" },
            { status: 400 }
        );
    }

    try {
        const res = await query('SELECT password FROM users WHERE user_npm = $1', [decoded.npm]);
        const user = res.rows[0];

        if (!user) {
            return NextResponse.json(
                { error: "Invalid token" },
                { status: 401 }
            );
        }

        // Verify old password
        const isOldPasswordValid = await comparePassword(old_password, user.password);
        if (!isOldPasswordValid) {
            return NextResponse.json(
                { success: false, error: "Old password is incorrect" },
                { status: 400 }
            );
        }

        // Hash new password
        const hashedNewPassword = await hashPassword(new_password);
        // Update password in database
        await query('UPDATE users SET password = $1 WHERE user_npm = $2', [hashedNewPassword, decoded.npm]);

        return NextResponse.json(
            { success: true, message: "Password updated successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("PUT /api/users/password error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update password" },
            { status: 500 }
        );
    }
}
