import { Resend } from 'resend';

export async function POST(req) {
    const { name, email, message } = await req.json();
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const { data, error } = await resend.emails.send({
            from: 'COMIT <onboarding@resend.dev>',
            to: 'comit.unipi@gmail.com',
            reply_to: email,
            subject: `Pesan dari ${name}`,
            html: `
            <p>Hallo saya ${name}, Memiliki pesan untuk COMIT!</p>
            <p>${message}</p>`
        });
        if (error) {
            console.error('Error sending email:', error);
            return Response.json({ success: false, error: 'Failed to send email' }, { status: 500 });
        }
        
        return Response.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return Response.json({ success: false, error: 'Failed to send email' }, { status: 500 });
    }
}