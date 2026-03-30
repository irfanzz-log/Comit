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
    

    try {
        const res = await query('SELECT password FROM users WHERE user_npm = $1', [decoded.npm]);
        const user = res.rows[0];
        

        // Verify old password
        if (!comparePassword(old_password, user.password)) {
            return NextResponse.json(
                { error: "Old password is incorrect" },
                { status: 400 }
            );
        }
        
        
        // Hash new password
        const hashedNewPassword = await hashPassword(new_password);
        // Update password in database
        await query('UPDATE users SET password = $1 WHERE user_npm = $2', [hashedNewPassword, decoded.npm]);
        
        
        
        return NextResponse.json(
            { message: "Password updated successfully" },
            { status: 200 },
            { success: true }
        );

        
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update password" },
            { status: 500 },
            { success: false }
        );
    }
}